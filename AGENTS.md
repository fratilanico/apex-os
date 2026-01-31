# AGENTS.md — AI Agent Development Guidelines

> **The authoritative source of truth for AI-assisted development in this codebase.**

---

## Table of Contents

1. [Document Meta](#1-document-meta)
2. [Project Identity](#2-project-identity)
3. [Universal Principles](#3-universal-principles)
4. [Code Style & Patterns](#4-code-style--patterns)
5. [Architecture Rules](#5-architecture-rules)
6. [Testing Strategy](#6-testing-strategy)
7. [Git Workflow](#7-git-workflow)
8. [Security Guidelines](#8-security-guidelines)
9. [Performance Standards](#9-performance-standards)
10. [CI/CD Guidelines](#10-cicd-guidelines)
11. [Accessibility Standards](#11-accessibility-standards)
12. [Monitoring & Observability](#12-monitoring--observability)
13. [Agent Behavior Rules](#13-agent-behavior-rules)
    - [13.8 Skills Framework](#138-skills-framework-for-task-execution)
14. [Common Task Templates](#14-common-task-templates)
15. [System Resilience & Safety Patterns](#15-system-resilience--safety-patterns-mandatory)
16. [Security Hardening](#16-security-hardening-mandatory)
17. [Operational Excellence](#17-operational-excellence)
18. [Integration Summary](#18-integration-summary)
19. [Anti-Patterns](#19-anti-patterns-never-do)
20. [Error Handling Standards](#20-error-handling-standards-mandatory)

---

## 1. Document Meta

### 1.1 Purpose

This document defines the **mandatory rules, conventions, and standards** that ALL AI coding agents MUST follow when working in this codebase. It serves as the single source of truth for automated development assistance.

### 1.2 Version

| Field | Value |
|-------|-------|
| Version | 1.0.0 |
| Last Updated | 2025-01-18 |
| Schema | Semantic Versioning |

### 1.3 Interpretation Rules

The following keywords indicate requirement levels (per RFC 2119):

| Keyword | Meaning |
|---------|---------|
| **MUST** / **SHALL** | Absolute requirement. No exceptions. |
| **MUST NOT** / **SHALL NOT** | Absolute prohibition. No exceptions. |
| **SHOULD** | Recommended. May be ignored with documented justification. |
| **SHOULD NOT** | Discouraged. May be done with documented justification. |
| **MAY** | Optional. Agent discretion. |

### 1.4 Priority Hierarchy

When rules conflict, resolve in this order (highest to lowest):

1. **Security Guidelines** — Always takes precedence
2. **Explicit User Instructions** — Direct requests from the user
3. **This AGENTS.md File** — These documented standards
4. **Language/Framework Conventions** — Official style guides
5. **Agent Defaults** — Built-in agent behaviors

### 1.5 Scope

This document applies to ALL AI agents including but not limited to:
- Claude Code (Anthropic)
- GitHub Copilot
- Cursor AI
- Aider
- Windsurf (Codeium)
- OpenAI Codex / ChatGPT
- Google Gemini
- Continue.dev
- Any future AI coding assistants

---

## 2. Project Identity

> **INSTRUCTION:** Customize this section for each project. Uncomment and fill in the relevant sections.

### 2.1 Project Type Declaration

```yaml
# Uncomment the applicable project type(s):
project_types:
  # - web_frontend      # React, Vue, Angular, Svelte, etc.
  # - web_backend       # Node.js, Django, FastAPI, Go, etc.
  # - web_fullstack     # Combined frontend + backend
  # - mobile_ios        # Native iOS (Swift/SwiftUI)
  # - mobile_android    # Native Android (Kotlin)
  # - mobile_cross      # React Native, Flutter, etc.
  # - cli_tool          # Command-line applications
  # - library           # Reusable packages/modules
  # - api_service       # REST/GraphQL API services
  # - microservice      # Distributed microservices
  # - monorepo          # Multi-project repository
```

### 2.2 Tech Stack Declaration

```yaml
# Define the project's technology stack:
tech_stack:
  languages:
    # primary: typescript
    # secondary: [python, go]
  
  frontend:
    # framework: react          # react | vue | angular | svelte | nextjs
    # styling: tailwind         # tailwind | css-modules | styled-components
    # state: zustand            # redux | zustand | jotai | mobx | context
  
  backend:
    # runtime: node             # node | python | go | rust | java
    # framework: express        # express | fastify | django | fastapi | gin
    # database: postgresql      # postgresql | mysql | mongodb | sqlite
    # orm: prisma               # prisma | drizzle | sqlalchemy | gorm
  
  mobile:
    # platform: react-native    # react-native | flutter | native
    # ios_lang: swift           # swift | objective-c
    # android_lang: kotlin      # kotlin | java
  
  infrastructure:
    # cloud: aws                # aws | gcp | azure | vercel | cloudflare
    # container: docker         # docker | podman
    # orchestration: kubernetes # kubernetes | ecs | nomad
```

### 2.3 Directory Structure

```
project-root/
├── src/                    # Source code
│   ├── components/         # UI components (frontend)
│   ├── features/           # Feature modules
│   ├── lib/                # Shared utilities
│   ├── services/           # Business logic / API clients
│   ├── hooks/              # Custom hooks (React)
│   ├── stores/             # State management
│   ├── types/              # Type definitions
│   └── utils/              # Helper functions
├── tests/                  # Test files (mirror src/ structure)
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                   # Documentation
├── scripts/                # Build/deploy scripts
├── config/                 # Configuration files
├── public/                 # Static assets (web)
├── assets/                 # Static assets (mobile)
└── .github/                # GitHub workflows
```

### 2.4 Critical Files

Agents MUST be aware of these files:

| File | Purpose | Modification Rules |
|------|---------|-------------------|
| `package.json` / `pyproject.toml` / `go.mod` | Dependencies | MUST NOT add unnecessary deps |
| `.env.example` | Environment template | MUST keep in sync with required vars |
| `.env` / `.env.local` | Secrets | MUST NEVER read, commit, or modify |
| `tsconfig.json` / `eslint.config.js` | Linting config | SHOULD NOT modify without approval |
| `Dockerfile` | Container definition | MUST follow security best practices |
| `AGENTS.md` | This file | SHOULD NOT modify without approval |

---

## 3. Universal Principles

### 3.1 Core Engineering Principles

All code MUST adhere to these principles:

#### DRY (Don't Repeat Yourself)

```typescript
// BAD: Duplicated validation logic
function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validateUserEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Duplicated!
  return regex.test(email);
}

// GOOD: Single source of truth
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}
```

#### SOLID Principles

| Principle | Rule |
|-----------|------|
| **S**ingle Responsibility | Each module/class MUST have ONE reason to change |
| **O**pen/Closed | MUST be open for extension, closed for modification |
| **L**iskov Substitution | Subtypes MUST be substitutable for base types |
| **I**nterface Segregation | MUST NOT force clients to depend on unused interfaces |
| **D**ependency Inversion | MUST depend on abstractions, not concretions |

#### KISS (Keep It Simple, Stupid)

```typescript
// BAD: Over-engineered
class UserValidatorFactoryBuilder {
  private validators: Map<string, ValidatorStrategy> = new Map();
  
  registerValidator(name: string, strategy: ValidatorStrategy): this {
    this.validators.set(name, strategy);
    return this;
  }
  
  build(): UserValidator {
    return new UserValidator(this.validators);
  }
}

// GOOD: Simple and direct
function validateUser(user: User): ValidationResult {
  const errors: string[] = [];
  
  if (!user.email || !isValidEmail(user.email)) {
    errors.push('Invalid email');
  }
  
  if (!user.name || user.name.length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  return { valid: errors.length === 0, errors };
}
```

### 3.2 Error Handling Philosophy

#### Rule: Fail Fast, Fail Loud

All errors MUST be:
1. **Caught** at appropriate boundaries
2. **Logged** with sufficient context
3. **Handled** or **propagated** intentionally
4. **Never swallowed silently**

```typescript
// BAD: Silent failure
async function fetchUser(id: string): Promise<User | null> {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    return null; // Silent failure - BAD!
  }
}

// GOOD: Explicit error handling
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch user', { userId: id, error });
    
    if (error instanceof NotFoundError) {
      throw new UserNotFoundError(id);
    }
    
    throw new UserFetchError(id, error);
  }
}
```

#### Error Types by Language

| Language | Custom Errors | Error Handling |
|----------|--------------|----------------|
| TypeScript | `class CustomError extends Error` | `try/catch`, Result types |
| Python | `class CustomError(Exception)` | `try/except`, contextlib |
| Go | `var ErrCustom = errors.New()` | Multiple returns, `errors.Is/As` |
| Rust | `enum CustomError {}` | `Result<T, E>`, `?` operator |
| Swift | `enum CustomError: Error` | `do/try/catch`, `Result` |
| Kotlin | `class CustomException : Exception()` | `try/catch`, `runCatching` |

### 3.3 Documentation Standards

#### Code Comments

```typescript
// BAD: Obvious comment
// Increment counter by 1
counter++;

// BAD: Outdated comment
// Returns user's full name
function getUserEmail(user: User): string { // Comment lies!
  return user.email;
}

// GOOD: Explains WHY, not WHAT
// We add 1 to account for zero-indexing in the external API
counter++;

// GOOD: Documents non-obvious behavior
/**
 * Fetches user with retry logic.
 * 
 * @remarks
 * Retries up to 3 times with exponential backoff because the
 * upstream service has known intermittent failures during deployments.
 */
async function fetchUserWithRetry(id: string): Promise<User> {
  // ...
}
```

#### Function Documentation Requirements

| Element | Required When |
|---------|--------------|
| Description | ALWAYS for public functions |
| Parameters | ALWAYS when non-obvious |
| Returns | ALWAYS when non-void |
| Throws | ALWAYS when function can throw |
| Example | SHOULD for complex functions |
| Remarks | MAY for implementation notes |

---

## 4. Code Style & Patterns

### 4.1 TypeScript / JavaScript

#### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `UserProfile.tsx` |
| Hooks | camelCase with `use` prefix | `useAuth.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Constants | camelCase or SCREAMING_SNAKE | `config.ts`, `API_ENDPOINTS.ts` |
| Types/Interfaces | PascalCase | `User.types.ts` |
| Tests | Same as source + `.test` | `UserProfile.test.tsx` |

#### Naming Conventions

```typescript
// Constants: SCREAMING_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';

// Variables & Functions: camelCase
const userName = 'john';
function calculateTotal(items: Item[]): number { }

// Classes & Types: PascalCase
class UserService { }
interface UserProfile { }
type UserId = string;

// React Components: PascalCase
function UserCard({ user }: UserCardProps): JSX.Element { }

// Private members: prefix with underscore (optional)
class Service {
  private _cache: Map<string, unknown>;
}

// Boolean variables: prefix with is/has/can/should
const isLoading = true;
const hasPermission = false;
const canEdit = user.role === 'admin';

// Event handlers: prefix with handle/on
const handleClick = () => { };
const onSubmit = (data: FormData) => { };
```

#### Import Order

Imports MUST be ordered as follows (with blank lines between groups):

```typescript
// 1. Node built-ins
import path from 'path';
import fs from 'fs';

// 2. External packages
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';

// 3. Internal aliases (@/)
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks';

// 4. Relative imports (parent directories first)
import { UserContext } from '../../contexts';
import { formatName } from '../utils';
import { UserAvatar } from './UserAvatar';

// 5. Type imports (last)
import type { User, UserRole } from '@/types';
```

#### TypeScript Specific Rules

```typescript
// MUST: Use explicit return types for public functions
function calculateDiscount(price: number, percent: number): number {
  return price * (percent / 100);
}

// MUST: Prefer interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// MUST: Use type for unions, intersections, and aliases
type UserId = string;
type Status = 'pending' | 'active' | 'disabled';
type UserWithPosts = User & { posts: Post[] };

// MUST: Use const assertions for literal types
const ROLES = ['admin', 'user', 'guest'] as const;
type Role = typeof ROLES[number];

// MUST NOT: Use `any` - use `unknown` instead
function parseJSON(text: string): unknown {
  return JSON.parse(text);
}

// MUST: Use strict null checks
function getUser(id: string): User | null {
  const user = users.get(id);
  return user ?? null;
}

// MUST: Prefer nullish coalescing over OR
const name = user.name ?? 'Anonymous'; // GOOD
const name = user.name || 'Anonymous'; // BAD (empty string becomes 'Anonymous')

// MUST: Use optional chaining
const city = user?.address?.city; // GOOD
const city = user && user.address && user.address.city; // BAD
```

### 4.2 Python

#### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Modules | snake_case | `user_service.py` |
| Classes | PascalCase | `class UserService:` |
| Functions | snake_case | `def get_user():` |
| Constants | SCREAMING_SNAKE | `MAX_RETRIES = 3` |
| Tests | `test_` prefix | `test_user_service.py` |

#### Code Style

```python
# MUST: Use type hints for all function signatures
def get_user_by_id(user_id: str) -> User | None:
    """Fetch a user by their unique identifier.
    
    Args:
        user_id: The unique identifier of the user.
        
    Returns:
        The User object if found, None otherwise.
        
    Raises:
        DatabaseError: If the database connection fails.
    """
    pass

# MUST: Use dataclasses or Pydantic for data structures
from dataclasses import dataclass
from pydantic import BaseModel

@dataclass
class User:
    id: str
    name: str
    email: str

class UserCreate(BaseModel):
    name: str
    email: str

# MUST: Use context managers for resources
with open('file.txt', 'r') as f:
    content = f.read()

async with aiohttp.ClientSession() as session:
    response = await session.get(url)

# MUST: Use f-strings for formatting
name = "Alice"
greeting = f"Hello, {name}!"  # GOOD
greeting = "Hello, {}!".format(name)  # BAD
greeting = "Hello, %s!" % name  # BAD

# MUST: Use pathlib for file paths
from pathlib import Path

config_path = Path(__file__).parent / "config" / "settings.yaml"  # GOOD
config_path = os.path.join(os.path.dirname(__file__), "config", "settings.yaml")  # BAD

# MUST: Use enum for fixed choices
from enum import Enum, auto

class Status(Enum):
    PENDING = auto()
    ACTIVE = auto()
    DISABLED = auto()

# MUST NOT: Use mutable default arguments
def add_item(item: str, items: list[str] | None = None) -> list[str]:
    if items is None:
        items = []
    items.append(item)
    return items

# BAD: Mutable default
def add_item_bad(item: str, items: list[str] = []) -> list[str]:  # NEVER DO THIS
    items.append(item)
    return items
```

### 4.3 Go

#### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Files | snake_case | `user_service.go` |
| Test files | `_test` suffix | `user_service_test.go` |
| Packages | lowercase, single word | `package user` |

#### Code Style

```go
// MUST: Use meaningful variable names
// BAD
func p(u *U) error { }

// GOOD
func processUser(user *User) error { }

// MUST: Handle all errors explicitly
result, err := doSomething()
if err != nil {
    return fmt.Errorf("failed to do something: %w", err)
}

// MUST: Use custom error types for domain errors
var (
    ErrUserNotFound = errors.New("user not found")
    ErrInvalidEmail = errors.New("invalid email format")
)

func GetUser(id string) (*User, error) {
    user, err := db.FindUser(id)
    if err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            return nil, ErrUserNotFound
        }
        return nil, fmt.Errorf("database error: %w", err)
    }
    return user, nil
}

// MUST: Use defer for cleanup
func ReadFile(path string) ([]byte, error) {
    f, err := os.Open(path)
    if err != nil {
        return nil, err
    }
    defer f.Close()
    
    return io.ReadAll(f)
}

// MUST: Use context for cancellation and timeouts
func FetchUser(ctx context.Context, id string) (*User, error) {
    ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
    defer cancel()
    
    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    // ...
}

// MUST: Prefer returning structs, accept interfaces
type UserStore interface {
    GetUser(ctx context.Context, id string) (*User, error)
}

type PostgresUserStore struct {
    db *sql.DB
}

func NewPostgresUserStore(db *sql.DB) *PostgresUserStore {
    return &PostgresUserStore{db: db}
}
```

### 4.4 Swift (iOS)

#### Naming Conventions

```swift
// MUST: Use camelCase for variables and functions
let userName = "John"
func fetchUserProfile() { }

// MUST: Use PascalCase for types and protocols
struct User { }
protocol UserServiceProtocol { }
enum UserStatus { }

// MUST: Use descriptive parameter labels
// BAD
func fetch(_ id: String) -> User? { }

// GOOD
func fetchUser(withID id: String) -> User? { }

// MUST: Use computed properties over get methods
// BAD
func getFullName() -> String {
    return "\(firstName) \(lastName)"
}

// GOOD
var fullName: String {
    "\(firstName) \(lastName)"
}

// MUST: Use Result type for error handling
func fetchUser(id: String) async -> Result<User, UserError> {
    do {
        let user = try await api.getUser(id: id)
        return .success(user)
    } catch {
        return .failure(.networkError(error))
    }
}

// MUST: Use guard for early exits
func processUser(_ user: User?) {
    guard let user = user else {
        return
    }
    
    guard user.isActive else {
        logger.warn("User is not active")
        return
    }
    
    // Process user...
}
```

### 4.5 Kotlin (Android)

#### Naming Conventions

```kotlin
// MUST: Use camelCase for variables and functions
val userName = "John"
fun fetchUserProfile() { }

// MUST: Use PascalCase for classes and interfaces
class User { }
interface UserRepository { }
sealed class UserState { }

// MUST: Use data classes for DTOs
data class User(
    val id: String,
    val name: String,
    val email: String
)

// MUST: Use sealed classes for state
sealed class UiState<out T> {
    object Loading : UiState<Nothing>()
    data class Success<T>(val data: T) : UiState<T>()
    data class Error(val message: String) : UiState<Nothing>()
}

// MUST: Use coroutines for async operations
suspend fun fetchUser(id: String): User {
    return withContext(Dispatchers.IO) {
        api.getUser(id)
    }
}

// MUST: Use scope functions appropriately
// let - for nullable transformations
user?.let { 
    saveUser(it)
}

// apply - for object configuration
val user = User().apply {
    name = "John"
    email = "john@example.com"
}

// also - for side effects
return user.also {
    logger.info("Created user: ${it.id}")
}
```

---

## 5. Architecture Rules

### 5.1 Module Boundaries

#### Dependency Direction Rule

Dependencies MUST flow in ONE direction only:

```
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION                            │
│  (Components, Pages, Views, Controllers)                     │
│                          │                                   │
│                          ▼                                   │
│                     APPLICATION                              │
│  (Use Cases, Services, State Management)                     │
│                          │                                   │
│                          ▼                                   │
│                       DOMAIN                                 │
│  (Entities, Business Rules, Interfaces)                      │
│                          │                                   │
│                          ▼                                   │
│                   INFRASTRUCTURE                             │
│  (Database, API Clients, External Services)                  │
└─────────────────────────────────────────────────────────────┘
```

**Rules:**
- MUST NOT import from upper layers
- MUST NOT have circular dependencies
- Domain layer MUST have zero external dependencies

```typescript
// BAD: Infrastructure importing from Presentation
// In: src/infrastructure/api.ts
import { UserCard } from '../components/UserCard'; // VIOLATION!

// BAD: Domain importing from Infrastructure
// In: src/domain/user.ts
import { prisma } from '../infrastructure/database'; // VIOLATION!

// GOOD: Presentation imports from Application
// In: src/components/UserProfile.tsx
import { useUser } from '../application/hooks/useUser';
import type { User } from '../domain/entities/User';
```

### 5.2 Feature-Based Structure

For larger projects, PREFER feature-based organization:

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── services/
│   │   │   └── authService.ts
│   │   ├── stores/
│   │   │   └── authStore.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   └── index.ts          # Public API
│   │
│   ├── users/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.ts
│   │
│   └── products/
│       └── ...
│
├── shared/                    # Cross-feature shared code
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── types/
│
└── core/                      # Application core
    ├── api/
    ├── config/
    └── providers/
```

**Feature Boundary Rules:**
- Features MUST export through `index.ts` (barrel file)
- Features MUST NOT import internal modules from other features
- Shared code MUST go in `shared/` directory

```typescript
// GOOD: Import from feature's public API
import { LoginForm, useAuth } from '@/features/auth';

// BAD: Import from feature's internals
import { LoginForm } from '@/features/auth/components/LoginForm';
```

### 5.3 State Management Patterns

#### Client State vs Server State

| Type | Examples | Solution |
|------|----------|----------|
| Server State | User data, posts, products | TanStack Query, SWR, Apollo |
| Client State | UI state, forms, filters | Zustand, Jotai, Context |
| URL State | Pagination, filters, tabs | URL params, router state |
| Form State | Input values, validation | React Hook Form, Formik |

```typescript
// GOOD: Server state with TanStack Query
function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// GOOD: Client state with Zustand
interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

// BAD: Server state in client store
const useStore = create((set) => ({
  users: [],  // DON'T store server data here
  fetchUsers: async () => {
    const users = await api.getUsers();
    set({ users });
  },
}));
```

### 5.4 API Design Standards

#### REST Endpoints

| Method | Path Pattern | Purpose |
|--------|--------------|---------|
| GET | `/resources` | List resources |
| GET | `/resources/:id` | Get single resource |
| POST | `/resources` | Create resource |
| PUT | `/resources/:id` | Replace resource |
| PATCH | `/resources/:id` | Partial update |
| DELETE | `/resources/:id` | Delete resource |

```typescript
// GOOD: RESTful naming
GET    /api/users
GET    /api/users/:id
POST   /api/users
PATCH  /api/users/:id
DELETE /api/users/:id
GET    /api/users/:id/posts

// BAD: Non-RESTful naming
GET    /api/getUsers
POST   /api/createUser
POST   /api/user/delete/:id
GET    /api/getUserPosts/:userId
```

#### Response Format

All API responses MUST follow this structure:

```typescript
// Success Response
interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// Error Response
interface ErrorResponse {
  success: false;
  error: {
    code: string;           // Machine-readable code
    message: string;        // Human-readable message
    details?: unknown;      // Additional error details
  };
}

// Example Success
{
  "success": true,
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}

// Example Error
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "No user found with the provided ID",
    "details": {
      "userId": "123"
    }
  }
}
```

---

## 6. Testing Strategy

### 6.1 Test Pyramid

```
                    ┌───────────┐
                    │   E2E     │  ~10% - Critical user journeys
                    │   Tests   │
                   ┌┴───────────┴┐
                   │ Integration │  ~20% - API, DB, services
                   │    Tests    │
                  ┌┴─────────────┴┐
                  │     Unit      │  ~70% - Functions, components
                  │     Tests     │
                  └───────────────┘
```

### 6.2 Coverage Requirements

| Category | Minimum Coverage | Target Coverage |
|----------|-----------------|-----------------|
| Overall | 70% | 85% |
| Critical Paths | 90% | 100% |
| Utility Functions | 80% | 95% |
| UI Components | 60% | 80% |
| API Endpoints | 85% | 95% |

### 6.3 Test File Organization

```
src/
├── components/
│   └── UserCard.tsx
├── services/
│   └── userService.ts
└── utils/
    └── formatters.ts

tests/
├── unit/
│   ├── components/
│   │   └── UserCard.test.tsx
│   ├── services/
│   │   └── userService.test.ts
│   └── utils/
│       └── formatters.test.ts
├── integration/
│   └── api/
│       └── users.test.ts
└── e2e/
    └── user-journey.spec.ts
```

### 6.4 Test Naming Convention

```typescript
// Pattern: describe -> context -> it
// Format: "should [expected behavior] when [condition]"

describe('UserService', () => {
  describe('createUser', () => {
    it('should create a user when valid data is provided', async () => {
      // ...
    });

    it('should throw ValidationError when email is invalid', async () => {
      // ...
    });

    it('should throw DuplicateError when email already exists', async () => {
      // ...
    });
  });
});

// Component tests
describe('UserCard', () => {
  it('should render user name and email', () => {
    // ...
  });

  it('should call onEdit when edit button is clicked', () => {
    // ...
  });

  it('should show loading skeleton when isLoading is true', () => {
    // ...
  });
});
```

### 6.5 Test Examples

#### Unit Test (TypeScript/Jest)

```typescript
import { formatCurrency, formatDate } from '@/utils/formatters';

describe('formatCurrency', () => {
  it('should format number as USD currency', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should handle negative numbers', () => {
    expect(formatCurrency(-100)).toBe('-$100.00');
  });
});

describe('formatDate', () => {
  it('should format ISO date to readable format', () => {
    const date = '2024-01-15T10:30:00Z';
    expect(formatDate(date)).toBe('January 15, 2024');
  });

  it('should return "Invalid Date" for invalid input', () => {
    expect(formatDate('not-a-date')).toBe('Invalid Date');
  });
});
```

#### Component Test (React Testing Library)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from '@/components/UserCard';

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://example.com/avatar.jpg',
};

describe('UserCard', () => {
  it('should render user information', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockUser.avatar);
  });

  it('should call onDelete when delete button is clicked', () => {
    const handleDelete = jest.fn();
    render(<UserCard user={mockUser} onDelete={handleDelete} />);

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(handleDelete).toHaveBeenCalledWith(mockUser.id);
  });

  it('should show confirmation dialog before delete', async () => {
    render(<UserCard user={mockUser} onDelete={jest.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(await screen.findByText(/are you sure/i)).toBeInTheDocument();
  });
});
```

#### Integration Test (API)

```typescript
import request from 'supertest';
import { app } from '@/app';
import { db } from '@/infrastructure/database';

describe('POST /api/users', () => {
  beforeEach(async () => {
    await db.user.deleteMany();
  });

  it('should create a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securePassword123',
    };

    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      name: userData.name,
      email: userData.email,
    });
    expect(response.body.data.password).toBeUndefined();
  });

  it('should return 400 for invalid email', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        name: 'John',
        email: 'invalid-email',
        password: 'password123',
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 409 for duplicate email', async () => {
    await db.user.create({
      data: { name: 'Existing', email: 'john@example.com', password: 'hash' },
    });

    const response = await request(app)
      .post('/api/users')
      .send({
        name: 'John',
        email: 'john@example.com',
        password: 'password123',
      })
      .expect(409);

    expect(response.body.error.code).toBe('DUPLICATE_EMAIL');
  });
});
```

### 6.6 Mocking Guidelines

#### What to Mock

| Always Mock | Never Mock |
|-------------|------------|
| External APIs | Pure functions |
| Database (in unit tests) | Simple utilities |
| File system | Data transformations |
| Time/Date | Business logic |
| Random values | |

#### Mocking Examples

```typescript
// Mock external service
jest.mock('@/services/emailService', () => ({
  sendEmail: jest.fn().mockResolvedValue({ sent: true }),
}));

// Mock with implementation
const mockFetch = jest.fn().mockImplementation((url: string) => {
  if (url.includes('/users/1')) {
    return Promise.resolve({ json: () => ({ id: '1', name: 'John' }) });
  }
  return Promise.reject(new Error('Not found'));
});

// Mock time
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2024-01-15T10:00:00Z'));
});

afterEach(() => {
  jest.useRealTimers();
});

// Mock module partially
jest.mock('@/utils/helpers', () => ({
  ...jest.requireActual('@/utils/helpers'),
  generateId: jest.fn().mockReturnValue('mock-id-123'),
}));
```

---

## 7. Git Workflow

### 7.1 Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/<ticket>-<description>` | `feature/PROJ-123-user-auth` |
| Bug Fix | `fix/<ticket>-<description>` | `fix/PROJ-456-login-crash` |
| Hotfix | `hotfix/<ticket>-<description>` | `hotfix/PROJ-789-security-patch` |
| Chore | `chore/<description>` | `chore/update-dependencies` |
| Docs | `docs/<description>` | `docs/api-documentation` |
| Refactor | `refactor/<description>` | `refactor/user-service` |
| Test | `test/<description>` | `test/auth-integration` |

### 7.2 Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

#### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, semicolons, etc.) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `build` | Build system or external dependencies |
| `ci` | CI/CD configuration |
| `chore` | Other changes that don't modify src or test files |
| `revert` | Reverts a previous commit |

#### Examples

```bash
# Feature
feat(auth): add OAuth2 login with Google

Implement Google OAuth2 authentication flow with PKCE.
Includes token refresh and secure storage.

Closes #123

# Bug Fix
fix(cart): resolve race condition in quantity update

Multiple rapid clicks caused incorrect quantity due to
stale state. Added debounce and optimistic locking.

Fixes #456

# Breaking Change
feat(api)!: change user endpoint response format

BREAKING CHANGE: User endpoint now returns nested
profile object instead of flat structure.

Migration guide: https://docs.example.com/migration

# Simple commits
docs: update API documentation for v2 endpoints
style: format code with prettier
test: add unit tests for UserService
chore: upgrade typescript to 5.3
```

### 7.3 Commit Rules

| Rule | Requirement |
|------|-------------|
| Atomic | Each commit MUST be a single logical change |
| Buildable | Each commit MUST leave the codebase in a buildable state |
| Tested | Each commit SHOULD pass all tests |
| Size | Commits SHOULD be small (< 400 lines changed) |
| Messages | Messages MUST be in imperative mood ("add" not "added") |

```bash
# BAD: Multiple unrelated changes
git commit -m "fix login and add new feature and update docs"

# GOOD: Separate atomic commits
git commit -m "fix(auth): resolve session timeout issue"
git commit -m "feat(users): add profile picture upload"
git commit -m "docs: update authentication guide"
```

### 7.4 Pull Request Template

```markdown
## Summary
<!-- Brief description of changes -->

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)

## Related Issues
<!-- Link to related issues: Closes #123, Fixes #456 -->

## Changes Made
<!-- Bullet points of specific changes -->
- 
- 
- 

## Testing
<!-- Describe testing performed -->
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Screenshots
<!-- If applicable, add screenshots -->

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] All tests pass locally
```

### 7.5 Branch Protection Rules

The following MUST be enforced on `main`/`master`:

| Rule | Setting |
|------|---------|
| Require PR reviews | Minimum 1 approval |
| Require status checks | All CI checks must pass |
| Require up-to-date branch | Must be current with base |
| Require linear history | Squash or rebase only |
| No force push | Disabled for everyone |
| No deletion | Protected from deletion |

---

## 8. Security Guidelines

### 8.1 Secret Management

#### NEVER Do

```typescript
// NEVER: Hardcoded secrets
const API_KEY = 'sk-1234567890abcdef';  // CRITICAL VIOLATION
const DB_PASSWORD = 'admin123';          // CRITICAL VIOLATION

// NEVER: Secrets in code comments
// API key for testing: sk-test-xxx      // VIOLATION

// NEVER: Secrets in URLs
const url = 'https://api.example.com?key=secret123';  // VIOLATION
```

#### ALWAYS Do

```typescript
// ALWAYS: Use environment variables
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;

// ALWAYS: Validate environment variables at startup
function validateEnv() {
  const required = ['API_KEY', 'DB_URL', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}

// ALWAYS: Use secrets manager in production
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

async function getSecret(secretName: string): Promise<string> {
  const client = new SecretsManager({ region: 'us-east-1' });
  const response = await client.getSecretValue({ SecretId: secretName });
  return response.SecretString!;
}
```

### 8.2 Sensitive Files

These files MUST NEVER be committed:

```gitignore
# Environment files
.env
.env.local
.env.*.local
.env.production

# Credentials
credentials.json
service-account.json
*.pem
*.key
*.crt

# IDE secrets
.idea/**/workspace.xml
.vscode/settings.json  # If contains secrets

# OS files
.DS_Store
Thumbs.db

# Logs that might contain sensitive data
*.log
logs/
```

### 8.3 Input Validation

All user input MUST be validated:

```typescript
import { z } from 'zod';

// Define schema
const UserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  age: z.number().int().min(0).max(150).optional(),
  role: z.enum(['user', 'admin']).default('user'),
});

// Validate at API boundary
app.post('/users', async (req, res) => {
  const result = UserSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request body',
        details: result.error.flatten(),
      },
    });
  }
  
  const user = await createUser(result.data);
  return res.status(201).json({ success: true, data: user });
});
```

### 8.4 SQL Injection Prevention

```typescript
// BAD: String concatenation (SQL Injection vulnerability!)
const query = `SELECT * FROM users WHERE id = '${userId}'`;

// BAD: Template literals (still vulnerable!)
const query = `SELECT * FROM users WHERE email = '${email}'`;

// GOOD: Parameterized queries
const user = await db.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);

// GOOD: ORM with parameters
const user = await prisma.user.findUnique({
  where: { id: userId },
});

// GOOD: Query builder with parameters
const user = await db
  .selectFrom('users')
  .where('id', '=', userId)
  .executeTakeFirst();
```

### 8.5 XSS Prevention

```typescript
// BAD: Direct HTML insertion
element.innerHTML = userInput;  // XSS vulnerability!

// BAD: React dangerouslySetInnerHTML without sanitization
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// GOOD: Use textContent for plain text
element.textContent = userInput;

// GOOD: React automatic escaping
<div>{userContent}</div>

// GOOD: Sanitize if HTML is required
import DOMPurify from 'dompurify';

<div
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(userContent),
  }}
/>
```

### 8.6 Authentication & Authorization

```typescript
// MUST: Hash passwords with bcrypt or argon2
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// MUST: Use secure JWT configuration
import jwt from 'jsonwebtoken';

const JWT_CONFIG = {
  algorithm: 'RS256',           // Use asymmetric algorithm
  expiresIn: '15m',             // Short-lived access tokens
  issuer: 'your-app',
  audience: 'your-app-users',
};

// MUST: Validate authorization on every request
async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const payload = jwt.verify(token, PUBLIC_KEY, JWT_CONFIG);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// MUST: Check permissions for protected resources
async function requirePermission(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const hasPermission = await checkUserPermission(req.user.id, permission);
    
    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
}
```

### 8.7 Security Headers

```typescript
// MUST: Set security headers
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// MUST: Enable CORS properly
import cors from 'cors';

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

---

## 9. Performance Standards

### 9.1 Load Time Budgets

| Metric | Target | Maximum |
|--------|--------|---------|
| First Contentful Paint (FCP) | < 1.0s | 1.8s |
| Largest Contentful Paint (LCP) | < 2.0s | 2.5s |
| Time to Interactive (TTI) | < 3.0s | 3.8s |
| Cumulative Layout Shift (CLS) | < 0.1 | 0.25 |
| First Input Delay (FID) | < 100ms | 300ms |

### 9.2 Bundle Size Limits

| Asset Type | Target | Maximum |
|------------|--------|---------|
| Initial JS Bundle | < 100KB | 200KB |
| Per-route chunk | < 50KB | 100KB |
| CSS Bundle | < 50KB | 100KB |
| Images (hero) | < 200KB | 500KB |
| Images (thumbnails) | < 20KB | 50KB |

### 9.3 Code Splitting

```typescript
// MUST: Lazy load routes
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}

// MUST: Split large libraries
// Instead of importing entire library
import _ from 'lodash';  // BAD: Imports entire lodash

// Import specific functions
import debounce from 'lodash/debounce';  // GOOD: Tree-shakeable
```

### 9.4 Image Optimization

```typescript
// MUST: Use modern formats
// Priority: AVIF > WebP > PNG/JPEG

// MUST: Use responsive images
<picture>
  <source
    type="image/avif"
    srcSet="image-400.avif 400w, image-800.avif 800w"
    sizes="(max-width: 600px) 400px, 800px"
  />
  <source
    type="image/webp"
    srcSet="image-400.webp 400w, image-800.webp 800w"
    sizes="(max-width: 600px) 400px, 800px"
  />
  <img
    src="image-800.jpg"
    alt="Description"
    loading="lazy"
    decoding="async"
    width={800}
    height={600}
  />
</picture>

// MUST: Lazy load below-fold images
<img loading="lazy" decoding="async" src="image.jpg" alt="..." />

// MUST: Use Next.js Image or similar
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority  // Only for above-fold images
/>
```

### 9.5 Caching Strategy

```typescript
// API Response Caching
const cacheConfig = {
  // Static assets - immutable
  static: 'public, max-age=31536000, immutable',
  
  // HTML pages - revalidate
  html: 'public, max-age=0, must-revalidate',
  
  // API responses - short cache
  api: 'private, max-age=60, stale-while-revalidate=300',
  
  // User-specific - no cache
  private: 'private, no-cache, no-store, must-revalidate',
};

// React Query cache configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      gcTime: 30 * 60 * 1000,        // 30 minutes
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});
```

### 9.6 Database Query Optimization

```typescript
// MUST: Avoid N+1 queries
// BAD: N+1 query problem
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({ where: { authorId: user.id } });
  // This creates N+1 queries!
}

// GOOD: Use includes/joins
const users = await prisma.user.findMany({
  include: { posts: true },
});

// MUST: Add indexes for queried columns
// In Prisma schema
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  
  @@index([createdAt])  // Index for sorting
  @@index([name])       // Index for searching
}

// MUST: Paginate large datasets
const users = await prisma.user.findMany({
  take: 20,
  skip: (page - 1) * 20,
  orderBy: { createdAt: 'desc' },
});

// SHOULD: Use cursor-based pagination for large datasets
const users = await prisma.user.findMany({
  take: 20,
  cursor: lastCursor ? { id: lastCursor } : undefined,
  skip: lastCursor ? 1 : 0,
});
```

### 9.7 Memory Management

```typescript
// MUST: Clean up subscriptions and listeners
useEffect(() => {
  const subscription = eventEmitter.subscribe(handler);
  
  return () => {
    subscription.unsubscribe();  // Clean up!
  };
}, []);

// MUST: Avoid memory leaks in closures
// BAD: Closure holds reference to large data
function processData(largeData: LargeObject[]) {
  return function handler() {
    console.log(largeData.length);  // Holds reference to largeData
  };
}

// GOOD: Extract only needed data
function processData(largeData: LargeObject[]) {
  const count = largeData.length;
  return function handler() {
    console.log(count);  // Only holds primitive
  };
}

// MUST: Use WeakMap/WeakSet for caches
const cache = new WeakMap<object, Result>();

function getCached(key: object): Result {
  if (cache.has(key)) {
    return cache.get(key)!;
  }
  const result = expensiveComputation(key);
  cache.set(key, result);
  return result;
}
```

---

## 10. CI/CD Guidelines

### 10.1 Pipeline Structure

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # Stage 1: Quick checks (parallel)
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run typecheck

  # Stage 2: Tests (after lint passes)
  test-unit:
    needs: [lint, typecheck]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - uses: codecov/codecov-action@v3

  test-integration:
    needs: [lint, typecheck]
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:integration

  # Stage 3: Build (after tests pass)
  build:
    needs: [test-unit, test-integration]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/

  # Stage 4: E2E (after build)
  test-e2e:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e

  # Stage 5: Deploy (main only, after E2E)
  deploy:
    if: github.ref == 'refs/heads/main'
    needs: test-e2e
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/
      - run: ./scripts/deploy.sh
```

### 10.2 Deployment Gates

| Gate | Requirement | Blocks |
|------|-------------|--------|
| Lint | Zero errors | Merge |
| Type Check | Zero errors | Merge |
| Unit Tests | 100% pass, coverage threshold | Merge |
| Integration Tests | 100% pass | Merge |
| E2E Tests | Critical paths pass | Deploy |
| Security Scan | No high/critical vulns | Deploy |
| Performance | Core Web Vitals pass | Deploy |
| Manual Approval | Required for prod | Deploy (prod) |

### 10.3 Environment Progression

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│   Dev   │───▶│ Staging │───▶│   QA    │───▶│  Prod   │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
     │              │              │              │
  Auto on       Auto on        Manual         Manual
  feature       develop        trigger        approval
  branch        merge
```

### 10.4 Rollback Procedures

```bash
# Immediate rollback (< 2 min)
# Revert to previous deployment
kubectl rollout undo deployment/app-name

# Or using Vercel/similar
vercel rollback

# Database rollback (if migrations applied)
npm run db:migrate:down

# Full rollback checklist
# 1. [ ] Notify team in incident channel
# 2. [ ] Revert deployment
# 3. [ ] Verify health checks pass
# 4. [ ] Revert database migrations if needed
# 5. [ ] Verify functionality
# 6. [ ] Post-incident review scheduled
```

---

## 11. Accessibility Standards

### 11.1 Compliance Level

This project targets **WCAG 2.1 Level AA** compliance.

| Level | Requirement |
|-------|-------------|
| A | MUST comply (minimum) |
| AA | MUST comply (target) |
| AAA | SHOULD comply where feasible |

### 11.2 Semantic HTML

```html
<!-- BAD: Div soup -->
<div class="header">
  <div class="nav">
    <div class="nav-item" onclick="navigate()">Home</div>
  </div>
</div>
<div class="main">
  <div class="title">Welcome</div>
</div>

<!-- GOOD: Semantic elements -->
<header>
  <nav aria-label="Main navigation">
    <a href="/">Home</a>
  </nav>
</header>
<main>
  <h1>Welcome</h1>
</main>
```

### 11.3 ARIA Requirements

```tsx
// MUST: Add ARIA labels for icons/buttons without visible text
<button aria-label="Close dialog">
  <CloseIcon />
</button>

// MUST: Use ARIA for custom components
<div
  role="tablist"
  aria-label="Settings sections"
>
  <button
    role="tab"
    aria-selected={activeTab === 'general'}
    aria-controls="general-panel"
    id="general-tab"
  >
    General
  </button>
</div>
<div
  role="tabpanel"
  id="general-panel"
  aria-labelledby="general-tab"
  hidden={activeTab !== 'general'}
>
  {/* Panel content */}
</div>

// MUST: Announce dynamic content
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// MUST: Mark required form fields
<label htmlFor="email">
  Email <span aria-hidden="true">*</span>
</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">
  {emailError}
</span>
```

### 11.4 Keyboard Navigation

```tsx
// MUST: All interactive elements focusable
// MUST: Visible focus indicators
.interactive:focus-visible {
  outline: 2px solid var(--focus-color);
  outline-offset: 2px;
}

// MUST: Logical tab order
// MUST NOT: Use positive tabindex (except 0 and -1)
<button tabIndex={0}>Focusable</button>
<div tabIndex={-1}>Programmatically focusable only</div>
<button tabIndex={5}>BAD - Breaks natural order</button>

// MUST: Support keyboard shortcuts for custom components
function useKeyboardNavigation(items: Item[]) {
  const [focusIndex, setFocusIndex] = useState(0);

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusIndex((i) => Math.min(i + 1, items.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        setFocusIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setFocusIndex(items.length - 1);
        break;
    }
  };

  return { focusIndex, handleKeyDown };
}
```

### 11.5 Color & Contrast

| Element | Minimum Ratio | Target Ratio |
|---------|--------------|--------------|
| Normal text | 4.5:1 | 7:1 |
| Large text (18px+ or 14px+ bold) | 3:1 | 4.5:1 |
| UI components | 3:1 | 4.5:1 |
| Non-text (icons, borders) | 3:1 | 4.5:1 |

```css
/* MUST: Provide sufficient contrast */
:root {
  --text-primary: #1a1a1a;      /* 16.1:1 on white */
  --text-secondary: #525252;    /* 7.2:1 on white */
  --text-disabled: #737373;     /* 4.5:1 on white (minimum) */
}

/* MUST NOT: Use color alone to convey information */
/* BAD */
.error { color: red; }

/* GOOD */
.error {
  color: #d32f2f;
  border-left: 3px solid currentColor;
}
.error::before {
  content: "Error: ";
}
```

### 11.6 Mobile Accessibility

```tsx
// MUST: Touch targets minimum 44x44px
.touch-target {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
}

// MUST: Support screen reader gestures
// MUST: Test with VoiceOver (iOS) and TalkBack (Android)

// MUST: Support reduced motion
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// In React:
function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}
```

---

## 12. Monitoring & Observability

### 12.1 Logging Standards

#### Log Levels

| Level | Use Case | Example |
|-------|----------|---------|
| `error` | Errors requiring immediate attention | Database connection failure |
| `warn` | Potential issues, degraded functionality | Retry succeeded, deprecated API used |
| `info` | Significant events, state changes | User login, order placed |
| `debug` | Diagnostic information | Request/response details |
| `trace` | Very detailed diagnostic info | Function entry/exit |

#### Log Format

```typescript
// MUST: Use structured logging
import { logger } from '@/lib/logger';

// GOOD: Structured with context
logger.info('User logged in', {
  userId: user.id,
  method: 'oauth',
  provider: 'google',
  duration: Date.now() - startTime,
});

// GOOD: Error with stack trace and context
logger.error('Failed to process payment', {
  error: error.message,
  stack: error.stack,
  orderId: order.id,
  amount: order.total,
  paymentMethod: order.paymentMethod,
});

// BAD: Unstructured string
logger.info(`User ${userId} logged in via ${method}`);

// BAD: Logging sensitive data
logger.info('Payment processed', { 
  creditCard: user.creditCard,  // NEVER!
  password: user.password,      // NEVER!
});
```

#### What to Log

| Always Log | Never Log |
|------------|-----------|
| Request ID / Correlation ID | Passwords |
| User ID (not PII) | Credit card numbers |
| Timestamps | SSN / Government IDs |
| Error messages & stacks | API keys / secrets |
| Performance metrics | Session tokens |
| Business events | Raw PII (names, emails) |

### 12.2 Metrics Requirements

#### Standard Metrics (RED Method)

| Metric | Description | Example |
|--------|-------------|---------|
| **R**ate | Requests per second | `http_requests_total` |
| **E**rrors | Error rate | `http_errors_total` |
| **D**uration | Request latency | `http_request_duration_seconds` |

```typescript
// MUST: Track request metrics
import { metrics } from '@/lib/metrics';

const httpRequestDuration = metrics.histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 5],
});

const httpRequestsTotal = metrics.counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

// Middleware to record metrics
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const labels = {
      method: req.method,
      route: req.route?.path ?? 'unknown',
      status: res.statusCode,
    };
    
    httpRequestDuration.observe(labels, duration);
    httpRequestsTotal.inc(labels);
  });
  
  next();
});
```

#### Business Metrics

```typescript
// MUST: Track key business events
const ordersPlaced = metrics.counter({
  name: 'orders_placed_total',
  help: 'Total orders placed',
  labelNames: ['payment_method', 'currency'],
});

