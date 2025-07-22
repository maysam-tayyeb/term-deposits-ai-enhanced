import React from "react";
import type { CalculationResult } from "../../domain/types";
import { UI_CONFIG, UI_TEXT, TEST_IDS } from "../../config/constants";
import { TableIcon } from "../../../../shared/components/Icons";

interface ResultsDisplayProps {
  schedule: CalculationResult[];
}

export function ResultsDisplay({ schedule }: ResultsDisplayProps): React.JSX.Element {
  if (schedule.length === 0) {
    return <></>;
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Summary Cards */}
      <div className="lg:col-span-1 space-y-4">
        {/* Final Balance Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-700">{UI_TEXT.SUMMARY.FINAL_BALANCE}</h3>
          </div>
          <div data-testid={TEST_IDS.FINAL_BALANCE} className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            ${Math.round(schedule[schedule.length - 1].balance).toLocaleString(UI_CONFIG.CURRENCY.LOCALE)}
          </div>
        </div>
        
        {/* Total Interest Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-700">{UI_TEXT.SUMMARY.TOTAL_INTEREST_EARNED}</h3>
          </div>
          <div data-testid={TEST_IDS.TOTAL_INTEREST_EARNED} className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            ${Math.round(schedule[schedule.length - 1].interest).toLocaleString(UI_CONFIG.CURRENCY.LOCALE)}
          </div>
        </div>
      </div>
      
      {/* Projected Savings Table */}
      <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <TableIcon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-slate-700">
            {UI_TEXT.TABLE_HEADERS.PROJECTED_SAVINGS}
          </h2>
        </div>
        
        <div className="max-h-96 overflow-y-auto rounded-xl border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50/80 backdrop-blur-sm sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  {UI_TEXT.TABLE_HEADERS.MONTH}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  {UI_TEXT.TABLE_HEADERS.INTEREST_RATE}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  {UI_TEXT.TABLE_HEADERS.INTEREST_EARNED}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  {UI_TEXT.TABLE_HEADERS.BALANCE}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedule.map((row, index) => (
                <tr key={row.month} className={`hover:bg-blue-50/50 transition-colors ${
                  index % 2 === 0 ? 'bg-white/50' : 'bg-slate-50/30'
                }`}>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{row.month}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {row.annualRate.toFixed(UI_CONFIG.DECIMAL_PLACES)}%
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-amber-700">
                    {row.interest.toLocaleString(UI_CONFIG.CURRENCY.LOCALE, {
                      style: "currency",
                      currency: UI_CONFIG.CURRENCY.CODE,
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                    {row.balance.toLocaleString(UI_CONFIG.CURRENCY.LOCALE, {
                      style: "currency",
                      currency: UI_CONFIG.CURRENCY.CODE,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}