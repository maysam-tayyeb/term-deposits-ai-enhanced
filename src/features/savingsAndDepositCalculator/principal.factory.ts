import type { PrincipalAmount } from "./compoundingInterestCalculators.types.ts";

export const MIN_ALLOWED_PRINCIPAL = 1;
export const MAX_ALLOWED_PRINCIPAL = 10_000_000;
export const DESCRIPTION_MIN_ALLOWED_PRINCIPAL = `$${MIN_ALLOWED_PRINCIPAL.toLocaleString()}`;
export const DESCRIPTION_MAX_ALLOWED_PRINCIPAL = `$${MAX_ALLOWED_PRINCIPAL.toLocaleString()}`;

export function createPrincipalAmount(value: number): PrincipalAmount {
  if (isNaN(value) || !isFinite(value)) {
    throw new RangeError(
      `Principal amount must be a valid number. Received: ${value}`,
    );
  }
  
  if (value < MIN_ALLOWED_PRINCIPAL || value > MAX_ALLOWED_PRINCIPAL) {
    throw new RangeError(
      `Principal amount must be between ${DESCRIPTION_MIN_ALLOWED_PRINCIPAL} and ${DESCRIPTION_MAX_ALLOWED_PRINCIPAL}. Received: $${value.toLocaleString()}`,
    );
  }
  
  return value as PrincipalAmount;
}