const orderValue = metrics.histogram({
  name: 'order_value_dollars',
  help: 'Order value in dollars',
  buckets: [10, 50, 100, 500, 1000, 5000],
});

// Track when orders are placed
function placeOrder(order: Order) {
  // ... process order
  
  ordersPlaced.inc({
    payment_method: order.paymentMethod,
    currency: order.currency,
  });
  
  orderValue.observe(order.totalInDollars);
}
```

### 12.3 Alerting Patterns

#### Alert Severity Levels

| Severity | Response Time | Example |
|----------|--------------|---------|
| Critical | Immediate (page) | Service down, data loss |
| High | < 15 min | Error rate > 5% |
| Medium | < 1 hour | Degraded performance |
| Low | Next business day | Warning thresholds |

#### Alert Configuration

```yaml
# Example: Prometheus alerting rules
groups:
  - name: api-alerts
    rules:
      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m]))
          / sum(rate(http_requests_total[5m])) > 0.05
        for: 5m
        labels:
          severity: high
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }} (threshold: 5%)"

      - alert: SlowResponseTime
        expr: |
          histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 10m
        labels:
          severity: medium
        annotations:
          summary: "Slow response times"
          description: "95th percentile latency is {{ $value }}s"

      - alert: ServiceDown
        expr: up{job="api"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service is down"
```

### 12.4 Distributed Tracing

```typescript
// MUST: Propagate trace context
import { trace, context, propagation } from '@opentelemetry/api';

const tracer = trace.getTracer('my-service');

// Create spans for operations
async function handleRequest(req: Request) {
  const span = tracer.startSpan('handleRequest', {
    attributes: {
      'http.method': req.method,
      'http.url': req.url,
    },
  });

  try {
    // Create child span for database operation
    const dbSpan = tracer.startSpan('database.query', {
      parent: span,
    });
    
    const result = await db.query('SELECT * FROM users');
    dbSpan.end();
    
    return result;
  } catch (error) {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR });
    throw error;
  } finally {
    span.end();
  }
}

