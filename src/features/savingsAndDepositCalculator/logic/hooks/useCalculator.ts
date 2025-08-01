import { useEffect, useState, useMemo } from "react";
import {
  createDurationMonths,
} from "../../domain/valueObjects/duration/durationMonths.factory";
import {
  calculateMonthlyCompounding,
  calculateQuarterlyCompounding,
  calculateAnnuallyCompounding,
  calculateAtMaturity,
} from "../calculations/compoundingInterestCalculators";
import type {
  CalculationResult,
  PayFrequency,
  PrincipalAmount,
  AnnualInterestRate,
  DurationMonths,
} from "../../domain/types/compoundingInterestCalculators.types";
import {
  createAnnualInterestRate,
} from "../../domain/valueObjects/interestRate/annualInterestRate.factory";
import {
  createPrincipalAmount,
} from "../../domain/valueObjects/principalAmount/principal.factory";
import {
  DEFAULT_VALUES,
} from "../../config/constants";
import {
  BaseCalculatorError,
  ErrorFactory,
  ErrorService,
} from "../../config/errors";

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
  resetToDefaults: () => void;
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

  // Memoize the calculation result to avoid recalculation on unrelated state changes
  const calculationResult = useMemo(() => {
    try {
      const context = {
        component: "SavingsAndDepositCalculator",
        action: "calculation",
        userInput: { principal, annualRate, months, frequency },
        timestamp: new Date().toISOString(),
      };

      // Validate all inputs and collect errors
      const validationErrors: string[] = [];
      let principalAmount: PrincipalAmount | undefined;
      let annualInterestRate: AnnualInterestRate | undefined;
      let duration: DurationMonths | undefined;

      // Validate principal
      try {
        principalAmount = createPrincipalAmount(principal);
      } catch (e) {
        if (e instanceof RangeError) {
          validationErrors.push(e.message);
        }
      }

      // Validate interest rate
      try {
        annualInterestRate = createAnnualInterestRate(annualRate);
      } catch (e) {
        if (e instanceof RangeError) {
          validationErrors.push(e.message);
        }
      }

      // Validate duration
      try {
        duration = createDurationMonths(months);
      } catch (e) {
        if (e instanceof RangeError) {
          validationErrors.push(e.message);
        }
      }

      // If there are validation errors, throw combined error
      if (validationErrors.length > 0) {
        const combinedMessage = validationErrors.join(". ");
        throw new RangeError(combinedMessage);
      }

      // All validations passed, proceed with calculation
      if (!principalAmount || !annualInterestRate || !duration) {
        throw new Error("Validation failed but no errors collected");
      }

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
      return { result, error: null };
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

      return { result: [], error: calculatorError };
    }
  }, [principal, annualRate, months, frequency]);

  // Update state when calculation result changes
  useEffect(() => {
    setSchedule(calculationResult.result);
    setError(calculationResult.error);
    if (calculationResult.error) {
      errorService.handleError(calculationResult.error);
    }
  }, [calculationResult, errorService]);

  const resetToDefaults = (): void => {
    setPrincipal(DEFAULT_VALUES.PRINCIPAL);
    setAnnualRate(DEFAULT_VALUES.INTEREST_RATE);
    setMonths(DEFAULT_VALUES.INVESTMENT_TERM_MONTHS);
    setFrequency(DEFAULT_VALUES.FREQUENCY);
    setError(null);
  };

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
    resetToDefaults,
  };
}