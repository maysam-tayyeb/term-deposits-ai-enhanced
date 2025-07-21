import { describe, expect, test } from "vitest";
import {
  calculateMonthlyCompounding,
  calculateQuarterlyCompounding,
  calculateAnnuallyCompounding,
  calculateAtMaturity,
  compoundingPeriods,
  calculateCompoundingInterestAmounts,
} from "./compoundingInterestCalculators.ts";
import {
  MIN_ALLOWED_INTEREST_RATE,
  MAX_ALLOWED_INTEREST_RATE,
  DESCRIPTION_MIN_ALLOWED_INTEREST_RATE,
  DESCRIPTION_MAX_ALLOWED_INTEREST_RATE,
  createAnnualInterestRate,
} from "./annualInterestRate.factory.ts";
import {
  MIN_ALLOWED_COMPOUNDING_MONTHS,
  MAX_ALLOWED_COMPOUNDING_MONTHS,
  createDurationMonths,
} from "./durationMonths.factory.ts";

describe("Calculate compounding interest amounts", () => {
  describe("throws range error when", () => {
    describe("duration months", () => {
      test(`is below ${MIN_ALLOWED_COMPOUNDING_MONTHS}`, () => {
        const belowRange = MIN_ALLOWED_COMPOUNDING_MONTHS - 1;

        expect(() => {
          const durationMonths = createDurationMonths(belowRange);
          calculateCompoundingInterestAmounts(
            10_000,
            createAnnualInterestRate(1.8),
            durationMonths,
            compoundingPeriods.monthly,
          );
        }).toThrow(RangeError);
      });

      test(`exceed ${MAX_ALLOWED_COMPOUNDING_MONTHS}`, () => {
        const exceedingMaxMonths = MAX_ALLOWED_COMPOUNDING_MONTHS + 1;

        expect(() => {
          const durationMonths = createDurationMonths(exceedingMaxMonths);
          calculateCompoundingInterestAmounts(
            10_000,
            createAnnualInterestRate(1.8),
            durationMonths,
            compoundingPeriods.monthly,
          );
        }).toThrow(RangeError);
      });
    });

    describe("annual interest rate", () => {
      test(`is below ${DESCRIPTION_MIN_ALLOWED_INTEREST_RATE}`, () => {
        const belowRange = MIN_ALLOWED_INTEREST_RATE - 1;

        expect(() => {
          const annualInterestRate = createAnnualInterestRate(belowRange);
          calculateCompoundingInterestAmounts(
            10_000,
            annualInterestRate,
            createDurationMonths(3),
            compoundingPeriods.monthly,
          );
        }).toThrow(RangeError);
      });

      test(`exceed ${DESCRIPTION_MAX_ALLOWED_INTEREST_RATE}`, () => {
        const exceedingAllowedInterestRate = MAX_ALLOWED_INTEREST_RATE + 1;

        expect(() => {
          const annualInterestRate = createAnnualInterestRate(
            exceedingAllowedInterestRate,
          );
          calculateCompoundingInterestAmounts(
            10_000,
            annualInterestRate,
            createDurationMonths(3),
            compoundingPeriods.monthly,
          );
        }).toThrow(RangeError);
      });
    });
  });

  test("for 3 months @ 1.8 re-invest monthly", () => {
    const durationMonths = createDurationMonths(3);
    const schedule = calculateCompoundingInterestAmounts(
      10_000,
      createAnnualInterestRate(1.8),
      durationMonths,
      compoundingPeriods.monthly,
    );
    expect(schedule).toHaveLength(durationMonths);
    expect(schedule).toStrictEqual([
      {
        annualRate: 1.8,
        balance: 10015,
        interest: 15,
        month: 1,
      },
      {
        annualRate: 1.8,
        balance: 10030.02,
        interest: 30.02,
        month: 2,
      },
      {
        annualRate: 1.8,
        balance: 10045.07,
        interest: 45.07,
        month: 3,
      },
    ]);
  });
});