// Propagate to downstream services
async function callDownstreamService(url: string) {
  const headers: Record<string, string> = {};
  
  // Inject trace context into headers
  propagation.inject(context.active(), headers);
  
  return fetch(url, { headers });
}
```

---

## 13. Agent Behavior Rules

### 13.1 Pre-Action Requirements

| Before This Action | Agent MUST First |
|-------------------|------------------|
| Editing a file | Read the file (or relevant section) |
| Deleting code | Understand what it does and confirm intent |
| Adding dependencies | Check if similar dependency exists |
| Creating files | Verify file doesn't already exist |
| Running commands | Understand what the command does |
| Modifying config | Read current config state |

### 13.2 Verification Steps

After making changes, agents MUST verify:

```yaml
# After code changes
verification_steps:
  - Check: Code compiles/lints without errors
  - Check: Existing tests still pass
  - Check: New code has appropriate tests
  - Check: No console.log/print debugging left
  - Check: No commented-out code left
  - Check: Imports are used and correctly ordered

# After dependency changes
dependency_verification:
  - Check: Package version is stable (not alpha/beta unless required)
  - Check: License is compatible
  - Check: No known security vulnerabilities
  - Check: Package is actively maintained

# After configuration changes
config_verification:
  - Check: All required environment variables documented
  - Check: No secrets in configuration files
  - Check: Changes work in all environments
