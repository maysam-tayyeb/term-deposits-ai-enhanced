import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ErrorType as ErrorTypeValues,
  ErrorSeverity as ErrorSeverityValues,
  ValidationError,
  CalculationError,
  UnknownError,
  ErrorFactory,
  ErrorService,
  ConsoleErrorLogger,
} from "./errors";

describe("Error Classes", () => {
  const mockContext = {
    component: "TestComponent",
    action: "test_action",
    timestamp: "2023-01-01T00:00:00.000Z",
  };

  describe("ValidationError", () => {
    it("should create a validation error with correct properties", () => {
      const error = new ValidationError(
        "principal",
        -100,
        "Principal cannot be negative",
        "Please enter a positive principal amount",
        mockContext,
      );

      expect(error.name).toBe("ValidationError");
      expect(error.type).toBe(ErrorTypeValues.VALIDATION);
      expect(error.severity).toBe(ErrorSeverityValues.MEDIUM);
      expect(error.field).toBe("principal");
      expect(error.value).toBe(-100);
      expect(error.message).toBe("Principal cannot be negative");
      expect(error.userMessage).toBe(
        "Please enter a positive principal amount",
      );
      expect(error.context).toEqual(mockContext);
    });
  });

  describe("CalculationError", () => {
    it("should create a calculation error with correct properties", () => {
      const error = new CalculationError(
        "monthly_compounding",
        "Math calculation failed",
        "Unable to calculate monthly compounding",
        mockContext,
      );

      expect(error.name).toBe("CalculationError");
      expect(error.type).toBe(ErrorTypeValues.CALCULATION);
      expect(error.severity).toBe(ErrorSeverityValues.HIGH);
      expect(error.calculationType).toBe("monthly_compounding");
      expect(error.message).toBe("Math calculation failed");
      expect(error.userMessage).toBe("Unable to calculate monthly compounding");
    });

    it("should allow custom severity", () => {
      const error = new CalculationError(
        "test",
        "test message",
        "test user message",
        mockContext,
        ErrorSeverityValues.LOW,
      );

      expect(error.severity).toBe(ErrorSeverityValues.LOW);
    });
  });

  describe("UnknownError", () => {
    it("should create an unknown error with correct properties", () => {
      const originalError = new Error("Original error");
      const error = new UnknownError(
        originalError,
        "Unknown error occurred",
        "Something unexpected happened",
        mockContext,
      );

      expect(error.name).toBe("UnknownError");
      expect(error.type).toBe(ErrorTypeValues.UNKNOWN);
      expect(error.severity).toBe(ErrorSeverityValues.HIGH);
      expect(error.originalError).toBe(originalError);
    });
  });
});

describe("ErrorFactory", () => {
  const mockContext = {
    component: "TestComponent",
    action: "test_action",
    timestamp: "2023-01-01T00:00:00.000Z",
  };

  describe("createValidationError", () => {
    it("should create a validation error with user-friendly message", () => {
      const error = ErrorFactory.createValidationError(
        "Principal",
        -100,
        "Value must be positive",
        mockContext,
      );

      expect(error).toBeInstanceOf(ValidationError);
      expect(error.field).toBe("Principal");
      expect(error.userMessage).toBe("Value must be positive");
    });
  });

  describe("createCalculationError", () => {
    it("should create a calculation error with default severity", () => {
      const error = ErrorFactory.createCalculationError(
        "test_calculation",
        "Calculation failed",
        mockContext,
      );

      expect(error).toBeInstanceOf(CalculationError);
      expect(error.calculationType).toBe("test_calculation");
      expect(error.severity).toBe(ErrorSeverityValues.HIGH);
      expect(error.userMessage).toBe(
        "Unable to calculate results. Please check your input values and try again.",
      );
    });

    it("should create a calculation error with custom severity", () => {
      const error = ErrorFactory.createCalculationError(
        "test_calculation",
        "Calculation failed",
        mockContext,
        ErrorSeverityValues.LOW,
      );

      expect(error.severity).toBe(ErrorSeverityValues.LOW);
    });
  });

  describe("createUnknownError", () => {
    it("should create unknown error from Error instance", () => {
      const originalError = new Error("Test error");
      const error = ErrorFactory.createUnknownError(originalError, mockContext);

      expect(error).toBeInstanceOf(UnknownError);
      expect(error.message).toBe("Test error");
      expect(error.originalError).toBe(originalError);
    });

    it("should create unknown error from non-Error value", () => {
      const originalError = "String error";
      const error = ErrorFactory.createUnknownError(originalError, mockContext);

      expect(error.message).toBe("String error");
      expect(error.originalError).toBe(originalError);
    });
  });
});

