import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { CalculatorErrorBoundary } from "./ErrorBoundary";
import { DefaultErrorFallback } from "./ErrorBoundary";

// Mock ErrorService
vi.mock("../../config/errors", async () => {
  const actual = await vi.importActual("../../config/errors");
  return {
    ...actual,
    ErrorService: {
      getInstance: () => ({
        handleError: vi.fn(),
      }),
    },
  };
});

describe("CalculatorErrorBoundary", () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it("should render children when there is no error", () => {
    render(
      <CalculatorErrorBoundary>
        <div>No error</div>
      </CalculatorErrorBoundary>,
    );

    expect(screen.getByText("No error")).toBeInTheDocument();
  });

  // Test the fallback component directly since Error Boundaries don't work properly in jsdom
  it("should render error fallback UI correctly", () => {
    const mockError = {
      name: "TestError",
      message: "Test error message",
      userMessage: "Something went wrong with the test",
      type: "UNKNOWN" as const,
      severity: "HIGH" as const,
      context: {
        component: "Test",
        action: "test",
        timestamp: "2023-01-01T00:00:00.000Z",
      },
    };

    render(<DefaultErrorFallback error={mockError} />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
    expect(screen.getByText("Go Back")).toBeInTheDocument();
    // Technical details should be hidden in non-development environment
    expect(screen.queryByText("Technical details")).not.toBeInTheDocument();
  });

  it("should display user-friendly error message without technical details", () => {
    const mockError = {
      name: "TestError",
      message: "Test error message",
      userMessage: "Something went wrong with the test",
      type: "VALIDATION" as const,
      severity: "MEDIUM" as const,
      context: {
        component: "TestComponent",
        action: "testAction",
        timestamp: "2023-01-01T00:00:00.000Z",
      },
    };

    render(<DefaultErrorFallback error={mockError} />);

    // Should show user-friendly message
    expect(
      screen.getByText("Something went wrong with the test"),
    ).toBeInTheDocument();

    // Technical details should be hidden in non-development environment
    expect(screen.queryByText("Technical details")).not.toBeInTheDocument();
    expect(screen.queryByText("Test error message")).not.toBeInTheDocument();
    expect(screen.queryByText("TestComponent")).not.toBeInTheDocument();
  });
});
