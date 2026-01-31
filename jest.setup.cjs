require('@testing-library/jest-dom');

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(function(query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  }),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() { return []; }
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock ResizeObserver
class MockResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

global.ResizeObserver = MockResizeObserver;

// Mock scrollTo
window.scrollTo = jest.fn();

// Suppress console errors during tests (optional)
const originalError = console.error;
beforeAll(function() {
  console.error = function() {
    if (
      typeof arguments[0] === 'string' &&
      arguments[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.apply(console, arguments);
  };
});

afterAll(function() {
  console.error = originalError;
});
