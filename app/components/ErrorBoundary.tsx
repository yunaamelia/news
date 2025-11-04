"use client";

import { Component, type ReactNode } from "react";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: { componentStack: string }) => void;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
  isRetrying: boolean;
}

/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors in child components and displays fallback UI.
 * Implements exponential backoff for retry logic.
 *
 * @example
 * ```tsx
 * <ErrorBoundary onError={(error) => console.error(error)}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
      isRetrying: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    // Log error to external service
    this.props.onError?.(error, errorInfo);

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught error:", error);
      console.error("Component stack:", errorInfo.componentStack);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  /**
   * Calculate exponential backoff delay
   * Formula: baseDelay * (2 ^ retryCount) with max cap
   */
  private getRetryDelay(retryCount: number): number {
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds max
    const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
    return delay;
  }

  private handleReset = () => {
    const { retryCount } = this.state;
    const delay = this.getRetryDelay(retryCount);

    this.setState({ isRetrying: true });

    // Exponential backoff delay
    this.retryTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        retryCount: retryCount + 1,
        isRetrying: false,
      });

      this.props.onReset?.();
    }, delay);
  };

  private handleImmediateReset = () => {
    this.setState({
      hasError: false,
      error: null,
      retryCount: 0,
      isRetrying: false,
    });
    this.props.onReset?.();
  };

  render() {
    const { hasError, error, retryCount, isRetrying } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      // Custom fallback
      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      const nextRetryDelay = this.getRetryDelay(retryCount);
      const isMaxRetries = retryCount >= 5;

      return (
        <div className="flex min-h-[400px] items-center justify-center px-4 py-16">
          <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-white p-8 shadow-2xl dark:border-red-500/30 dark:bg-slate-800">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                <FiAlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Terjadi Kesalahan
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isMaxRetries
                    ? "Sudah mencoba 5x"
                    : `Percobaan ke-${retryCount + 1}`}
                </p>
              </div>
            </div>

            {/* Error Details */}
            <div className="mb-6 rounded-lg bg-red-50 p-4 dark:bg-red-900/10">
              <p className="text-sm font-semibold text-red-800 dark:text-red-400">
                {error.name}
              </p>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {error.message}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {!isMaxRetries && (
                <button
                  onClick={this.handleReset}
                  disabled={isRetrying}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiRefreshCw
                    className={`h-5 w-5 ${isRetrying ? "animate-spin" : ""}`}
                  />
                  {isRetrying
                    ? `Mencoba lagi dalam ${Math.ceil(nextRetryDelay / 1000)}s...`
                    : "Coba Lagi"}
                </button>
              )}

              <button
                onClick={this.handleImmediateReset}
                className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
              >
                Muat Ulang Halaman
              </button>

              {process.env.NODE_ENV === "development" && (
                <details className="mt-2 text-xs">
                  <summary className="cursor-pointer text-gray-600 dark:text-gray-400">
                    Detail Stack Trace
                  </summary>
                  <pre className="mt-2 overflow-auto rounded bg-gray-100 p-2 text-xs dark:bg-slate-900">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

// Default export
export default ErrorBoundary;

/**
 * ErrorBoundary Wrapper with simpler API
 */
export function ErrorBoundaryWrapper({
  children,
  onError,
}: {
  children: ReactNode;
  onError?: (error: Error) => void;
}) {
  return (
    <ErrorBoundary
      onError={(error) => {
        onError?.(error);
        // Could send to logging service here
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
