/**
 * Custom error types for the Term Deposit Calculator
 */

export type ErrorType = "VALIDATION" | "CALCULATION" | "NETWORK" | "UNKNOWN";

export type ErrorSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export const ErrorType = {
  VALIDATION: "VALIDATION",
  CALCULATION: "CALCULATION", 
  NETWORK: "NETWORK",
  UNKNOWN: "UNKNOWN",
} as const;

export const ErrorSeverity = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH", 
  CRITICAL: "CRITICAL",
} as const;

export interface ErrorContext {
  component: string;
  action: string;
  userInput?: Record<string, unknown>;
  timestamp: string;
}

export abstract class BaseCalculatorError extends Error {
  public readonly type: ErrorType;
  public readonly severity: ErrorSeverity;
  public readonly context: ErrorContext;
  public readonly userMessage: string;

  protected constructor(
    message: string,
    userMessage: string,
    type: ErrorType,
    severity: ErrorSeverity,
    context: ErrorContext,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.userMessage = userMessage;
    this.type = type;
    this.severity = severity;
    this.context = context;
  }
}

export class ValidationError extends BaseCalculatorError {
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

export class CalculationError extends BaseCalculatorError {
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

export class NetworkError extends BaseCalculatorError {
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

export class UnknownError extends BaseCalculatorError {
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

/**
 * Error factory to create appropriate error instances
 */
export class ErrorFactory {
  static createValidationError(
    field: string,
    value: unknown,
    message: string,
    context: ErrorContext,
  ): ValidationError {
    const userMessage = `Please check the ${field.toLowerCase()} value. ${message}`;
    return new ValidationError(field, value, message, userMessage, context);
  }

  static createCalculationError(
    calculationType: string,
    message: string,
    context: ErrorContext,
    severity: ErrorSeverity = ErrorSeverity.HIGH,
  ): CalculationError {
    const userMessage = "Unable to calculate results. Please check your input values and try again.";
    return new CalculationError(calculationType, message, userMessage, context, severity);
  }

  static createUnknownError(
    originalError: unknown,
    context: ErrorContext,
  ): UnknownError {
    const message = originalError instanceof Error ? originalError.message : String(originalError);
    const userMessage = "An unexpected error occurred. Please try again or contact support if the problem persists.";
    return new UnknownError(originalError, message, userMessage, context);
  }
}

/**
 * Error logging service
 */
export interface ErrorLogger {
  log(error: BaseCalculatorError): void;
}

export class ConsoleErrorLogger implements ErrorLogger {
  log(error: BaseCalculatorError): void {
    const logData = {
      name: error.name,
      message: error.message,
      userMessage: error.userMessage,
      type: error.type,
      severity: error.severity,
      context: error.context,
      stack: error.stack,
    };

    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        console.error("Calculator Error:", logData);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn("Calculator Warning:", logData);
        break;
      case ErrorSeverity.LOW:
        console.info("Calculator Info:", logData);
        break;
    }
  }
}

/**
 * Error service for centralized error handling
 */
export class ErrorService {
  private static instance: ErrorService;
  private logger: ErrorLogger;

  private constructor(logger: ErrorLogger = new ConsoleErrorLogger()) {
    this.logger = logger;
  }

  static getInstance(logger?: ErrorLogger): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService(logger);
    }
    return ErrorService.instance;
  }

  handleError(error: BaseCalculatorError): void {
    this.logger.log(error);

    // In production, you might want to send to external logging service
    // this.sendToExternalService(error);
  }

  setLogger(logger: ErrorLogger): void {
    this.logger = logger;
  }
}