```

### 13.3 Modification Limits

| Action | Limit | Exceeding Requires |
|--------|-------|-------------------|
| Lines changed per file | 200 | Explicit user approval |
| Files modified per task | 10 | Break into smaller tasks |
| New dependencies added | 3 | Justification required |
| New files created | 5 | Explicit user approval |

### 13.4 Escalation Triggers

Agents MUST stop and ask the user when:

```yaml
escalation_required:
  # Uncertainty
  - "Requirement is ambiguous"
  - "Multiple valid approaches exist"
  - "Cannot find referenced file/function"
  - "Test failures unrelated to changes"
  
  # Risk
  - "Change affects authentication/authorization"
  - "Change affects payment processing"
  - "Change affects data deletion"
  - "Modifying production configuration"
  - "Removing seemingly unused code"
  
  # Scope
  - "Task requires changes outside current directory"
  - "Task requires infrastructure changes"
  - "Task requires database schema changes"
  
  # Blockers
  - "Missing required information"
  - "Conflicting requirements"
  - "Environment/tooling issues"
```

### 13.5 Recovery Procedures

When something goes wrong:

```yaml
error_recovery:
  compilation_error:
    1: "Identify the specific error message"
    2: "Check if error is from our changes"
    3: "If our change, fix the issue"
    4: "If not our change, report to user"
    5: "Never ignore compilation errors"

  test_failure:
    1: "Identify which test failed"
    2: "Determine if failure is expected (behavior change)"
    3: "If expected, update test"
    4: "If unexpected, fix the bug"
    5: "Never delete failing tests without approval"

  merge_conflict:
    1: "Stop and report to user"
    2: "Do not attempt automatic resolution"
    3: "Explain the conflict"
    4: "Wait for user guidance"

  accidental_deletion:
    1: "Immediately notify user"
    2: "Check git history for recovery"
    3: "Restore from git if possible"
    4: "Document what was lost if unrecoverable"
