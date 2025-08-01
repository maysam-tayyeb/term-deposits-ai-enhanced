import { proxy, subscribe } from "valtio";
import { DEFAULT_VALUES } from "@features/savingsAndDepositCalculator/config/constants";
import type { PayFrequency } from "@features/savingsAndDepositCalculator/domain/types/compoundingInterestCalculators.types";
import { getInitialState, calculateNewState } from "../../shared/utils";

// Load persisted state from individual keys
const loadState = () => {
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

// Persist state changes to individual keys
subscribe(calculatorStore, () => {
  localStorage.setItem("calculator.principal", JSON.stringify(calculatorStore.principal));
  localStorage.setItem("calculator.annualRate", JSON.stringify(calculatorStore.annualRate));
  localStorage.setItem("calculator.months", JSON.stringify(calculatorStore.months));
  localStorage.setItem("calculator.frequency", JSON.stringify(calculatorStore.frequency));
});

// Listen for localStorage changes from other tabs/implementations
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (!e.key || !e.newValue) return;
    
    const value = JSON.parse(e.newValue);
    
    switch (e.key) {
      case "calculator.principal":
        calculatorActions.setPrincipal(value);
        break;
      case "calculator.annualRate":
        calculatorActions.setAnnualRate(value);
        break;
      case "calculator.months":
        calculatorActions.setMonths(value);
        break;
      case "calculator.frequency":
        calculatorActions.setFrequency(value);
        break;
    }
  });
}
