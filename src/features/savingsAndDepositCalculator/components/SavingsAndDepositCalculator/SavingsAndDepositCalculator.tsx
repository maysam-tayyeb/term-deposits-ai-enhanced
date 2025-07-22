import React from "react";
import { UI_TEXT } from "../../config/constants";
import { useCalculator } from "../../logic/hooks";
import { ErrorDisplay } from "../ErrorHandling";
import { CalculatorForm } from "../CalculatorForm";
import { ResultsDisplay } from "../ResultsDisplay";

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
  } = useCalculator();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-[#de313b]">
        {UI_TEXT.TITLE}
      </h1>
      {error && <ErrorDisplay error={error} />}
      <CalculatorForm
        principal={principal}
        annualRate={annualRate}
        months={months}
        frequency={frequency}
        error={error}
        onPrincipalChange={setPrincipal}
        onAnnualRateChange={setAnnualRate}
        onMonthsChange={setMonths}
        onFrequencyChange={setFrequency}
      />
      {error ? (
        <div className="flex gap-4">
          <div className="max-h-[32rem] overflow-y-auto flex-2">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-gray-500 mb-2">
                <svg
                  className="h-12 w-12 mx-auto mb-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2Zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2Z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No Results Available
              </h3>
              <p className="text-sm text-gray-500">
                Please fix the validation errors above to view your projected savings and calculation results.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-start border p-4 flex-1">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-gray-500 mb-2">
                <svg
                  className="h-8 w-8 mx-auto mb-3 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.897-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <h4 className="text-base font-medium text-gray-700 mb-1">
                Summary Unavailable
              </h4>
              <p className="text-xs text-gray-500">
                Enter valid values to see your final balance and total interest earned.
              </p>
            </div>
          </div>
        </div>
      ) : (
        schedule.length > 0 && <ResultsDisplay schedule={schedule} />
      )}
    </div>
  );
}

