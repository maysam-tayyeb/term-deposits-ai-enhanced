import type { ErrorType, ErrorSeverity, ErrorContext } from "./types";

/**
 * Abstract base class for all application errors
 * Provides consistent structure and properties across all error types
 */
export abstract class BaseError extends Error {
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

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
