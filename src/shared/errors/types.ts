/**
 * Generic error types for application-wide error handling
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

/**
 * Context information for error tracking and debugging
 * Can be extended with additional fields as needed
 */
export interface ErrorContext {
  component: string;
  action: string;
  userInput?: Record<string, unknown>;
  timestamp: string;
  [key: string]: unknown; // Allow additional context fields
}