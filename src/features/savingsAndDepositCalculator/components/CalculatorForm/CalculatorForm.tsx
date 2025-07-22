import React from "react";
import type { PayFrequency } from "../../domain/types";
import type { BaseCalculatorError } from "../../config/errors";
import {
  MAX_ALLOWED_COMPOUNDING_MONTHS,
  MIN_ALLOWED_COMPOUNDING_MONTHS,
} from "../../domain/valueObjects/duration";
import {
  DESCRIPTION_MAX_ALLOWED_INTEREST_RATE,
  DESCRIPTION_MIN_ALLOWED_INTEREST_RATE,
  MAX_ALLOWED_INTEREST_RATE,
  MIN_ALLOWED_INTEREST_RATE,
} from "../../domain/valueObjects/interestRate";
import {
  DESCRIPTION_MAX_ALLOWED_PRINCIPAL,
  DESCRIPTION_MIN_ALLOWED_PRINCIPAL,
  MAX_ALLOWED_PRINCIPAL,
  MIN_ALLOWED_PRINCIPAL,
} from "../../domain/valueObjects/principalAmount";
import {
  UI_CONFIG,
  UI_TEXT,
  FREQUENCY_OPTIONS,
  TEST_IDS,
} from "../../config/constants";

interface CalculatorFormProps {
  principal: number;
  annualRate: number;
  months: number;
  frequency: PayFrequency;
  error?: BaseCalculatorError | null;
  onPrincipalChange: (value: number) => void;
  onAnnualRateChange: (value: number) => void;
  onMonthsChange: (value: number) => void;
  onFrequencyChange: (value: PayFrequency) => void;
}

export function CalculatorForm({
  principal,
  annualRate,
  months,
  frequency,
  error,
  onPrincipalChange,
  onAnnualRateChange,
  onMonthsChange,
  onFrequencyChange,
}: CalculatorFormProps): React.JSX.Element {
  // Parse the combined error message into individual field errors
  const parseFieldErrors = (): { [key: string]: string[] } => {
    if (!error || error.type !== 'VALIDATION') return {};
    
    const errorMessage = error.userMessage || error.message || '';
    const individualErrors = errorMessage.split('. ');
    const fieldErrors: { [key: string]: string[] } = {};
    
    individualErrors.forEach(err => {
      const trimmedError = err.trim();
      if (trimmedError.toLowerCase().includes('principal')) {
        if (!fieldErrors.principal) fieldErrors.principal = [];
        fieldErrors.principal.push(trimmedError);
      } else if (trimmedError.toLowerCase().includes('interest')) {
        if (!fieldErrors.interestRate) fieldErrors.interestRate = [];
        fieldErrors.interestRate.push(trimmedError);
      } else if (trimmedError.toLowerCase().includes('duration')) {
        if (!fieldErrors.duration) fieldErrors.duration = [];
        fieldErrors.duration.push(trimmedError);
      }
    });
    
    return fieldErrors;
  };

  const fieldErrors = parseFieldErrors();

  // Helper function to determine if a field has an error
  const hasFieldError = (fieldKey: string): boolean => {
    return fieldErrors[fieldKey]?.length > 0;
  };

  // Helper function to get error class for input styling
  const getInputClassName = (hasError: boolean): string => {
    const baseClass = "w-full border rounded p-2";
    return hasError 
      ? `${baseClass} border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500` 
      : `${baseClass} border-gray-300 focus:border-blue-500 focus:ring-blue-500`;
  };

  // Helper function to get field-specific error messages
  const getFieldErrorMessages = (fieldKey: string): string[] => {
    return fieldErrors[fieldKey] || [];
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          {UI_TEXT.LABELS.PRINCIPAL}
        </label>
        <input
          type="number"
          value={principal}
          onChange={(e) => onPrincipalChange(parseFloat(e.target.value))}
          min={MIN_ALLOWED_PRINCIPAL}
          max={MAX_ALLOWED_PRINCIPAL}
          className={getInputClassName(hasFieldError('principal'))}
          data-testid={TEST_IDS.PRINCIPAL_INPUT}
        />
        {getFieldErrorMessages('principal').length > 0 ? (
          <div className="mt-1">
            {getFieldErrorMessages('principal').map((errMsg, index) => (
              <p key={index} className="text-xs text-red-600">
                {errMsg}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500">
            Min {DESCRIPTION_MIN_ALLOWED_PRINCIPAL} and max{" "}
            {DESCRIPTION_MAX_ALLOWED_PRINCIPAL}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          {UI_TEXT.LABELS.INTEREST_RATE}
        </label>
        <input
          type="number"
          step={UI_CONFIG.INTEREST_RATE_STEP}
          value={annualRate}
          onChange={(e) => onAnnualRateChange(parseFloat(e.target.value))}
          min={MIN_ALLOWED_INTEREST_RATE}
          max={MAX_ALLOWED_INTEREST_RATE}
          className={getInputClassName(hasFieldError('interestRate'))}
          data-testid={TEST_IDS.INTEREST_RATE_INPUT}
        />
        {getFieldErrorMessages('interestRate').length > 0 ? (
          <div className="mt-1">
            {getFieldErrorMessages('interestRate').map((errMsg, index) => (
              <p key={index} className="text-xs text-red-600">
                {errMsg}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500">
            Min {DESCRIPTION_MIN_ALLOWED_INTEREST_RATE} and max{" "}
            {DESCRIPTION_MAX_ALLOWED_INTEREST_RATE}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          {UI_TEXT.LABELS.INVESTMENT_TERM}
        </label>
        <input
          type="number"
          value={months}
          onChange={(e) => onMonthsChange(parseInt(e.target.value, 10))}
          min={MIN_ALLOWED_COMPOUNDING_MONTHS}
          max={MAX_ALLOWED_COMPOUNDING_MONTHS}
          className={getInputClassName(hasFieldError('duration'))}
          data-testid={TEST_IDS.INVESTMENT_TERM_INPUT}
        />
        {getFieldErrorMessages('duration').length > 0 ? (
          <div className="mt-1">
            {getFieldErrorMessages('duration').map((errMsg, index) => (
              <p key={index} className="text-xs text-red-600">
                {errMsg}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500">
            Min {MIN_ALLOWED_COMPOUNDING_MONTHS} and max{" "}
            {MAX_ALLOWED_COMPOUNDING_MONTHS} months
          </p>
        )}
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
                onChange={() => onFrequencyChange(opt.value)}
                className="form-radio mr-2"
                data-testid={`${TEST_IDS.RADIO_PREFIX}${opt.value.toLowerCase()}`}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}