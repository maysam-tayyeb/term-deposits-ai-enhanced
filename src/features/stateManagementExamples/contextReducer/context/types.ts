import type { PayFrequency } from "@features/savingsAndDepositCalculator/domain/types/compoundingInterestCalculators.types";
import type { CalculatorState } from "../../shared/types";

export const ActionType = {
  SET_PRINCIPAL: "SET_PRINCIPAL",
  SET_ANNUAL_RATE: "SET_ANNUAL_RATE",
  SET_MONTHS: "SET_MONTHS",
  SET_FREQUENCY: "SET_FREQUENCY",
  RESET_TO_DEFAULTS: "RESET_TO_DEFAULTS",
} as const;

export type CalculatorAction =
  | { type: typeof ActionType.SET_PRINCIPAL; payload: number }
  | { type: typeof ActionType.SET_ANNUAL_RATE; payload: number }
  | { type: typeof ActionType.SET_MONTHS; payload: number }
  | { type: typeof ActionType.SET_FREQUENCY; payload: PayFrequency }
  | { type: typeof ActionType.RESET_TO_DEFAULTS };

export interface CalculatorContextValue {
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
}