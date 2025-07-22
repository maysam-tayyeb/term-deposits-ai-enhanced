import { useEffect, useState } from "react";

import {
  createDurationMonths,
  MAX_ALLOWED_COMPOUNDING_MONTHS,
  MIN_ALLOWED_COMPOUNDING_MONTHS,
} from "./durationMonths.factory.ts";
import {
  calculateMonthlyCompounding,
  calculateQuarterlyCompounding,
  calculateAnnuallyCompounding,
  calculateAtMaturity,
} from "./compoundingInterestCalculators";
import type {
  CalculationResult,
  PayFrequency,
} from "./compoundingInterestCalculators.types";
import {
  createAnnualInterestRate,
  DESCRIPTION_MAX_ALLOWED_INTEREST_RATE,
  DESCRIPTION_MIN_ALLOWED_INTEREST_RATE,
  MAX_ALLOWED_INTEREST_RATE,
  MIN_ALLOWED_INTEREST_RATE,
} from "./annualInterestRate.factory.ts";
import {
  createPrincipalAmount,
  DESCRIPTION_MAX_ALLOWED_PRINCIPAL,
  DESCRIPTION_MIN_ALLOWED_PRINCIPAL,
  MAX_ALLOWED_PRINCIPAL,
  MIN_ALLOWED_PRINCIPAL,
} from "./principal.factory.ts";
import {
  DEFAULT_VALUES,
  UI_CONFIG,
  UI_TEXT,
  FREQUENCY_OPTIONS,
  TEST_IDS,
} from "./SavingsAndDepositCalculator.constants";

export function SavingsAndDepositCalculator() {
  const [principal, setPrincipal] = useState<number>(DEFAULT_VALUES.PRINCIPAL);
  const [annualRate, setAnnualRate] = useState<number>(
    DEFAULT_VALUES.INTEREST_RATE,
  );
  const [months, setMonths] = useState<number>(
    DEFAULT_VALUES.INVESTMENT_TERM_MONTHS,
  );
  const [frequency, setFrequency] = useState<PayFrequency>(
    DEFAULT_VALUES.FREQUENCY,
  );
  const [schedule, setSchedule] = useState<CalculationResult[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setError("");
    try {
      const principalAmount = createPrincipalAmount(principal);
      const annualInterestRate = createAnnualInterestRate(annualRate);
      const duration = createDurationMonths(months);
      let result: CalculationResult[];
      switch (frequency) {
        case "monthly":
          result = calculateMonthlyCompounding(
            principalAmount,
            annualInterestRate,
            duration,
          );
          break;
        case "quarterly":
          result = calculateQuarterlyCompounding(
            principalAmount,
            annualInterestRate,
            duration,
          );
          break;
        case "annually":
          result = calculateAnnuallyCompounding(
            principalAmount,
            annualInterestRate,
            duration,
          );
          break;
        case "atMaturity":
          result = calculateAtMaturity(principalAmount, annualInterestRate, duration);
          break;
      }
      setSchedule(result);
    } catch (e) {
      if (e instanceof RangeError) {
        setError(e.message);
        setSchedule([]);
      } else {
        console.error("Unknown error occurred:", e);
        setError(UI_TEXT.ERROR_MESSAGES.UNKNOWN_ERROR);
      }
    }
  }, [annualRate, frequency, months, principal]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-[#de313b]">
        {UI_TEXT.TITLE}
      </h1>
      {error && (
        <div data-testid={TEST_IDS.ERROR} className="text-red-600 mb-4">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {UI_TEXT.LABELS.PRINCIPAL}
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(parseFloat(e.target.value))}
            min={MIN_ALLOWED_PRINCIPAL}
            max={MAX_ALLOWED_PRINCIPAL}
            className="w-full border rounded p-2"
            data-testid={TEST_IDS.PRINCIPAL_INPUT}
          />
          <p className="text-xs text-gray-500">
            Min {DESCRIPTION_MIN_ALLOWED_PRINCIPAL} and max{" "}
            {DESCRIPTION_MAX_ALLOWED_PRINCIPAL}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {UI_TEXT.LABELS.INTEREST_RATE}
          </label>
          <input
            type="number"
            step={UI_CONFIG.INTEREST_RATE_STEP}
            value={annualRate}
            onChange={(e) => setAnnualRate(parseFloat(e.target.value))}
            min={MIN_ALLOWED_INTEREST_RATE}
            max={MAX_ALLOWED_INTEREST_RATE}
            className="w-full border rounded p-2"
            data-testid={TEST_IDS.INTEREST_RATE_INPUT}
          />
          <p className="text-xs text-gray-500">
            Min {DESCRIPTION_MIN_ALLOWED_INTEREST_RATE} and max{" "}
            {DESCRIPTION_MAX_ALLOWED_INTEREST_RATE}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {UI_TEXT.LABELS.INVESTMENT_TERM}
          </label>
          <input
            type="number"
            value={months}
            onChange={(e) => setMonths(parseInt(e.target.value, 10))}
            min={MIN_ALLOWED_COMPOUNDING_MONTHS}
            max={MAX_ALLOWED_COMPOUNDING_MONTHS}
            className="w-full border rounded p-2"
            data-testid={TEST_IDS.INVESTMENT_TERM_INPUT}
          />
          <p className="text-xs text-gray-500">
            Min {MIN_ALLOWED_COMPOUNDING_MONTHS} and max{" "}
            {MAX_ALLOWED_COMPOUNDING_MONTHS} months
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {UI_TEXT.LABELS.INTEREST_PAID}
          </label>
          <div className="flex gap-4">
            {FREQUENCY_OPTIONS.map((opt) => (
              <label key={opt.value} className="inline-flex items-center">
                <input
                  type="radio"
                  name="frequency"
                  value={opt.value}
                  checked={frequency === opt.value}
                  onChange={() => setFrequency(opt.value)}
                  className="form-radio mr-2"
                  data-testid={`${TEST_IDS.RADIO_PREFIX}${opt.value.toLowerCase()}`}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>
      {schedule.length > 0 && (
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
      )}
    </div>
  );
}
