import { proxy, subscribe } from "valtio";
import { DEFAULT_VALUES } from "@features/savingsAndDepositCalculator/config/constants";
import type { PayFrequency } from "@features/savingsAndDepositCalculator/domain/types/compoundingInterestCalculators.types";
import { calculateNewState, loadFromStorage, STORAGE_KEYS, saveToStorage, setupStorageListener } from "../../shared/utils";

// Load persisted state from individual keys
const loadState = () => {
  const loadedState = loadFromStorage();
  const { schedule, error } = calculateNewState(loadedState);
  return { ...loadedState, schedule, error };
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
  saveToStorage(STORAGE_KEYS.PRINCIPAL, calculatorStore.principal);
  saveToStorage(STORAGE_KEYS.ANNUAL_RATE, calculatorStore.annualRate);
  saveToStorage(STORAGE_KEYS.MONTHS, calculatorStore.months);
  saveToStorage(STORAGE_KEYS.FREQUENCY, calculatorStore.frequency);
});

// Listen for localStorage changes from other tabs/implementations
setupStorageListener(calculatorActions);
