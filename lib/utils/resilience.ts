// Using console.error instead of logger to avoid import issues

/**
 * Error thrown when a promise exceeds its timeout duration
 */
export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TimeoutError";
  }
}

/**
 * Error thrown when a request deadline is exceeded
 */
export class DeadlineExceededError extends Error {
  constructor() {
    super("Request deadline exceeded");
    this.name = "DeadlineExceededError";
  }
}

/**
 * Error thrown when a circuit breaker is in OPEN state
 */
export class CircuitOpenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitOpenError";
  }
}

/**
 * Error thrown when an idempotency key is already in use
 */
export class IdempotencyKeyInUseError extends Error {
  constructor() {
    super("Idempotency key is already in use by a concurrent request");
    this.name = "IdempotencyKeyInUseError";
  }
}

/**
 * Circuit breaker states
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Failure threshold exceeded, fast-fail immediately
 * - HALF_OPEN: Testing if service recovered, allow limited requests
 */
type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

/**
 * Circuit breaker configuration options
 */
interface CircuitBreakerOptions {
  /** Number of consecutive failures before tripping the circuit (default: 5) */
  failureThreshold?: number;
  /** Time in milliseconds before attempting recovery (default: 30000) */
  timeoutDuration?: number;
  /** Maximum test requests in half-open state (default: 3) */
  halfOpenMaxCalls?: number;
  /** Number of successes needed to close circuit (default: 2) */
  successThreshold?: number;
  /** Name for logging/metrics */
  name?: string;
}

/**
 * Circuit Breaker Pattern
 * 
 * Purpose: Prevent cascade failures when external services degrade.
 * 
 * When to use:
 * - External API calls (payment processors, email services)
 * - Database connections
 * - Third-party integrations
 * - Microservice inter-communication
 * 
 * DOOM LOOP PREVENTION:
 * - Tracks success/failure counts per external service
 * - Returns cached fallback when circuit is OPEN
 * - Logs circuit state transitions
 * - Exposes circuit state in metrics
 * - Alerts when circuits trip
 */
export class CircuitBreaker {
  private state: CircuitState = "CLOSED";
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime?: number;
  private halfOpenCalls = 0;
  private readonly failureThreshold: number;
  private readonly timeoutDuration: number;
  private readonly halfOpenMaxCalls: number;
  private readonly successThreshold: number;
  private readonly name: string;

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold ?? 5;
    this.timeoutDuration = options.timeoutDuration ?? 30000;
    this.halfOpenMaxCalls = options.halfOpenMaxCalls ?? 3;
    this.successThreshold = options.successThreshold ?? 2;
    this.name = options.name ?? "unnamed";
  }

  /**
   * Execute a function with circuit breaker protection
   * 
   * @param fn - The async function to execute
   * @param fallback - Optional fallback value to return when circuit is OPEN
   * @returns The result of fn() or fallback
   * @throws CircuitOpenError if circuit is OPEN and no fallback provided
   * @throws Error from fn() if execution fails
   */
  async execute<T>(fn: () => Promise<T>, fallback?: T): Promise<T> {
    // Check if circuit should transition from OPEN to HALF_OPEN
    if (this.state === "OPEN") {
      if (Date.now() - (this.lastFailureTime || 0) > this.timeoutDuration) {
        console.error(`Circuit breaker '${this.name}' transitioning: OPEN -> HALF_OPEN`);
        this.state = "HALF_OPEN";
        this.halfOpenCalls = 0;
        this.successCount = 0;
      } else {
        // Circuit is still OPEN, return fallback or throw
        if (fallback !== undefined) {
          console.error(`Circuit breaker '${this.name}' is OPEN, returning fallback`);
          return fallback;
        }
        throw new CircuitOpenError(`Service '${this.name}' temporarily unavailable - circuit is OPEN`);
      }
    }

    // In HALF_OPEN state, limit concurrent test requests
    if (this.state === "HALF_OPEN") {
      if (this.halfOpenCalls >= this.halfOpenMaxCalls) {
        throw new CircuitOpenError(`Circuit breaker '${this.name}' is testing recovery, too many concurrent requests`);
      }
      this.halfOpenCalls++;
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      if (fallback !== undefined) {
        return fallback;
      }
      throw error;
    } finally {
      if (this.state === "HALF_OPEN") {
        this.halfOpenCalls--;
      }
    }
  }

  /**
   * Get current circuit state
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Get current failure count
   */
  getFailureCount(): number {
    return this.failureCount;
  }

  /**
   * Manually reset the circuit to CLOSED state
   * Use with caution - typically only for testing or manual recovery
   */
  reset(): void {
    console.error(`Circuit breaker '${this.name}' manually reset to CLOSED`);
    this.state = "CLOSED";
    this.failureCount = 0;
    this.successCount = 0;
    this.halfOpenCalls = 0;
    this.lastFailureTime = undefined;
  }

  private onSuccess(): void {
    this.failureCount = 0;

    if (this.state === "HALF_OPEN") {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        console.error(`Circuit breaker '${this.name}' transitioning: HALF_OPEN -> CLOSED`);
        this.state = "CLOSED";
        this.successCount = 0;
      }
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      if (this.state !== "OPEN") {
        console.error(`Circuit breaker '${this.name}' transitioning: ${this.state} -> OPEN after ${this.failureCount} failures`);
        this.state = "OPEN";
      }
    }
  }
}

