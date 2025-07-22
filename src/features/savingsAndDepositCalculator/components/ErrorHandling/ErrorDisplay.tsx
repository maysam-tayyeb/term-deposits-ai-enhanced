import React from "react";
import {
  type BaseCalculatorError,
  ErrorSeverity as ErrorSeverityValues,
} from "../../config/errors";
import { TEST_IDS } from "../../config/constants";

interface ErrorDisplayProps {
  error: BaseCalculatorError;
  onDismiss: () => void;
}

export function ErrorDisplay({
  error,
  onDismiss,
}: ErrorDisplayProps): React.JSX.Element {
  const getSeverityStyles = (severity: string): string => {
    switch (severity) {
      case ErrorSeverityValues.CRITICAL:
      case ErrorSeverityValues.HIGH:
        return "bg-red-50 border-red-200 text-red-800";
      case ErrorSeverityValues.MEDIUM:
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case ErrorSeverityValues.LOW:
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getSeverityIcon = (severity: string): React.JSX.Element => {
    const iconClass = "h-5 w-5";

    switch (severity) {
      case ErrorSeverityValues.CRITICAL:
      case ErrorSeverityValues.HIGH:
        return (
          <svg
            className={`${iconClass} text-red-500`}
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
        );
      case ErrorSeverityValues.MEDIUM:
        return (
          <svg
            className={`${iconClass} text-yellow-500`}
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
        );
      case ErrorSeverityValues.LOW:
        return (
          <svg
            className={`${iconClass} text-blue-500`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className={`${iconClass} text-gray-500`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div
      data-testid={TEST_IDS.ERROR}
      className={`rounded-lg border p-4 mb-4 ${getSeverityStyles(error.severity)}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{getSeverityIcon(error.severity)}</div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-semibold mb-1">
            {error.type === "VALIDATION" ? "Input Error" : "Calculation Error"}
          </h3>
          <p className="text-sm mb-2">{error.userMessage}</p>

          {process.env.NODE_ENV === "development" && (
            <details className="text-xs mt-2">
              <summary className="cursor-pointer hover:underline">
                Debug Information
              </summary>
              <div className="mt-1 p-2 bg-white bg-opacity-50 rounded text-xs font-mono">
                <p>
                  <strong>Type:</strong> {error.type}
                </p>
                <p>
                  <strong>Severity:</strong> {error.severity}
                </p>
                <p>
                  <strong>Message:</strong> {error.message}
                </p>
                <p>
                  <strong>Component:</strong> {error.context.component}
                </p>
                <p>
                  <strong>Action:</strong> {error.context.action}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {new Date(error.context.timestamp).toLocaleString()}
                </p>
              </div>
            </details>
          )}
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss error"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}