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
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
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
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
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
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
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
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
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
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}