/**
 * Retry with Exponential Backoff + Jitter
 * 
 * Purpose: Handle transient failures without overwhelming failing services.
 * 
 * DOOM LOOP PREVENTION:
 * - Never retry non-idempotent POST requests without deduplication
 * - Max 3 retries to prevent infinite loops
 * - Jitter prevents thundering herd
 * - Only retry specific error types
 * 
 * @param fn - The async function to retry
 * @param options - Retry configuration
 * @returns The result of fn()
 * @throws Error from fn() after all retries exhausted
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    /** Maximum number of retry attempts (default: 3) */
    maxRetries?: number;
    /** Base delay in milliseconds (default: 100) */
    baseDelay?: number;
    /** Maximum delay in milliseconds (default: 10000) */
    maxDelay?: number;
    /** Function to determine if error is retryable */
    isRetryable?: (error: unknown) => boolean;
  } = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 100, maxDelay = 10000, isRetryable = isRetryableError } = options;

  // DOOM LOOP PREVENTION: Track attempt count to prevent infinite loops
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // DOOM LOOP PREVENTION: Don't exceed max retries
      if (attempt === maxRetries) {
        throw error;
      }

      // DOOM LOOP PREVENTION: Only retry specific error types
      if (!isRetryable(error)) {
        throw error;
      }

      // Calculate delay with exponential backoff
      // Formula: delay = min(base_delay * (2 ^ attempt), max_delay)
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      
      // Add jitter (0-100ms) to prevent thundering herd
      const jitter = Math.random() * 100;
      const totalDelay = delay + jitter;

      console.error(`Retry attempt ${attempt + 1}/${maxRetries} after ${totalDelay.toFixed(0)}ms: ${error instanceof Error ? error.message : String(error)}`);

      await sleep(totalDelay);
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError;
}

