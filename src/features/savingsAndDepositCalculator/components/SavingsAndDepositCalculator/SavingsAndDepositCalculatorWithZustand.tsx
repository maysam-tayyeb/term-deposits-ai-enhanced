import React, { useEffect, useState } from "react";
import { UI_TEXT } from "../../config/constants";
import { useCalculatorStore } from "../../stores/zustand/calculatorStore";
import { ErrorDisplay } from "../ErrorHandling";
import { CalculatorForm } from "../CalculatorForm";
import { ResultsDisplay } from "../ResultsDisplay";
import { CalculatorIcon, ClockIcon } from "@shared/components/Icons";
import { LiveRegion } from "@shared/components/LiveRegion";
import { CalculatorErrorBoundary } from "../ErrorHandling";

function SavingsAndDepositCalculatorWithZustandInner(): React.JSX.Element {
  // Use Zustand store
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
  } = useCalculatorStore();

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
    <div className="min-h-screen bg-gray-50">
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      {/* Live region for announcements */}
      <LiveRegion message={liveMessage} politeness="polite" />

      {/* Header Section */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <CalculatorIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {UI_TEXT.TITLE}
              </h1>
              <p className="text-gray-600 mt-1">
                Calculate your compound interest returns with precision
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="max-w-5xl mx-auto px-6 py-8">
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
            error={error}
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
          schedule.length > 0 && <ResultsDisplay schedule={schedule} />
        )}
      </main>
    </div>
  );
}

export function SavingsAndDepositCalculatorWithZustand(): React.JSX.Element {
  return (
    <CalculatorErrorBoundary>
      <SavingsAndDepositCalculatorWithZustandInner />
    </CalculatorErrorBoundary>
  );
}