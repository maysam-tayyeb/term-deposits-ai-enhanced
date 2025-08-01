import React from "react";
import { CalculatorErrorBoundary } from "@features/savingsAndDepositCalculator/components/ErrorHandling";
import { PerformanceWrapper } from "../../shared/components";
import { CalculatorProvider } from "../context";
import { useContextCalculator } from "../hooks";

function ContextCalculatorInner(): React.JSX.Element {
  const calculator = useContextCalculator();
  return <PerformanceWrapper calculator={calculator} implementation="Context + Reducer" />;
}

export function SavingsAndDepositCalculatorWithContext(): React.JSX.Element {
  return (
    <CalculatorErrorBoundary>
      <CalculatorProvider>
        <ContextCalculatorInner />
      </CalculatorProvider>
    </CalculatorErrorBoundary>
  );
}

export const ContextReducerCalculator = SavingsAndDepositCalculatorWithContext;