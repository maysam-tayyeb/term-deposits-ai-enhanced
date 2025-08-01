import { useCallback, useEffect } from "react";
import { DEFAULT_VALUES } from "@features/savingsAndDepositCalculator/config/constants";
import { useLocalStorage } from "@shared/hooks";
import type { PayFrequency } from "@features/savingsAndDepositCalculator/domain/types/compoundingInterestCalculators.types";
import type { CalculatorHookReturn } from "../../shared/types";
import { calculateNewState, STORAGE_KEYS, setupStorageListener } from "../../shared/utils";

export function useCalculator(): CalculatorHookReturn {
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

  // Calculate initial state
  const { schedule, error } = calculateNewState({
    principal,
    annualRate,
    months,
    frequency,
  });

  // Action handlers
  const setPrincipalHandler = useCallback((value: number) => {
    setPrincipal(value);
  }, [setPrincipal]);

  const setAnnualRateHandler = useCallback((value: number) => {
    setAnnualRate(value);
  }, [setAnnualRate]);

  const setMonthsHandler = useCallback((value: number) => {
    setMonths(value);
    // If months < 12 and frequency is annually, switch to atMaturity
    if (value < 12 && frequency === "annually") {
      setFrequency("atMaturity");
    }
  }, [setMonths, frequency, setFrequency]);

  const setFrequencyHandler = useCallback((value: PayFrequency) => {
    setFrequency(value);
  }, [setFrequency]);

  const resetToDefaults = useCallback(() => {
    setPrincipal(DEFAULT_VALUES.PRINCIPAL);
    setAnnualRate(DEFAULT_VALUES.INTEREST_RATE);
    setMonths(DEFAULT_VALUES.INVESTMENT_TERM_MONTHS);
    setFrequency(DEFAULT_VALUES.FREQUENCY);
  }, [setPrincipal, setAnnualRate, setMonths, setFrequency]);

  // Setup storage listener for same-tab sync
  useEffect(() => {
    const cleanup = setupStorageListener({
      setPrincipal: setPrincipalHandler,
      setAnnualRate: setAnnualRateHandler,
      setMonths: setMonthsHandler,
      setFrequency: setFrequencyHandler,
    });
    
    return cleanup;
  }, [setPrincipalHandler, setAnnualRateHandler, setMonthsHandler, setFrequencyHandler]);

  return {
    principal,
    annualRate,
    months,
    frequency,
    schedule,
    error,
    setPrincipal: setPrincipalHandler,
    setAnnualRate: setAnnualRateHandler,
    setMonths: setMonthsHandler,
    setFrequency: setFrequencyHandler,
    resetToDefaults,
  };
}