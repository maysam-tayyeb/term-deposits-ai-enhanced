import React from "react";
import { CalculatorErrorBoundary } from "@features/savingsAndDepositCalculator/components/ErrorHandling";
import { BaseCalculatorWrapper } from "../../shared/components";
import { CalculatorProvider } from "../context";
import { useContextCalculator } from "../hooks";

function ContextCalculatorInner(): React.JSX.Element {
  const calculator = useContextCalculator();
  return <BaseCalculatorWrapper calculator={calculator} />;
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