```

---

### 13.6 Doom Loop Prevention (MANDATORY)

A **doom loop** occurs when an agent attempts fixes that create new errors, requiring more fixes, creating an infinite regression cycle. This destroys code quality and wastes resources. ALL agents MUST detect and prevent doom loops.

#### Definition

```yaml
doom_loop: >
  A destructive cycle where:
  1. Fix for Error A creates Error B
  2. Fix for Error B creates Error C  
  3. Fix for Error C recreates Error A
  4. Agent keeps looping indefinitely
  
  Or:
  1. Same error type occurs 3+ times
  2. Alternating errors (A→B→A→B pattern)
  3. Multiple fixes without verification
  4. Error count increases after fixes
```

#### Detection Patterns (STOP Immediately When Detected)

| Pattern | Detection Rule | Action Required |
|---------|----------------|-----------------|
| **Recurring Error** | Same error type/message appears 3+ times | STOP - Do not attempt another fix |
| **Alternating Errors** | Error type alternates (e.g., lint→test→lint→test) | STOP - Fixes are conflicting |
| **Unverified Cascade** | 3+ fixes attempted without running verification | STOP - Run full verification suite |
| **Regression** | Previously fixed error reappears | STOP - Do not re-apply same fix |
| **Escalating Errors** | Total error count increases after fixes | STOP - Changes are making it worse |
| **Fix Ping-Pong** | Changing code to fix A breaks B, fixing B breaks A | STOP - Architecture issue, escalate |

#### Mandatory Pre-Fix Checks

Before EVERY fix attempt, agents MUST:

```yaml
pre_fix_checklist:
  - "[ ] Check if this EXACT error was already 'fixed'"
  - "[ ] Check if previous fix created this error"
  - "[ ] Count total errors before this fix"
  - "[ ] Count actions in last 2 minutes (MUST be < 5)"
  - "[ ] Verify I'm not retrying a failed approach"
  - "[ ] Check git diff to see what changed so far"
```

#### Mandatory Post-Fix Verification

After EVERY fix, agents MUST run:

```yaml
post_fix_verification:
  required_commands:
    - "Run lint command if available"
    - "Run typecheck command if available"
    - "Run test command if available"
  
  verification_checks:
    - "[ ] Error count decreased or stayed same"
    - "[ ] No NEW errors introduced"
    - "[ ] Previous errors remain fixed"
    - "[ ] Code still compiles/builds"
    - "[ ] Tests still pass"
```

#### Hard Limits (NEVER Exceed)

| Limit | Value | Action When Exceeded |
|-------|-------|---------------------|
| Max fix attempts per error | 2 | STOP and escalate to user |
| Max actions per minute | 5 | Pause and review strategy |
| Max file changes per session | 10 | STOP and break into smaller tasks |
| Max consecutive errors | 3 | STOP - Doom loop detected |
| Max alternating error cycles | 2 | STOP - Conflicting fixes |

#### Recovery Procedure (When Doom Loop Detected)

```yaml
recovery_steps:
  1: "STOP all operations IMMEDIATELY"
  2: "DO NOT attempt another fix"
  3: "Report to user with full context:"
     - Error pattern observed
     - Files changed during loop
     - Number of fix attempts made
     - Suggested cause
  4: "Offer to git reset to last known good state"
  5: "Await user guidance before proceeding"
  6: "Document the loop in session notes"
```

#### Example Doom Loop Scenario

```typescript
// ❌ DOOM LOOP EXAMPLE - What NOT to do:

// Attempt 1: Fix lint error by changing import
import { helper } from './utils';
// Result: Test fails (helper is mocked in tests)

// Attempt 2: Fix test by updating mock
jest.mock('./utils', () => ({ helper: jest.fn() }));
// Result: Type check fails (mock doesn't match type)

// Attempt 3: Fix types by adding type annotation
jest.mock('./utils', () => ({ helper: jest.fn() as jest.Mock }));
// Result: Lint error (unused import of helper)

// Attempt 4: Back to Attempt 1... LOOP!

// ✅ CORRECT APPROACH:
// After Attempt 2, STOP and ask:
// "Fixing lint broke tests, fixing tests broke types.
// Should I refactor the test approach or mock differently?"
```

#### Forbidden Doom Loop Patterns

Agents MUST NEVER:

```yaml
never_do_in_doom_loop:
  - "Apply same fix twice to same error"
  - "Fix without running verification commands first"
  - "Delete and rewrite entire file to 'start fresh'"
  - "Ignore error and attempt completely different fix"
  - "Comment out failing tests to 'fix' them"
  - "Remove type annotations to bypass type errors"
  - "Use @ts-ignore or @ts-expect-error without explicit user approval"
  - "Delete 'unused' code to fix lint (it might be used)"
  - "Keep fixing for more than 10 minutes without success"
  - "Make changes faster than 1 per minute (rushing creates loops)"
```

---

### 13.7 Skill Management

Agents MUST use the Vercel Labs agent skills in every new project. For each new project, install the skills with:

```bash
npx add-skill vercel-labs/agent-skills
```

When a skill applies to a task, agents MUST load and follow that skill before proceeding.

## 13.8 Skills Framework for Task Execution

### Overview

All complex tasks MUST be broken down into discrete **Skills** - self-contained units of work with clear goals, parameters, and acceptance criteria. This framework ensures consistent, high-quality execution across agent swarms.

### Skill Card Format

Every skill MUST be presented using this standardized format:

```markdown
## SKILL [ID]: [NAME] [STATUS]

**Classification:** [Foundation | Feature | Polish | Critical]
**Estimated Duration:** [Time estimate]
**Dependencies:** [Skill IDs that must complete first]

### Goals
- [ ] Goal 1
- [ ] Goal 2
- [ ] Goal 3

### Parameters
**Input:**
- Required files/data
- Configuration values
- Context requirements

**Output:**
- Files to create/modify
- Expected deliverables
- Success metrics

### Execution Steps
1. Step one
2. Step two
3. Step three

### Acceptance Criteria
✅ Criterion 1
✅ Criterion 2
✅ Criterion 3

### Error Handling
- Known failure modes
- Recovery procedures
- Escalation triggers

### Verification Commands
```bash
# Commands to verify completion
npm run typecheck
npm run build
```
```

### Skill Status Indicators

| Status | Icon | Meaning |
|--------|------|---------|
| Pending | ⏳ | Not yet started |
| In Progress | 🔄 | Currently executing |
| Blocked | 🚫 | Waiting on dependencies |
| Complete | ✅ | Finished and verified |
| Failed | ❌ | Failed, needs retry |

### Skill Classification System

#### Foundation Skills (Priority: Critical)
- Dependency installation
- Configuration setup
- Core infrastructure
- Data layer implementation

#### Feature Skills (Priority: High)
- Page components
- UI/UX implementation
- API endpoints
- Business logic

#### Polish Skills (Priority: Medium)
- Testing
- Performance optimization
- Documentation
- Deployment preparation

#### Critical Path Skills
Skills that block other work. Must complete first:
1. All Foundation skills
2. Core data layer
3. Authentication (if required)

### Parallel Execution Rules

**Allowed Parallelism:**
- Foundation skills can run in parallel
- Independent Feature skills can run in parallel
- UI components can be built in parallel

**Sequential Requirements:**
- Data layer must complete before pages
- API routes must exist before UI integration
- Authentication before protected features

### Skill Dependency Management

```yaml
skill_dependencies:
  foundation:
    parallel: true
    skills: [1A, 1B, 1C]
    
  pages:
    parallel: true
    depends_on: foundation
    skills: [2A, 2B, 2C]
    
  features:
    parallel: true
    depends_on: pages
    skills: [3A, 3B, 3C]
    
  polish:
    parallel: false
    depends_on: features
    skills: [4A, 4B, 4C]
```

### Agent Swarm Deployment

When deploying multiple agents:

1. **Pre-flight Check:**
   - Verify all dependencies available
   - Check working directory state
   - Confirm no conflicting operations

2. **Deployment Order:**
   ```
   Wave 1: Foundation (3 agents in parallel)
   Wave 2: Pages (3 agents in parallel)
   Wave 3: Features (3 agents in parallel)
   Wave 4: Polish (1 agent sequential)
   ```

3. **Monitoring:**
   - Track each skill status
   - Detect blocking issues
   - Escalate on failure

4. **Completion Verification:**
   - Run all verification commands
   - Check acceptance criteria
   - Document results

### Example: VibeCoder Dashboard Skills

#### Wave 1: Foundation
- **1A:** Install dependencies ⏳
- **1B:** Build conversation design engine ⏳
- **1C:** Create data layer & API routes ⏳

#### Wave 2: Core Pages
- **2A:** Build Prospects page ⏳
- **2B:** Build Campaigns page ⏳
- **2C:** Build Templates page ⏳

#### Wave 3: Advanced Features
- **3A:** Build Analytics + charts ⏳
- **3B:** Build Settings + forms ⏳
- **3C:** Advanced features (search, command palette) ⏳

#### Wave 4: Polish
- **4A:** Testing & verification ⏳
- **4B:** Performance optimization ⏳
- **4C:** Documentation & deployment ⏳

### Skill Completion Protocol

When a skill completes:

1. Update status to ✅
2. Run verification commands
3. Document any issues found
4. Report completion to orchestrator
5. Unblock dependent skills

### Failure Recovery

If a skill fails:

1. Mark status as ❌
2. Document failure reason
3. Attempt auto-recovery (if safe)
4. Escalate to user if cannot recover
5. Block dependent skills until resolved

## 14. Common Task Templates

### 14.1 Adding a New Feature

```yaml
checklist:
  planning:
    - [ ] Understand the requirement completely
    - [ ] Identify affected areas of codebase
    - [ ] Plan the implementation approach
    - [ ] Identify potential risks/blockers
  
  implementation:
    - [ ] Create feature branch (feature/TICKET-description)
    - [ ] Implement core functionality
    - [ ] Add input validation
    - [ ] Add error handling
    - [ ] Add logging
    - [ ] Add necessary comments/documentation
  
  testing:
    - [ ] Write unit tests (aim for >80% coverage)
    - [ ] Write integration tests if applicable
    - [ ] Test edge cases
    - [ ] Test error scenarios
    - [ ] Manual testing
  
  quality:
    - [ ] Run linter, fix any issues
    - [ ] Run type checker, fix any issues
    - [ ] Check for console.log/debug statements
    - [ ] Review for security concerns
    - [ ] Review for performance concerns
  
  completion:
    - [ ] Update relevant documentation
    - [ ] Create descriptive commit(s)
    - [ ] Verify all tests pass
    - [ ] Create pull request with template
