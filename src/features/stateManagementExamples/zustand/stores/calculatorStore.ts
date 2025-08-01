import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_VALUES } from "@features/savingsAndDepositCalculator/config/constants";
import type { PayFrequency } from "@features/savingsAndDepositCalculator/domain/types/compoundingInterestCalculators.types";
import type { CalculatorState, CalculatorActions } from "../../shared/types";
import { getInitialState, calculateNewState } from "../../shared/utils";

type CalculatorStore = CalculatorState & CalculatorActions;

export const useCalculatorStore = create<CalculatorStore>()(
  persist(
    (set) => ({
      ...getInitialState(),

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
    }),
    {
      name: "calculatorState",
      partialize: (state) => ({
        principal: state.principal,
        annualRate: state.annualRate,
        months: state.months,
        frequency: state.frequency,
      }),
    }
  )
);