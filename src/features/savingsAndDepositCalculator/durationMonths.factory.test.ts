import { describe, test, expect } from "vitest";
import {
  MIN_ALLOWED_COMPOUNDING_MONTHS,
  MAX_ALLOWED_COMPOUNDING_MONTHS,
  createDurationMonths,
} from "./durationMonths.factory.ts";

describe("Duration Months factory", () => {
  test("should return a branded DurationMonths for valid input", () => {
    const validValue = 6;
    const result = createDurationMonths(validValue);

    expect(result).toBe(validValue);

    const asNumber: number = result;
    expect(asNumber).toBe(validValue);
  });

  test(`should accept exactly ${MIN_ALLOWED_COMPOUNDING_MONTHS} month as minimum`, () => {
    expect(() =>
      createDurationMonths(MIN_ALLOWED_COMPOUNDING_MONTHS),
    ).not.toThrow();
  });

  test(`should accept exactly ${MAX_ALLOWED_COMPOUNDING_MONTHS} months as maximum`, () => {
    expect(() =>
      createDurationMonths(MAX_ALLOWED_COMPOUNDING_MONTHS),
    ).not.toThrow();
  });

  test(`should throw RangeError when value is below ${MIN_ALLOWED_COMPOUNDING_MONTHS}`, () => {
    expect(() =>
      createDurationMonths(MIN_ALLOWED_COMPOUNDING_MONTHS - 1),
    ).toThrow(RangeError);
  });

  test(`should throw RangeError when value exceeds ${MAX_ALLOWED_COMPOUNDING_MONTHS}`, () => {
    expect(() =>
      createDurationMonths(MAX_ALLOWED_COMPOUNDING_MONTHS + 1),
    ).toThrow(RangeError);
  });
});
