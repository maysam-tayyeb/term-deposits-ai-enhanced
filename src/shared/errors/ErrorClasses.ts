import { BaseError } from "./BaseError";
import { ErrorType, ErrorSeverity, type ErrorContext } from "./types";

/**
 * Error for validation failures (user input, data validation, etc.)
 */
export class ValidationError extends BaseError {
  public readonly field: string;
  public readonly value: unknown;

  constructor(
    field: string,
    value: unknown,
    message: string,
    userMessage: string,
    context: ErrorContext,
  ) {
    super(message, userMessage, ErrorType.VALIDATION, ErrorSeverity.MEDIUM, context);
    this.field = field;
    this.value = value;
  }
}

/**
 * Error for calculation/computation failures
 */
export class CalculationError extends BaseError {
  public readonly calculationType: string;

  constructor(
    calculationType: string,
    message: string,
    userMessage: string,
    context: ErrorContext,
    severity: ErrorSeverity = ErrorSeverity.HIGH,
  ) {
    super(message, userMessage, ErrorType.CALCULATION, severity, context);
    this.calculationType = calculationType;
  }
}

/**
 * Error for network/API failures
 */
export class NetworkError extends BaseError {
  public readonly endpoint?: string;
  public readonly statusCode?: number;

  constructor(
    message: string,
    userMessage: string,
    context: ErrorContext,
    endpoint?: string,
    statusCode?: number,
  ) {
    super(message, userMessage, ErrorType.NETWORK, ErrorSeverity.MEDIUM, context);
    this.endpoint = endpoint;
    this.statusCode = statusCode;
  }
}

/**
 * Error for unexpected/unknown failures
 */
export class UnknownError extends BaseError {
  public readonly originalError: unknown;

  constructor(
    originalError: unknown,
    message: string,
    userMessage: string,
    context: ErrorContext,
  ) {
    super(message, userMessage, ErrorType.UNKNOWN, ErrorSeverity.HIGH, context);
    this.originalError = originalError;
  }
}