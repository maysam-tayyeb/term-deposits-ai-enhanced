import type { PayFrequency } from "../domain/types/compoundingInterestCalculators.types";

// Default component values
export const DEFAULT_VALUES = {
  PRINCIPAL: 10_000,
  INTEREST_RATE: 1.2,
  INVESTMENT_TERM_MONTHS: 3,
  FREQUENCY: "monthly" as PayFrequency,
} as const;

// UI configuration
export const UI_CONFIG = {
  INTEREST_RATE_STEP: "0.1",
  DECIMAL_PLACES: 2,
  CURRENCY: {
    LOCALE: "en-AU",
    CODE: "AUD",
  },
} as const;

// UI Text constants
export const UI_TEXT = {
  TITLE: "Calculate Term Deposit (Re-invest)",
  LABELS: {
    PRINCIPAL: "Starting amount",
    INTEREST_RATE: "Interest rate (per year)",
    INVESTMENT_TERM: "Investment term",
    INTEREST_PAID: "Interest paid",
  },
  TABLE_HEADERS: {
    PROJECTED_SAVINGS: "Projected savings",
    MONTH: "Month",
    INTEREST_RATE: "Interest Rate",
    INTEREST_EARNED: "Interest Earned",
    BALANCE: "Balance",
  },
  SUMMARY: {
    FINAL_BALANCE: "Final balance",
    TOTAL_INTEREST_EARNED: "Total interest earned",
  },
  ERROR_MESSAGES: {
    UNKNOWN_ERROR: "There is an unknown error occurred.",
  },
} as const;

// Frequency options for radio buttons
export const FREQUENCY_OPTIONS: { label: string; value: PayFrequency }[] = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Annually", value: "annually" },
  { label: "At Maturity", value: "atMaturity" },
] as const;

// Test IDs for component elements
export const TEST_IDS = {
  PRINCIPAL_INPUT: "principal-input",
  INTEREST_RATE_INPUT: "interest-rate-input",
  INVESTMENT_TERM_INPUT: "investment-term-input",
  RADIO_PREFIX: "radio-re-invest-",
  FINAL_BALANCE: "final-balance",
  TOTAL_INTEREST_EARNED: "total-interest-earned",
  ERROR: "error",
} as const;
