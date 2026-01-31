import { Component, ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);

    this.setState({
      error,
      errorInfo,
    });

    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (callbackError) {
        console.error('Error in onError callback:', callbackError);
      }
    }
  }

  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    if (this.props.onReset) {
      try {
        this.props.onReset();
      } catch (resetError) {
        console.error('Error in onReset callback:', resetError);
      }
    }
  };

  private renderDefaultFallback(): ReactNode {
    const { error, errorInfo } = this.state;

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          backgroundColor: '#0a0a0a',
          color: '#e5e5e5',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            width: '100%',
            backgroundColor: '#171717',
            borderRadius: '12px',
            padding: '2rem',
            border: '1px solid #262626',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#fafafa',
                }}
              >
                Something went wrong
              </h2>
              <p
                style={{
                  margin: '0.25rem 0 0 0',
                  fontSize: '0.875rem',
                  color: '#a3a3a3',
                }}
              >
                An error occurred in this component
              </p>
            </div>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <p
                style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#ef4444',
                }}
              >
                Error: {error.message || 'Unknown error'}
              </p>
              {error.stack && (
                <details style={{ marginTop: '0.5rem' }}>
                  <summary
                    style={{
                      fontSize: '0.75rem',
                      color: '#a3a3a3',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                  >
                    View stack trace
                  </summary>
                  <pre
                    style={{
                      margin: '0.75rem 0 0 0',
                      padding: '0.75rem',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      color: '#d4d4d4',
                      overflow: 'auto',
                      maxHeight: '200px',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}

          {errorInfo && errorInfo.componentStack && (
            <div
              style={{
                marginBottom: '1.5rem',
              }}
            >
              <details>
                <summary
                  style={{
                    fontSize: '0.875rem',
                    color: '#a3a3a3',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  Component stack trace
                </summary>
                <pre
                  style={{
                    margin: '0.75rem 0 0 0',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    color: '#d4d4d4',
                    overflow: 'auto',
                    maxHeight: '150px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {errorInfo.componentStack}
                </pre>
              </details>
            </div>
          )}

          <button
            onClick={this.handleReset}
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#fafafa',
              color: '#171717',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e5e5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fafafa';
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return this.renderDefaultFallback();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
