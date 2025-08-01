/**
 * Calculator-specific error handling using shared error system
 * Re-exports from shared error system for backward compatibility
 */

// Re-export all classes and interfaces
export {
  BaseError as BaseCalculatorError,
  ValidationError,
  CalculationError,
  NetworkError,
  UnknownError,
  ErrorFactory,
  ErrorService,
  ConsoleErrorLogger,
} from "@shared/errors";

// Re-export types
export type { ErrorContext, ErrorLogger } from "@shared/errors";

// Import and re-export constant values for backward compatibility
import {
  type ErrorType as ErrorTypeType,
  type ErrorSeverity as ErrorSeverityType,
  ErrorTypeValues,
  ErrorSeverityValues,
  ConsoleErrorLogger,
} from "@shared/errors";

// Export types with original names
export type ErrorType = ErrorTypeType;
export type ErrorSeverity = ErrorSeverityType;

// Export values with original names to maintain backward compatibility
export const ErrorType = ErrorTypeValues;
export const ErrorSeverity = ErrorSeverityValues;

// For backward compatibility, create a calculator-specific logger
export class CalculatorConsoleErrorLogger extends ConsoleErrorLogger {
  constructor() {
    super("Calculator");
  }
}
