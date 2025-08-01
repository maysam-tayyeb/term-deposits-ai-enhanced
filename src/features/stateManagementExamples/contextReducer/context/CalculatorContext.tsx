import React, { createContext, useContext, useReducer, useEffect } from "react";
import { DEFAULT_VALUES } from "@features/savingsAndDepositCalculator/config/constants";
import type { PayFrequency } from "@features/savingsAndDepositCalculator/domain/types/compoundingInterestCalculators.types";
import { useLocalStorage } from "@shared/hooks";
import { getInitialState, calculateNewState } from "../../shared/utils";
import { calculatorReducer } from "./calculatorReducer";
import type { CalculatorContextValue } from "./types";

const CalculatorContext = createContext<CalculatorContextValue | undefined>(undefined);

const STORAGE_KEY = "calculatorState";

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  // Load persisted state
  const [storedState, setStoredState] = useLocalStorage<{
    principal: number;
    annualRate: number;
    months: number;
    frequency: PayFrequency;
  }>(STORAGE_KEY, {
    principal: DEFAULT_VALUES.PRINCIPAL,
    annualRate: DEFAULT_VALUES.INTEREST_RATE,
    months: DEFAULT_VALUES.INVESTMENT_TERM_MONTHS,
    frequency: DEFAULT_VALUES.FREQUENCY,
  });

  // Initialize state with stored values and recalculate
  const initialState = (() => {
    const baseState = getInitialState();
    const mergedState = { ...baseState, ...storedState };
    const { schedule, error } = calculateNewState(mergedState);
    return { ...mergedState, schedule, error };
  })();

  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  // Persist state changes
  useEffect(() => {
    setStoredState({
      principal: state.principal as number,
      annualRate: state.annualRate as number,
      months: state.months as number,
      frequency: state.frequency,
    });
  }, [state, setStoredState]);

  return (
    <CalculatorContext.Provider value={{ state, dispatch }}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculatorContext() {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error("useCalculatorContext must be used within CalculatorProvider");
  }
  return context;
}