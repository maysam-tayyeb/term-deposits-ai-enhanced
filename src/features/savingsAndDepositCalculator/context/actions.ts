import type { PayFrequency, CalculationResult } from "../domain/types/compoundingInterestCalculators.types";
import type { BaseCalculatorError } from "../config/errors";
import type { CalculatorAction } from "./types";

// Action creators for cleaner dispatch calls
export const calculatorActions = {
  setPrincipal: (value: number): CalculatorAction => ({
    type: "SET_PRINCIPAL",
    payload: value,
  }),

  setAnnualRate: (value: number): CalculatorAction => ({
    type: "SET_ANNUAL_RATE",
    payload: value,
  }),

  setMonths: (value: number): CalculatorAction => ({
    type: "SET_MONTHS",
    payload: value,
  }),

  setFrequency: (value: PayFrequency): CalculatorAction => ({
    type: "SET_FREQUENCY",
    payload: value,
  }),

  setSchedule: (value: CalculationResult[]): CalculatorAction => ({
    type: "SET_SCHEDULE",
    payload: value,
  }),

  setError: (value: BaseCalculatorError | null): CalculatorAction => ({
    type: "SET_ERROR",
    payload: value,
  }),

  resetToDefaults: (): CalculatorAction => ({
    type: "RESET_TO_DEFAULTS",
  }),
} as const;