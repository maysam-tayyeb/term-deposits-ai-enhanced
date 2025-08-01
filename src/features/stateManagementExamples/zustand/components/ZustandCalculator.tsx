import React from "react";
import { CalculatorErrorBoundary } from "@features/savingsAndDepositCalculator/components/ErrorHandling";
import { PerformanceWrapper } from "../../shared/components";
import { useCalculatorStore } from "../stores/calculatorStore";

export function SavingsAndDepositCalculatorWithZustand(): React.JSX.Element {
  const calculator = useCalculatorStore();

  return (
    <CalculatorErrorBoundary>
      <PerformanceWrapper calculator={calculator} implementation="Zustand" />
    </CalculatorErrorBoundary>
  );
}

export const ZustandCalculator = SavingsAndDepositCalculatorWithZustand;