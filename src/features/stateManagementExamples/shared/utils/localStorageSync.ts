import type { PayFrequency } from "@features/savingsAndDepositCalculator/domain/types/compoundingInterestCalculators.types";
import { DEFAULT_VALUES } from "@features/savingsAndDepositCalculator/config/constants";

// Storage keys for calculator state
export const STORAGE_KEYS = {
  PRINCIPAL: "calculator.principal",
  ANNUAL_RATE: "calculator.annualRate",
  MONTHS: "calculator.months",
  FREQUENCY: "calculator.frequency",
} as const;

// Type for storage keys
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

// Load individual values from localStorage
export function loadFromStorage() {
  try {
    const principal = localStorage.getItem(STORAGE_KEYS.PRINCIPAL);
    const annualRate = localStorage.getItem(STORAGE_KEYS.ANNUAL_RATE);
    const months = localStorage.getItem(STORAGE_KEYS.MONTHS);
    const frequency = localStorage.getItem(STORAGE_KEYS.FREQUENCY);
    
    return {
      principal: principal ? JSON.parse(principal) : DEFAULT_VALUES.PRINCIPAL,
      annualRate: annualRate ? JSON.parse(annualRate) : DEFAULT_VALUES.INTEREST_RATE,
      months: months ? JSON.parse(months) : DEFAULT_VALUES.INVESTMENT_TERM_MONTHS,
      frequency: (frequency ? JSON.parse(frequency) : DEFAULT_VALUES.FREQUENCY) as PayFrequency,
    };
  } catch (e) {
    console.error("Failed to load calculator state from localStorage", e);
    return {
      principal: DEFAULT_VALUES.PRINCIPAL,
      annualRate: DEFAULT_VALUES.INTEREST_RATE,
      months: DEFAULT_VALUES.INVESTMENT_TERM_MONTHS,
      frequency: DEFAULT_VALUES.FREQUENCY,
    };
  }
}

// Save individual values to localStorage
export function saveToStorage(key: StorageKey, value: number | PayFrequency) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage`, e);
  }
}

// Save all values to localStorage
export function saveAllToStorage(state: {
  principal: number;
  annualRate: number;
  months: number;
  frequency: PayFrequency;
}) {
  saveToStorage(STORAGE_KEYS.PRINCIPAL, state.principal);
  saveToStorage(STORAGE_KEYS.ANNUAL_RATE, state.annualRate);
  saveToStorage(STORAGE_KEYS.MONTHS, state.months);
  saveToStorage(STORAGE_KEYS.FREQUENCY, state.frequency);
}

// Type for storage event handler actions
export interface StorageEventActions {
  setPrincipal: (value: number) => void;
  setAnnualRate: (value: number) => void;
  setMonths: (value: number) => void;
  setFrequency: (value: PayFrequency) => void;
}

// Create storage event listener for cross-tab/implementation sync
export function createStorageEventListener(actions: StorageEventActions) {
  return (e: StorageEvent) => {
    if (!e.key || !e.newValue) return;
    
    try {
      const value = JSON.parse(e.newValue);
      
      switch (e.key) {
        case STORAGE_KEYS.PRINCIPAL:
          actions.setPrincipal(value);
          break;
        case STORAGE_KEYS.ANNUAL_RATE:
          actions.setAnnualRate(value);
          break;
        case STORAGE_KEYS.MONTHS:
          actions.setMonths(value);
          break;
        case STORAGE_KEYS.FREQUENCY:
          actions.setFrequency(value);
          break;
      }
    } catch (error) {
      console.error("Error parsing storage event value:", error);
    }
  };
}

// Hook to setup storage event listener
export function setupStorageListener(actions: StorageEventActions) {
  if (typeof window === "undefined") return;
  
  const listener = createStorageEventListener(actions);
  window.addEventListener("storage", listener);
  
  // Return cleanup function
  return () => window.removeEventListener("storage", listener);
}