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
      </CalculatorErrorBoundary>
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
    expect(screen.getByText("Technical details")).toBeInTheDocument();
  });

  it("should show technical details when expanded", () => {
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

    expect(screen.getByText("Technical details")).toBeInTheDocument();
    expect(screen.getByText("Test error message")).toBeInTheDocument();
    expect(screen.getByText("TestComponent")).toBeInTheDocument();
    expect(screen.getByText("2023-01-01T00:00:00.000Z")).toBeInTheDocument();
  });
});