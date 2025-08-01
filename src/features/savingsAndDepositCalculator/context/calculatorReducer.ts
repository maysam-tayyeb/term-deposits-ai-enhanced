import { DEFAULT_VALUES } from "../config/constants";
import type { CalculatorState, CalculatorAction } from "./types";

export const initialState: CalculatorState = {
  principal: DEFAULT_VALUES.PRINCIPAL,
  annualRate: DEFAULT_VALUES.INTEREST_RATE,
  months: DEFAULT_VALUES.INVESTMENT_TERM_MONTHS,
  frequency: DEFAULT_VALUES.FREQUENCY,
  schedule: [],
  error: null,
};

export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.type) {
    case "SET_PRINCIPAL":
      return { ...state, principal: action.payload };

    case "SET_ANNUAL_RATE":
      return { ...state, annualRate: action.payload };

    case "SET_MONTHS": {
      // Handle frequency switching logic when months change
      const newMonths = action.payload;
      const newState = { ...state, months: newMonths };
      
      // If annually is selected but new term is < 12 months, change to at maturity
      if (state.frequency === "annually" && newMonths < 12) {
        newState.frequency = "atMaturity";
      }
      
      return newState;
    }

    case "SET_FREQUENCY":
      return { ...state, frequency: action.payload };

    case "SET_SCHEDULE":
      return { ...state, schedule: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "RESET_TO_DEFAULTS":
      return {
        ...initialState,
        // Keep schedule and error as they'll be recalculated
        schedule: [],
        error: null,
      };

    case "LOAD_FROM_STORAGE":
      return {
        ...state,
        ...action.payload,
        // Don't load schedule and error from storage, recalculate them
        schedule: [],
        error: null,
      };

    default: {
      // Exhaustive check
      const exhaustiveCheck: never = action;
      throw new Error(`Unhandled action type: ${(exhaustiveCheck as CalculatorAction).type}`);
    }
  }
}