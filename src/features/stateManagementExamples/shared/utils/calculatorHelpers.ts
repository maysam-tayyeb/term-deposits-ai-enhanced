import { DEFAULT_VALUES } from "@features/savingsAndDepositCalculator/config/constants";
import { createDurationMonths } from "@features/savingsAndDepositCalculator/domain/valueObjects/duration/durationMonths.factory";
import { createAnnualInterestRate } from "@features/savingsAndDepositCalculator/domain/valueObjects/interestRate/annualInterestRate.factory";
import { createPrincipalAmount } from "@features/savingsAndDepositCalculator/domain/valueObjects/principalAmount/principal.factory";
import {
  calculateMonthlyCompounding,
  calculateQuarterlyCompounding,
  calculateAnnuallyCompounding,
  calculateAtMaturity,
} from "@features/savingsAndDepositCalculator/logic/calculations/compoundingInterestCalculators";
import { ErrorFactory } from "@features/savingsAndDepositCalculator/config/errors";
import type { CalculatorState } from "../types";
import type {
  CalculationResult,
} from "@features/savingsAndDepositCalculator/domain/types/compoundingInterestCalculators.types";

export const getInitialState = (): CalculatorState => {
  try {
    const principal = createPrincipalAmount(DEFAULT_VALUES.PRINCIPAL);
    const annualRate = createAnnualInterestRate(DEFAULT_VALUES.INTEREST_RATE);
    const months = createDurationMonths(DEFAULT_VALUES.INVESTMENT_TERM_MONTHS);
    
    const schedule = calculateMonthlyCompounding(principal, annualRate, months);
    
    return {
      principal: DEFAULT_VALUES.PRINCIPAL,
      annualRate: DEFAULT_VALUES.INTEREST_RATE,
      months: DEFAULT_VALUES.INVESTMENT_TERM_MONTHS,
      frequency: DEFAULT_VALUES.FREQUENCY,
      schedule,
      error: null,
    };
  } catch (error) {
    return {
      principal: DEFAULT_VALUES.PRINCIPAL,
      annualRate: DEFAULT_VALUES.INTEREST_RATE,
      months: DEFAULT_VALUES.INVESTMENT_TERM_MONTHS,
      frequency: DEFAULT_VALUES.FREQUENCY,
      schedule: [],
      error: ErrorFactory.createValidationError(
        "input",
        { principal: DEFAULT_VALUES.PRINCIPAL, annualRate: DEFAULT_VALUES.INTEREST_RATE, months: DEFAULT_VALUES.INVESTMENT_TERM_MONTHS },
        error instanceof Error ? error.message : "Validation error",
        { component: "Calculator", action: "initialize", timestamp: new Date().toISOString() }
      ),
    };
  }
};

export const calculateNewState = (
  state: Pick<CalculatorState, "principal" | "annualRate" | "months" | "frequency">
): Pick<CalculatorState, "schedule" | "error"> => {
  try {
    // Create value objects with validation
    const principalAmount = createPrincipalAmount(state.principal);
    const annualInterestRate = createAnnualInterestRate(state.annualRate);
    const duration = createDurationMonths(state.months);

    // Calculate based on frequency
    let result: CalculationResult[];
    switch (state.frequency) {
      case "monthly":
        result = calculateMonthlyCompounding(principalAmount, annualInterestRate, duration);
        break;
      case "quarterly":
        result = calculateQuarterlyCompounding(principalAmount, annualInterestRate, duration);
        break;
      case "annually":
        result = calculateAnnuallyCompounding(principalAmount, annualInterestRate, duration);
        break;
      case "atMaturity":
        result = calculateAtMaturity(principalAmount, annualInterestRate, duration);
        break;
      default:
        throw new Error(`Unknown frequency: ${state.frequency}`);
    }

    return {
      schedule: result,
      error: null,
    };
  } catch (error) {
    return {
      schedule: [],
      error: ErrorFactory.createValidationError(
        "input",
        { principal: DEFAULT_VALUES.PRINCIPAL, annualRate: DEFAULT_VALUES.INTEREST_RATE, months: DEFAULT_VALUES.INVESTMENT_TERM_MONTHS },
        error instanceof Error ? error.message : "Validation error",
        { component: "Calculator", action: "initialize", timestamp: new Date().toISOString() }
      ),
    };
  }
};