/**
 * Check if an error is retryable
 * 
 * Retryable errors:
 * - Network timeouts
 * - 503 Service Unavailable
 * - 429 Rate Limited (with Retry-After)
 * - Database connection errors
 * 
 * Never retry:
 * - 400 Bad Request
 * - 401 Unauthorized
 * - 404 Not Found
 * - Non-idempotent POST requests without deduplication
 * 
 * @param error - The error to check
 * @returns true if the error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  // HTTP errors with specific status codes
  if (error && typeof error === "object") {
    const err = error as { statusCode?: number; code?: string };
    
    // HTTP status codes that are retryable
    if (err.statusCode) {
      const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
      return retryableStatusCodes.includes(err.statusCode);
    }

    // Error codes that indicate retryable conditions
    const retryableCodes = [
      "ECONNRESET",
      "ETIMEDOUT",
      "ECONNREFUSED",
      "ENOTFOUND",
      "EAI_AGAIN",
      "NETWORK_ERROR",
      "TIMEOUT",
    ];
    
    if (err.code && retryableCodes.includes(err.code)) {
      return true;
    }
  }

  // Network-related errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return true;
  }

  return false;
}

/**
 * Execute a promise with a timeout
 * 
 * Purpose: Prevent requests from hanging indefinitely.
 * 
 * DOOM LOOP PREVENTION:
 * - Never use default 'no timeout'
 * - Cancel in-flight operations when possible
 * - Log timeout occurrences
 * 
 * @param promise - The promise to wrap
 * @param timeoutMs - Timeout in milliseconds
 * @param errorMessage - Custom error message
 * @returns The result of the promise
 * @throws TimeoutError if timeout is exceeded
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> {
  // DOOM LOOP PREVENTION: Validate timeout is reasonable
  if (timeoutMs <= 0) {
    throw new Error("Timeout must be greater than 0ms");
  }

  const timeoutPromise = new Promise<never>((_, reject) => {
    const timer = setTimeout(() => {
      reject(new TimeoutError(errorMessage));
    }, timeoutMs);

    // Clean up timer if not needed (though Promise.race will resolve first)
    timer.unref?.();
  });

  return Promise.race([promise, timeoutPromise]);
}

/**
 * Execute a function with a deadline
 * 
 * Purpose: Propagate deadline context through request chains.
 * 
 * DOOM LOOP PREVENTION:
 * - Calculate remaining time at each hop
 * - Fail fast if deadline already passed
 * - Reserve 100ms for cleanup/response
 * 
 * @param fn - The async function to execute
 * @param deadline - The deadline timestamp (ms since epoch)
 * @param context - Description for error messages
 * @returns The result of fn()
 * @throws DeadlineExceededError if deadline has passed or will pass
 */
export async function withDeadline<T>(
  fn: () => Promise<T>,
  deadline: number,
  context: string = "operation"
): Promise<T> {
  const now = Date.now();
  const remaining = deadline - now - 100; // Reserve 100ms buffer

  // DOOM LOOP PREVENTION: Fail fast if deadline already passed
  if (remaining <= 0) {
    console.error(`Deadline already exceeded for ${context}: deadline=${new Date(deadline).toISOString()}, now=${new Date(now).toISOString()}`);
    throw new DeadlineExceededError();
  }

  return withTimeout(
    fn(),
    remaining,
    `Deadline exceeded for ${context}`
  );
}

/**
 * Sleep for a specified duration
 * 
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after ms milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Idempotency key store interface
 */
export interface IdempotencyStore {
  get(key: string): Promise<{ response: unknown; status: number } | null>;
  set(key: string, value: unknown, status: number, ttl: number): Promise<void>;
  lock(key: string): Promise<boolean>;
  unlock(key: string): Promise<void>;
}

/**
 * Execute a function with idempotency protection
 * 
 * Purpose: Prevent duplicate operations when retries occur.
 * 
 * DOOM LOOP PREVENTION:
 * - Store processed keys for 24 hours minimum
 * - Return cached response for duplicate keys
 * - Handle concurrent requests with locking
 * 
 * @param key - The idempotency key
 * @param fn - The function to execute
 * @param store - The idempotency store
 * @param options - Configuration options
 * @returns The result of fn() or cached response
 * @throws IdempotencyKeyInUseError if key is locked by concurrent request
 */
export async function withIdempotency<T>(
  key: string | undefined,
  fn: () => Promise<{ data: T; status: number }>,
  store: IdempotencyStore,
  options: {
    /** TTL in seconds (default: 86400 = 24 hours) */
    ttl?: number;
  } = {}
): Promise<T> {
  // If no key provided, just execute the function
  if (!key) {
    const result = await fn();
    return result.data;
  }

  const ttl = options.ttl ?? 86400; // 24 hours default

  // Check if already processed
  const cached = await store.get(key);
  if (cached) {
    console.error(`Returning cached idempotency response for key: ${key}`);
    return cached.response as T;
  }

  // Try to acquire lock
  const locked = await store.lock(key);
  if (!locked) {
    throw new IdempotencyKeyInUseError();
  }

  try {
    // Double-check after acquiring lock (race condition protection)
    const doubleCheck = await store.get(key);
    if (doubleCheck) {
      return doubleCheck.response as T;
    }

    // Execute the function
    const result = await fn();

    // Store the result
    await store.set(key, result.data, result.status, ttl);

    return result.data;
  } finally {
    await store.unlock(key);
  }
}
