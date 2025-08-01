import {
  MIN_ALLOWED_PRINCIPAL,
  MAX_ALLOWED_PRINCIPAL,
  DESCRIPTION_MIN_ALLOWED_PRINCIPAL,
  DESCRIPTION_MAX_ALLOWED_PRINCIPAL,
} from "../domain/valueObjects/principalAmount/principal.factory";
import {
  MIN_ALLOWED_INTEREST_RATE,
  MAX_ALLOWED_INTEREST_RATE,
  DESCRIPTION_MIN_ALLOWED_INTEREST_RATE,
  DESCRIPTION_MAX_ALLOWED_INTEREST_RATE,
} from "../domain/valueObjects/interestRate/annualInterestRate.factory";
import {
  MIN_ALLOWED_COMPOUNDING_MONTHS,
  MAX_ALLOWED_COMPOUNDING_MONTHS,
} from "../domain/valueObjects/duration/durationMonths.factory";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validatePrincipal(value: number): ValidationResult {
  if (isNaN(value) || value === 0) {
    return {
      isValid: false,
      error: "Please enter a valid amount",
    };
  }

  if (value < MIN_ALLOWED_PRINCIPAL) {
    return {
      isValid: false,
      error: `Amount must be at least ${DESCRIPTION_MIN_ALLOWED_PRINCIPAL}`,
    };
  }

  if (value > MAX_ALLOWED_PRINCIPAL) {
    return {
      isValid: false,
      error: `Amount cannot exceed ${DESCRIPTION_MAX_ALLOWED_PRINCIPAL}`,
    };
  }

  return { isValid: true };
}

export function validateInterestRate(value: number): ValidationResult {
  if (isNaN(value)) {
    return {
      isValid: false,
      error: "Please enter a valid interest rate",
    };
  }

  if (value < MIN_ALLOWED_INTEREST_RATE) {
    return {
      isValid: false,
      error: `Rate must be at least ${DESCRIPTION_MIN_ALLOWED_INTEREST_RATE}`,
    };
  }

  if (value > MAX_ALLOWED_INTEREST_RATE) {
    return {
      isValid: false,
      error: `Rate cannot exceed ${DESCRIPTION_MAX_ALLOWED_INTEREST_RATE}`,
    };
  }

  return { isValid: true };
}

export function validateDuration(value: number): ValidationResult {
  if (isNaN(value) || value === 0) {
    return {
      isValid: false,
      error: "Please enter a valid duration",
    };
  }

  if (!Number.isInteger(value)) {
    return {
      isValid: false,
      error: "Duration must be a whole number of months",
    };
  }

  if (value < MIN_ALLOWED_COMPOUNDING_MONTHS) {
    return {
      isValid: false,
      error: `Duration must be at least ${MIN_ALLOWED_COMPOUNDING_MONTHS} months`,
    };
  }

  if (value > MAX_ALLOWED_COMPOUNDING_MONTHS) {
    return {
      isValid: false,
      error: `Duration cannot exceed ${MAX_ALLOWED_COMPOUNDING_MONTHS} months`,
    };
  }

  return { isValid: true };
}