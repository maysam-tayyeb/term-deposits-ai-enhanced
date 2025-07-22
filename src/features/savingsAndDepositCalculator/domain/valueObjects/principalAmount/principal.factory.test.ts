import { describe, it, expect } from "vitest";
import {
  createPrincipalAmount,
  MIN_ALLOWED_PRINCIPAL,
  MAX_ALLOWED_PRINCIPAL,
  DESCRIPTION_MIN_ALLOWED_PRINCIPAL,
  DESCRIPTION_MAX_ALLOWED_PRINCIPAL,
} from "./principal.factory";

describe("createPrincipalAmount", () => {
  it("should create a valid principal amount for values within range", () => {
    expect(createPrincipalAmount(1)).toBe(1);
    expect(createPrincipalAmount(1000)).toBe(1000);
    expect(createPrincipalAmount(10000)).toBe(10000);
    expect(createPrincipalAmount(1000000)).toBe(1000000);
    expect(createPrincipalAmount(MAX_ALLOWED_PRINCIPAL)).toBe(MAX_ALLOWED_PRINCIPAL);
  });

  it("should throw RangeError for values below minimum", () => {
    expect(() => createPrincipalAmount(0)).toThrow(RangeError);
    expect(() => createPrincipalAmount(-1)).toThrow(RangeError);
    expect(() => createPrincipalAmount(-1000)).toThrow(RangeError);
    
    expect(() => createPrincipalAmount(0)).toThrow(
      `Principal amount must be between ${DESCRIPTION_MIN_ALLOWED_PRINCIPAL} and ${DESCRIPTION_MAX_ALLOWED_PRINCIPAL}. Received: $0`
    );
  });

  it("should throw RangeError for values above maximum", () => {
    const tooHigh = MAX_ALLOWED_PRINCIPAL + 1;
    expect(() => createPrincipalAmount(tooHigh)).toThrow(RangeError);
    expect(() => createPrincipalAmount(50000000)).toThrow(RangeError);
    
    expect(() => createPrincipalAmount(tooHigh)).toThrow(
      `Principal amount must be between ${DESCRIPTION_MIN_ALLOWED_PRINCIPAL} and ${DESCRIPTION_MAX_ALLOWED_PRINCIPAL}. Received: $${tooHigh.toLocaleString()}`
    );
  });

  it("should throw RangeError for invalid numeric values", () => {
    expect(() => createPrincipalAmount(NaN)).toThrow(RangeError);
    expect(() => createPrincipalAmount(Infinity)).toThrow(RangeError);
    expect(() => createPrincipalAmount(-Infinity)).toThrow(RangeError);
    
    expect(() => createPrincipalAmount(NaN)).toThrow(
      "Principal amount must be a valid number. Received: NaN"
    );
    expect(() => createPrincipalAmount(Infinity)).toThrow(
      "Principal amount must be a valid number. Received: Infinity"
    );
  });

  it("should handle decimal values correctly", () => {
    expect(createPrincipalAmount(1.5)).toBe(1.5);
    expect(createPrincipalAmount(999.99)).toBe(999.99);
    expect(createPrincipalAmount(1000000.01)).toBe(1000000.01);
  });

  it("should validate boundary values", () => {
    expect(createPrincipalAmount(MIN_ALLOWED_PRINCIPAL)).toBe(MIN_ALLOWED_PRINCIPAL);
    expect(createPrincipalAmount(MAX_ALLOWED_PRINCIPAL)).toBe(MAX_ALLOWED_PRINCIPAL);
    
    expect(() => createPrincipalAmount(MIN_ALLOWED_PRINCIPAL - 0.01)).toThrow(RangeError);
    expect(() => createPrincipalAmount(MAX_ALLOWED_PRINCIPAL + 0.01)).toThrow(RangeError);
  });
});