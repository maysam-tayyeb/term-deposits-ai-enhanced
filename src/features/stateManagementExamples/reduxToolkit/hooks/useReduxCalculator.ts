import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { PayFrequency } from "@features/savingsAndDepositCalculator/domain/types/compoundingInterestCalculators.types";
import type { RootState, AppDispatch } from "../stores/store";
import type { CalculatorHookReturn } from "../../shared/types";
import {
  setPrincipal,
  setAnnualRate,
  setMonths,
  setFrequency,
  resetToDefaults,
} from "../stores/calculatorSlice";

export function useReduxCalculator(): CalculatorHookReturn {
  const state = useSelector((state: RootState) => state.calculator);
  const dispatch = useDispatch<AppDispatch>();

  const handleSetPrincipal = useCallback(
    (value: number) => {
      dispatch(setPrincipal(value));
    },
    [dispatch]
  );

  const handleSetAnnualRate = useCallback(
    (value: number) => {
      dispatch(setAnnualRate(value));
    },
    [dispatch]
  );

  const handleSetMonths = useCallback(
    (value: number) => {
      dispatch(setMonths(value));
    },
    [dispatch]
  );

  const handleSetFrequency = useCallback(
    (value: PayFrequency) => {
      dispatch(setFrequency(value));
    },
    [dispatch]
  );

  const handleResetToDefaults = useCallback(() => {
    dispatch(resetToDefaults());
  }, [dispatch]);

  return {
    ...state,
    setPrincipal: handleSetPrincipal,
    setAnnualRate: handleSetAnnualRate,
    setMonths: handleSetMonths,
    setFrequency: handleSetFrequency,
    resetToDefaults: handleResetToDefaults,
  };
}