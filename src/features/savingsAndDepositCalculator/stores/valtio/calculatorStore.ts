import { proxy, subscribe } from "valtio";
import { DEFAULT_VALUES } from "../../config/constants";
import type { PayFrequency, CalculationResult } from "../../domain/types/compoundingInterestCalculators.types";
import { createDurationMonths } from "../../domain/valueObjects/duration/durationMonths.factory";
import {
  calculateMonthlyCompounding,
  calculateQuarterlyCompounding,
  calculateAnnuallyCompounding,
  calculateAtMaturity,
} from "../../logic/calculations/compoundingInterestCalculators";
import { createAnnualInterestRate } from "../../domain/valueObjects/interestRate/annualInterestRate.factory";
import { createPrincipalAmount } from "../../domain/valueObjects/principalAmount/principal.factory";
import { ErrorFactory, ErrorService, BaseCalculatorError } from "../../config/errors";

// Define the store shape
interface CalculatorStore {
  principal: number;
  annualRate: number;
  months: number;
  frequency: PayFrequency;
  schedule: CalculationResult[];
  error: BaseCalculatorError | null;
}

// Storage keys
const STORAGE_KEYS = {
  principal: "calculator.principal",
  annualRate: "calculator.annualRate",
  months: "calculator.months",
  frequency: "calculator.frequency",
} as const;

// Load initial values from localStorage
function loadFromStorage(): Partial<CalculatorStore> {
  if (typeof window === "undefined") return {};

  const stored: Partial<CalculatorStore> = {};

  try {
    const principal = localStorage.getItem(STORAGE_KEYS.principal);
    if (principal) stored.principal = Number(principal);

    const annualRate = localStorage.getItem(STORAGE_KEYS.annualRate);
    if (annualRate) stored.annualRate = Number(annualRate);

    const months = localStorage.getItem(STORAGE_KEYS.months);
    if (months) stored.months = Number(months);

    const frequency = localStorage.getItem(STORAGE_KEYS.frequency);
    if (frequency) stored.frequency = frequency as PayFrequency;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
  }

  return stored;
}

// Create the Valtio store
export const calculatorStore = proxy<CalculatorStore>({
  principal: DEFAULT_VALUES.PRINCIPAL,
  annualRate: DEFAULT_VALUES.INTEREST_RATE,
  months: DEFAULT_VALUES.INVESTMENT_TERM_MONTHS,
  frequency: DEFAULT_VALUES.FREQUENCY,
  schedule: [],
  error: null,
  ...loadFromStorage(),
});

