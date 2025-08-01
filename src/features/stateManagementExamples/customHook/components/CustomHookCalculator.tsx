import React from "react";
import { CalculatorErrorBoundary } from "@features/savingsAndDepositCalculator/components/ErrorHandling";
import { PerformanceWrapper } from "../../shared/components";
import { useCalculator } from "../hooks";

export function SavingsAndDepositCalculatorWithHook(): React.JSX.Element {
  const calculator = useCalculator();
  
  return (
    <CalculatorErrorBoundary>
      <PerformanceWrapper calculator={calculator} implementation="Custom Hook" />
    </CalculatorErrorBoundary>
  );
}

export const CustomHookCalculator = SavingsAndDepositCalculatorWithHook;