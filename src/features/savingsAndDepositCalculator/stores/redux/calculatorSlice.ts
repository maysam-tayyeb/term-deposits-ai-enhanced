import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
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

// Storage keys - same as other implementations
const STORAGE_KEYS = {
  principal: "calculator.principal",
  annualRate: "calculator.annualRate",
  months: "calculator.months",
  frequency: "calculator.frequency",
} as const;

// Load initial values from localStorage
function loadFromStorage() {
  if (typeof window === "undefined") return {};

  const stored: any = {};

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

// Define the state shape
interface CalculatorState {
  principal: number;
  annualRate: number;
  months: number;
  frequency: PayFrequency;
  schedule: CalculationResult[];
  error: BaseCalculatorError | null;
}

// Load stored values
const storedValues = loadFromStorage();

// Initial state
const initialState: CalculatorState = {
  principal: storedValues.principal ?? DEFAULT_VALUES.PRINCIPAL,
  annualRate: storedValues.annualRate ?? DEFAULT_VALUES.INTEREST_RATE,
  months: storedValues.months ?? DEFAULT_VALUES.INVESTMENT_TERM_MONTHS,
  frequency: storedValues.frequency ?? DEFAULT_VALUES.FREQUENCY,
  schedule: [],
  error: null,
};

// Create the slice
export const calculatorSlice = createSlice({
  name: "calculator",
  initialState,
  reducers: {
    setPrincipal: (state, action: PayloadAction<number>) => {
      state.principal = action.payload;
      saveToStorage("principal", action.payload);
    },
    setAnnualRate: (state, action: PayloadAction<number>) => {
      state.annualRate = action.payload;
      saveToStorage("annualRate", action.payload);
    },
    setMonths: (state, action: PayloadAction<number>) => {
      state.months = action.payload;
      saveToStorage("months", action.payload);
      // Handle frequency switching logic
      if (state.frequency === "annually" && action.payload < 12) {
        state.frequency = "atMaturity";
        saveToStorage("frequency", "atMaturity");
      }
    },
    setFrequency: (state, action: PayloadAction<PayFrequency>) => {
      state.frequency = action.payload;
      saveToStorage("frequency", action.payload);
    },
    setSchedule: (state, action: PayloadAction<CalculationResult[]>) => {
      state.schedule = action.payload;
    },
    setError: (state, action: PayloadAction<BaseCalculatorError | null>) => {
      state.error = action.payload;
    },
    resetToDefaults: (state) => {
      state.principal = DEFAULT_VALUES.PRINCIPAL;
      state.annualRate = DEFAULT_VALUES.INTEREST_RATE;
      state.months = DEFAULT_VALUES.INVESTMENT_TERM_MONTHS;
      state.frequency = DEFAULT_VALUES.FREQUENCY;
      state.schedule = [];
      state.error = null;
      // Save defaults to localStorage
      saveToStorage("principal", DEFAULT_VALUES.PRINCIPAL);
      saveToStorage("annualRate", DEFAULT_VALUES.INTEREST_RATE);
      saveToStorage("months", DEFAULT_VALUES.INVESTMENT_TERM_MONTHS);
      saveToStorage("frequency", DEFAULT_VALUES.FREQUENCY);
    },
    syncFromStorage: (state, action: PayloadAction<{ key: string; value: string }>) => {
      // Handle storage events from other tabs
      const { key, value } = action.payload;
      switch (key) {
        case STORAGE_KEYS.principal:
          state.principal = Number(value);
          break;
        case STORAGE_KEYS.annualRate:
          state.annualRate = Number(value);
          break;
        case STORAGE_KEYS.months:
          state.months = Number(value);
          break;
        case STORAGE_KEYS.frequency:
          state.frequency = value as PayFrequency;
          break;
      }
    },
  },
});

// Export actions
export const {
  setPrincipal,
  setAnnualRate,
  setMonths,
  setFrequency,
  setSchedule,
  setError,
  resetToDefaults,
  syncFromStorage,
} = calculatorSlice.actions;

// Selector for getting all state
export const selectCalculator = (state: { calculator: CalculatorState }) => state.calculator;

// Thunk for recalculating (side effect)
export const recalculate = () => (dispatch: any, getState: any) => {
  const state = getState().calculator as CalculatorState;
  
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

    dispatch(setSchedule(result));
    dispatch(setError(null));
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

    dispatch(setSchedule([]));
    dispatch(setError(calculatorError));
    ErrorService.getInstance().handleError(calculatorError);
  }
};

export default calculatorSlice.reducer;