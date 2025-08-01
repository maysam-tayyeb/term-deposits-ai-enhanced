import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
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

// Store interface
interface CalculatorStore {
  // State
  principal: number;
  annualRate: number;
  months: number;
  frequency: PayFrequency;
  schedule: CalculationResult[];
  error: BaseCalculatorError | null;

  // Actions
  setPrincipal: (value: number) => void;
  setAnnualRate: (value: number) => void;
  setMonths: (value: number) => void;
  setFrequency: (value: PayFrequency) => void;
  resetToDefaults: () => void;
  recalculate: () => void;
}

// Storage keys - same as other implementations
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

// Save to localStorage
function saveToStorage(key: keyof typeof STORAGE_KEYS, value: string | number) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS[key], String(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

// Create Zustand store
export const useCalculatorStore = create<CalculatorStore>()(
  subscribeWithSelector((set, get) => {
    // Load initial values
    const storedValues = loadFromStorage();
    
    return {
      // Initial state with localStorage values
      principal: storedValues.principal ?? DEFAULT_VALUES.PRINCIPAL,
      annualRate: storedValues.annualRate ?? DEFAULT_VALUES.INTEREST_RATE,
      months: storedValues.months ?? DEFAULT_VALUES.INVESTMENT_TERM_MONTHS,
      frequency: storedValues.frequency ?? DEFAULT_VALUES.FREQUENCY,
      schedule: [],
      error: null,

      // Actions
      setPrincipal: (value) => {
        set({ principal: value });
        saveToStorage("principal", value);
        get().recalculate();
      },

      setAnnualRate: (value) => {
        set({ annualRate: value });
        saveToStorage("annualRate", value);
        get().recalculate();
      },

      setMonths: (value) => {
        set((state) => {
          // Handle frequency switching logic
          const newState: Partial<CalculatorStore> = { months: value };
          if (state.frequency === "annually" && value < 12) {
            newState.frequency = "atMaturity";
            saveToStorage("frequency", "atMaturity");
          }
          saveToStorage("months", value);
          return newState;
        });
        get().recalculate();
      },

      setFrequency: (value) => {
        set({ frequency: value });
        saveToStorage("frequency", value);
        get().recalculate();
      },

      resetToDefaults: () => {
        set({
          principal: DEFAULT_VALUES.PRINCIPAL,
          annualRate: DEFAULT_VALUES.INTEREST_RATE,
          months: DEFAULT_VALUES.INVESTMENT_TERM_MONTHS,
          frequency: DEFAULT_VALUES.FREQUENCY,
        });
        // Save defaults to localStorage
        saveToStorage("principal", DEFAULT_VALUES.PRINCIPAL);
        saveToStorage("annualRate", DEFAULT_VALUES.INTEREST_RATE);
        saveToStorage("months", DEFAULT_VALUES.INVESTMENT_TERM_MONTHS);
        saveToStorage("frequency", DEFAULT_VALUES.FREQUENCY);
        get().recalculate();
      },

      recalculate: () => {
        const state = get();
        
        try {
          const context = {
            component: "SavingsAndDepositCalculator",
            action: "calculation",
            userInput: {
              principal: state.principal,
              annualRate: state.annualRate,
              months: state.months,
              frequency: state.frequency,
            },
            timestamp: new Date().toISOString(),
          };

          // Validate all inputs
          const validationErrors: string[] = [];
          let principalAmount, annualInterestRate, duration;

          try {
            principalAmount = createPrincipalAmount(state.principal);
          } catch (e) {
            if (e instanceof RangeError) validationErrors.push(e.message);
          }

          try {
            annualInterestRate = createAnnualInterestRate(state.annualRate);
          } catch (e) {
            if (e instanceof RangeError) validationErrors.push(e.message);
          }

          try {
            duration = createDurationMonths(state.months);
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
          switch (state.frequency) {
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
                `Invalid frequency type: ${state.frequency}`,
                context,
              );
          }

          set({ schedule: result, error: null });
        } catch (e) {
          const context = {
            component: "SavingsAndDepositCalculator",
            action: "calculation",
            userInput: {
              principal: state.principal,
              annualRate: state.annualRate,
              months: state.months,
              frequency: state.frequency,
            },
            timestamp: new Date().toISOString(),
          };

          let calculatorError: BaseCalculatorError;

          if (e instanceof RangeError) {
            calculatorError = ErrorFactory.createValidationError(
              "input_validation",
              {
                principal: state.principal,
                annualRate: state.annualRate,
                months: state.months,
                frequency: state.frequency,
              },
              e.message,
              context,
            );
          } else if (e instanceof BaseCalculatorError) {
            calculatorError = e;
          } else {
            calculatorError = ErrorFactory.createUnknownError(e, context);
          }

          set({ schedule: [], error: calculatorError });
          ErrorService.getInstance().handleError(calculatorError);
        }
      },
    };
  })
);

// Listen for storage changes from other tabs
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (!e.key || !Object.values(STORAGE_KEYS).includes(e.key as any)) return;
    if (e.newValue === null) return;

    const state = useCalculatorStore.getState();
    
    switch (e.key) {
      case STORAGE_KEYS.principal:
        state.setPrincipal(Number(e.newValue));
        break;
      case STORAGE_KEYS.annualRate:
        state.setAnnualRate(Number(e.newValue));
        break;
      case STORAGE_KEYS.months:
        state.setMonths(Number(e.newValue));
        break;
      case STORAGE_KEYS.frequency:
        state.setFrequency(e.newValue as PayFrequency);
        break;
    }
  });
  
  // Initial calculation after load
  setTimeout(() => {
    useCalculatorStore.getState().recalculate();
  }, 0);
}