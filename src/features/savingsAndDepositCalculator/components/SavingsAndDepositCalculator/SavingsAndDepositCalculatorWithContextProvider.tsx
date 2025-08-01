import React from "react";
import { CalculatorProvider } from "../../context";
import { SavingsAndDepositCalculatorWithContext } from "./SavingsAndDepositCalculatorWithContext";
import { CalculatorErrorBoundary } from "../ErrorHandling";

export function SavingsAndDepositCalculatorWithContextProvider(): React.JSX.Element {
  return (
    <CalculatorErrorBoundary>
      <CalculatorProvider>
        <SavingsAndDepositCalculatorWithContext />
      </CalculatorProvider>
    </CalculatorErrorBoundary>
  );
}