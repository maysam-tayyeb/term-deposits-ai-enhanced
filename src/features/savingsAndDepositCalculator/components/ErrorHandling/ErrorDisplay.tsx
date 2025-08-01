import React from "react";
import {
  type BaseCalculatorError,
  ErrorSeverity as ErrorSeverityValues,
} from "../../config/errors";
import { TEST_IDS } from "../../config/constants";
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@shared/components/Icons";

interface ErrorDisplayProps {
  error: BaseCalculatorError;
}

export function ErrorDisplay({ error }: ErrorDisplayProps): React.JSX.Element {
  const getSeverityIcon = (severity: string): React.JSX.Element => {
    const iconClass = "h-5 w-5";

    switch (severity) {
      case ErrorSeverityValues.CRITICAL:
      case ErrorSeverityValues.HIGH:
        return (
          <ExclamationTriangleIcon className={`${iconClass} text-red-500`} />
        );
      case ErrorSeverityValues.MEDIUM:
        return (
          <ExclamationTriangleIcon className={`${iconClass} text-yellow-500`} />
        );
      case ErrorSeverityValues.LOW:
        return (
          <InformationCircleIcon className={`${iconClass} text-blue-500`} />
        );
      default:
        return (
          <InformationCircleIcon className={`${iconClass} text-gray-500`} />
        );
    }
  };

  return (
    <div
      data-testid={TEST_IDS.ERROR}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-red-200 p-6 mb-6"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            {getSeverityIcon(error.severity)}
          </div>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            {error.type === "VALIDATION"
              ? "Please Check Your Input"
              : "Calculation Error"}
          </h3>

          {error.type === "VALIDATION" && (
            <div className="space-y-2">
              {error.message?.toLowerCase().includes("principal") && (
                <div className="p-3 bg-red-50/70 rounded-lg">
                  <span className="text-sm text-slate-700">
                    Enter a valid principal amount between $1 and $10,000,000
                  </span>
                </div>
              )}
              {error.message?.toLowerCase().includes("interest") && (
                <div className="p-3 bg-red-50/70 rounded-lg">
                  <span className="text-sm text-slate-700">
                    Enter an interest rate between 0.00% and 15.00%
                  </span>
                </div>
              )}
              {error.message?.toLowerCase().includes("duration") && (
                <div className="p-3 bg-red-50/70 rounded-lg">
                  <span className="text-sm text-slate-700">
                    Choose an investment term between 3 and 60 months
                  </span>
                </div>
              )}
              {error.message?.toLowerCase().includes("valid number") && (
                <div className="p-3 bg-red-50/70 rounded-lg">
                  <span className="text-sm text-slate-700">
                    Make sure all fields contain valid numbers
                  </span>
                </div>
              )}
            </div>
          )}

          {error.type !== "VALIDATION" && (
            <p className="text-sm text-slate-700 bg-red-50/70 p-3 rounded-lg">
              {error.userMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