// Subscribe to changes and persist to localStorage
subscribe(calculatorStore, () => {
  try {
    localStorage.setItem(STORAGE_KEYS.principal, String(calculatorStore.principal));
    localStorage.setItem(STORAGE_KEYS.annualRate, String(calculatorStore.annualRate));
    localStorage.setItem(STORAGE_KEYS.months, String(calculatorStore.months));
    localStorage.setItem(STORAGE_KEYS.frequency, calculatorStore.frequency);
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
});

// Actions
export const calculatorActions = {
  setPrincipal(value: number) {
    calculatorStore.principal = value;
    this.recalculate();
  },

  setAnnualRate(value: number) {
    calculatorStore.annualRate = value;
    this.recalculate();
  },

  setMonths(value: number) {
    calculatorStore.months = value;
    // Handle frequency switching logic
    if (calculatorStore.frequency === "annually" && value < 12) {
      calculatorStore.frequency = "atMaturity";
    }
    this.recalculate();
  },

  setFrequency(value: PayFrequency) {
    calculatorStore.frequency = value;
    this.recalculate();
  },

  resetToDefaults() {
    calculatorStore.principal = DEFAULT_VALUES.PRINCIPAL;
    calculatorStore.annualRate = DEFAULT_VALUES.INTEREST_RATE;
    calculatorStore.months = DEFAULT_VALUES.INVESTMENT_TERM_MONTHS;
    calculatorStore.frequency = DEFAULT_VALUES.FREQUENCY;
    this.recalculate();
  },

  recalculate() {
    try {
      const context = {
        component: "SavingsAndDepositCalculator",
        action: "calculation",
        userInput: {
          principal: calculatorStore.principal,
          annualRate: calculatorStore.annualRate,
          months: calculatorStore.months,
          frequency: calculatorStore.frequency,
        },
        timestamp: new Date().toISOString(),
      };

      // Validate all inputs
      const validationErrors: string[] = [];
      let principalAmount, annualInterestRate, duration;

      try {
        principalAmount = createPrincipalAmount(calculatorStore.principal);
      } catch (e) {
        if (e instanceof RangeError) validationErrors.push(e.message);
      }

      try {
        annualInterestRate = createAnnualInterestRate(calculatorStore.annualRate);
      } catch (e) {
        if (e instanceof RangeError) validationErrors.push(e.message);
      }

      try {
        duration = createDurationMonths(calculatorStore.months);
      } catch (e) {
        if (e instanceof RangeError) validationErrors.push(e.message);
      }

      if (validationErrors.length > 0) {
        throw new RangeError(validationErrors.join(". "));
      }

      if (!principalAmount || !annualInterestRate || !duration) {
        throw new Error("Validation failed but no errors collected");
      }

      // Calculate based on frequency
      let result: CalculationResult[];
      switch (calculatorStore.frequency) {
        case "monthly":
          result = calculateMonthlyCompounding(principalAmount, annualInterestRate, duration);
          break;
        case "quarterly":
          result = calculateQuarterlyCompounding(principalAmount, annualInterestRate, duration);
          break;
        case "annually":
          result = calculateAnnuallyCompounding(principalAmount, annualInterestRate, duration);
          break;
        case "atMaturity":
          result = calculateAtMaturity(principalAmount, annualInterestRate, duration);
          break;
        default:
          throw ErrorFactory.createCalculationError(
            "frequency_selection",
            `Invalid frequency type: ${calculatorStore.frequency}`,
            context,
          );
      }

      calculatorStore.schedule = result;
      calculatorStore.error = null;
    } catch (e) {
      const context = {
        component: "SavingsAndDepositCalculator",
        action: "calculation",
        userInput: {
          principal: calculatorStore.principal,
          annualRate: calculatorStore.annualRate,
          months: calculatorStore.months,
          frequency: calculatorStore.frequency,
        },
        timestamp: new Date().toISOString(),
      };

      let calculatorError: BaseCalculatorError;

      if (e instanceof RangeError) {
        calculatorError = ErrorFactory.createValidationError(
          "input_validation",
          {
            principal: calculatorStore.principal,
            annualRate: calculatorStore.annualRate,
            months: calculatorStore.months,
            frequency: calculatorStore.frequency,
          },
          e.message,
          context,
        );
      } else if (e instanceof BaseCalculatorError) {
        calculatorError = e;
      } else {
        calculatorError = ErrorFactory.createUnknownError(e, context);
      }

      calculatorStore.schedule = [];
      calculatorStore.error = calculatorError;
      ErrorService.getInstance().handleError(calculatorError);
    }
  },
};

// Listen for storage changes from other tabs
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (!e.key || !Object.values(STORAGE_KEYS).includes(e.key as any)) return;
    if (e.newValue === null) return;

    switch (e.key) {
      case STORAGE_KEYS.principal:
        calculatorStore.principal = Number(e.newValue);
        break;
      case STORAGE_KEYS.annualRate:
        calculatorStore.annualRate = Number(e.newValue);
        break;
      case STORAGE_KEYS.months:
        calculatorStore.months = Number(e.newValue);
        break;
      case STORAGE_KEYS.frequency:
        calculatorStore.frequency = e.newValue as PayFrequency;
        break;
    }
    calculatorActions.recalculate();
  });
}

// Initial calculation
calculatorActions.recalculate();