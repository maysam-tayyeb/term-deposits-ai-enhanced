import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormattedNumberInput } from "./FormattedNumberInput";

describe("FormattedNumberInput", () => {
  const defaultProps = {
    value: 1000,
    onChange: vi.fn(),
    format: "number" as const,
    testId: "test-input",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Currency format", () => {
    it("displays value as currency when not focused", () => {
      render(<FormattedNumberInput {...defaultProps} format="currency" value={1234.56} />);
      const input = screen.getByTestId("test-input");
      expect(input).toHaveValue("$1,234.56");
    });

    it("shows raw number when focused", async () => {
      render(<FormattedNumberInput {...defaultProps} format="currency" value={1234.56} />);
      const input = screen.getByTestId("test-input");
      
      await userEvent.click(input);
      expect(input).toHaveValue("1234.56");
    });

    it("formats number on blur", async () => {
      const onChange = vi.fn();
      render(<FormattedNumberInput {...defaultProps} format="currency" value={1000} onChange={onChange} />);
      const input = screen.getByTestId("test-input");
      
      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.type(input, "5678.90");
      
      expect(onChange).toHaveBeenLastCalledWith(5678.90);
      
      fireEvent.blur(input);
      
      // The component should call onChange with the parsed value
      expect(onChange).toHaveBeenLastCalledWith(5678.90);
    });

    it("handles paste with non-numeric characters", async () => {
      const onChange = vi.fn();
      render(<FormattedNumberInput {...defaultProps} format="currency" onChange={onChange} />);
      const input = screen.getByTestId("test-input");
      
      await userEvent.click(input);
      
      // Create a paste event with clipboardData
      const clipboardData = {
        getData: vi.fn().mockReturnValue("$1,234.56"),
      };
      const pasteEvent = new Event("paste", { bubbles: true });
      Object.defineProperty(pasteEvent, "clipboardData", {
        value: clipboardData,
        writable: false,
      });
      
      fireEvent(input, pasteEvent);
      
      expect(onChange).toHaveBeenCalledWith(1234.56);
    });
  });

  describe("Percentage format", () => {
    it("displays value as percentage when not focused", () => {
      render(<FormattedNumberInput {...defaultProps} format="percentage" value={5.5} />);
      const input = screen.getByTestId("test-input");
      expect(input).toHaveValue("5.50%");
    });

    it("shows raw number when focused", async () => {
      render(<FormattedNumberInput {...defaultProps} format="percentage" value={5.5} />);
      const input = screen.getByTestId("test-input");
      
      await userEvent.click(input);
      expect(input).toHaveValue("5.5");
    });

    it("formats number on blur", async () => {
      const onChange = vi.fn();
      render(<FormattedNumberInput {...defaultProps} format="percentage" value={1000} onChange={onChange} />);
      const input = screen.getByTestId("test-input");
      
      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.type(input, "7.25");
      
      expect(onChange).toHaveBeenLastCalledWith(7.25);
      
      fireEvent.blur(input);
      
      // The component should call onChange with the parsed value
      expect(onChange).toHaveBeenLastCalledWith(7.25);
    });
  });

  describe("Input validation", () => {
    it("prevents non-numeric characters", async () => {
      render(<FormattedNumberInput {...defaultProps} />);
      const input = screen.getByTestId("test-input");
      
      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.type(input, "abc123def");
      
      expect(input).toHaveValue("123");
    });

    it("allows decimal point", async () => {
      render(<FormattedNumberInput {...defaultProps} />);
      const input = screen.getByTestId("test-input");
      
      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.type(input, "123.45");
      
      expect(input).toHaveValue("123.45");
    });

    it("prevents multiple decimal points", async () => {
      render(<FormattedNumberInput {...defaultProps} />);
      const input = screen.getByTestId("test-input") as HTMLInputElement;
      
      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.type(input, "12.3");
      
      // The input should contain a decimal point
      expect(input.value).toContain(".");
      
      // Try to type another decimal - userEvent simulates keydown/keypress/keyup
      await userEvent.type(input, ".");
      
      // Should still only have one decimal point
      const decimalCount = (input.value.match(/\./g) || []).length;
      expect(decimalCount).toBe(1);
    });

    it("allows minus sign at the beginning", async () => {
      render(<FormattedNumberInput {...defaultProps} />);
      const input = screen.getByTestId("test-input") as HTMLInputElement;
      
      await userEvent.click(input);
      await userEvent.clear(input);
      
      // Position cursor at start
      input.setSelectionRange(0, 0);
      
      await userEvent.type(input, "-123");
      expect(input).toHaveValue("-123");
    });

    it("prevents minus sign in the middle", async () => {
      render(<FormattedNumberInput {...defaultProps} value={123} />);
      const input = screen.getByTestId("test-input") as HTMLInputElement;
      
      await userEvent.click(input);
      
      // Should have initial value
      expect(input.value).toBe("123");
      
      // Try to add minus in the middle - move cursor to position 2
      input.setSelectionRange(2, 2);
      await userEvent.keyboard("-");
      
      // Minus should not be added in the middle
      expect(input.value).not.toContain("-");
    });
  });

  describe("Min/Max constraints", () => {
    it("enforces minimum value on blur", async () => {
      const onChange = vi.fn();
      render(<FormattedNumberInput {...defaultProps} min={100} onChange={onChange} />);
      const input = screen.getByTestId("test-input");
      
      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.type(input, "50");
      
      fireEvent.blur(input);
      
      expect(onChange).toHaveBeenLastCalledWith(100);
    });

    it("enforces maximum value on blur", async () => {
      const onChange = vi.fn();
      render(<FormattedNumberInput {...defaultProps} max={1000} onChange={onChange} />);
      const input = screen.getByTestId("test-input");
      
      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.type(input, "2000");
      
      fireEvent.blur(input);
      
      expect(onChange).toHaveBeenLastCalledWith(1000);
    });

    it("enforces constraints on paste", async () => {
      const onChange = vi.fn();
      render(<FormattedNumberInput {...defaultProps} min={0} max={100} onChange={onChange} />);
      const input = screen.getByTestId("test-input");
      
      await userEvent.click(input);
      
      // Create a paste event with clipboardData
      const clipboardData = {
        getData: vi.fn().mockReturnValue("150"),
      };
      const pasteEvent = new Event("paste", { bubbles: true });
      Object.defineProperty(pasteEvent, "clipboardData", {
        value: clipboardData,
        writable: false,
      });
      
      fireEvent(input, pasteEvent);
      
      expect(onChange).toHaveBeenCalledWith(100);
    });
  });

  describe("Decimal places", () => {
    it("respects decimal places for currency", () => {
      render(<FormattedNumberInput {...defaultProps} format="currency" value={1234.567} decimalPlaces={2} />);
      const input = screen.getByTestId("test-input");
      expect(input).toHaveValue("$1,234.57");
    });

    it("respects decimal places for percentage", () => {
      render(<FormattedNumberInput {...defaultProps} format="percentage" value={5.678} decimalPlaces={1} />);
      const input = screen.getByTestId("test-input");
      expect(input).toHaveValue("5.7%");
    });

    it("handles zero decimal places", () => {
      render(<FormattedNumberInput {...defaultProps} format="number" value={123.456} decimalPlaces={0} />);
      const input = screen.getByTestId("test-input");
      expect(input).toHaveValue("123");
    });
  });

  describe("Placeholders", () => {
    it("shows custom placeholder when provided", () => {
      render(<FormattedNumberInput {...defaultProps} placeholder="Enter amount" />);
      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("placeholder", "Enter amount");
    });

    it("shows default currency placeholder", () => {
      render(<FormattedNumberInput {...defaultProps} format="currency" value={0} />);
      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("placeholder", "$0.00");
    });

    it("shows default percentage placeholder", () => {
      render(<FormattedNumberInput {...defaultProps} format="percentage" value={0} />);
      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("placeholder", "0.00%");
    });

    it("shows default number placeholder", () => {
      render(<FormattedNumberInput {...defaultProps} format="number" value={0} />);
      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("placeholder", "0");
    });
  });

  describe("Accessibility", () => {
    it("supports aria-label", () => {
      render(<FormattedNumberInput {...defaultProps} ariaLabel="Test input" />);
      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("aria-label", "Test input");
    });

    it("supports aria-describedby", () => {
      render(<FormattedNumberInput {...defaultProps} ariaDescribedBy="help-text" />);
      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("aria-describedby", "help-text");
    });

    it("supports aria-invalid", () => {
      render(<FormattedNumberInput {...defaultProps} ariaInvalid={true} />);
      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("supports aria-errormessage", () => {
      render(<FormattedNumberInput {...defaultProps} ariaErrorMessage="error-message" />);
      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("aria-errormessage", "error-message");
    });

    it("sets aria-invalid based on hasError when ariaInvalid not provided", () => {
      render(<FormattedNumberInput {...defaultProps} hasError={true} />);
      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("Stepper buttons", () => {
    it("renders stepper buttons by default", () => {
      render(<FormattedNumberInput {...defaultProps} testId="test-input" />);
      
      expect(screen.getByTestId("test-input-increment")).toBeInTheDocument();
      expect(screen.getByTestId("test-input-decrement")).toBeInTheDocument();
    });

    it("hides stepper buttons when showSteppers is false", () => {
      render(<FormattedNumberInput {...defaultProps} showSteppers={false} testId="test-input" />);
      
      expect(screen.queryByTestId("test-input-increment")).not.toBeInTheDocument();
      expect(screen.queryByTestId("test-input-decrement")).not.toBeInTheDocument();
    });

    it("increments value when clicking up stepper", async () => {
      const onChange = vi.fn();
      render(<FormattedNumberInput {...defaultProps} value={100} onChange={onChange} step={10} testId="test-input" />);
      
      const incrementButton = screen.getByTestId("test-input-increment");
      await userEvent.click(incrementButton);
      
      expect(onChange).toHaveBeenCalledWith(110);
    });

    it("decrements value when clicking down stepper", async () => {
      const onChange = vi.fn();
      render(<FormattedNumberInput {...defaultProps} value={100} onChange={onChange} step={10} testId="test-input" />);
      
      const decrementButton = screen.getByTestId("test-input-decrement");
      await userEvent.click(decrementButton);
      
      expect(onChange).toHaveBeenCalledWith(90);
    });

    it("respects max value when incrementing", async () => {
      const onChange = vi.fn();
      render(<FormattedNumberInput {...defaultProps} value={95} max={100} onChange={onChange} step={10} testId="test-input" />);
      
      const incrementButton = screen.getByTestId("test-input-increment");
      await userEvent.click(incrementButton);
      
      expect(onChange).toHaveBeenCalledWith(100);
    });

    it("respects min value when decrementing", async () => {
      const onChange = vi.fn();
      render(<FormattedNumberInput {...defaultProps} value={5} min={0} onChange={onChange} step={10} testId="test-input" />);
      
      const decrementButton = screen.getByTestId("test-input-decrement");
      await userEvent.click(decrementButton);
      
      expect(onChange).toHaveBeenCalledWith(0);
    });

    it("uses default step of 1 when not specified", async () => {
      const onChange = vi.fn();
      render(<FormattedNumberInput {...defaultProps} value={100} onChange={onChange} testId="test-input" />);
      
      const incrementButton = screen.getByTestId("test-input-increment");
      await userEvent.click(incrementButton);
      
      expect(onChange).toHaveBeenCalledWith(101);
    });

    it("has proper aria labels for stepper buttons", () => {
      render(<FormattedNumberInput {...defaultProps} ariaLabel="Test amount" testId="test-input" />);
      
      const incrementButton = screen.getByTestId("test-input-increment");
      const decrementButton = screen.getByTestId("test-input-decrement");
      
      expect(incrementButton).toHaveAttribute("aria-label", "Increase Test amount");
      expect(decrementButton).toHaveAttribute("aria-label", "Decrease Test amount");
    });
  });

  describe("Edge cases", () => {
    it("handles empty input on blur", async () => {
      const onChange = vi.fn();
      render(<FormattedNumberInput {...defaultProps} format="currency" value={1000} onChange={onChange} />);
      const input = screen.getByTestId("test-input");
      
      await userEvent.click(input);
      await userEvent.clear(input);
      
      fireEvent.blur(input);
      
      // Should reset to original value
      expect(input).toHaveValue("$1,000.00");
      expect(onChange).toHaveBeenLastCalledWith(1000);
    });

    it("handles invalid input on blur", async () => {
      render(<FormattedNumberInput {...defaultProps} format="currency" value={1000} />);
      const input = screen.getByTestId("test-input");
      
      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.type(input, "-");
      
      fireEvent.blur(input);
      
      // Should reset to original formatted value
      expect(input).toHaveValue("$1,000.00");
    });

    it("handles NaN value", () => {
      render(<FormattedNumberInput {...defaultProps} value={NaN} />);
      const input = screen.getByTestId("test-input");
      expect(input).toHaveValue("");
    });
  });
});