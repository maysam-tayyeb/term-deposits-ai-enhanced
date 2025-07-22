import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { CalculatorErrorBoundary } from "./ErrorBoundary";

// Mock ErrorService
vi.mock("./errors", async () => {
  const actual = await vi.importActual("./errors");
  return {
    ...actual,
    ErrorService: {
      getInstance: () => ({
        handleError: vi.fn(),
      }),
    },
  };
});

// Component that throws an error
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
}

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
        <ThrowError shouldThrow={false} />
      </CalculatorErrorBoundary>
    );

    expect(screen.getByText("No error")).toBeInTheDocument();
  });

  it("should render error fallback when error occurs", () => {
    render(
      <CalculatorErrorBoundary>
        <ThrowError shouldThrow={true} />
      </CalculatorErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
    expect(screen.getByText("Go Back")).toBeInTheDocument();
  });

  it("should show technical details section", () => {
    render(
      <CalculatorErrorBoundary>
        <ThrowError shouldThrow={true} />
      </CalculatorErrorBoundary>
    );

    expect(screen.getByText("Technical details")).toBeInTheDocument();
  });
});