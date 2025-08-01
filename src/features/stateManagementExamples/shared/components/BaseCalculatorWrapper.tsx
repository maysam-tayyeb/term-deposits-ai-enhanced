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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header Section with Logo */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <CalculatorIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
              {UI_TEXT.TITLE}
            </h1>
            <div className="flex items-center justify-center gap-2 text-slate-600">
              <ClockIcon className="w-5 h-5" />
              <p className="text-lg">Grow your wealth with compound interest</p>
            </div>
          </div>

          {/* Live Region for Screen Readers */}
          <LiveRegion message={liveMessage} />

          {/* Error Display - Only show when there's an error */}
          {error && <ErrorDisplay error={error} />}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Calculator Form - Always visible */}
            <div className="order-1">
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
            </div>

            {/* Results Display - Only show when no error */}
            {!error && (
              <div className="order-2">
                <ResultsDisplay schedule={schedule} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}