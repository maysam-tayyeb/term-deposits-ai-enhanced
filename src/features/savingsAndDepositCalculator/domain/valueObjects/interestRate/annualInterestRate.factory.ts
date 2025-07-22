import type { AnnualInterestRate } from "../../types/compoundingInterestCalculators.types";
import { 
  createValueObjectFactory, 
  createPercentageFormatter 
} from "../../../../../shared/utils/valueObjectFactory";

export const MIN_ALLOWED_INTEREST_RATE = 0;
export const MAX_ALLOWED_INTEREST_RATE = 15;
export const DESCRIPTION_MIN_ALLOWED_INTEREST_RATE = `${MIN_ALLOWED_INTEREST_RATE.toFixed(2)}%`;
export const DESCRIPTION_MAX_ALLOWED_INTEREST_RATE = `${MAX_ALLOWED_INTEREST_RATE.toFixed(2)}%`;

const percentageFormatter = createPercentageFormatter(2);

export const createAnnualInterestRate = createValueObjectFactory<AnnualInterestRate>({
  min: MIN_ALLOWED_INTEREST_RATE,
  max: MAX_ALLOWED_INTEREST_RATE,
  displayName: "Interest rate",
  formatValue: percentageFormatter,
  formatDescription: percentageFormatter,
  customValidation: (value) => {
    if (isNaN(value) || !isFinite(value)) {
      return `Interest rate must be a valid number. Received: ${value}`;
    }
    return null;
  },
});
