import React, { createContext, useContext, useReducer, useEffect, useRef } from "react";
import { DEFAULT_VALUES } from "@features/savingsAndDepositCalculator/config/constants";
import type { PayFrequency } from "@features/savingsAndDepositCalculator/domain/types/compoundingInterestCalculators.types";
import { useLocalStorage } from "@shared/hooks";
import { calculateNewState, STORAGE_KEYS, createStorageEventListener } from "../../shared/utils";
import { calculatorReducer } from "./calculatorReducer";
import type { CalculatorContextValue } from "./types";
import { ActionType } from "./types";

const CalculatorContext = createContext<CalculatorContextValue | undefined>(undefined);

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  // Use localStorage for persisting calculator values
  const [principal, setPrincipal] = useLocalStorage<number>(
    STORAGE_KEYS.PRINCIPAL,
    DEFAULT_VALUES.PRINCIPAL,
  );
  const [annualRate, setAnnualRate] = useLocalStorage<number>(
    STORAGE_KEYS.ANNUAL_RATE,
    DEFAULT_VALUES.INTEREST_RATE,
  );
  const [months, setMonths] = useLocalStorage<number>(
    STORAGE_KEYS.MONTHS,
    DEFAULT_VALUES.INVESTMENT_TERM_MONTHS,
  );
  const [frequency, setFrequency] = useLocalStorage<PayFrequency>(
    STORAGE_KEYS.FREQUENCY,
    DEFAULT_VALUES.FREQUENCY,
  );

  // Initialize state with stored values and recalculate
  const initialState = (() => {
    const mergedState = { principal, annualRate, months, frequency };
    const { schedule, error } = calculateNewState(mergedState);
    return { ...mergedState, schedule, error };
  })();

  const [state, dispatch] = useReducer(calculatorReducer, initialState);
  const isInitialMount = useRef(true);
  const isSyncing = useRef(false);

  // Persist state changes to individual localStorage keys
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Skip if we're syncing from external changes
    if (isSyncing.current) {
      return;
    }
    
    setPrincipal(state.principal);
    setAnnualRate(state.annualRate);
    setMonths(state.months);
    setFrequency(state.frequency);
  }, [state.principal, state.annualRate, state.months, state.frequency, setPrincipal, setAnnualRate, setMonths, setFrequency]);

  // Listen for localStorage changes and update state
  useEffect(() => {
    const handleStorageChange = createStorageEventListener({
      setPrincipal: (value) => {
        isSyncing.current = true;
        dispatch({ type: ActionType.SET_PRINCIPAL, payload: value });
        setTimeout(() => { isSyncing.current = false; }, 0);
      },
      setAnnualRate: (value) => {
        isSyncing.current = true;
        dispatch({ type: ActionType.SET_ANNUAL_RATE, payload: value });
        setTimeout(() => { isSyncing.current = false; }, 0);
      },
      setMonths: (value) => {
        isSyncing.current = true;
        dispatch({ type: ActionType.SET_MONTHS, payload: value });
        setTimeout(() => { isSyncing.current = false; }, 0);
      },
      setFrequency: (value) => {
        isSyncing.current = true;
        dispatch({ type: ActionType.SET_FREQUENCY, payload: value });
        setTimeout(() => { isSyncing.current = false; }, 0);
      },
    });

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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