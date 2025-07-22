import { ValidationError, CalculationError, NetworkError, UnknownError } from "./ErrorClasses";
import { ErrorSeverity, type ErrorContext } from "./types";

/**
 * Factory for creating appropriate error instances with consistent messaging
 */
export class ErrorFactory {
  /**
   * Create a validation error with user-friendly messaging
   */
  static createValidationError(
    field: string,
    value: unknown,
    message: string,
    context: ErrorContext,
  ): ValidationError {
    // Clean up the message for end users by removing technical field names
    const userMessage = message;
    return new ValidationError(field, value, message, userMessage, context);
  }

  /**
   * Create a calculation error with appropriate severity
   */
  static createCalculationError(
    calculationType: string,
    message: string,
    context: ErrorContext,
    severity: ErrorSeverity = ErrorSeverity.HIGH,
  ): CalculationError {
    const userMessage = "Unable to calculate results. Please check your input values and try again.";
    return new CalculationError(calculationType, message, userMessage, context, severity);
  }

  /**
   * Create a network error with optional endpoint and status information
   */
  static createNetworkError(
    message: string,
    context: ErrorContext,
    endpoint?: string,
    statusCode?: number,
  ): NetworkError {
    const userMessage = "Network error occurred. Please check your connection and try again.";
    return new NetworkError(message, userMessage, context, endpoint, statusCode);
  }

  /**
   * Create an unknown error from any thrown value
   */
  static createUnknownError(
    originalError: unknown,
    context: ErrorContext,
  ): UnknownError {
    const message = originalError instanceof Error ? originalError.message : String(originalError);
    const userMessage = "An unexpected error occurred. Please try again or contact support if the problem persists.";
    return new UnknownError(originalError, message, userMessage, context);
  }

  /**
   * Create error context with current timestamp
   */
  static createContext(
    component: string,
    action: string,
    additionalContext?: Record<string, unknown>
  ): ErrorContext {
    return {
      component,
      action,
      timestamp: new Date().toISOString(),
      ...additionalContext,
    };
  }
}