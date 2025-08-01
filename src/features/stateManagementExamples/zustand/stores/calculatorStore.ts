import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { DEFAULT_VALUES } from "@features/savingsAndDepositCalculator/config/constants";
import type { PayFrequency } from "@features/savingsAndDepositCalculator/domain/types/compoundingInterestCalculators.types";
import type { CalculatorState, CalculatorActions } from "../../shared/types";
import { calculateNewState } from "../../shared/utils";

type CalculatorStore = CalculatorState & CalculatorActions;

// Load initial state from localStorage
const loadInitialState = (): CalculatorState => {
  try {
    const principal = localStorage.getItem("calculator.principal");
    const annualRate = localStorage.getItem("calculator.annualRate");
    const months = localStorage.getItem("calculator.months");
    const frequency = localStorage.getItem("calculator.frequency");
    
    const loadedState = {
      principal: principal ? JSON.parse(principal) : DEFAULT_VALUES.PRINCIPAL,
      annualRate: annualRate ? JSON.parse(annualRate) : DEFAULT_VALUES.INTEREST_RATE,
      months: months ? JSON.parse(months) : DEFAULT_VALUES.INVESTMENT_TERM_MONTHS,
      frequency: (frequency ? JSON.parse(frequency) : DEFAULT_VALUES.FREQUENCY) as PayFrequency,
    };
    
    const { schedule, error } = calculateNewState(loadedState);
    return { ...loadedState, schedule, error };
  } catch (e) {
    console.error("Failed to load calculator state from localStorage", e);
    const { schedule, error } = calculateNewState({
      principal: DEFAULT_VALUES.PRINCIPAL,
      annualRate: DEFAULT_VALUES.INTEREST_RATE,
      months: DEFAULT_VALUES.INVESTMENT_TERM_MONTHS,
      frequency: DEFAULT_VALUES.FREQUENCY,
    });
    return {
      principal: DEFAULT_VALUES.PRINCIPAL,
      annualRate: DEFAULT_VALUES.INTEREST_RATE,
      months: DEFAULT_VALUES.INVESTMENT_TERM_MONTHS,
      frequency: DEFAULT_VALUES.FREQUENCY,
      schedule,
      error,
    };
  }
};

export const useCalculatorStore = create<CalculatorStore>()(
  subscribeWithSelector((set) => ({
    ...loadInitialState(),

      setPrincipal: (value: number) =>
        set((state) => {
          const newState = { ...state, principal: value };
          const { schedule, error } = calculateNewState(newState);
          return { ...newState, schedule, error };
        }),

      setAnnualRate: (value: number) =>
        set((state) => {
          const newState = { ...state, annualRate: value };
          const { schedule, error } = calculateNewState(newState);
          return { ...newState, schedule, error };
        }),

      setMonths: (value: number) =>
        set((state) => {
          let newState = { ...state, months: value };
          // If months < 12 and frequency is annually, switch to atMaturity
          if (value < 12 && state.frequency === "annually") {
            newState.frequency = "atMaturity";
          }
          const { schedule, error } = calculateNewState(newState);
          return { ...newState, schedule, error };
        }),

      setFrequency: (value: PayFrequency) =>
        set((state) => {
          const newState = { ...state, frequency: value };
          const { schedule, error } = calculateNewState(newState);
          return { ...newState, schedule, error };
        }),

      resetToDefaults: () =>
        set(() => {
          const defaultState = {
            principal: DEFAULT_VALUES.PRINCIPAL,
            annualRate: DEFAULT_VALUES.INTEREST_RATE,
            months: DEFAULT_VALUES.INVESTMENT_TERM_MONTHS,
            frequency: DEFAULT_VALUES.FREQUENCY,
          };
          const { schedule, error } = calculateNewState(defaultState);
          return { ...defaultState, schedule, error };
        }),
  }))
);

// Subscribe to state changes and persist to localStorage
useCalculatorStore.subscribe(
  (state) => ({
    principal: state.principal,
    annualRate: state.annualRate,
    months: state.months,
    frequency: state.frequency,
  }),
  (current) => {
    localStorage.setItem("calculator.principal", JSON.stringify(current.principal));
    localStorage.setItem("calculator.annualRate", JSON.stringify(current.annualRate));
    localStorage.setItem("calculator.months", JSON.stringify(current.months));
    localStorage.setItem("calculator.frequency", JSON.stringify(current.frequency));
  }
);

// Listen for localStorage changes from other tabs/implementations
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (!e.key || !e.newValue) return;
    
    const value = JSON.parse(e.newValue);
    const store = useCalculatorStore.getState();
    
    switch (e.key) {
      case "calculator.principal":
        store.setPrincipal(value);
        break;
      case "calculator.annualRate":
        store.setAnnualRate(value);
        break;
      case "calculator.months":
        store.setMonths(value);
        break;
      case "calculator.frequency":
        store.setFrequency(value);
        break;
    }
  });
}