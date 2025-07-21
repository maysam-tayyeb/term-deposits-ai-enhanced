import type { DurationMonths } from "./compoundingInterestCalculators.types.ts";

export const MIN_ALLOWED_COMPOUNDING_MONTHS = 3;
export const MAX_ALLOWED_COMPOUNDING_MONTHS = 5 * 12;

export function createDurationMonths(value: number): DurationMonths {
  if (
    value < MIN_ALLOWED_COMPOUNDING_MONTHS ||
    value > MAX_ALLOWED_COMPOUNDING_MONTHS
  ) {
    throw new RangeError(
      `Duration must be between ${MIN_ALLOWED_COMPOUNDING_MONTHS} and ${MAX_ALLOWED_COMPOUNDING_MONTHS} months. Received: ${value} month${value > 1 ? "s" : ""}`,
    );
  }
  return value as DurationMonths;
}
