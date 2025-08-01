import { DEFAULT_VALUES } from "@features/savingsAndDepositCalculator/config/constants";
import type { CalculatorState } from "../../shared/types";
import { calculateNewState } from "../../shared/utils";
import { ActionType, type CalculatorAction } from "./types";

export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.type) {
    case ActionType.SET_PRINCIPAL: {
      const newState = { ...state, principal: action.payload };
      const { schedule, error } = calculateNewState(newState);
      return { ...newState, schedule, error };
    }
    
    case ActionType.SET_ANNUAL_RATE: {
      const newState = { ...state, annualRate: action.payload };
      const { schedule, error } = calculateNewState(newState);
      return { ...newState, schedule, error };
    }
    
    case ActionType.SET_MONTHS: {
      let newState = { ...state, months: action.payload };
      // If months < 12 and frequency is annually, switch to atMaturity
      if (action.payload < 12 && state.frequency === "annually") {
        newState.frequency = "atMaturity";
      }
      const { schedule, error } = calculateNewState(newState);
      return { ...newState, schedule, error };
    }
    
    case ActionType.SET_FREQUENCY: {
      const newState = { ...state, frequency: action.payload };
      const { schedule, error } = calculateNewState(newState);
      return { ...newState, schedule, error };
    }
    
    case ActionType.RESET_TO_DEFAULTS: {
      const defaultState = {
        principal: DEFAULT_VALUES.PRINCIPAL,
        annualRate: DEFAULT_VALUES.INTEREST_RATE,
        months: DEFAULT_VALUES.INVESTMENT_TERM_MONTHS,
        frequency: DEFAULT_VALUES.FREQUENCY,
      };
      const { schedule, error } = calculateNewState(defaultState);
      return { ...defaultState, schedule, error };
    }
    
    default:
      return state;
  }
}