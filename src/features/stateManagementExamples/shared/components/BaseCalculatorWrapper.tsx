import React, { useEffect, useState } from "react";
import { UI_TEXT } from "@features/savingsAndDepositCalculator/config/constants";
import { ErrorDisplay } from "@features/savingsAndDepositCalculator/components/ErrorHandling";
import { CalculatorForm } from "@features/savingsAndDepositCalculator/components/CalculatorForm";
import { ResultsDisplay } from "@features/savingsAndDepositCalculator/components/ResultsDisplay";
import { CalculatorIcon, ClockIcon } from "@shared/components/Icons";
import { LiveRegion } from "@shared/components/LiveRegion";
import type { CalculatorHookReturn } from "../types";

interface BaseCalculatorWrapperProps {
  calculator: CalculatorHookReturn;
}

export function BaseCalculatorWrapper({ calculator }: BaseCalculatorWrapperProps): React.JSX.Element {
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
    resetToDefaults,
  } = calculator;

  const [liveMessage, setLiveMessage] = useState("");

  // Announce calculation results
  useEffect(() => {
    if (!error && schedule.length > 0) {
      const finalBalance = schedule[schedule.length - 1].balance;
      const totalInterest = schedule[schedule.length - 1].interest;
      setLiveMessage(
        `Calculation updated. Final balance: ${Math.round(
          finalBalance,
        ).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}. Total interest earned: ${Math.round(totalInterest).toLocaleString(
          "en-US",
          {
            style: "currency",
            currency: "USD",
          },
        )}.`,
      );
    } else if (error) {
      setLiveMessage(
        "Please correct the input errors to see calculation results.",
      );
    }
  }, [schedule, error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <CalculatorIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{UI_TEXT.TITLE}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="max-w-5xl mx-auto px-6 py-8">
        {/* Live Region for Screen Readers */}
        <LiveRegion message={liveMessage} />

        {error && (
          <div className="mb-8">
            <ErrorDisplay error={error} />
          </div>
        )}

        {/* Calculator Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8 transition-all duration-200 hover:shadow-md">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Investment Calculator
            </h2>
            <button
              type="button"
              onClick={resetToDefaults}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-all duration-200 border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Reset calculator to default values"
            >
              Reset to Default
            </button>
          </div>

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
        </div>

        {/* Results Section */}
        {error ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <ClockIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Results Pending
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Complete the form above with valid values to see your projected
                investment growth and detailed breakdown.
              </p>
            </div>
          </div>
        ) : (
          <ResultsDisplay schedule={schedule} />
        )}
      </main>
    </div>
  );
}