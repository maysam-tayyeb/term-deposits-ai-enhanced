import React from "react";
import type { CalculationResult } from "../../domain/types";
import { UI_CONFIG, UI_TEXT, TEST_IDS } from "../../config/constants";

interface ResultsDisplayProps {
  schedule: CalculationResult[];
}

export function ResultsDisplay({ schedule }: ResultsDisplayProps): React.JSX.Element {
  if (schedule.length === 0) {
    return <></>;
  }

  return (
    <div className="flex gap-4">
      <div className="max-h-[32rem] overflow-y-auto flex-2">
        <h2 className="text-xl font-bold mb-4">
          {UI_TEXT.TABLE_HEADERS.PROJECTED_SAVINGS}
        </h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1 text-left">
                {UI_TEXT.TABLE_HEADERS.MONTH}
              </th>
              <th className="border px-2 py-1 text-left">
                {UI_TEXT.TABLE_HEADERS.INTEREST_RATE}
              </th>
              <th className="border px-2 py-1 text-left">
                {UI_TEXT.TABLE_HEADERS.INTEREST_EARNED}
              </th>
              <th className="border px-2 py-1 text-left">
                {UI_TEXT.TABLE_HEADERS.BALANCE}
              </th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row) => (
              <tr key={row.month}>
                <td className="border px-2 py-1">{row.month}</td>
                <td className="border px-2 py-1">
                  {row.annualRate.toFixed(UI_CONFIG.DECIMAL_PLACES)}%
                </td>
                <td className="border px-2 py-1">
                  {row.interest.toLocaleString(UI_CONFIG.CURRENCY.LOCALE, {
                    style: "currency",
                    currency: UI_CONFIG.CURRENCY.CODE,
                  })}
                </td>
                <td className="border px-2 py-1">
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
      <div className="flex flex-col justify-start border p-4 flex-1">
        <div>
          <span className="font-medium text-[#de313b]">
            {UI_TEXT.SUMMARY.FINAL_BALANCE}
          </span>
          <span
            data-testid={TEST_IDS.FINAL_BALANCE}
            className="block font-bold text-4xl mt-1"
          >
            <span className="text-2xl align-top">$</span>
            {Math.round(
              schedule[schedule.length - 1].balance,
            ).toLocaleString(UI_CONFIG.CURRENCY.LOCALE, {
              currency: UI_CONFIG.CURRENCY.CODE,
            })}
          </span>
        </div>
        <div className="mb-2">
          <span className="font-medium text-[#de313b]">
            {UI_TEXT.SUMMARY.TOTAL_INTEREST_EARNED}
          </span>
          <span
            data-testid={TEST_IDS.TOTAL_INTEREST_EARNED}
            className="block font-bold text-4xl mt-1"
          >
            <span className="text-2xl align-top">$</span>
            {Math.round(
              schedule[schedule.length - 1].interest,
            ).toLocaleString(UI_CONFIG.CURRENCY.LOCALE, {
              currency: UI_CONFIG.CURRENCY.CODE,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}