import { BaseError } from "./BaseError";
import { type ErrorLogger, ConsoleErrorLogger } from "./ErrorLogger";

/**
 * Centralized error handling service with singleton pattern
 */
export class ErrorService {
  private static instance: ErrorService;
  private logger: ErrorLogger;

  private constructor(logger: ErrorLogger = new ConsoleErrorLogger()) {
    this.logger = logger;
  }

  /**
   * Get the singleton instance of ErrorService
   */
  static getInstance(logger?: ErrorLogger): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService(logger);
    }
    return ErrorService.instance;
  }

  /**
   * Handle an error by logging it and potentially sending to external services
   */
  handleError(error: BaseError): void {
    this.logger.log(error);

    // In production, you might want to send to external logging service
    // this.sendToExternalService(error);
    // this.notifyMonitoring(error);
  }

  /**
   * Update the logger (useful for testing or changing log destinations)
   */
  setLogger(logger: ErrorLogger): void {
    this.logger = logger;
  }

  /**
   * Reset the singleton instance (useful for testing)
   */
  static reset(): void {
    ErrorService.instance = undefined as any;
  }
}