import type { PayFrequency } from "@features/savingsAndDepositCalculator/domain/types/compoundingInterestCalculators.types";
import type { CalculationResult } from "@features/savingsAndDepositCalculator/domain/types/compoundingInterestCalculators.types";
import type { BaseCalculatorError } from "@features/savingsAndDepositCalculator/config/errors";

export interface CalculatorState {
  principal: number;
  annualRate: number;
  months: number;
  frequency: PayFrequency;
  schedule: CalculationResult[];
  error: BaseCalculatorError | null;
}

export interface CalculatorActions {
  setPrincipal: (value: number) => void;
  setAnnualRate: (value: number) => void;
  setMonths: (value: number) => void;
  setFrequency: (value: PayFrequency) => void;
  resetToDefaults: () => void;
}

export type CalculatorHookReturn = CalculatorState & CalculatorActions;