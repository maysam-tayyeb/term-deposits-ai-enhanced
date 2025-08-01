import type { PrincipalAmount } from "../../types/compoundingInterestCalculators.types";
import {
  createValueObjectFactory,
  createNumberValidation,
} from "@shared/utils/valueObjectFactory";

export const MIN_ALLOWED_PRINCIPAL = 1;
export const MAX_ALLOWED_PRINCIPAL = 10_000_000;
export const DESCRIPTION_MIN_ALLOWED_PRINCIPAL = `$${MIN_ALLOWED_PRINCIPAL.toLocaleString()}`;
export const DESCRIPTION_MAX_ALLOWED_PRINCIPAL = `$${MAX_ALLOWED_PRINCIPAL.toLocaleString()}`;

// Custom formatter to match existing behavior (no decimals for whole numbers)
const principalFormatter = (value: number) => `$${value.toLocaleString()}`;

export const createPrincipalAmount = createValueObjectFactory<PrincipalAmount>({
  min: MIN_ALLOWED_PRINCIPAL,
  max: MAX_ALLOWED_PRINCIPAL,
  displayName: "Principal amount",
  formatValue: principalFormatter,
  formatDescription: principalFormatter,
  customValidation: createNumberValidation("Principal amount"),
});
