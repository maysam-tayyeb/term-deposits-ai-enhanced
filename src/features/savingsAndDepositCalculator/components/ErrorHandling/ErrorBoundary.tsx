import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { type BaseCalculatorError, ErrorFactory, ErrorService } from "../../config/errors";

interface ErrorBoundaryState {
  hasError: boolean;
  error: BaseCalculatorError | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: BaseCalculatorError) => ReactNode;
}

export class CalculatorErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private errorService: ErrorService;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
    this.errorService = ErrorService.getInstance();
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true, error: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const context = {
      component: "SavingsAndDepositCalculator",
      action: "render",
      timestamp: new Date().toISOString(),
    };

    const calculatorError = ErrorFactory.createUnknownError(
      { error, errorInfo },
      context,
    );

    this.setState({ error: calculatorError });
    this.errorService.handleError(calculatorError);
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error);
      }

      return <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: BaseCalculatorError;
}

export function DefaultErrorFallback({ error }: DefaultErrorFallbackProps): React.JSX.Element {
  const handleRetry = (): void => {
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-red-800">
              Something went wrong
            </h2>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-red-700 mb-2">{error.userMessage}</p>
          {process.env.NODE_ENV === "development" && (
            <details className="text-sm text-red-600">
              <summary className="cursor-pointer hover:text-red-800">
                Technical details
              </summary>
              <div className="mt-2 p-2 bg-red-100 rounded text-xs font-mono">
                <p><strong>Error:</strong> {error.message}</p>
                <p><strong>Type:</strong> {error.type}</p>
                <p><strong>Component:</strong> {error.context.component}</p>
                <p><strong>Time:</strong> {error.context.timestamp}</p>
              </div>
            </details>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRetry}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}