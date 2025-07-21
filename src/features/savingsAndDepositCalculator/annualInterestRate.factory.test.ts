import { describe, test, expect } from "vitest";
import {
  MIN_ALLOWED_INTEREST_RATE,
  MAX_ALLOWED_INTEREST_RATE,
  DESCRIPTION_MIN_ALLOWED_INTEREST_RATE,
  DESCRIPTION_MAX_ALLOWED_INTEREST_RATE,
  createAnnualInterestRate,
} from "./annualInterestRate.factory.ts";

describe("Annual interest rate factory", () => {
  test("should return a branded AnnualInterestRate for valid input", () => {
    const validValue = 6;
    const result = createAnnualInterestRate(validValue);

    expect(result).toBe(validValue);

    const asNumber: number = result;
    expect(asNumber).toBe(validValue);
  });

  test(`should accept exactly ${DESCRIPTION_MIN_ALLOWED_INTEREST_RATE} as minimum`, () => {
    expect(() => createAnnualInterestRate(0)).not.toThrow();
  });

  test(`should accept exactly ${DESCRIPTION_MAX_ALLOWED_INTEREST_RATE} as maximum`, () => {
    expect(() =>
      createAnnualInterestRate(MAX_ALLOWED_INTEREST_RATE),
    ).not.toThrow();
  });

  test(`should throw RangeError when value is below ${DESCRIPTION_MIN_ALLOWED_INTEREST_RATE}`, () => {
    expect(() =>
      createAnnualInterestRate(MIN_ALLOWED_INTEREST_RATE - 1),
    ).toThrow(RangeError);
  });

  test(`should throw RangeError when value exceeds ${DESCRIPTION_MAX_ALLOWED_INTEREST_RATE}`, () => {
    expect(() =>
      createAnnualInterestRate(MAX_ALLOWED_INTEREST_RATE + 1),
    ).toThrow(RangeError);
  });
});
