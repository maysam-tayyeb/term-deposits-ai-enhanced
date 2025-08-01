import React from "react";
import type { CalculationResult } from "../../domain/types";
import { UI_CONFIG, UI_TEXT, TEST_IDS } from "../../config/constants";
import { LazyResultsTable } from "../LazyResultsTable";

interface ResultsDisplayProps {
  schedule: CalculationResult[];
}

const ResultsDisplayComponent = ({
  schedule,
}: ResultsDisplayProps): React.JSX.Element => {
  if (schedule.length === 0) {
    return <></>;
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in duration-500 lg:items-start">
      {/* Projected Savings Table */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in slide-in-from-left-3 fade-in duration-700 delay-100 flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            {UI_TEXT.TABLE_HEADERS.PROJECTED_SAVINGS}
          </h2>
        </div>

        <div
          className="max-h-96 overflow-y-auto flex-1"
          role="region"
          aria-label="Projected savings table"
        >
          {schedule.length > 60 ? (
            <LazyResultsTable schedule={schedule} />
          ) : (
            <table
              className="w-full"
              role="table"
              aria-label="Monthly breakdown of investment growth"
            >
              <caption className="sr-only">
                Monthly breakdown showing interest earned and balance for your
                term deposit
              </caption>
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-medium text-gray-900"
                  >
                    {UI_TEXT.TABLE_HEADERS.MONTH}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-medium text-gray-900"
                  >
                    {UI_TEXT.TABLE_HEADERS.INTEREST_RATE}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-medium text-gray-900"
                  >
                    {UI_TEXT.TABLE_HEADERS.INTEREST_EARNED}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-medium text-gray-900"
                  >
                    {UI_TEXT.TABLE_HEADERS.BALANCE}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schedule.map((row) => (
                  <tr
                    key={row.month}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td
                      className="px-6 py-4 text-sm font-medium text-gray-900"
                      scope="row"
                    >
                      {row.month}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {row.annualRate.toFixed(UI_CONFIG.DECIMAL_PLACES)}%
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">
                      {row.interest.toLocaleString(UI_CONFIG.CURRENCY.LOCALE, {
                        style: "currency",
                        currency: UI_CONFIG.CURRENCY.CODE,
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {row.balance.toLocaleString(UI_CONFIG.CURRENCY.LOCALE, {
                        style: "currency",
                        currency: UI_CONFIG.CURRENCY.CODE,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Summary Box */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:h-full animate-in slide-in-from-right-3 fade-in duration-700 delay-200 flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-gray-900">
              Investment Summary
            </h3>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6 flex-1">
          {/* Final Balance */}
          <div>
            <h4
              id="final-balance-label"
              className="text-sm font-medium text-gray-600 mb-2"
            >
              {UI_TEXT.SUMMARY.FINAL_BALANCE}
            </h4>
            <div
              data-testid={TEST_IDS.FINAL_BALANCE}
              className="text-3xl font-bold text-green-600"
              aria-labelledby="final-balance-label"
              role="status"
            >
              $
              {Math.round(schedule[schedule.length - 1].balance).toLocaleString(
                UI_CONFIG.CURRENCY.LOCALE,
              )}
            </div>
          </div>

          {/* Total Interest */}
          <div>
            <h4
              id="total-interest-label"
              className="text-sm font-medium text-gray-600 mb-2"
            >
              {UI_TEXT.SUMMARY.TOTAL_INTEREST_EARNED}
            </h4>
            <div
              data-testid={TEST_IDS.TOTAL_INTEREST_EARNED}
              className="text-3xl font-bold text-blue-600"
              aria-labelledby="total-interest-label"
              role="status"
            >
              $
              {Math.round(
                schedule[schedule.length - 1].interest,
              ).toLocaleString(UI_CONFIG.CURRENCY.LOCALE)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ResultsDisplay = React.memo(ResultsDisplayComponent);
