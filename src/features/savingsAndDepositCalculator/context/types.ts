import type { PayFrequency, CalculationResult } from "../domain/types/compoundingInterestCalculators.types";
import type { BaseCalculatorError } from "../config/errors";

// State shape for the calculator context
export interface CalculatorState {
  principal: number;
  annualRate: number;
  months: number;
  frequency: PayFrequency;
  schedule: CalculationResult[];
  error: BaseCalculatorError | null;
}

// Action types for the reducer
export type CalculatorAction =
  | { type: "SET_PRINCIPAL"; payload: number }
  | { type: "SET_ANNUAL_RATE"; payload: number }
  | { type: "SET_MONTHS"; payload: number }
  | { type: "SET_FREQUENCY"; payload: PayFrequency }
  | { type: "SET_SCHEDULE"; payload: CalculationResult[] }
  | { type: "SET_ERROR"; payload: BaseCalculatorError | null }
  | { type: "RESET_TO_DEFAULTS" }
  | { type: "LOAD_FROM_STORAGE"; payload: Partial<CalculatorState> };

// Context value shape including state and dispatch
export interface CalculatorContextValue {
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
}