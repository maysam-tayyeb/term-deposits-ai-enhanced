import React, { useState, useEffect, useRef } from "react";
import type { CalculationResult } from "../../domain/types";
import { UI_CONFIG, UI_TEXT } from "../../config/constants";

interface LazyResultsTableProps {
  schedule: CalculationResult[];
}

const INITIAL_ROWS = 12; // Show first year initially
const ROWS_PER_PAGE = 12; // Load 12 more rows each time

export function LazyResultsTable({ schedule }: LazyResultsTableProps): React.JSX.Element {
  const [visibleRows, setVisibleRows] = useState(INITIAL_ROWS);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleRows < schedule.length) {
          setVisibleRows((prev) => Math.min(prev + ROWS_PER_PAGE, schedule.length));
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [visibleRows, schedule.length]);

  const displayedSchedule = schedule.slice(0, visibleRows);

  return (
    <>
      <table className="w-full" role="table" aria-label="Monthly breakdown of investment growth">
        <caption className="sr-only">Monthly breakdown showing interest earned and balance for your term deposit</caption>
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-900">
              {UI_TEXT.TABLE_HEADERS.MONTH}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-900">
              {UI_TEXT.TABLE_HEADERS.INTEREST_RATE}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-900">
              {UI_TEXT.TABLE_HEADERS.INTEREST_EARNED}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-900">
              {UI_TEXT.TABLE_HEADERS.BALANCE}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {displayedSchedule.map((row) => (
            <tr key={row.month} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4 text-sm font-medium text-gray-900" scope="row">{row.month}</td>
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
      {visibleRows < schedule.length && (
        <div
          ref={observerTarget}
          className="p-4 text-center text-sm text-gray-500"
          aria-live="polite"
        >
          Loading more results... ({visibleRows} of {schedule.length} months shown)
        </div>
      )}
    </>
  );
}