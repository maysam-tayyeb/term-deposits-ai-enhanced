import type { AnnualInterestRate } from "./compoundingInterestCalculators.types.ts";

export const MIN_ALLOWED_INTEREST_RATE = 0;
export const MAX_ALLOWED_INTEREST_RATE = 15;
export const DESCRIPTION_MIN_ALLOWED_INTEREST_RATE = `${MIN_ALLOWED_INTEREST_RATE.toFixed(2)}%`;
export const DESCRIPTION_MAX_ALLOWED_INTEREST_RATE = `${MAX_ALLOWED_INTEREST_RATE.toFixed(2)}%`;

export function createAnnualInterestRate(value: number): AnnualInterestRate {
  if (value < MIN_ALLOWED_INTEREST_RATE || value > MAX_ALLOWED_INTEREST_RATE) {
    throw new RangeError(
      `Interest rate must be between ${DESCRIPTION_MIN_ALLOWED_INTEREST_RATE} and ${DESCRIPTION_MAX_ALLOWED_INTEREST_RATE}. Received: ${value.toFixed(2)}%`,
    );
  }
  return value as AnnualInterestRate;
}
