import React from "react";
import { CalculatorErrorBoundary } from "@features/savingsAndDepositCalculator/components/ErrorHandling";
import { BaseCalculatorWrapper } from "../../shared/components";
import { useValtioCalculator } from "../hooks";

export function SavingsAndDepositCalculatorWithValtio(): React.JSX.Element {
  const calculator = useValtioCalculator();

  return (
    <CalculatorErrorBoundary>
      <BaseCalculatorWrapper calculator={calculator} />
    </CalculatorErrorBoundary>
  );
}

export const ValtioCalculator = SavingsAndDepositCalculatorWithValtio;