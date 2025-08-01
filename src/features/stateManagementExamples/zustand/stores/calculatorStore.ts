import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { DEFAULT_VALUES } from "@features/savingsAndDepositCalculator/config/constants";
import type { PayFrequency } from "@features/savingsAndDepositCalculator/domain/types/compoundingInterestCalculators.types";
import type { CalculatorState, CalculatorActions } from "../../shared/types";
import { calculateNewState, loadFromStorage, saveAllToStorage, setupStorageListener } from "../../shared/utils";

type CalculatorStore = CalculatorState & CalculatorActions;

// Load initial state from localStorage
const loadInitialState = (): CalculatorState => {
  const loadedState = loadFromStorage();
  const { schedule, error } = calculateNewState(loadedState);
  return { ...loadedState, schedule, error };
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
    saveAllToStorage(current);
  }
);

// Listen for localStorage changes from other tabs/implementations
setupStorageListener(useCalculatorStore.getState());