```

### 14.2 Fixing a Bug

```yaml
checklist:
  investigation:
    - [ ] Reproduce the bug
    - [ ] Understand the root cause
    - [ ] Identify the scope of impact
    - [ ] Check for related issues
  
  implementation:
    - [ ] Create fix branch (fix/TICKET-description)
    - [ ] Write failing test that reproduces bug
    - [ ] Implement the fix
    - [ ] Verify test now passes
    - [ ] Check for similar bugs elsewhere
  
  verification:
    - [ ] All existing tests pass
    - [ ] New regression test added
    - [ ] Manual verification of fix
    - [ ] No new issues introduced
  
  completion:
    - [ ] Commit with "fix:" prefix
    - [ ] Reference issue in commit message
    - [ ] Create pull request
    - [ ] Update issue status
```

### 14.3 Refactoring Code

```yaml
checklist:
  preparation:
    - [ ] Ensure comprehensive test coverage exists
    - [ ] Document current behavior
    - [ ] Identify refactoring scope
    - [ ] Plan incremental steps
  
  execution:
    - [ ] Make small, focused changes
    - [ ] Run tests after each change
    - [ ] Keep commits atomic
    - [ ] Do NOT change behavior (unless bugs found)
  
  verification:
    - [ ] All tests pass
    - [ ] Performance not degraded
    - [ ] Code is more readable/maintainable
    - [ ] No functionality changed (unless intended)
  
  completion:
    - [ ] Commit with "refactor:" prefix
    - [ ] Document architectural decisions
    - [ ] Update related documentation
```

### 14.4 Creating a New Component (React)

```typescript
// Template: src/components/[ComponentName]/index.ts
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName.types';

// Template: src/components/[ComponentName]/ComponentName.types.ts
export interface ComponentNameProps {
  /** Description of prop */
  propName: string;
  /** Optional prop with default */
  optionalProp?: boolean;
  /** Children elements */
  children?: React.ReactNode;
}

// Template: src/components/[ComponentName]/ComponentName.tsx
import { type ComponentNameProps } from './ComponentName.types';
import styles from './ComponentName.module.css';

/**
 * ComponentName - Brief description
 *
 * @example
 * ```tsx
 * <ComponentName propName="value">
 *   Content
 * </ComponentName>
 * ```
 */
export function ComponentName({
  propName,
  optionalProp = false,
  children,
}: ComponentNameProps): JSX.Element {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
}

// Template: src/components/[ComponentName]/ComponentName.test.tsx
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render children', () => {
    render(<ComponentName propName="test">Content</ComponentName>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should apply optional prop correctly', () => {
    // Test optional prop behavior
  });
});

// Template: src/components/[ComponentName]/ComponentName.module.css
.container {
  /* Component styles */
}
```

### 14.5 Creating an API Endpoint

```typescript
// Template: src/api/routes/[resource].ts

import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '@/middleware/validation';
import { requireAuth } from '@/middleware/auth';
import { ResourceService } from '@/services/ResourceService';
import { logger } from '@/lib/logger';

const router = Router();

// Validation schemas
const CreateResourceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

const UpdateResourceSchema = CreateResourceSchema.partial();

const ResourceParamsSchema = z.object({
  id: z.string().uuid(),
});

// GET /api/resources
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const resources = await ResourceService.findAll({
      userId: req.user.id,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
    });

    res.json({
      success: true,
      data: resources.items,
      meta: {
        page: resources.page,
        limit: resources.limit,
        total: resources.total,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/resources/:id
router.get(
  '/:id',
  requireAuth,
  validateRequest({ params: ResourceParamsSchema }),
  async (req, res, next) => {
    try {
      const resource = await ResourceService.findById(req.params.id);

      if (!resource) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Resource not found',
          },
        });
      }

      res.json({ success: true, data: resource });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/resources
router.post(
  '/',
  requireAuth,
  validateRequest({ body: CreateResourceSchema }),
  async (req, res, next) => {
    try {
      const resource = await ResourceService.create({
        ...req.body,
        userId: req.user.id,
      });

      logger.info('Resource created', {
        resourceId: resource.id,
        userId: req.user.id,
      });

      res.status(201).json({ success: true, data: resource });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/resources/:id
router.patch(
  '/:id',
  requireAuth,
  validateRequest({
    params: ResourceParamsSchema,
    body: UpdateResourceSchema,
  }),
  async (req, res, next) => {
    try {
      const resource = await ResourceService.update(req.params.id, req.body);

      if (!resource) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Resource not found',
          },
        });
      }

      res.json({ success: true, data: resource });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/resources/:id
router.delete(
  '/:id',
  requireAuth,
  validateRequest({ params: ResourceParamsSchema }),
  async (req, res, next) => {
    try {
      const deleted = await ResourceService.delete(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Resource not found',
          },
        });
      }

      logger.info('Resource deleted', {
        resourceId: req.params.id,
        userId: req.user.id,
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export { router as resourceRouter };
```

---

## 15. System Resilience & Safety Patterns (MANDATORY)

This section defines **production-grade safety patterns** that MUST be implemented for all systems. These patterns prevent cascading failures, ensure graceful degradation, and maintain system stability under stress.

### 15.1 Circuit Breaker Pattern

**Purpose:** Prevent cascade failures when external services degrade.

```yaml
circuit_breaker_rules:
  states:
    CLOSED: "Normal operation, requests pass through"
    OPEN: "Failure threshold exceeded, fast-fail immediately"
    HALF_OPEN: "Testing if service recovered, allow limited requests"
  
  configuration:
    failure_threshold: 5          # Trip after 5 consecutive failures
    timeout_duration: 30s         # Time before attempting recovery
    half_open_max_calls: 3        # Test requests in half-open state
    success_threshold: 2          # Close circuit after 2 successes
  
  implementation_checklist:
    - "[ ] Track success/failure counts per external service"
    - "[ ] Return cached fallback when circuit is OPEN"
    - "[ ] Log circuit state transitions"
    - "[ ] Expose circuit state in metrics"
    - "[ ] Alert when circuits trip"
```

**When to Use:**
- External API calls (payment processors, email services)
- Database connections
- Third-party integrations
- Microservice inter-communication

```typescript
// Example: Circuit breaker wrapper
class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime?: number;
  
  async execute<T>(fn: () => Promise<T>, fallback?: T): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - (this.lastFailureTime || 0) > 30000) {
        this.state = 'HALF_OPEN';
      } else {
        if (fallback !== undefined) return fallback;
        throw new CircuitOpenError('Service temporarily unavailable');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      if (fallback !== undefined) return fallback;
      throw error;
    }
  }
  
  private onSuccess() {
    this.failureCount = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
    }
  }
  
  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= 5) {
      this.state = 'OPEN';
    }
  }
}
```

---

### 15.2 Retry with Exponential Backoff + Jitter

**Purpose:** Handle transient failures without overwhelming failing services.

```yaml
retry_rules:
  when_to_retry:
    - "Network timeouts"
    - "503 Service Unavailable"
    - "429 Rate Limited (with Retry-After)"
    - "Database connection errors"
  
  never_retry:
    - "400 Bad Request"
    - "401 Unauthorized"
    - "404 Not Found"
    - "Non-idempotent POST requests without deduplication"
  
  configuration:
    max_retries: 3
    base_delay_ms: 100
    max_delay_ms: 10000
    jitter: true                    # Add random 0-100ms to prevent thundering herd
    backoff_strategy: exponential   # 100ms → 200ms → 400ms
  
  formula: |
    delay = min(base_delay * (2 ^ attempt), max_delay)
    delay_with_jitter = delay + random(0, 100)
```

```typescript
// Example: Retry implementation
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
  } = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 100, maxDelay = 10000 } = options;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      if (!isRetryableError(error)) throw error;
      
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      const jitter = Math.random() * 100;
      await sleep(delay + jitter);
    }
  }
  
  throw new Error('Unreachable');
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof HTTPError) {
    return [408, 429, 500, 502, 503, 504].includes(error.statusCode);
  }
  return error instanceof NetworkError;
}
```

---

### 15.3 Idempotency Keys

**Purpose:** Prevent duplicate operations when retries occur.

```yaml
idempotency_requirements:
  mandatory_for:
    - "Payment processing"
    - "Order creation"
    - "User registration"
    - "Any mutating POST/PUT/PATCH"
  
  key_generation:
    - "Use UUID v4 or nanoid"
    - "Client generates key"
    - "Include key in request header: Idempotency-Key"
  
  storage:
    - "Store processed keys for 24 hours minimum"
    - "Store response associated with key"
    - "Return cached response for duplicate keys"
    - "Use Redis or database with TTL"
  
  response_handling:
    - "200 OK: New request processed"
    - "200 OK: Cached response returned"
    - "409 Conflict: Key in use (concurrent request)"
```

```typescript
// Example: Idempotency middleware
interface IdempotencyStore {
  get(key: string): Promise<{ response: unknown; status: number } | null>;
  set(key: string, value: unknown, status: number, ttl: number): Promise<void>;
  lock(key: string): Promise<boolean>;
  unlock(key: string): Promise<void>;
}

async function idempotencyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const key = req.headers['idempotency-key'] as string;
  
  if (!key) {
    return next(); // Not an idempotent request
  }
  
  // Check if already processed
  const cached = await idempotencyStore.get(key);
  if (cached) {
    return res.status(cached.status).json(cached.response);
  }
  
  // Try to acquire lock
  const locked = await idempotencyStore.lock(key);
  if (!locked) {
    return res.status(409).json({
      error: 'Idempotency key in use by concurrent request'
    });
  }
  
  // Override res.json to capture response
  const originalJson = res.json.bind(res);
  res.json = (body: unknown) => {
    idempotencyStore.set(key, body, res.statusCode, 86400);
    idempotencyStore.unlock(key);
    return originalJson(body);
  };
  
  next();
}
```

---

### 15.4 Request Timeouts & Deadlines

**Purpose:** Prevent requests from hanging indefinitely.

```yaml
timeout_rules:
  default_timeouts:
    http_client: 30s
    database_query: 5s
    file_system: 10s
    external_api: 30s
    internal_service: 10s
  
  deadline_propagation:
    - "Calculate remaining time at each hop"
    - "Pass deadline via header: X-Request-Deadline"
    - "Fail fast if deadline already passed"
    - "Reserve 100ms for cleanup/response"
  
  implementation:
    - "NEVER use default 'no timeout'"
    - "Use Promise.race() with timeout"
    - "Cancel in-flight operations when possible"
    - "Log timeout occurrences"
```

```typescript
// Example: Timeout wrapper
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new TimeoutError(errorMessage));
    }, timeoutMs);
  });
  
  return Promise.race([promise, timeoutPromise]);
}

// Example: Deadline propagation
async function handleRequest(req: Request) {
  const deadline = req.headers['x-request-deadline'];
  if (deadline) {
    const remaining = new Date(deadline).getTime() - Date.now() - 100; // 100ms buffer
    if (remaining <= 0) {
      throw new DeadlineExceededError();
    }
    return withTimeout(processRequest(req), remaining, 'Deadline exceeded');
  }
  return processRequest(req);
}
```

---

### 15.5 Graceful Shutdown

**Purpose:** Allow in-flight requests to complete before terminating.

```yaml
shutdown_procedure:
  phases:
    1. "Stop accepting new connections/requests"
    2. "Wait for in-flight requests (max 30s)"
    3. "Close database connections"
    4. "Close cache connections"
    5. "Flush logs"
    6. "Exit with status 0"
  
  signals:
    - "SIGTERM - Initiate graceful shutdown"
    - "SIGINT - Initiate graceful shutdown"
    - "SIGKILL - Force immediate (OS level, not catchable)"
  
  timeouts:
    graceful_shutdown: 30s
    forceful_shutdown: 35s
  
  health_checks:
    - "Return 503 during shutdown"
    - "Keep /health/live returning 200 until process exits"
```

```typescript
// Example: Graceful shutdown
let isShuttingDown = false;
const activeRequests = new Set<Promise<void>>();