describe("ConsoleErrorLogger", () => {
  let logger: ConsoleErrorLogger;
  let consoleSpy: {
    error: ReturnType<typeof vi.spyOn>;
    warn: ReturnType<typeof vi.spyOn>;
    info: ReturnType<typeof vi.spyOn>;
  };

  beforeEach(() => {
    logger = new ConsoleErrorLogger("Calculator");
    consoleSpy = {
      error: vi.spyOn(console, "error").mockImplementation(() => {}),
      warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
      info: vi.spyOn(console, "info").mockImplementation(() => {}),
    };
  });

  it("should log critical errors to console.error", () => {
    const error = new ValidationError(
      "test",
      "value",
      "test message",
      "test user message",
      {
        component: "test",
        action: "test",
        timestamp: "2023-01-01T00:00:00.000Z",
      },
    );
    Object.defineProperty(error, "severity", {
      value: ErrorSeverityValues.CRITICAL,
      writable: false,
    });

    logger.log(error);

    expect(consoleSpy.error).toHaveBeenCalledWith(
      "Calculator Error:",
      expect.objectContaining({
        name: "ValidationError",
        type: ErrorTypeValues.VALIDATION,
        severity: ErrorSeverityValues.CRITICAL,
      }),
    );
  });

  it("should log medium errors to console.warn", () => {
    const error = new ValidationError(
      "test",
      "value",
      "test message",
      "test user message",
      {
        component: "test",
        action: "test",
        timestamp: "2023-01-01T00:00:00.000Z",
      },
    );

    logger.log(error);

    expect(consoleSpy.warn).toHaveBeenCalledWith(
      "Calculator Warning:",
      expect.objectContaining({
        severity: ErrorSeverityValues.MEDIUM,
      }),
    );
  });

  it("should log low errors to console.info", () => {
    const error = new CalculationError(
      "test",
      "test message",
      "test user message",
      {
        component: "test",
        action: "test",
        timestamp: "2023-01-01T00:00:00.000Z",
      },
      ErrorSeverityValues.LOW,
    );

    logger.log(error);

    expect(consoleSpy.info).toHaveBeenCalledWith(
      "Calculator Info:",
      expect.objectContaining({
        severity: ErrorSeverityValues.LOW,
      }),
    );
  });
});

describe("ErrorService", () => {
  let errorService: ErrorService;
  let mockLogger: { log: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockLogger = { log: vi.fn() };
    // Reset singleton instance for testing
    (ErrorService as unknown as { instance: undefined }).instance = undefined;
    errorService = ErrorService.getInstance(mockLogger);
  });

  it("should be a singleton", () => {
    const instance1 = ErrorService.getInstance();
    const instance2 = ErrorService.getInstance();
    expect(instance1).toBe(instance2);
  });

  it("should handle errors by logging them", () => {
    const error = ErrorFactory.createValidationError(
      "test",
      "value",
      "test message",
      {
        component: "test",
        action: "test",
        timestamp: "2023-01-01T00:00:00.000Z",
      },
    );

    errorService.handleError(error);

    expect(mockLogger.log).toHaveBeenCalledWith(error);
  });

  it("should allow changing logger", () => {
    const newLogger = { log: vi.fn() };
    errorService.setLogger(newLogger);

    const error = ErrorFactory.createValidationError(
      "test",
      "value",
      "test message",
      {
        component: "test",
        action: "test",
        timestamp: "2023-01-01T00:00:00.000Z",
      },
    );

    errorService.handleError(error);

    expect(newLogger.log).toHaveBeenCalledWith(error);
    expect(mockLogger.log).not.toHaveBeenCalled();
  });
});
