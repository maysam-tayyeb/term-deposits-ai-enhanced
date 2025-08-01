import React, { useState, useEffect } from "react";
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
import {
  FormField,
  FormattedNumberInput,
  ButtonGroup,
} from "../../../../shared/components/FormFields";
import {
  validatePrincipal,
  validateInterestRate,
  validateDuration,
} from "../../utils/inputValidation";

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
  // Local state for real-time validation errors
  const [principalError, setPrincipalError] = useState<string>("");
  const [interestRateError, setInterestRateError] = useState<string>("");
  const [durationError, setDurationError] = useState<string>("");

  // Real-time validation on value changes
  useEffect(() => {
    const validation = validatePrincipal(principal);
    setPrincipalError(validation.isValid ? "" : validation.error || "");
  }, [principal]);

  useEffect(() => {
    const validation = validateInterestRate(annualRate);
    setInterestRateError(validation.isValid ? "" : validation.error || "");
  }, [annualRate]);

  useEffect(() => {
    const validation = validateDuration(months);
    setDurationError(validation.isValid ? "" : validation.error || "");
  }, [months]);

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
    // Check both server-side and real-time validation errors
    if (fieldKey === 'principal' && principalError) return true;
    if (fieldKey === 'interestRate' && interestRateError) return true;
    if (fieldKey === 'duration' && durationError) return true;
    return fieldErrors[fieldKey]?.length > 0;
  };

  // Helper function to get field-specific error messages
  const getFieldErrorMessages = (fieldKey: string): string[] => {
    // Prioritize real-time validation errors
    if (fieldKey === 'principal' && principalError) return [principalError];
    if (fieldKey === 'interestRate' && interestRateError) return [interestRateError];
    if (fieldKey === 'duration' && durationError) return [durationError];
    return fieldErrors[fieldKey] || [];
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        label={UI_TEXT.LABELS.PRINCIPAL}
        error={getFieldErrorMessages('principal')}
        helpText={`Enter amount between ${DESCRIPTION_MIN_ALLOWED_PRINCIPAL} - ${DESCRIPTION_MAX_ALLOWED_PRINCIPAL}`}
        fieldId="principal-input"
      >
        <FormattedNumberInput
          id="principal-input"
          value={principal}
          onChange={onPrincipalChange}
          format="currency"
          min={MIN_ALLOWED_PRINCIPAL}
          max={MAX_ALLOWED_PRINCIPAL}
          hasError={hasFieldError('principal')}
          testId={TEST_IDS.PRINCIPAL_INPUT}
          ariaLabel={UI_TEXT.LABELS.PRINCIPAL}
          ariaDescribedBy={hasFieldError('principal') ? 'principal-input-error' : 'principal-input-help'}
          placeholder="e.g., $10,000"
          decimalPlaces={2}
        />
      </FormField>

      <FormField
        label={UI_TEXT.LABELS.INTEREST_RATE}
        error={getFieldErrorMessages('interestRate')}
        helpText={`Enter rate between ${DESCRIPTION_MIN_ALLOWED_INTEREST_RATE} - ${DESCRIPTION_MAX_ALLOWED_INTEREST_RATE}`}
        fieldId="interest-rate-input"
      >
        <FormattedNumberInput
          id="interest-rate-input"
          value={annualRate}
          onChange={onAnnualRateChange}
          format="percentage"
          min={MIN_ALLOWED_INTEREST_RATE}
          max={MAX_ALLOWED_INTEREST_RATE}
          step={parseFloat(UI_CONFIG.INTEREST_RATE_STEP)}
          hasError={hasFieldError('interestRate')}
          testId={TEST_IDS.INTEREST_RATE_INPUT}
          ariaLabel={UI_TEXT.LABELS.INTEREST_RATE}
          ariaDescribedBy={hasFieldError('interestRate') ? 'interest-rate-input-error' : 'interest-rate-input-help'}
          placeholder="e.g., 5.50%"
          decimalPlaces={2}
        />
      </FormField>

      <FormField
        label={UI_TEXT.LABELS.INVESTMENT_TERM}
        error={getFieldErrorMessages('duration')}
        helpText={`Enter ${MIN_ALLOWED_COMPOUNDING_MONTHS} - ${MAX_ALLOWED_COMPOUNDING_MONTHS} months`}
        fieldId="investment-term-input"
      >
        <FormattedNumberInput
          id="investment-term-input"
          value={months}
          onChange={(value) => onMonthsChange(Math.floor(value))}
          format="number"
          min={MIN_ALLOWED_COMPOUNDING_MONTHS}
          max={MAX_ALLOWED_COMPOUNDING_MONTHS}
          hasError={hasFieldError('duration')}
          testId={TEST_IDS.INVESTMENT_TERM_INPUT}
          ariaLabel={UI_TEXT.LABELS.INVESTMENT_TERM}
          ariaDescribedBy={hasFieldError('duration') ? 'investment-term-input-error' : 'investment-term-input-help'}
          placeholder="e.g., 12 months"
          decimalPlaces={0}
        />
      </FormField>

      <FormField
        label={UI_TEXT.LABELS.INTEREST_PAID}
        fieldId="frequency-select"
      >
        <ButtonGroup
          options={FREQUENCY_OPTIONS.filter(
            (opt) => opt.value !== "annually" || months >= 12,
          )}
          value={frequency}
          onChange={(value) => onFrequencyChange(value as PayFrequency)}
          testIdPrefix={TEST_IDS.RADIO_PREFIX}
          ariaLabel={UI_TEXT.LABELS.INTEREST_PAID}
        />
      </FormField>
      </div>
    </div>
  );
}