import React from "react";
import { CalculatorErrorBoundary } from "@features/savingsAndDepositCalculator/components/ErrorHandling";
import { PerformanceWrapper } from "../../shared/components";
import { useValtioCalculator } from "../hooks";

export function SavingsAndDepositCalculatorWithValtio(): React.JSX.Element {
  const calculator = useValtioCalculator();

  return (
    <CalculatorErrorBoundary>
      <PerformanceWrapper calculator={calculator} implementation="Valtio" />
    </CalculatorErrorBoundary>
  );
}

export const ValtioCalculator = SavingsAndDepositCalculatorWithValtio;