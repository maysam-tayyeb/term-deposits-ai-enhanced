import React from "react";
import { CalculatorErrorBoundary } from "@features/savingsAndDepositCalculator/components/ErrorHandling";
import { BaseCalculatorWrapper } from "../../shared/components";
import { useZustandCalculator } from "../hooks";

export function SavingsAndDepositCalculatorWithZustand(): React.JSX.Element {
  const calculator = useZustandCalculator();

  return (
    <CalculatorErrorBoundary>
      <BaseCalculatorWrapper calculator={calculator} />
    </CalculatorErrorBoundary>
  );
}

export const ZustandCalculator = SavingsAndDepositCalculatorWithZustand;