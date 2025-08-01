import type { PayFrequency } from "@features/savingsAndDepositCalculator/domain/types/compoundingInterestCalculators.types";
import { ActionType, type CalculatorAction } from "./types";

export const calculatorActions = {
  setPrincipal: (value: number): CalculatorAction => ({
    type: ActionType.SET_PRINCIPAL,
    payload: value,
  }),
  
  setAnnualRate: (value: number): CalculatorAction => ({
    type: ActionType.SET_ANNUAL_RATE,
    payload: value,
  }),
  
  setMonths: (value: number): CalculatorAction => ({
    type: ActionType.SET_MONTHS,
    payload: value,
  }),
  
  setFrequency: (value: PayFrequency): CalculatorAction => ({
    type: ActionType.SET_FREQUENCY,
    payload: value,
  }),
  
  resetToDefaults: (): CalculatorAction => ({
    type: ActionType.RESET_TO_DEFAULTS,
  }),
};