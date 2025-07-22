import React from "react";
import { UI_TEXT } from "../../config/constants";
import { useCalculator } from "../../logic/hooks";
import { ErrorDisplay } from "../ErrorHandling";
import { CalculatorForm } from "../CalculatorForm";
import { ResultsDisplay } from "../ResultsDisplay";
import { AppLogoIcon, CalculatorIcon, ClockIcon } from "../../../../shared/components/Icons";

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
    resetToDefaults,
  } = useCalculator();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#de313b] to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <AppLogoIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#de313b] to-red-600 bg-clip-text text-transparent">
                {UI_TEXT.TITLE}
              </h1>
              <p className="text-slate-600 text-sm mt-1">Calculate your compound interest returns with precision</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="mb-8">
            <ErrorDisplay error={error} />
          </div>
        )}
        {/* Calculator Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <CalculatorIcon className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-slate-700">Investment Calculator</h2>
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
            onReset={resetToDefaults}
          />
        </div>

        {/* Results Section */}
        {error ? (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <ClockIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-3">Results Pending</h3>
                <p className="text-slate-500 leading-relaxed">
                  Complete the form above with valid values to see your projected investment growth and detailed breakdown.
                </p>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-slate-700 mb-3">Summary Coming Soon</h4>
                <p className="text-slate-500 leading-relaxed">
                  Your final balance and total interest earned will appear here once all fields are properly filled.
                </p>
              </div>
            </div>
          </div>
        ) : (
          schedule.length > 0 && <ResultsDisplay schedule={schedule} />
        )}
      </div>
    </div>
  );
}

