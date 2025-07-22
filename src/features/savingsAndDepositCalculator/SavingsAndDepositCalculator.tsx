import React, { useEffect, useState } from "react";

import {
  createDurationMonths,
  MAX_ALLOWED_COMPOUNDING_MONTHS,
  MIN_ALLOWED_COMPOUNDING_MONTHS,
} from "./durationMonths.factory.ts";
import {
  calculateMonthlyCompounding,
  calculateQuarterlyCompounding,
  calculateAnnuallyCompounding,
  calculateAtMaturity,
} from "./compoundingInterestCalculators";
import type {
  CalculationResult,
  PayFrequency,
} from "./compoundingInterestCalculators.types";
import {
  createAnnualInterestRate,
  DESCRIPTION_MAX_ALLOWED_INTEREST_RATE,
  DESCRIPTION_MIN_ALLOWED_INTEREST_RATE,
  MAX_ALLOWED_INTEREST_RATE,
  MIN_ALLOWED_INTEREST_RATE,
} from "./annualInterestRate.factory.ts";
import {
  createPrincipalAmount,
  DESCRIPTION_MAX_ALLOWED_PRINCIPAL,
  DESCRIPTION_MIN_ALLOWED_PRINCIPAL,
  MAX_ALLOWED_PRINCIPAL,
  MIN_ALLOWED_PRINCIPAL,
} from "./principal.factory.ts";
import {
  DEFAULT_VALUES,
  UI_CONFIG,
  UI_TEXT,
  FREQUENCY_OPTIONS,
  TEST_IDS,
} from "./SavingsAndDepositCalculator.constants";
import {
  BaseCalculatorError,
  ErrorFactory,
  ErrorService,
  type ErrorSeverity,
  ErrorSeverity as ErrorSeverityValues,
} from "./errors";

