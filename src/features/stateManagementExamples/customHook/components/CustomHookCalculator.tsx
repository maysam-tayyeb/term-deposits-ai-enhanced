import React from "react";
import { CalculatorErrorBoundary } from "@features/savingsAndDepositCalculator/components/ErrorHandling";
import { BaseCalculatorWrapper } from "../../shared/components";
import { useCalculator } from "../hooks";

export function SavingsAndDepositCalculatorWithHook(): React.JSX.Element {
  const calculator = useCalculator();
  
  return (
    <CalculatorErrorBoundary>
      <BaseCalculatorWrapper calculator={calculator} />
    </CalculatorErrorBoundary>
  );
}

export const CustomHookCalculator = SavingsAndDepositCalculatorWithHook;