describe("Term deposit", () => {
  describe("calculate monthly compounding", () => {
    test("3 months @ 1.20%", () => {
      expect(
        calculateMonthlyCompounding(
          10_000,
          createAnnualInterestRate(1.2),
          createDurationMonths(3),
        ),
      ).toStrictEqual([
        {
          annualRate: 1.2,
          balance: 10010,
          interest: 10,
          month: 1,
        },
        {
          annualRate: 1.2,
          balance: 10020.01,
          interest: 20.01,
          month: 2,
        },
        {
          annualRate: 1.2,
          balance: 10030.03,
          interest: 30.03,
          month: 3,
        },
      ]);
    });

    test("5 months @ 1.20%", () => {
      expect(
        calculateMonthlyCompounding(
          10_000,
          createAnnualInterestRate(1.2),
          createDurationMonths(5),
        ),
      ).toStrictEqual([
        {
          annualRate: 1.2,
          balance: 10010,
          interest: 10,
          month: 1,
        },
        {
          annualRate: 1.2,
          balance: 10020.01,
          interest: 20.01,
          month: 2,
        },
        {
          annualRate: 1.2,
          balance: 10030.03,
          interest: 30.03,
          month: 3,
        },
        {
          annualRate: 1.2,
          balance: 10040.06,
          interest: 40.06,
          month: 4,
        },
        {
          annualRate: 1.2,
          balance: 10050.1,
          interest: 50.1,
          month: 5,
        },
      ]);
    });
  });

  describe("calculate quarterly compounding", () => {
    test("10,000 for 3 months term @ 1.20%", () => {
      expect(
        calculateQuarterlyCompounding(
          10_000,
          createAnnualInterestRate(1.2),
          createDurationMonths(3),
        ),
      ).toStrictEqual([
        {
          annualRate: 1.2,
          balance: 10_009.99,
          interest: 9.99,
          month: 1,
        },
        {
          annualRate: 1.2,
          balance: 10_019.99,
          interest: 19.99,
          month: 2,
        },
        {
          annualRate: 1.2,
          balance: 10_030.0,
          interest: 30.0,
          month: 3,
        },
      ]);
    });

    test("3 months term @ 3.40%", () => {
      expect(
        calculateQuarterlyCompounding(
          600_000,
          createAnnualInterestRate(3.4),
          createDurationMonths(3),
        ),
      ).toStrictEqual([
        {
          annualRate: 3.4,
          balance: 601695.21,
          interest: 1695.21,
          month: 1,
        },
        {
          annualRate: 3.4,
          balance: 603395.2,
          interest: 3395.2,
          month: 2,
        },
        {
          annualRate: 3.4,
          balance: 605100,
          interest: 5100,
          month: 3,
        },
      ]);
    });

    test("5 months term @ 3.40%", () => {
      expect(
        calculateQuarterlyCompounding(
          600_000,
          createAnnualInterestRate(3.4),
          createDurationMonths(5),
        ),
      ).toStrictEqual([
        {
          annualRate: 3.4,
          balance: 601695.21,
          interest: 1695.21,
          month: 1,
        },
        {
          annualRate: 3.4,
          balance: 603395.2,
          interest: 3395.2,
          month: 2,
        },
        {
          annualRate: 3.4,
          balance: 605100,
          interest: 5100,
          month: 3,
        },
        {
          annualRate: 3.4,
          balance: 606809.62,
          interest: 6809.62,
          month: 4,
        },
        {
          annualRate: 3.4,
          balance: 608524.06,
          interest: 8524.06,
          month: 5,
        },
      ]);
    });
  });

  describe("calculate yearly compounding", () => {
    test("1 year term @ 1.20%", () => {
      expect(
        calculateAnnuallyCompounding(
          10_000,
          createAnnualInterestRate(1.2),
          createDurationMonths(12),
        ),
      ).toStrictEqual([
        {
          annualRate: 1.2,
          balance: 10009.95,
          interest: 9.95,
          month: 1,
        },
        {
          annualRate: 1.2,
          balance: 10019.9,
          interest: 19.9,
          month: 2,
        },
        {
          annualRate: 1.2,
          balance: 10029.87,
          interest: 29.87,
          month: 3,
        },
        {
          annualRate: 1.2,
          balance: 10039.84,
          interest: 39.84,
          month: 4,
        },
        {
          annualRate: 1.2,
          balance: 10049.83,
          interest: 49.83,
          month: 5,
        },
        {
          annualRate: 1.2,
          balance: 10059.82,
          interest: 59.82,
          month: 6,
        },
        {
          annualRate: 1.2,
          balance: 10069.83,
          interest: 69.83,
          month: 7,
        },
        {
          annualRate: 1.2,
          balance: 10079.84,
          interest: 79.84,
          month: 8,
        },
        {
          annualRate: 1.2,
          balance: 10089.87,
          interest: 89.87,
          month: 9,
        },
        {
          annualRate: 1.2,
          balance: 10099.9,
          interest: 99.9,
          month: 10,
        },
        {
          annualRate: 1.2,
          balance: 10109.95,
          interest: 109.95,
          month: 11,
        },
        {
          annualRate: 1.2,
          balance: 10120,
          interest: 120,
          month: 12,
        },
      ]);
    });

    test("1 year and two months term @ 1.20%", () => {
      expect(
        calculateAnnuallyCompounding(
          10_000,
          createAnnualInterestRate(1.2),
          createDurationMonths(14),
        ),
      ).toStrictEqual([
        {
          annualRate: 1.2,
          balance: 10009.95,
          interest: 9.95,
          month: 1,
        },
        {
          annualRate: 1.2,
          balance: 10019.9,
          interest: 19.9,
          month: 2,
        },
        {
          annualRate: 1.2,
          balance: 10029.87,
          interest: 29.87,
          month: 3,
        },
        {
          annualRate: 1.2,
          balance: 10039.84,
          interest: 39.84,
          month: 4,
        },
        {
          annualRate: 1.2,
          balance: 10049.83,
          interest: 49.83,
          month: 5,
        },
        {
          annualRate: 1.2,
          balance: 10059.82,
          interest: 59.82,
          month: 6,
        },
        {
          annualRate: 1.2,
          balance: 10069.83,
          interest: 69.83,
          month: 7,
        },
        {
          annualRate: 1.2,
          balance: 10079.84,
          interest: 79.84,
          month: 8,
        },
        {
          annualRate: 1.2,
          balance: 10089.87,
          interest: 89.87,
          month: 9,
        },
        {
          annualRate: 1.2,
          balance: 10099.9,
          interest: 99.9,
          month: 10,
        },
        {
          annualRate: 1.2,
          balance: 10109.95,
          interest: 109.95,
          month: 11,
        },
        {
          annualRate: 1.2,
          balance: 10120,
          interest: 120,
          month: 12,
        },
        {
          annualRate: 1.2,
          balance: 10130.06,
          interest: 130.06,
          month: 13,
        },
        {
          annualRate: 1.2,
          balance: 10140.14,
          interest: 140.14,
          month: 14,
        },
      ]);
    });

    test("3 years term @ 1.20%", () => {
      expect(
        calculateAnnuallyCompounding(
          10_000,
          createAnnualInterestRate(1.2),
          createDurationMonths(36),
        ),
      ).toStrictEqual([
        {
          annualRate: 1.2,
          balance: 10009.95,
          interest: 9.95,
          month: 1,
        },
        {
          annualRate: 1.2,
          balance: 10019.9,
          interest: 19.9,
          month: 2,
        },
        {
          annualRate: 1.2,
          balance: 10029.87,
          interest: 29.87,
          month: 3,
        },
        {
          annualRate: 1.2,
          balance: 10039.84,
          interest: 39.84,
          month: 4,
        },
        {
          annualRate: 1.2,
          balance: 10049.83,
          interest: 49.83,
          month: 5,
        },
        {
          annualRate: 1.2,
          balance: 10059.82,
          interest: 59.82,
          month: 6,
        },
        {
          annualRate: 1.2,
          balance: 10069.83,
          interest: 69.83,
          month: 7,
        },
        {
          annualRate: 1.2,
          balance: 10079.84,
          interest: 79.84,
          month: 8,
        },
        {
          annualRate: 1.2,
          balance: 10089.87,
          interest: 89.87,
          month: 9,
        },
        {
          annualRate: 1.2,
          balance: 10099.9,
          interest: 99.9,
          month: 10,
        },
        {
          annualRate: 1.2,
          balance: 10109.95,
          interest: 109.95,
          month: 11,
        },
        {
          annualRate: 1.2,
          balance: 10120,
          interest: 120,
          month: 12,
        },
        {
          annualRate: 1.2,
          balance: 10130.06,
          interest: 130.06,
          month: 13,
        },
        {
          annualRate: 1.2,
          balance: 10140.14,
          interest: 140.14,
          month: 14,
        },
        {
          annualRate: 1.2,
          balance: 10150.22,
          interest: 150.22,
          month: 15,
        },
        {
          annualRate: 1.2,
          balance: 10160.32,
          interest: 160.32,
          month: 16,
        },
        {
          annualRate: 1.2,
          balance: 10170.42,
          interest: 170.42,
          month: 17,
        },
        {
          annualRate: 1.2,
          balance: 10180.54,
          interest: 180.54,
          month: 18,
        },
        {
          annualRate: 1.2,
          balance: 10190.66,
          interest: 190.66,
          month: 19,
        },
        {
          annualRate: 1.2,
          balance: 10200.8,
          interest: 200.8,
          month: 20,
        },
        {
          annualRate: 1.2,
          balance: 10210.94,
          interest: 210.94,
          month: 21,
        },
        {
          annualRate: 1.2,
          balance: 10221.1,
          interest: 221.1,
          month: 22,
        },
        {
          annualRate: 1.2,
          balance: 10231.26,
          interest: 231.26,
          month: 23,
        },
        {
          annualRate: 1.2,
          balance: 10241.44,
          interest: 241.44,
          month: 24,
        },
        {
          annualRate: 1.2,
          balance: 10251.63,
          interest: 251.63,
          month: 25,
        },
        {
          annualRate: 1.2,
          balance: 10261.82,
          interest: 261.82,
          month: 26,
        },
        {
          annualRate: 1.2,
          balance: 10272.03,
          interest: 272.03,
          month: 27,
        },
        {
          annualRate: 1.2,
          balance: 10282.24,
          interest: 282.24,
          month: 28,
        },
        {
          annualRate: 1.2,
          balance: 10292.47,
          interest: 292.47,
          month: 29,
        },
        {
          annualRate: 1.2,
          balance: 10302.71,
          interest: 302.71,
          month: 30,
        },
        {
          annualRate: 1.2,
          balance: 10312.95,
          interest: 312.95,
          month: 31,
        },
        {
          annualRate: 1.2,
          balance: 10323.21,
          interest: 323.21,
          month: 32,
        },
        {
          annualRate: 1.2,
          balance: 10333.48,
          interest: 333.48,
          month: 33,
        },
        {
          annualRate: 1.2,
          balance: 10343.75,
          interest: 343.75,
          month: 34,
        },
        {
          annualRate: 1.2,
          balance: 10354.04,
          interest: 354.04,
          month: 35,
        },
        {
          annualRate: 1.2,
          balance: 10364.34,
          interest: 364.34,
          month: 36,
        },
      ]);
    });
  });

  describe("calculate at maturity", () => {
    test("3 months @ 1.20%", () => {
      expect(
        calculateAtMaturity(
          10_000,
          createAnnualInterestRate(1.2),
          createDurationMonths(3),
        ),
      ).toStrictEqual([
        {
          annualRate: 1.2,
          balance: 10_009.99,
          interest: 9.99,
          month: 1,
        },
        {
          annualRate: 1.2,
          balance: 10_019.99,
          interest: 19.99,
          month: 2,
        },
        {
          annualRate: 1.2,
          balance: 10_030.0,
          interest: 30.0,
          month: 3,
        },
      ]);
    });

    test("5 months @ 1.20%", () => {
      expect(
        calculateAtMaturity(
          10_000,
          createAnnualInterestRate(1.2),
          createDurationMonths(5),
        ),
      ).toStrictEqual([
        {
          annualRate: 1.2,
          balance: 10009.98,
          interest: 9.98,
          month: 1,
        },
        {
          annualRate: 1.2,
          balance: 10019.97,
          interest: 19.97,
          month: 2,
        },
        {
          annualRate: 1.2,
          balance: 10029.97,
          interest: 29.97,
          month: 3,
        },
        {
          annualRate: 1.2,
          balance: 10039.98,
          interest: 39.98,
          month: 4,
        },
        {
          annualRate: 1.2,
          balance: 10050,
          interest: 50,
          month: 5,
        },
      ]);
    });

    test("8 months @ 1.30%", () => {
      expect(
        calculateAtMaturity(
          10_000,
          createAnnualInterestRate(1.3),
          createDurationMonths(8),
        ),
      ).toStrictEqual([
        {
          annualRate: 1.3,
          balance: 10010.79,
          interest: 10.79,
          month: 1,
        },
        {
          annualRate: 1.3,
          balance: 10021.6,
          interest: 21.6,
          month: 2,
        },
        {
          annualRate: 1.3,
          balance: 10032.41,
          interest: 32.41,
          month: 3,
        },
        {
          annualRate: 1.3,
          balance: 10043.24,
          interest: 43.24,
          month: 4,
        },
        {
          annualRate: 1.3,
          balance: 10054.08,
          interest: 54.08,
          month: 5,
        },
        {
          annualRate: 1.3,
          balance: 10064.93,
          interest: 64.93,
          month: 6,
        },
        {
          annualRate: 1.3,
          balance: 10075.79,
          interest: 75.79,
          month: 7,
        },
        {
          annualRate: 1.3,
          balance: 10086.67,
          interest: 86.67,
          month: 8,
        },
      ]);
    });
  });
});
