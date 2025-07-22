import React from "react";
import { UI_TEXT } from "./SavingsAndDepositCalculator.constants";
import { useCalculator } from "./useCalculator";
import { ErrorDisplay } from "./ErrorDisplay";
import { CalculatorForm } from "./CalculatorForm";
import { ResultsDisplay } from "./ResultsDisplay";

export function SavingsAndDepositCalculator(): React.JSX.Element {
  const {
    principal,
    annualRate,
    months,
    frequency,
    schedule,
    error,
    setPrincipal,
    setAnnualRate,
    setMonths,
    setFrequency,
    setError,
  } = useCalculator();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-[#de313b]">
        {UI_TEXT.TITLE}
      </h1>
      {error && <ErrorDisplay error={error} onDismiss={() => setError(null)} />}
      <CalculatorForm
        principal={principal}
        annualRate={annualRate}
        months={months}
        frequency={frequency}
        onPrincipalChange={setPrincipal}
        onAnnualRateChange={setAnnualRate}
        onMonthsChange={setMonths}
        onFrequencyChange={setFrequency}
      />
      {schedule.length > 0 && <ResultsDisplay schedule={schedule} />}
    </div>
  );
}

