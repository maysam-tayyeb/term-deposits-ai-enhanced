import { round } from "../../utils/currency.ts";
import type {
  AnnualInterestRate,
  DurationMonths,
  CalculationResult,
  PeriodicFrequency,
} from "./compoundingInterestCalculators.types.ts";

export const compoundingPeriods: Record<PeriodicFrequency, number> = {
  monthly: 12,
  quarterly: 4,
  annually: 1,
};

/**
 * Internal helper: calculates the raw balance for a given month using the compound interest formula.
 */
const calculateRawBalanceForMonth = (
  principal: number,
  rate: number,
  targetMonth: number,
  reInvestFrequency: number,
): number => {
  const p = principal;
  const r = rate;
  const n = reInvestFrequency;
  const t = targetMonth / 12;

  //The compound interest formula.
  return p * Math.pow(1 + r / n, n * t);
};

export function calculateCompoundingInterestAmounts(
  principal: number,
  annualRate: AnnualInterestRate,
  months: DurationMonths,
  reInvestFrequency: number,
): CalculationResult[] {
  const schedule: CalculationResult[] = [];
  const rate = annualRate / 100;

  for (let month = 1; month <= months; month++) {
    const balanceForMonth = calculateRawBalanceForMonth(
      principal,
      rate,
      month,
      reInvestFrequency,
    );

    schedule.push({
      month,
      annualRate,
      interest: round(balanceForMonth - principal),
      balance: round(balanceForMonth),
    });
  }

  return schedule;
}

export function calculateMonthlyCompounding(
  principal: number,
  annualRate: AnnualInterestRate,
  months: DurationMonths,
): CalculationResult[] {
  return calculateCompoundingInterestAmounts(
    principal,
    annualRate,
    months,
    compoundingPeriods.monthly,
  );
}

export function calculateQuarterlyCompounding(
  principal: number,
  annualRate: AnnualInterestRate,
  months: DurationMonths,
): CalculationResult[] {
  return calculateCompoundingInterestAmounts(
    principal,
    annualRate,
    months,
    compoundingPeriods.quarterly,
  );
}

export function calculateAnnuallyCompounding(
  principal: number,
  annualRate: AnnualInterestRate,
  months: DurationMonths,
): CalculationResult[] {
  return calculateCompoundingInterestAmounts(
    principal,
    annualRate,
    months,
    compoundingPeriods.annually,
  );
}

export function calculateAtMaturity(
  principal: number,
  annualRate: AnnualInterestRate,
  months: DurationMonths,
): CalculationResult[] {
  const reInvestmentFrequency = 12 / months;

  return calculateCompoundingInterestAmounts(
    principal,
    annualRate,
    months,
    reInvestmentFrequency,
  );
}
