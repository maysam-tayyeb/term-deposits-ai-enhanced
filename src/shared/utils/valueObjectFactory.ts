import type { Brand } from "../types/brandedTypes";

/**
 * Configuration for creating a value object factory
 */
export interface ValueObjectConfig<_T extends number & Brand<number, string>> {
  /** Minimum allowed value (inclusive) */
  min: number;
  /** Maximum allowed value (inclusive) */
  max: number;
  /** Function to format the value for display (e.g., "$1,000" or "5.50%") */
  formatValue?: (value: number) => string;
  /** Function to format boundary values for error messages */
  formatDescription?: (value: number) => string;
  /** Human-readable name for the value type (e.g., "Principal amount", "Interest rate") */
  displayName: string;
  /** Additional validation function (e.g., check for NaN, finite) */
  customValidation?: (value: number) => string | null; // Returns error message or null if valid
}

/**
 * Creates a factory function for value objects with consistent validation
 * 
 * Example usage:
 * ```typescript
 * type UserId = Brand<number, "UserId">;
 * 
 * const createUserId = createValueObjectFactory<UserId>({
 *   min: 1,
 *   max: 999999,
 *   displayName: "User ID",
 *   formatValue: (v) => `#${v}`,
 * });
 * 
 * const userId = createUserId(123); // Returns UserId
 * ```
 */
export function createValueObjectFactory<T extends number & Brand<number, string>>(
  config: ValueObjectConfig<T>
) {
  return function createValueObject(value: number): T {
    // Custom validation first (e.g., NaN check)
    if (config.customValidation) {
      const customError = config.customValidation(value);
      if (customError) {
        throw new RangeError(customError);
      }
    }

    // Range validation
    if (value < config.min || value > config.max) {
      const minDesc = config.formatDescription?.(config.min) ?? config.min.toString();
      const maxDesc = config.formatDescription?.(config.max) ?? config.max.toString();
      const valueDesc = config.formatValue?.(value) ?? value.toString();
      
      throw new RangeError(
        `${config.displayName} must be between ${minDesc} and ${maxDesc}. Received: ${valueDesc}`
      );
    }

    return value as T;
  };
}

/**
 * Helper to create standard number validation that checks for NaN and finite values
 */
export function createNumberValidation(displayName: string) {
  return function validateNumber(value: number): string | null {
    if (isNaN(value) || !isFinite(value)) {
      return `${displayName} must be a valid number. Received: ${value}`;
    }
    return null;
  };
}

/**
 * Helper to create percentage formatter
 */
export function createPercentageFormatter(decimalPlaces: number = 2) {
  return (value: number) => `${value.toFixed(decimalPlaces)}%`;
}

/**
 * Helper to create currency formatter
 */
export function createCurrencyFormatter(locale: string = 'en-US', currency: string = 'USD') {
  return (value: number) => value.toLocaleString(locale, { 
    style: 'currency', 
    currency 
  });
}

/**
 * Helper to create unit formatter (e.g., "5 months", "1 month")
 */
export function createUnitFormatter(singular: string, plural?: string) {
  return (value: number) => {
    const unit = value === 1 ? singular : (plural ?? `${singular}s`);
    return `${value} ${unit}`;
  };
}