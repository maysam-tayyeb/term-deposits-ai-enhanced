import React from "react";
import { Provider } from "react-redux";
import { CalculatorErrorBoundary } from "@features/savingsAndDepositCalculator/components/ErrorHandling";
import { PerformanceWrapper } from "../../shared/components";
import { store } from "../stores/store";
import { useReduxCalculator } from "../hooks";

function ReduxCalculatorInner(): React.JSX.Element {
  const calculator = useReduxCalculator();
  return <PerformanceWrapper calculator={calculator} implementation="Redux Toolkit" />;
}

export function SavingsAndDepositCalculatorWithRedux(): React.JSX.Element {
  return (
    <CalculatorErrorBoundary>
      <Provider store={store}>
        <ReduxCalculatorInner />
      </Provider>
    </CalculatorErrorBoundary>
  );
}

export const ReduxCalculator = SavingsAndDepositCalculatorWithRedux;