import React, { Component, ErrorInfo, ReactNode } from "react";
import { type BaseCalculatorError, ErrorFactory, ErrorService } from "./errors";

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

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
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

function DefaultErrorFallback({ error }: DefaultErrorFallbackProps): JSX.Element {
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
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
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