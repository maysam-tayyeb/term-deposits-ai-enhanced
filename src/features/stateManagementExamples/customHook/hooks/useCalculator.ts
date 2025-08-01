import { useState, useEffect, useCallback } from "react";
import { DEFAULT_VALUES } from "@features/savingsAndDepositCalculator/config/constants";
import { useLocalStorage } from "@shared/hooks";
import type { PayFrequency } from "@features/savingsAndDepositCalculator/domain/types/compoundingInterestCalculators.types";
import type { CalculatorHookReturn } from "../../shared/types";
import { calculateNewState } from "../../shared/utils";

const STORAGE_KEY = "calculatorState";

export function useCalculator(): CalculatorHookReturn {
  // Load persisted state
  const [storedState, setStoredState] = useLocalStorage<{
    principal: number;
    annualRate: number;
    months: number;
    frequency: PayFrequency;
  }>(STORAGE_KEY, {
    principal: DEFAULT_VALUES.PRINCIPAL,
    annualRate: DEFAULT_VALUES.INTEREST_RATE,
    months: DEFAULT_VALUES.INVESTMENT_TERM_MONTHS,
    frequency: DEFAULT_VALUES.FREQUENCY,
  });

  const [principal, setPrincipalState] = useState<number>(storedState.principal);
  const [annualRate, setAnnualRateState] = useState<number>(storedState.annualRate);
  const [months, setMonthsState] = useState<number>(storedState.months);
  const [frequency, setFrequencyState] = useState<PayFrequency>(
    storedState.frequency,
  );

  // Calculate initial state
  const { schedule, error } = calculateNewState({
    principal,
    annualRate,
    months,
    frequency,
  });

  // Persist state changes
  useEffect(() => {
    setStoredState({
      principal: principal as number,
      annualRate: annualRate as number,
      months: months as number,
      frequency,
    });
  }, [principal, annualRate, months, frequency, setStoredState]);

  // Action handlers
  const setPrincipal = useCallback((value: number) => {
    setPrincipalState(value);
  }, []);

  const setAnnualRate = useCallback((value: number) => {
    setAnnualRateState(value);
  }, []);

  const setMonths = useCallback((value: number) => {
    setMonthsState(value);
    // If months < 12 and frequency is annually, switch to atMaturity
    if (value < 12 && frequency === "annually") {
      setFrequencyState("atMaturity");
    }
  }, [frequency]);

  const setFrequency = useCallback((value: PayFrequency) => {
    setFrequencyState(value);
  }, []);

  const resetToDefaults = useCallback(() => {
    setPrincipalState(DEFAULT_VALUES.PRINCIPAL);
    setAnnualRateState(DEFAULT_VALUES.INTEREST_RATE);
    setMonthsState(DEFAULT_VALUES.INVESTMENT_TERM_MONTHS);
    setFrequencyState(DEFAULT_VALUES.FREQUENCY);
  }, []);

  return {
    principal,
    annualRate,
    months,
    frequency,
    schedule,
    error,
    setPrincipal,
    setAnnualRate,
    setMonths,
    setFrequency,
    resetToDefaults,
  };
}