export function SavingsAndDepositCalculator() {
  const [principal, setPrincipal] = useState<number>(DEFAULT_VALUES.PRINCIPAL);
  const [annualRate, setAnnualRate] = useState<number>(
    DEFAULT_VALUES.INTEREST_RATE,
  );
  const [months, setMonths] = useState<number>(
    DEFAULT_VALUES.INVESTMENT_TERM_MONTHS,
  );
  const [frequency, setFrequency] = useState<PayFrequency>(
    DEFAULT_VALUES.FREQUENCY,
  );
  const [schedule, setSchedule] = useState<CalculationResult[]>([]);
  const [error, setError] = useState<BaseCalculatorError | null>(null);
  const errorService = ErrorService.getInstance();

  useEffect(() => {
    setError(null);
    try {
      const context = {
        component: "SavingsAndDepositCalculator",
        action: "calculation",
        userInput: { principal, annualRate, months, frequency },
        timestamp: new Date().toISOString(),
      };

      const principalAmount = createPrincipalAmount(principal);
      const annualInterestRate = createAnnualInterestRate(annualRate);
      const duration = createDurationMonths(months);

      let result: CalculationResult[];
      switch (frequency) {
        case "monthly":
          result = calculateMonthlyCompounding(
            principalAmount,
            annualInterestRate,
            duration,
          );
          break;
        case "quarterly":
          result = calculateQuarterlyCompounding(
            principalAmount,
            annualInterestRate,
            duration,
          );
          break;
        case "annually":
          result = calculateAnnuallyCompounding(
            principalAmount,
            annualInterestRate,
            duration,
          );
          break;
        case "atMaturity":
          result = calculateAtMaturity(
            principalAmount,
            annualInterestRate,
            duration,
          );
          break;
        default:
          throw ErrorFactory.createCalculationError(
            "frequency_selection",
            `Invalid frequency type: ${frequency}`,
            context,
          );
      }
      setSchedule(result);
    } catch (e) {
      const context = {
        component: "SavingsAndDepositCalculator",
        action: "calculation",
        userInput: { principal, annualRate, months, frequency },
        timestamp: new Date().toISOString(),
      };

      let calculatorError: BaseCalculatorError;

      if (e instanceof RangeError) {
        // Handle validation errors from factory functions
        calculatorError = ErrorFactory.createValidationError(
          "input_validation",
          { principal, annualRate, months, frequency },
          e.message,
          context,
        );
      } else if (e instanceof BaseCalculatorError) {
        // Re-throw our custom errors
        calculatorError = e;
      } else {
        // Handle unknown errors
        calculatorError = ErrorFactory.createUnknownError(e, context);
      }

      setError(calculatorError);
      setSchedule([]);
      errorService.handleError(calculatorError);
    }
  }, [annualRate, frequency, months, principal, errorService]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-[#de313b]">
        {UI_TEXT.TITLE}
      </h1>
      {error && <ErrorDisplay error={error} onDismiss={() => setError(null)} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {UI_TEXT.LABELS.PRINCIPAL}
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(parseFloat(e.target.value))}
            min={MIN_ALLOWED_PRINCIPAL}
            max={MAX_ALLOWED_PRINCIPAL}
            className="w-full border rounded p-2"
            data-testid={TEST_IDS.PRINCIPAL_INPUT}
          />
          <p className="text-xs text-gray-500">
            Min {DESCRIPTION_MIN_ALLOWED_PRINCIPAL} and max{" "}
            {DESCRIPTION_MAX_ALLOWED_PRINCIPAL}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {UI_TEXT.LABELS.INTEREST_RATE}
          </label>
          <input
            type="number"
            step={UI_CONFIG.INTEREST_RATE_STEP}
            value={annualRate}
            onChange={(e) => setAnnualRate(parseFloat(e.target.value))}
            min={MIN_ALLOWED_INTEREST_RATE}
            max={MAX_ALLOWED_INTEREST_RATE}
            className="w-full border rounded p-2"
            data-testid={TEST_IDS.INTEREST_RATE_INPUT}
          />
          <p className="text-xs text-gray-500">
            Min {DESCRIPTION_MIN_ALLOWED_INTEREST_RATE} and max{" "}
            {DESCRIPTION_MAX_ALLOWED_INTEREST_RATE}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {UI_TEXT.LABELS.INVESTMENT_TERM}
          </label>
          <input
            type="number"
            value={months}
            onChange={(e) => {
              const newMonths = parseInt(e.target.value, 10);
              setMonths(newMonths);
              // If annually is selected but new term is < 12 months, change to at maturity
              if (frequency === "annually" && newMonths < 12) {
                setFrequency("atMaturity");
              }
            }}
            min={MIN_ALLOWED_COMPOUNDING_MONTHS}
            max={MAX_ALLOWED_COMPOUNDING_MONTHS}
            className="w-full border rounded p-2"
            data-testid={TEST_IDS.INVESTMENT_TERM_INPUT}
          />
          <p className="text-xs text-gray-500">
            Min {MIN_ALLOWED_COMPOUNDING_MONTHS} and max{" "}
            {MAX_ALLOWED_COMPOUNDING_MONTHS} months
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {UI_TEXT.LABELS.INTEREST_PAID}
          </label>
          <div className="flex gap-4">
            {FREQUENCY_OPTIONS.filter(
              (opt) => opt.value !== "annually" || months >= 12,
            ).map((opt) => (
              <label key={opt.value} className="inline-flex items-center">
                <input
                  type="radio"
                  name="frequency"
                  value={opt.value}
                  checked={frequency === opt.value}
                  onChange={() => setFrequency(opt.value)}
                  className="form-radio mr-2"
                  data-testid={`${TEST_IDS.RADIO_PREFIX}${opt.value.toLowerCase()}`}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>
      {schedule.length > 0 && (
        <div className="flex gap-4">
          <div className="max-h-[32rem] overflow-y-auto flex-2">
            <h2 className="text-xl font-bold mb-4">
              {UI_TEXT.TABLE_HEADERS.PROJECTED_SAVINGS}
            </h2>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-2 py-1 text-left">
                    {UI_TEXT.TABLE_HEADERS.MONTH}
                  </th>
                  <th className="border px-2 py-1 text-left">
                    {UI_TEXT.TABLE_HEADERS.INTEREST_RATE}
                  </th>
                  <th className="border px-2 py-1 text-left">
                    {UI_TEXT.TABLE_HEADERS.INTEREST_EARNED}
                  </th>
                  <th className="border px-2 py-1 text-left">
                    {UI_TEXT.TABLE_HEADERS.BALANCE}
                  </th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.month}>
                    <td className="border px-2 py-1">{row.month}</td>
                    <td className="border px-2 py-1">
                      {row.annualRate.toFixed(UI_CONFIG.DECIMAL_PLACES)}%
                    </td>
                    <td className="border px-2 py-1">
                      {row.interest.toLocaleString(UI_CONFIG.CURRENCY.LOCALE, {
                        style: "currency",
                        currency: UI_CONFIG.CURRENCY.CODE,
                      })}
                    </td>
                    <td className="border px-2 py-1">
                      {row.balance.toLocaleString(UI_CONFIG.CURRENCY.LOCALE, {
                        style: "currency",
                        currency: UI_CONFIG.CURRENCY.CODE,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col justify-start border p-4 flex-1">
            <div>
              <span className="font-medium text-[#de313b]">
                {UI_TEXT.SUMMARY.FINAL_BALANCE}
              </span>
              <span
                data-testid={TEST_IDS.FINAL_BALANCE}
                className="block font-bold text-4xl mt-1"
              >
                <span className="text-2xl align-top">$</span>
                {Math.round(
                  schedule[schedule.length - 1].balance,
                ).toLocaleString(UI_CONFIG.CURRENCY.LOCALE, {
                  currency: UI_CONFIG.CURRENCY.CODE,
                })}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-medium text-[#de313b]">
                {UI_TEXT.SUMMARY.TOTAL_INTEREST_EARNED}
              </span>
              <span
                data-testid={TEST_IDS.TOTAL_INTEREST_EARNED}
                className="block font-bold text-4xl mt-1"
              >
                <span className="text-2xl align-top">$</span>
                {Math.round(
                  schedule[schedule.length - 1].interest,
                ).toLocaleString(UI_CONFIG.CURRENCY.LOCALE, {
                  currency: UI_CONFIG.CURRENCY.CODE,
                })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ErrorDisplayProps {
  error: BaseCalculatorError;
  onDismiss: () => void;
}

function ErrorDisplay({
  error,
  onDismiss,
}: ErrorDisplayProps): React.JSX.Element {
  const getSeverityStyles = (severity: ErrorSeverity): string => {
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

  const getSeverityIcon = (severity: ErrorSeverity): React.JSX.Element => {
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
