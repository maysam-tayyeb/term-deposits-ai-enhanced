import React, { createContext, useContext, useReducer, useEffect, useMemo } from "react";
import { calculatorReducer, initialState } from "./calculatorReducer";
import type { CalculatorContextValue, CalculatorState } from "./types";
import { createDurationMonths } from "../domain/valueObjects/duration/durationMonths.factory";
import {
  calculateMonthlyCompounding,
  calculateQuarterlyCompounding,
  calculateAnnuallyCompounding,
  calculateAtMaturity,
} from "../logic/calculations/compoundingInterestCalculators";
import type {
  CalculationResult,
  PrincipalAmount,
  AnnualInterestRate,
  DurationMonths,
} from "../domain/types/compoundingInterestCalculators.types";
import { createAnnualInterestRate } from "../domain/valueObjects/interestRate/annualInterestRate.factory";
import { createPrincipalAmount } from "../domain/valueObjects/principalAmount/principal.factory";
import {
  BaseCalculatorError,
  ErrorFactory,
  ErrorService,
} from "../config/errors";

// Create the context
const CalculatorContext = createContext<CalculatorContextValue | undefined>(undefined);

// Custom hook to use the calculator context
export function useCalculatorContext() {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error("useCalculatorContext must be used within a CalculatorProvider");
  }
  return context;
}

// Storage keys
const STORAGE_KEYS = {
  principal: "calculator.principal",
  annualRate: "calculator.annualRate",
  months: "calculator.months",
  frequency: "calculator.frequency",
} as const;

// Load initial state from localStorage
function loadFromStorage(): Partial<CalculatorState> {
  if (typeof window === "undefined") return {};

  const stored: Partial<CalculatorState> = {};

  try {
    const principal = localStorage.getItem(STORAGE_KEYS.principal);
    if (principal) stored.principal = Number(principal);

    const annualRate = localStorage.getItem(STORAGE_KEYS.annualRate);
    if (annualRate) stored.annualRate = Number(annualRate);

    const months = localStorage.getItem(STORAGE_KEYS.months);
    if (months) stored.months = Number(months);

    const frequency = localStorage.getItem(STORAGE_KEYS.frequency);
    if (frequency) stored.frequency = frequency as CalculatorState["frequency"];
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

interface CalculatorProviderProps {
  children: React.ReactNode;
}

export function CalculatorProvider({ children }: CalculatorProviderProps) {
  // Initialize reducer with stored values
  const [state, dispatch] = useReducer(calculatorReducer, initialState, (initial) => ({
    ...initial,
    ...loadFromStorage(),
  }));

  const errorService = ErrorService.getInstance();

  // Persist individual values to localStorage when they change
  useEffect(() => {
    saveToStorage("principal", state.principal);
  }, [state.principal]);

  useEffect(() => {
    saveToStorage("annualRate", state.annualRate);
  }, [state.annualRate]);

  useEffect(() => {
    saveToStorage("months", state.months);
  }, [state.months]);

  useEffect(() => {
    saveToStorage("frequency", state.frequency);
  }, [state.frequency]);

  // Calculate schedule whenever inputs change
  useEffect(() => {
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

      // Validate all inputs and collect errors
      const validationErrors: string[] = [];
      let principalAmount: PrincipalAmount | undefined;
      let annualInterestRate: AnnualInterestRate | undefined;
      let duration: DurationMonths | undefined;

      // Validate principal
      try {
        principalAmount = createPrincipalAmount(state.principal);
      } catch (e) {
        if (e instanceof RangeError) {
          validationErrors.push(e.message);
        }
      }

      // Validate interest rate
      try {
        annualInterestRate = createAnnualInterestRate(state.annualRate);
      } catch (e) {
        if (e instanceof RangeError) {
          validationErrors.push(e.message);
        }
      }

      // Validate duration
      try {
        duration = createDurationMonths(state.months);
      } catch (e) {
        if (e instanceof RangeError) {
          validationErrors.push(e.message);
        }
      }

      // If there are validation errors, throw combined error
      if (validationErrors.length > 0) {
        const combinedMessage = validationErrors.join(". ");
        throw new RangeError(combinedMessage);
      }

      // All validations passed, proceed with calculation
      if (!principalAmount || !annualInterestRate || !duration) {
        throw new Error("Validation failed but no errors collected");
      }

      let result: CalculationResult[];
      switch (state.frequency) {
        case "monthly":
          result = calculateMonthlyCompounding(
            principalAmount,
            annualInterestRate,
            duration,
          );
          break;
        case "quarterly":
          result = calculateQuarterlyCompounding(
            principalAmount,
            annualInterestRate,
            duration,
          );
          break;
        case "annually":
          result = calculateAnnuallyCompounding(
            principalAmount,
            annualInterestRate,
            duration,
          );
          break;
        case "atMaturity":
          result = calculateAtMaturity(
            principalAmount,
            annualInterestRate,
            duration,
          );
          break;
        default:
          throw ErrorFactory.createCalculationError(
            "frequency_selection",
            `Invalid frequency type: ${state.frequency}`,
            context,
          );
      }

      dispatch({ type: "SET_SCHEDULE", payload: result });
      dispatch({ type: "SET_ERROR", payload: null });
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
        // Handle validation errors from factory functions
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
        // Re-throw our custom errors
        calculatorError = e;
      } else {
        // Handle unknown errors
        calculatorError = ErrorFactory.createUnknownError(e, context);
      }

      dispatch({ type: "SET_SCHEDULE", payload: [] });
      dispatch({ type: "SET_ERROR", payload: calculatorError });
      errorService.handleError(calculatorError);
    }
  }, [state.principal, state.annualRate, state.months, state.frequency, errorService]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || !Object.values(STORAGE_KEYS).includes(e.key as any)) return;
      if (e.newValue === null) return;

      const updates: Partial<CalculatorState> = {};

      switch (e.key) {
        case STORAGE_KEYS.principal:
          updates.principal = Number(e.newValue);
          break;
        case STORAGE_KEYS.annualRate:
          updates.annualRate = Number(e.newValue);
          break;
        case STORAGE_KEYS.months:
          updates.months = Number(e.newValue);
          break;
        case STORAGE_KEYS.frequency:
          updates.frequency = e.newValue as CalculatorState["frequency"];
          break;
        default:
          // Ignore other storage keys
          break;
      }

      if (Object.keys(updates).length > 0) {
        dispatch({ type: "LOAD_FROM_STORAGE", payload: updates });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ state, dispatch }),
    [state]
  );

  return (
    <CalculatorContext.Provider value={contextValue}>
      {children}
    </CalculatorContext.Provider>
  );
}