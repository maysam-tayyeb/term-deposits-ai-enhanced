import { useEffect, useState } from "react";
import {
  createDurationMonths,
} from "./durationMonths.factory.ts";
import {
  calculateMonthlyCompounding,
  calculateQuarterlyCompounding,
  calculateAnnuallyCompounding,
  calculateAtMaturity,
} from "./compoundingInterestCalculators";
import type {
  CalculationResult,
  PayFrequency,
} from "./compoundingInterestCalculators.types";
import {
  createAnnualInterestRate,
} from "./annualInterestRate.factory.ts";
import {
  createPrincipalAmount,
} from "./principal.factory.ts";
import {
  DEFAULT_VALUES,
} from "./SavingsAndDepositCalculator.constants";
import {
  BaseCalculatorError,
  ErrorFactory,
  ErrorService,
} from "./errors";

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
  setError: (error: BaseCalculatorError | null) => void;
}

export function useCalculator(): CalculatorState & CalculatorActions {
  const [principal, setPrincipal] = useState<number>(DEFAULT_VALUES.PRINCIPAL);
  const [annualRate, setAnnualRate] = useState<number>(
    DEFAULT_VALUES.INTEREST_RATE,
  );
  const [months, setMonths] = useState<number>(
    DEFAULT_VALUES.INVESTMENT_TERM_MONTHS,
  );
  const [frequency, setFrequency] = useState<PayFrequency>(
    DEFAULT_VALUES.FREQUENCY,
  );
  const [schedule, setSchedule] = useState<CalculationResult[]>([]);
  const [error, setError] = useState<BaseCalculatorError | null>(null);
  const errorService = ErrorService.getInstance();

  // Enhanced setMonths that handles frequency switching logic
  const setMonthsWithFrequencyCheck = (newMonths: number): void => {
    setMonths(newMonths);
    // If annually is selected but new term is < 12 months, change to at maturity
    if (frequency === "annually" && newMonths < 12) {
      setFrequency("atMaturity");
    }
  };

  useEffect(() => {
    setError(null);
    try {
      const context = {
        component: "SavingsAndDepositCalculator",
        action: "calculation",
        userInput: { principal, annualRate, months, frequency },
        timestamp: new Date().toISOString(),
      };

      const principalAmount = createPrincipalAmount(principal);
      const annualInterestRate = createAnnualInterestRate(annualRate);
      const duration = createDurationMonths(months);

      let result: CalculationResult[];
      switch (frequency) {
        case "monthly":
          result = calculateMonthlyCompounding(
            principalAmount,
            annualInterestRate,
            duration,
          );
          break;
        case "quarterly":
          result = calculateQuarterlyCompounding(
            principalAmount,
            annualInterestRate,
            duration,
          );
          break;
        case "annually":
          result = calculateAnnuallyCompounding(
            principalAmount,
            annualInterestRate,
            duration,
          );
          break;
        case "atMaturity":
          result = calculateAtMaturity(
            principalAmount,
            annualInterestRate,
            duration,
          );
          break;
        default:
          throw ErrorFactory.createCalculationError(
            "frequency_selection",
            `Invalid frequency type: ${frequency}`,
            context,
          );
      }
      setSchedule(result);
    } catch (e) {
      const context = {
        component: "SavingsAndDepositCalculator",
        action: "calculation",
        userInput: { principal, annualRate, months, frequency },
        timestamp: new Date().toISOString(),
      };

      let calculatorError: BaseCalculatorError;

      if (e instanceof RangeError) {
        // Handle validation errors from factory functions
        calculatorError = ErrorFactory.createValidationError(
          "input_validation",
          { principal, annualRate, months, frequency },
          e.message,
          context,
        );
      } else if (e instanceof BaseCalculatorError) {
        // Re-throw our custom errors
        calculatorError = e;
      } else {
        // Handle unknown errors
        calculatorError = ErrorFactory.createUnknownError(e, context);
      }

      setError(calculatorError);
      setSchedule([]);
      errorService.handleError(calculatorError);
    }
  }, [annualRate, frequency, months, principal, errorService]);

  return {
    // State
    principal,
    annualRate,
    months,
    frequency,
    schedule,
    error,
    // Actions
    setPrincipal,
    setAnnualRate,
    setMonths: setMonthsWithFrequencyCheck,
    setFrequency,
    setError,
  };
}