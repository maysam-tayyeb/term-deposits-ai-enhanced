import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_VALUES } from "@features/savingsAndDepositCalculator/config/constants";
import type { PayFrequency } from "@features/savingsAndDepositCalculator/domain/types/compoundingInterestCalculators.types";
import type { CalculatorState } from "../../shared/types";
import { getInitialState, calculateNewState } from "../../shared/utils";

// Load persisted state from individual keys
const loadState = (): CalculatorState => {
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
    return getInitialState();
  }
};

const calculatorSlice = createSlice({
  name: "calculator",
  initialState: loadState(),
  reducers: {
    setPrincipal: (state, action: PayloadAction<number>) => {
      state.principal = action.payload;
      const { schedule, error } = calculateNewState(state);
      state.schedule = schedule;
      state.error = error;
    },
    setAnnualRate: (state, action: PayloadAction<number>) => {
      state.annualRate = action.payload;
      const { schedule, error } = calculateNewState(state);
      state.schedule = schedule;
      state.error = error;
    },
    setMonths: (state, action: PayloadAction<number>) => {
      state.months = action.payload;
      // If months < 12 and frequency is annually, switch to atMaturity
      if (action.payload < 12 && state.frequency === "annually") {
        state.frequency = "atMaturity";
      }
      const { schedule, error } = calculateNewState(state);
      state.schedule = schedule;
      state.error = error;
    },
    setFrequency: (state, action: PayloadAction<PayFrequency>) => {
      state.frequency = action.payload;
      const { schedule, error } = calculateNewState(state);
      state.schedule = schedule;
      state.error = error;
    },
    resetToDefaults: (state) => {
      state.principal = DEFAULT_VALUES.PRINCIPAL;
      state.annualRate = DEFAULT_VALUES.INTEREST_RATE;
      state.months = DEFAULT_VALUES.INVESTMENT_TERM_MONTHS;
      state.frequency = DEFAULT_VALUES.FREQUENCY;
      const { schedule, error } = calculateNewState(state);
      state.schedule = schedule;
      state.error = error;
    },
  },
});

export const {
  setPrincipal,
  setAnnualRate,
  setMonths,
  setFrequency,
  resetToDefaults,
} = calculatorSlice.actions;

export default calculatorSlice.reducer;