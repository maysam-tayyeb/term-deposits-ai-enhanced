import { BaseError } from "./BaseError";
import { ErrorSeverity } from "./types";

/**
 * Interface for error logging implementations
 */
export interface ErrorLogger {
  log(error: BaseError): void;
}

/**
 * Console-based error logger with severity-appropriate logging levels
 */
export class ConsoleErrorLogger implements ErrorLogger {
  private readonly prefix: string;

  constructor(prefix: string = "Application") {
    this.prefix = prefix;
  }

  log(error: BaseError): void {
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
        console.error(`${this.prefix} Error:`, logData);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn(`${this.prefix} Warning:`, logData);
        break;
      case ErrorSeverity.LOW:
        console.info(`${this.prefix} Info:`, logData);
        break;
    }
  }
}

/**
 * No-op error logger for testing or when logging is disabled
 */
export class NoOpErrorLogger implements ErrorLogger {
  log(): void {
    // Intentionally empty
  }
}

/**
 * Composite logger that logs to multiple destinations
 */
export class CompositeErrorLogger implements ErrorLogger {
  private loggers: ErrorLogger[];

  constructor(loggers: ErrorLogger[]) {
    this.loggers = loggers;
  }

  log(error: BaseError): void {
    this.loggers.forEach((logger) => logger.log(error));
  }

  addLogger(logger: ErrorLogger): void {
    this.loggers.push(logger);
  }
}
