import type { DurationMonths } from "../../types/compoundingInterestCalculators.types";
import { 
  createValueObjectFactory, 
  createUnitFormatter 
} from "../../../../../shared/utils/valueObjectFactory";

export const MIN_ALLOWED_COMPOUNDING_MONTHS = 3;
export const MAX_ALLOWED_COMPOUNDING_MONTHS = 5 * 12;

const monthsFormatter = createUnitFormatter("month");

export const createDurationMonths = createValueObjectFactory<DurationMonths>({
  min: MIN_ALLOWED_COMPOUNDING_MONTHS,
  max: MAX_ALLOWED_COMPOUNDING_MONTHS,
  displayName: "Duration",
  formatValue: monthsFormatter,
  formatDescription: (value) => `${value} months`, // Always plural for ranges
  customValidation: (value) => {
    if (isNaN(value) || !isFinite(value)) {
      return `Duration must be a valid number. Received: ${value}`;
    }
    return null;
  },
});