async function gracefulShutdown(signal: string) {
  console.log(`Received ${signal}, starting graceful shutdown...`);
  isShuttingDown = true;
  
  // Stop accepting new requests
  server.close(() => {
    console.log('HTTP server closed, no longer accepting connections');
  });
  
  // Wait for active requests
  const shutdownTimeout = setTimeout(() => {
    console.error('Forceful shutdown: timeout exceeded');
    process.exit(1);
  }, 30000);
  
  try {
    await Promise.all(Array.from(activeRequests));
    clearTimeout(shutdownTimeout);
    
    // Close connections
    await db.close();
    await redis.quit();
    
    console.log('Graceful shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Track active requests
app.use((req, res, next) => {
  if (isShuttingDown) {
    return res.status(503).json({ error: 'Server is shutting down' });
  }
  
  const requestPromise = new Promise<void>((resolve) => {
    res.on('finish', resolve);
    res.on('close', resolve);
  });
  
  activeRequests.add(requestPromise);
  requestPromise.finally(() => activeRequests.delete(requestPromise));
  next();
});
```

---

## 16. Security Hardening (MANDATORY)

### 16.1 Feature Flags (Safe Deployment)

**Purpose:** Deploy safely with kill switches and gradual rollouts.

```yaml
feature_flag_rules:
  mandatory_usage:
    - "All new features behind flags"
    - "Database migrations behind flags"
    - "UI redesigns behind flags"
    - "Algorithm changes behind flags"
  
  rollout_strategy:
    - "Start with 0% (internal only)"
    - "1% → 5% → 10% → 25% → 50% → 100%"
    - "Monitor error rates at each stage"
    - "Automatic rollback if errors > 0.1%"
  
  flag_configuration:
    - "Percentage-based rollout"
    - "User ID hash bucketing (consistent per user)"
    - "Target groups (beta users, employees)"
    - "Kill switch (immediate 0%)"
  
  monitoring:
    - "Track errors per flag"
    - "Track performance per flag"
    - "Alert on flag-related incidents"
    - "Clean up old flags after 30 days"
```

```typescript
// Example: Feature flag implementation
interface FeatureFlag {
  name: string;
  enabled: boolean;
  rolloutPercentage: number;
  targetUserIds?: string[];
  killSwitch: boolean;
}

function isFeatureEnabled(flag: FeatureFlag, userId: string): boolean {
  if (flag.killSwitch) return false;
  if (!flag.enabled) return false;
  if (flag.targetUserIds?.includes(userId)) return true;
  
  // Consistent hashing for percentage rollout
  const hash = hashUserId(userId + flag.name);
  const bucket = hash % 100;
  return bucket < flag.rolloutPercentage;
}

// Usage
if (isFeatureEnabled(flags.newCheckout, user.id)) {
  return <NewCheckout />;
}
return <OldCheckout />;
```

---

### 16.2 Rate Limiting

**Purpose:** Protect APIs from abuse and ensure fair usage.

```yaml
rate_limiting_tiers:
  anonymous:
    requests_per_minute: 30
    burst_allowance: 10
  
  authenticated:
    requests_per_minute: 100
    burst_allowance: 20
  
  premium:
    requests_per_minute: 1000
    burst_allowance: 100
  
  ip_based:
    requests_per_minute: 1000
    burst_allowance: 50

implementation:
  algorithm: "Token bucket or Sliding window"
  storage: "Redis (distributed) or In-memory (single instance)"
  headers:
    X-RateLimit-Limit: "100"
    X-RateLimit-Remaining: "95"
    X-RateLimit-Reset: "1640995200"
  response:
    status: 429
    body: { error: "Too many requests", retry_after: 60 }
```

```typescript
// Example: Rate limiting middleware
async function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const key = req.user?.id || req.ip;
  const limit = req.user ? 100 : 30;
  const window = 60; // seconds
  
  const current = await redis.incr(`ratelimit:${key}`);
  if (current === 1) {
    await redis.expire(`ratelimit:${key}`, window);
  }
  
  const remaining = Math.max(0, limit - current);
  const resetTime = Date.now() + (await redis.ttl(`ratelimit:${key}`)) * 1000;
  
  res.setHeader('X-RateLimit-Limit', limit.toString());
  res.setHeader('X-RateLimit-Remaining', remaining.toString());
  res.setHeader('X-RateLimit-Reset', resetTime.toString());
  
  if (current > limit) {
    return res.status(429).json({
      error: 'Too many requests',
      retry_after: await redis.ttl(`ratelimit:${key}`)
    });
  }
  
  next();
}
```

---

### 16.3 Audit Logging

**Purpose:** Maintain compliance and security trail.

```yaml
audit_requirements:
  logged_events:
    authentication:
      - "Login success/failure"
      - "Logout"
      - "Password change"
      - "2FA enabled/disabled"
      - "Session revocation"
    
    authorization:
      - "Permission grants/revocations"
      - "Role changes"
      - "Access denied events"
    
    data_modification:
      - "Create/update/delete operations"
      - "Before/after values for sensitive fields"
      - "Bulk operations"
    
    security:
      - "API key generation/revocation"
      - "Secret rotation"
      - "Configuration changes"
  
  log_format:
    timestamp: "ISO 8601 UTC"
    actor: "user_id or service_account"
    action: "CREATE|UPDATE|DELETE|LOGIN|etc"
    resource: "type:id"
    changes: "before/after for modifications"
    ip_address: "client IP"
    user_agent: "browser/client info"
    correlation_id: "request tracing"
  
  retention:
    hot_storage: "90 days"
    cold_storage: "7 years"
    immutability: "Write-once, no deletes"
```

```typescript
// Example: Audit logger
interface AuditEvent {
  timestamp: string;
  actor: string;
  action: string;
  resource: { type: string; id: string };
  changes?: { before: unknown; after: unknown };
  metadata: {
    ip: string;
    userAgent: string;
    correlationId: string;
  };
}

class AuditLogger {
  async log(event: Omit<AuditEvent, 'timestamp'>): Promise<void> {
    const auditEvent: AuditEvent = {
      ...event,
      timestamp: new Date().toISOString()
    };
    
    // Write to append-only log
    await auditStore.append(auditEvent);
    
    // Alert on critical events
    if (this.isCriticalEvent(event)) {
      await alertSecurityTeam(auditEvent);
    }
  }
  
  private isCriticalEvent(event: AuditEvent): boolean {
    const criticalActions = [
      'ADMIN_LOGIN',
      'PERMISSION_GRANT',
      'DATA_EXPORT',
      'SECURITY_SETTING_CHANGE'
    ];
    return criticalActions.includes(event.action);
  }
}

// Usage
await auditLogger.log({
  actor: user.id,
  action: 'USER_UPDATE',
  resource: { type: 'User', id: targetUser.id },
  changes: {
    before: { role: 'user' },
    after: { role: 'admin' }
  },
  metadata: {
    ip: req.ip,
    userAgent: req.headers['user-agent'] || '',
    correlationId: req.headers['x-correlation-id'] as string
  }
});
```

---

### 16.4 Input/Output Security Pipeline

```yaml
security_pipeline:
  input_validation:
    step_1: "Parse with strict schema (Zod, Joi, class-validator)"
    step_2: "Sanitize HTML content (DOMPurify)"
    step_3: "Normalize Unicode (NFC form)"
    step_4: "Trim and normalize whitespace"
    step_5: "Validate file uploads (type, size, magic bytes)"
  
  output_encoding:
    step_1: "Escape HTML entities"
    step_2: "JSON serialize (never string concat)"
    step_3: "Set security headers"
    step_4: "Validate Content-Type matches body"
  
  file_upload_security:
    - "Validate extension whitelist"
    - "Check MIME type with magic bytes"
    - "Scan with antivirus (ClamAV)"
    - "Store outside web root"
    - "Use UUID filenames, never user input"
    - "Limit file size (10MB default)"
```

```typescript
// Example: Secure file upload
async function handleFileUpload(file: UploadedFile): Promise<string> {
  // Validate extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    throw new ValidationError('File type not allowed');
  }
  
  // Check magic bytes
  const magic = file.buffer.slice(0, 4).toString('hex');
  const validMagics = {
    'ffd8ffe0': 'jpg',  // JPEG
    'ffd8ffe1': 'jpg',  // JPEG
    '89504e47': 'png',  // PNG
    '25504446': 'pdf'   // PDF
  };
  
  if (!validMagics[magic]) {
    throw new ValidationError('File content does not match extension');
  }
  
  // Scan with antivirus
  const scanResult = await antivirus.scan(file.buffer);
  if (!scanResult.clean) {
    throw new SecurityError('File contains malware');
  }
  
  // Store with UUID filename
  const filename = `${uuidv4()}${ext}`;
  await storage.put(filename, file.buffer, {
    contentType: file.mimetype,
    metadata: {
      originalName: file.originalname,
      uploadedBy: user.id,
      uploadedAt: new Date().toISOString()
    }
  });
  
  return filename;
}
```

---

### 16.5 Secrets Management & Rotation

```yaml
secrets_management:
  storage:
    - "NEVER commit to git"
    - "Use environment variables for development"
    - "Use AWS Secrets Manager / Azure Key Vault / HashiCorp Vault for production"
    - "Separate secrets per environment"
  
  rotation:
    schedule:
      api_keys: "90 days"
      database_passwords: "90 days"
      jwt_signing_keys: "180 days"
      ssl_certificates: "365 days"
    
    procedure:
      1: "Generate new secret"
      2: "Deploy to application (both old and new valid)"
      3: "Update consumers"
      4: "Revoke old secret after 24h grace period"
  
  validation:
    - "Scan commits for secrets (git-secrets, truffleHog)"
    - "Pre-commit hooks to block secrets"
    - "CI/CD scanning of built artifacts"
```

```typescript
// Example: Secrets manager wrapper
class SecretsManager {
  private cache = new Map<string, { value: string; expiry: number }>();
  
  async getSecret(name: string): Promise<string> {
    // Check cache
    const cached = this.cache.get(name);
    if (cached && cached.expiry > Date.now()) {
      return cached.value;
    }
    
    // Fetch from vault
    const secret = await vaultClient.get(name);
    
    // Cache with TTL
    this.cache.set(name, {
      value: secret.value,
      expiry: Date.now() + 300000 // 5 minutes
    });
    
    return secret.value;
  }
  
  async rotateSecret(name: string): Promise<void> {
    // Generate new secret
    const newSecret = crypto.randomBytes(32).toString('hex');
    
    // Store new version
    await vaultClient.put(name, newSecret, { version: 'latest' });
    
    // Clear cache
    this.cache.delete(name);
    
    // Schedule old version revocation
    setTimeout(async () => {
      await vaultClient.revokeOldVersions(name, { keepLatest: 1 });
    }, 24 * 60 * 60 * 1000); // 24 hours
  }
}
```

---

### 16.6 Dependency Security Scanning

```yaml
security_scanning:
  tools:
    - "npm audit / yarn audit"
    - "Snyk"
    - "Dependabot"
    - "OWASP Dependency-Check"
  
  policy:
    critical: "Block build immediately"
    high: "Block build, require manual override"
    moderate: "Warning, fix within 7 days"
    low: "Track, fix within 30 days"
  
  practices:
    - "Pin exact versions in package.json"
    - "Use lock files (package-lock.json, yarn.lock)"
    - "Weekly automated scans"
    - "Update dependencies monthly"
    - "Review changelogs before updating"
    - "Test thoroughly after updates"
```

---

## 17. Operational Excellence

### 17.1 Health Check Endpoints

```yaml
health_checks:
  endpoints:
    /health/live:
      purpose: "Kubernetes liveness probe"
      checks: "Process is running"
      status: "200 = alive, 500 = restart needed"
    
    /health/ready:
      purpose: "Kubernetes readiness probe"
      checks:
        - "Database connectivity"
        - "Cache connectivity"
        - "External service availability"
      status: "200 = ready for traffic, 503 = not ready"
    
    /health/deep:
      purpose: "Comprehensive system check"
      checks:
        - "All /health/ready checks"
        - "Disk space"
        - "Memory usage"
        - "Queue depths"
        - "Circuit breaker states"
      frequency: "Manual or monitoring only"
  
  standards:
    - "Response time < 500ms"
    - "JSON response format"
    - "Include version and build info"
    - "Log failures"
    - "Don't expose sensitive info"
```

```typescript
// Example: Health check implementation
interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  version: string;
  timestamp: string;
  checks: {
    name: string;
    status: 'pass' | 'fail';
    responseTime: number;
    message?: string;
  }[];
}

app.get('/health/ready', async (req, res) => {
  const checks = await Promise.all([
    checkDatabase(),
    checkCache(),
    checkExternalAPI()
  ]);
  
  const allPass = checks.every(c => c.status === 'pass');
  
  res.status(allPass ? 200 : 503).json({
    status: allPass ? 'healthy' : 'unhealthy',
    version: process.env.APP_VERSION,
    timestamp: new Date().toISOString(),
    checks
  });
});

