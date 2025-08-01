import { useCallback } from "react";
import type { PayFrequency } from "@features/savingsAndDepositCalculator/domain/types/compoundingInterestCalculators.types";
import type { CalculatorHookReturn } from "../../shared/types";
import { useCalculatorContext, calculatorActions } from "../context";

export function useContextCalculator(): CalculatorHookReturn {
  const { state, dispatch } = useCalculatorContext();

  // Action handlers
  const setPrincipal = useCallback((value: number) => {
    dispatch(calculatorActions.setPrincipal(value));
  }, [dispatch]);

  const setAnnualRate = useCallback((value: number) => {
    dispatch(calculatorActions.setAnnualRate(value));
  }, [dispatch]);

  const setMonths = useCallback((value: number) => {
    dispatch(calculatorActions.setMonths(value));
  }, [dispatch]);

  const setFrequency = useCallback((value: PayFrequency) => {
    dispatch(calculatorActions.setFrequency(value));
  }, [dispatch]);

  const resetToDefaults = useCallback(() => {
    dispatch(calculatorActions.resetToDefaults());
  }, [dispatch]);

  return {
    ...state,
    setPrincipal,
    setAnnualRate,
    setMonths,
    setFrequency,
    resetToDefaults,
  };
}