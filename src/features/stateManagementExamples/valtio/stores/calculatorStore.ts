import { proxy, subscribe } from "valtio";
import { DEFAULT_VALUES } from "@features/savingsAndDepositCalculator/config/constants";
import type { PayFrequency } from "@features/savingsAndDepositCalculator/domain/types/compoundingInterestCalculators.types";
import { getInitialState, calculateNewState } from "../../shared/utils";

const STORAGE_KEY = "calculatorState";

// Load persisted state
const loadState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...getInitialState(),
        ...parsed,
      };
    }
  } catch (e) {
    console.error("Failed to load calculator state from localStorage", e);
  }
  return getInitialState();
};

// Create the store
export const calculatorStore = proxy(loadState());

// Actions
export const calculatorActions = {
  setPrincipal(value: number) {
    calculatorStore.principal = value;
    const { schedule, error } = calculateNewState(calculatorStore);
    calculatorStore.schedule = schedule;
    calculatorStore.error = error;
  },

  setAnnualRate(value: number) {
    calculatorStore.annualRate = value;
    const { schedule, error } = calculateNewState(calculatorStore);
    calculatorStore.schedule = schedule;
    calculatorStore.error = error;
  },

  setMonths(value: number) {
    calculatorStore.months = value;
    // If months < 12 and frequency is annually, switch to atMaturity
    if (value < 12 && calculatorStore.frequency === "annually") {
      calculatorStore.frequency = "atMaturity";
    }
    const { schedule, error } = calculateNewState(calculatorStore);
    calculatorStore.schedule = schedule;
    calculatorStore.error = error;
  },

  setFrequency(value: PayFrequency) {
    calculatorStore.frequency = value;
    const { schedule, error } = calculateNewState(calculatorStore);
    calculatorStore.schedule = schedule;
    calculatorStore.error = error;
  },

  resetToDefaults() {
    calculatorStore.principal = DEFAULT_VALUES.PRINCIPAL;
    calculatorStore.annualRate = DEFAULT_VALUES.INTEREST_RATE;
    calculatorStore.months = DEFAULT_VALUES.INVESTMENT_TERM_MONTHS;
    calculatorStore.frequency = DEFAULT_VALUES.FREQUENCY;
    const { schedule, error } = calculateNewState(calculatorStore);
    calculatorStore.schedule = schedule;
    calculatorStore.error = error;
  },
};

// Persist state changes
subscribe(calculatorStore, () => {
  const { principal, annualRate, months, frequency } = calculatorStore;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ principal, annualRate, months, frequency }),
  );
});