async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    await db.query('SELECT 1');
    return { name: 'database', status: 'pass', responseTime: Date.now() - start };
  } catch (error) {
    return { 
      name: 'database', 
      status: 'fail', 
      responseTime: Date.now() - start,
      message: error.message 
    };
  }
}
```

---

### 17.2 Database Transaction Safety

```yaml
transaction_rules:
  boundaries:
    - "Use transactions for multi-table operations"
    - "Keep transactions as short as possible (< 100ms target)"
    - "Don't make external API calls inside transactions"
    - "Don't perform heavy computations in transactions"
  
  isolation_levels:
    READ_COMMITTED: "Default, prevent dirty reads"
    REPEATABLE_READ: "When reading same rows multiple times"
    SERIALIZABLE: "When absolute consistency required (rare)"
  
  timeouts:
    statement_timeout: "5 seconds"
    transaction_timeout: "10 seconds"
    idle_in_transaction_timeout: "30 seconds"
  
  locking:
    - "Use optimistic locking for conflicts (version column)"
    - "Use SELECT FOR UPDATE for pessimistic locking"
    - "Always acquire locks in consistent order (deadlock prevention)"
    - "Release locks as early as possible"
  
  error_handling:
    - "Always rollback on error"
    - "Don't swallow transaction errors"
    - "Log transaction failures"
    - "Alert on high deadlock rates"
```

```typescript
// Example: Safe transaction wrapper
async function withTransaction<T>(
  fn: (trx: Transaction) => Promise<T>,
  options: { timeout?: number; isolation?: string } = {}
): Promise<T> {
  const trx = await db.begin();
  
  // Set timeout
  if (options.timeout) {
    await trx.raw(`SET LOCAL statement_timeout = '${options.timeout}s'`);
  }
  
  // Set isolation level
  if (options.isolation) {
    await trx.raw(`SET TRANSACTION ISOLATION LEVEL ${options.isolation}`);
  }
  
  try {
    const result = await fn(trx);
    await trx.commit();
    return result;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

// Usage
await withTransaction(async (trx) => {
  const user = await trx('users').insert({ name: 'John' }).returning('*');
  await trx('profiles').insert({ user_id: user[0].id });
}, { timeout: 5, isolation: 'READ COMMITTED' });
```

---

### 17.3 Structured Logging with Correlation IDs

```yaml
logging_requirements:
  correlation_ids:
    generation: "At request entry (UUID or trace ID from header)"
    propagation:
      - "Include in all log entries"
      - "Pass to downstream services via X-Correlation-Id header"
      - "Include in response headers"
      - "Store in database for request tracking"
  
  structured_format:
    timestamp: "ISO 8601 UTC"
    level: "ERROR|WARN|INFO|DEBUG"
    correlation_id: "trace identifier"
    service: "service name"
    environment: "dev|staging|prod"
    message: "human readable"
    context: "structured data object"
  
  required_fields:
    - "timestamp"
    - "level"
    - "correlation_id"
    - "message"
    - "service"
  
  sampling:
    - "100% for ERROR and above"
    - "10% for INFO in high-traffic"
    - "1% for DEBUG (only in dev)"
```

```typescript
// Example: Structured logger
interface LogEntry {
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  correlationId: string;
  service: string;
  environment: string;
  message: string;
  context?: Record<string, unknown>;
}

class StructuredLogger {
  private correlationId: string;
  
  constructor(correlationId?: string) {
    this.correlationId = correlationId || uuidv4();
  }
  
  private log(
    level: LogEntry['level'],
    message: string,
    context?: Record<string, unknown>
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      correlationId: this.correlationId,
      service: process.env.SERVICE_NAME || 'unknown',
      environment: process.env.NODE_ENV || 'development',
      message,
      context
    };
    
    console.log(JSON.stringify(entry));
  }
  
  error(message: string, context?: Record<string, unknown>): void {
    this.log('error', message, context);
  }
  
  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }
  
  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }
  
  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, context);
    }
  }
  
  child(additionalContext: Record<string, unknown>): StructuredLogger {
    const child = new StructuredLogger(this.correlationId);
    return child;
  }
}

// Middleware to attach logger
app.use((req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] as string || uuidv4();
  req.logger = new StructuredLogger(correlationId);
  res.setHeader('X-Correlation-Id', correlationId);
  next();
});
```

---

## 18. Integration Summary

### Quick Reference Checklist

Before deploying any feature, verify:

```yaml
resilience_checks:
  - "[ ] Circuit breakers configured for external calls"
  - "[ ] Retry logic with exponential backoff implemented"
  - "[ ] Idempotency keys for mutating operations"
  - "[ ] Timeouts set for all external operations"
  - "[ ] Graceful shutdown handler implemented"
  - "[ ] Health check endpoints working"

security_checks:
  - "[ ] Feature flags for new functionality"
  - "[ ] Rate limiting applied to APIs"
  - "[ ] Audit logging for sensitive operations"
  - "[ ] Input validation and sanitization"
  - "[ ] Output encoding implemented"
  - "[ ] Secrets in vault (not code)"
  - "[ ] Dependencies scanned for vulnerabilities"

operational_checks:
  - "[ ] Structured logging with correlation IDs"
  - "[ ] Database transactions with proper isolation"
  - "[ ] Monitoring and alerting configured"
  - "[ ] Runbooks for common failures"
  - "[ ] Database backups verified"
  - "[ ] Rollback plan documented"
```

---

## 19. Anti-Patterns (NEVER DO)

### 15.1 Forbidden Code Patterns

```typescript
// NEVER: Use `any` type
function process(data: any) { }  // FORBIDDEN

// NEVER: Ignore TypeScript errors
// @ts-ignore
// @ts-expect-error (without explanation)

// NEVER: Use non-null assertion without certainty
const value = maybeNull!;  // FORBIDDEN unless proven safe

// NEVER: Mutate function parameters
function addItem(items: Item[], item: Item) {
  items.push(item);  // FORBIDDEN - mutates input
}

// NEVER: Use eval or Function constructor
eval(userInput);  // CRITICAL SECURITY VIOLATION
new Function(userInput);  // CRITICAL SECURITY VIOLATION

// NEVER: Use innerHTML with user input
element.innerHTML = userInput;  // XSS VULNERABILITY

// NEVER: Synchronous file operations in async context
import fs from 'fs';
fs.readFileSync(path);  // FORBIDDEN in request handlers

// NEVER: Catch and ignore errors silently
try {
  riskyOperation();
} catch (e) {
  // Silent catch - FORBIDDEN
}

// NEVER: Use magic numbers without constants
if (status === 3) { }  // What is 3?
// Use: if (status === STATUS.PENDING) { }

// NEVER: Deep nesting (>3 levels)
if (a) {
  if (b) {
    if (c) {
      if (d) {  // FORBIDDEN - too deep
      }
    }
  }
}

// NEVER: Functions longer than 50 lines
// Split into smaller, focused functions

// NEVER: More than 3 parameters
function create(a: A, b: B, c: C, d: D, e: E) { }  // FORBIDDEN
// Use: function create(options: CreateOptions) { }
```

### 15.2 Forbidden File Operations

```yaml
forbidden_operations:
  # NEVER delete without explicit confirmation
  - "rm -rf" or recursive delete
  - Deleting files outside project directory
  - Deleting configuration files
  - Deleting test files (without approval)
  
  # NEVER modify without reading first
  - Editing files without reading them
  - Overwriting files without backup consideration
  
  # NEVER create
  - Files in system directories
  - Executable files without approval
  - .env files with actual secrets
  - Files with hardcoded credentials
  
  # NEVER commit
  - .env files
  - Node modules / vendor directories
  - Build artifacts
  - IDE-specific files with secrets
  - Large binary files
```

### 15.3 Forbidden Shortcuts

```yaml
never_take_shortcuts:
  testing:
    - "Skipping tests to save time"
    - "Commenting out failing tests"
    - "Writing tests that don't actually test anything"
    - "Using skip/only in committed code"
  
  security:
    - "Disabling security checks temporarily"
    - "Hardcoding credentials to make it work"
    - "Skipping input validation"
    - "Disabling HTTPS for convenience"
  
  code_quality:
    - "Copy-pasting large blocks of code"
    - "Adding TODO without creating ticket"
    - "Leaving console.log in production code"
    - "Disabling linter rules inline"
  
  git:
    - "Force pushing to main/master"
    - "Committing directly to main/master"
    - "Large commits with unrelated changes"
    - "Vague commit messages"
```

### 15.4 Red Flags to Report

If agents encounter these patterns, they MUST report to the user:

```yaml
security_red_flags:
  - "Hardcoded API keys or secrets"
  - "SQL queries built with string concatenation"
  - "User input directly in HTML"
  - "Disabled authentication/authorization"
  - "HTTP instead of HTTPS for sensitive data"
  - "Weak cryptographic practices"

code_quality_red_flags:
  - "Duplicated code blocks (>20 lines)"
  - "Functions with cyclomatic complexity >10"
  - "Files with >500 lines"
  - "Classes with >20 methods"
  - "Circular dependencies"
  - "Unused exports or dead code"

architecture_red_flags:
  - "Business logic in UI components"
  - "Database queries in route handlers"
  - "Hardcoded configuration values"
  - "Missing error handling"
  - "Inconsistent naming conventions"
```

---

## 20. Error Handling Standards (MANDATORY)

### Why This Matters
Error handling from the START of any project saves valuable time and money. Runtime crashes destroy user experience and make debugging extremely difficult.

### Required Patterns

#### 1. Error Boundaries (React)
ALWAYS create and use ErrorBoundary components:
- Wrap ALL artifact/feature components
- Wrap ALL third-party component integrations
- Wrap ALL components with animations (framer-motion, etc.)

```tsx
// components/ErrorBoundary.tsx - CREATE THIS FIRST
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-fallback">
          <h3>Something went wrong</h3>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

#### 2. Null/Undefined Guards
ALWAYS guard against null/undefined before calling methods:

```tsx
// BAD - Will crash if line is undefined
{output.map((line) => line.startsWith('✓') ? ... )}

// GOOD - Safe with filter and optional chaining
{output.filter((line): line is string => line != null).map((line) => (
  line?.startsWith('✓') ? ... : <span>{line ?? ''}</span>
))}
```

#### 3. Focus/DOM Operations
ALWAYS wrap focus operations in try-catch with delays:

```tsx
useEffect(() => {
  const timer = setTimeout(() => {
    try {
      inputRef.current?.focus();
    } catch (e) {
      console.warn('Focus error:', e);
    }
  }, 50);
  return () => clearTimeout(timer);
}, [state]);
```

#### 4. AnimatePresence Rules
NEVER nest AnimatePresence components - causes crashes:

```tsx
// BAD - Nested AnimatePresence
<AnimatePresence>
  <ComponentWithItsOwnAnimatePresence />
</AnimatePresence>

// GOOD - Single AnimatePresence, conditional rendering
{isOpen && <ComponentWithAnimations />}
```

### Checklist for Every Component
- [ ] Wrapped in ErrorBoundary if complex
- [ ] All array.map() calls have null filtering
- [ ] All string methods use optional chaining (?.)
- [ ] All DOM operations have try-catch
- [ ] No nested AnimatePresence
- [ ] Fallback UI for error states

---

## Appendix A: Quick Reference Card

### File Naming

| Language | Files | Components/Classes | Tests |
|----------|-------|-------------------|-------|
| TypeScript | `camelCase.ts` | `PascalCase.tsx` | `*.test.ts` |
| Python | `snake_case.py` | `class PascalCase` | `test_*.py` |
| Go | `snake_case.go` | `type PascalCase` | `*_test.go` |
| Swift | `PascalCase.swift` | `class PascalCase` | `*Tests.swift` |
| Kotlin | `PascalCase.kt` | `class PascalCase` | `*Test.kt` |

### Commit Prefixes

| Prefix | Use For |
|--------|---------|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `docs:` | Documentation |
| `style:` | Formatting |
| `refactor:` | Code restructuring |
| `perf:` | Performance |
| `test:` | Tests |
| `chore:` | Maintenance |

### HTTP Status Codes

| Code | Meaning | Use When |
|------|---------|----------|
| 200 | OK | Successful GET/PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Not authorized |
| 404 | Not Found | Resource missing |
| 409 | Conflict | Duplicate/conflict |
| 500 | Server Error | Unexpected error |

---

## Appendix B: Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-01-18 | Initial release |

---

## Appendix C: Contributing to This Document

To propose changes to this AGENTS.md:

1. Create a branch: `docs/agents-md-update`
2. Make changes with clear rationale
3. Submit PR with explanation of why change is needed
4. Require approval from tech lead
5. Update version number and changelog

---

*This document is the authoritative source of truth for AI-assisted development. All agents MUST comply with these guidelines.*
