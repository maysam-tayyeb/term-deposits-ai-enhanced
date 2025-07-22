import { CalculatorErrorBoundary } from "./ErrorBoundary";
import { SavingsAndDepositCalculator } from "./SavingsAndDepositCalculator";

/**
 * SavingsAndDepositCalculator wrapped with error boundary
 * This provides a safety net for unexpected errors and better error reporting
 */
export function SavingsAndDepositCalculatorWithErrorBoundary(): JSX.Element {
  return (
    <CalculatorErrorBoundary>
      <SavingsAndDepositCalculator />
    </CalculatorErrorBoundary>
  );
}