// Types
export type { ErrorType, ErrorSeverity, ErrorContext } from "./types";
export {
  ErrorType as ErrorTypeValues,
  ErrorSeverity as ErrorSeverityValues,
} from "./types";

// Base classes
export { BaseError } from "./BaseError";

// Error classes
export {
  ValidationError,
  CalculationError,
  NetworkError,
  UnknownError,
} from "./ErrorClasses";

// Utilities
export { ErrorFactory } from "./ErrorFactory";
export { ErrorService } from "./ErrorService";

// Logging
export type { ErrorLogger } from "./ErrorLogger";
export {
  ConsoleErrorLogger,
  NoOpErrorLogger,
  CompositeErrorLogger,
} from "./ErrorLogger";
