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
  DEFAULT_VALUES,
} from "../../config/constants";
import {
  FormField,
  NumberInput,
  ButtonGroup,
} from "../../../../shared/components/FormFields";

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
  onReset?: () => void;
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
  onReset,
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


  // Helper function to get field-specific error messages
  const getFieldErrorMessages = (fieldKey: string): string[] => {
    return fieldErrors[fieldKey] || [];
  };
  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      onPrincipalChange(DEFAULT_VALUES.PRINCIPAL);
      onAnnualRateChange(DEFAULT_VALUES.INTEREST_RATE);
      onMonthsChange(DEFAULT_VALUES.INVESTMENT_TERM_MONTHS);
      onFrequencyChange(DEFAULT_VALUES.FREQUENCY);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        label={UI_TEXT.LABELS.PRINCIPAL}
        error={getFieldErrorMessages('principal')}
        helpText={`Min ${DESCRIPTION_MIN_ALLOWED_PRINCIPAL} and max ${DESCRIPTION_MAX_ALLOWED_PRINCIPAL}`}
      >
        <NumberInput
          value={principal}
          onChange={onPrincipalChange}
          min={MIN_ALLOWED_PRINCIPAL}
          max={MAX_ALLOWED_PRINCIPAL}
          hasError={hasFieldError('principal')}
          testId={TEST_IDS.PRINCIPAL_INPUT}
        />
      </FormField>

      <FormField
        label={UI_TEXT.LABELS.INTEREST_RATE}
        error={getFieldErrorMessages('interestRate')}
        helpText={`Min ${DESCRIPTION_MIN_ALLOWED_INTEREST_RATE} and max ${DESCRIPTION_MAX_ALLOWED_INTEREST_RATE}`}
      >
        <NumberInput
          value={annualRate}
          onChange={onAnnualRateChange}
          min={MIN_ALLOWED_INTEREST_RATE}
          max={MAX_ALLOWED_INTEREST_RATE}
          step={parseFloat(UI_CONFIG.INTEREST_RATE_STEP)}
          hasError={hasFieldError('interestRate')}
          testId={TEST_IDS.INTEREST_RATE_INPUT}
        />
      </FormField>

      <FormField
        label={UI_TEXT.LABELS.INVESTMENT_TERM}
        error={getFieldErrorMessages('duration')}
        helpText={`Min ${MIN_ALLOWED_COMPOUNDING_MONTHS} and max ${MAX_ALLOWED_COMPOUNDING_MONTHS} months`}
      >
        <NumberInput
          value={months}
          onChange={(value) => onMonthsChange(Math.floor(value))}
          min={MIN_ALLOWED_COMPOUNDING_MONTHS}
          max={MAX_ALLOWED_COMPOUNDING_MONTHS}
          hasError={hasFieldError('duration')}
          testId={TEST_IDS.INVESTMENT_TERM_INPUT}
        />
      </FormField>

      <FormField
        label={UI_TEXT.LABELS.INTEREST_PAID}
      >
        <ButtonGroup
          options={FREQUENCY_OPTIONS.filter(
            (opt) => opt.value !== "annually" || months >= 12,
          )}
          value={frequency}
          onChange={(value) => onFrequencyChange(value as PayFrequency)}
          testIdPrefix={TEST_IDS.RADIO_PREFIX}
        />
      </FormField>
      </div>
    </div>
  );
}