import { describe, it, expect } from "vitest";
import {
  validatePrincipal,
  validateInterestRate,
  validateDuration,
} from "./inputValidation";

describe("Input Validation", () => {
  describe("validatePrincipal", () => {
    it("should accept valid principal amounts", () => {
      expect(validatePrincipal(1000)).toEqual({ isValid: true });
      expect(validatePrincipal(10000)).toEqual({ isValid: true });
      expect(validatePrincipal(5000000)).toEqual({ isValid: true });
    });

    it("should reject NaN values", () => {
      const result = validatePrincipal(NaN);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Please enter a valid amount");
    });

    it("should reject zero values", () => {
      const result = validatePrincipal(0);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Please enter a valid amount");
    });

    it("should reject values below minimum", () => {
      const result = validatePrincipal(0.5);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("must be at least");
    });

    it("should reject values above maximum", () => {
      const result = validatePrincipal(10_000_001);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("cannot exceed");
    });
  });

  describe("validateInterestRate", () => {
    it("should accept valid interest rates", () => {
      expect(validateInterestRate(0)).toEqual({ isValid: true });
      expect(validateInterestRate(5.5)).toEqual({ isValid: true });
      expect(validateInterestRate(15)).toEqual({ isValid: true });
    });

    it("should reject NaN values", () => {
      const result = validateInterestRate(NaN);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Please enter a valid interest rate");
    });

    it("should reject negative values", () => {
      const result = validateInterestRate(-1);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("must be at least");
    });

    it("should reject values above maximum", () => {
      const result = validateInterestRate(15.01);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("cannot exceed");
    });
  });

  describe("validateDuration", () => {
    it("should accept valid durations", () => {
      expect(validateDuration(3)).toEqual({ isValid: true });
      expect(validateDuration(12)).toEqual({ isValid: true });
      expect(validateDuration(60)).toEqual({ isValid: true });
      expect(validateDuration(120)).toEqual({ isValid: true });
    });

    it("should reject NaN values", () => {
      const result = validateDuration(NaN);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Please enter a valid duration");
    });

    it("should reject zero values", () => {
      const result = validateDuration(0);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Please enter a valid duration");
    });

    it("should reject non-integer values", () => {
      const result = validateDuration(3.5);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Duration must be a whole number of months");
    });

    it("should reject values below minimum", () => {
      const result = validateDuration(2);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("must be at least");
    });

    it("should reject values above maximum", () => {
      const result = validateDuration(121);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("cannot exceed");
    });
  });
});
