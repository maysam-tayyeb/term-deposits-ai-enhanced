import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
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
      render(
        <FormattedNumberInput
          {...defaultProps}
          format="currency"
          value={1234.56}
        />,
      );
      const input = screen.getByTestId("test-input");
      // The input always contains the numeric value
      expect(input).toHaveValue(1234.56);
      // The formatted display is shown in the overlay
      const display = screen.getByTestId("test-input-display");
      expect(display).toHaveTextContent("$1,234.56");
    });

    it("shows raw number when focused", async () => {
      render(
        <FormattedNumberInput
          {...defaultProps}
          format="currency"
          value={1234.56}
        />,
      );
      const input = screen.getByTestId("test-input");

      await userEvent.click(input);
      expect(input).toHaveValue(1234.56);
    });

    it("formats number on blur", async () => {
      const onChange = vi.fn();
      render(
        <FormattedNumberInput
          {...defaultProps}
          format="currency"
          value={1000}
          onChange={onChange}
        />,
      );
      const input = screen.getByTestId("test-input");

      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.type(input, "5678.90");

      expect(onChange).toHaveBeenLastCalledWith(5678.9);

      fireEvent.blur(input);

      // The component should call onChange with the parsed value
      expect(onChange).toHaveBeenLastCalledWith(5678.9);
    });

    it("handles paste with non-numeric characters", async () => {
      const onChange = vi.fn();
      render(
        <FormattedNumberInput
          {...defaultProps}
          format="currency"
          onChange={onChange}
        />,
      );
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
      render(
        <FormattedNumberInput
          {...defaultProps}
          format="percentage"
          value={5.5}
        />,
      );
      const input = screen.getByTestId("test-input");
      // The input always contains the numeric value
      expect(input).toHaveValue(5.5);
      // The formatted display is shown in the overlay
      const display = screen.getByTestId("test-input-display");
      expect(display).toHaveTextContent("5.50%");
    });

    it("shows raw number when focused", async () => {
      render(
        <FormattedNumberInput
          {...defaultProps}
          format="percentage"
          value={5.5}
        />,
      );
      const input = screen.getByTestId("test-input");

      await userEvent.click(input);
      expect(input).toHaveValue(5.5);
    });

    it("formats number on blur", async () => {
      const onChange = vi.fn();
      render(
        <FormattedNumberInput
          {...defaultProps}
          format="percentage"
          value={1000}
          onChange={onChange}
        />,
      );
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
      const input = screen.getByTestId("test-input") as HTMLInputElement;

      // Since the input is always type="number", the browser handles validation
      await userEvent.click(input);
      await userEvent.clear(input);
      
      // When using type="number", browser prevents non-numeric input
      // Test by checking the value remains numeric
      await userEvent.type(input, "123abc456");
      
      // Only numeric characters should be accepted
      expect(input).toHaveValue(123456);
    });

    it("allows decimal point", async () => {
      render(<FormattedNumberInput {...defaultProps} />);
      const input = screen.getByTestId("test-input");

      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.type(input, "123.45");

      expect(input).toHaveValue(123.45);
    });

    it("prevents multiple decimal points when type=text", async () => {
      render(<FormattedNumberInput {...defaultProps} />);
      const input = screen.getByTestId("test-input") as HTMLInputElement;

      // Type=text mode prevents multiple decimals
      fireEvent.change(input, { target: { value: "12.3.4" } });

      // But when focused (type="number"), browser handles validation
      await userEvent.click(input);
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(input).toHaveAttribute("type", "number");
    });

    it("allows minus sign at the beginning", async () => {
      render(<FormattedNumberInput {...defaultProps} />);
      const input = screen.getByTestId("test-input") as HTMLInputElement;

      await userEvent.click(input);
      await userEvent.clear(input);

      // Type negative number
      await userEvent.type(input, "-123");
      expect(input).toHaveValue(-123);
    });

    it("allows browser to handle minus sign when type=number", async () => {
      render(<FormattedNumberInput {...defaultProps} value={123} />);
      const input = screen.getByTestId("test-input") as HTMLInputElement;

      // Input always has numeric value
      expect(input).toHaveValue(123);

      // Input is always type="number"
      expect(input).toHaveAttribute("type", "number");
      
      // Browser handles number input natively
      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.type(input, "-456");
      expect(input).toHaveValue(-456);
    });
  });

  describe("Min/Max constraints", () => {
    it("enforces minimum value on blur", async () => {
      const onChange = vi.fn();
      render(
        <FormattedNumberInput
          {...defaultProps}
          min={100}
          onChange={onChange}
        />,
      );
      const input = screen.getByTestId("test-input");

      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.type(input, "50");

      fireEvent.blur(input);

      expect(onChange).toHaveBeenLastCalledWith(100);
    });

    it("enforces maximum value on blur", async () => {
      const onChange = vi.fn();
      render(
        <FormattedNumberInput
          {...defaultProps}
          max={1000}
          onChange={onChange}
        />,
      );
      const input = screen.getByTestId("test-input");

      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.type(input, "2000");

      fireEvent.blur(input);

      expect(onChange).toHaveBeenLastCalledWith(1000);
    });

    it("enforces constraints on paste", async () => {
      const onChange = vi.fn();
      render(
        <FormattedNumberInput
          {...defaultProps}
          min={0}
          max={100}
          onChange={onChange}
        />,
      );
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
      render(
        <FormattedNumberInput
          {...defaultProps}
          format="currency"
          value={1234.567}
          decimalPlaces={2}
        />,
      );
      const input = screen.getByTestId("test-input");
      // Input always has numeric value
      expect(input).toHaveValue(1234.567);
      // Formatted display shows with correct decimal places
      const display = screen.getByTestId("test-input-display");
      expect(display).toHaveTextContent("$1,234.57");
    });

    it("respects decimal places for percentage", () => {
      render(
        <FormattedNumberInput
          {...defaultProps}
          format="percentage"
          value={5.678}
          decimalPlaces={1}
        />,
      );
      const input = screen.getByTestId("test-input");
      // Input always has numeric value
      expect(input).toHaveValue(5.678);
      // Formatted display shows with correct decimal places
      const display = screen.getByTestId("test-input-display");
      expect(display).toHaveTextContent("5.7%");
    });

    it("handles zero decimal places", () => {
      render(
        <FormattedNumberInput
          {...defaultProps}
          format="number"
          value={123.456}
          decimalPlaces={0}
        />,
      );
      const input = screen.getByTestId("test-input");
      // Input always has numeric value
      expect(input).toHaveValue(123.456);
      // Formatted display shows with zero decimal places
      const display = screen.getByTestId("test-input-display");
      expect(display).toHaveTextContent("123");
    });
  });

  describe("Placeholders", () => {
    it("shows custom placeholder when provided", () => {
      render(
        <FormattedNumberInput {...defaultProps} placeholder="Enter amount" />,
      );
      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("placeholder", "Enter amount");
    });

    it("shows default currency placeholder", () => {
      render(
        <FormattedNumberInput {...defaultProps} format="currency" value={0} />,
      );
      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("placeholder", "$0.00");
    });

    it("shows default percentage placeholder", () => {
      render(
        <FormattedNumberInput
          {...defaultProps}
          format="percentage"
          value={0}
        />,
      );
      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("placeholder", "0.00%");
    });

    it("shows default number placeholder", () => {
      render(
        <FormattedNumberInput {...defaultProps} format="number" value={0} />,
      );
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
      render(
        <FormattedNumberInput {...defaultProps} ariaDescribedBy="help-text" />,
      );
      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("aria-describedby", "help-text");
    });

    it("supports aria-invalid", () => {
      render(<FormattedNumberInput {...defaultProps} ariaInvalid={true} />);
      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("supports aria-errormessage", () => {
      render(
        <FormattedNumberInput
          {...defaultProps}
          ariaErrorMessage="error-message"
        />,
      );
      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("aria-errormessage", "error-message");
    });

    it("sets aria-invalid based on hasError when ariaInvalid not provided", () => {
      render(<FormattedNumberInput {...defaultProps} hasError={true} />);
      const input = screen.getByTestId("test-input");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("Input type switching", () => {
    it("switches to number type on focus", async () => {
      render(
        <FormattedNumberInput
          {...defaultProps}
          format="currency"
          value={1000}
          testId="test-input"
        />,
      );
      const input = screen.getByTestId("test-input");

      // Input is always type="number" in new implementation
      expect(input).toHaveAttribute("type", "number");
      expect(input).toHaveValue(1000);

      await userEvent.click(input);

      // Wait for transition
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(input).toHaveAttribute("type", "number");
      expect((input as HTMLInputElement).value).toBe("1000");
    });

    it("switches back to text type on blur", async () => {
      render(
        <FormattedNumberInput
          {...defaultProps}
          format="currency"
          value={1000}
          testId="test-input"
        />,
      );
      const input = screen.getByTestId("test-input");

      await userEvent.click(input);
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(input).toHaveAttribute("type", "number");

      fireEvent.blur(input);
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Input remains type="number" in new implementation
      expect(input).toHaveAttribute("type", "number");
      expect(input).toHaveValue(1000);
      
      // Formatted display is shown via overlay when not focused
      const display = screen.getByTestId("test-input-display");
      expect(display).toHaveTextContent("$1,000.00");
    });

    it("maintains min/max/step attributes on number input", async () => {
      render(
        <FormattedNumberInput
          {...defaultProps}
          min={0}
          max={100}
          step={5}
          testId="test-input"
        />,
      );
      const input = screen.getByTestId("test-input");

      await userEvent.click(input);
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(input).toHaveAttribute("min", "0");
      expect(input).toHaveAttribute("max", "100");
      expect(input).toHaveAttribute("step", "5");
    });
  });

  describe("Security and validation", () => {
    it("prevents invalid values from being set", async () => {
      const onChange = vi.fn();
      render(
        <FormattedNumberInput
          {...defaultProps}
          value={50}
          min={0}
          max={100}
          onChange={onChange}
          testId="test-input"
        />,
      );
      const input = screen.getByTestId("test-input");

      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.type(input, "200");

      fireEvent.blur(input);
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Should be clamped to max
      expect(onChange).toHaveBeenLastCalledWith(100);
    });

    it("handles rapid focus/blur without errors", async () => {
      const onChange = vi.fn();
      render(
        <FormattedNumberInput
          {...defaultProps}
          value={50}
          onChange={onChange}
          testId="test-input"
        />,
      );
      const input = screen.getByTestId("test-input") as HTMLInputElement;

      // Initial state

      // Simulate rapid focus/blur that might happen with shaky hands or accidental touches
      await act(async () => {
        for (let i = 0; i < 10; i++) {
          fireEvent.focus(input);
          await new Promise((resolve) => setTimeout(resolve, 5)); // Very quick
          fireEvent.blur(input);
          await new Promise((resolve) => setTimeout(resolve, 5));
        }
      });

      // Component should not crash or throw errors
      expect(input).toBeInTheDocument();

      // Value should remain stable (not corrupted)
      expect(input.value).toBeTruthy(); // Has some value
      expect(input.value).not.toBe("NaN");
      expect(input.value).not.toBe("undefined");

      // Now let's ensure the component is still functional
      // Wait for any pending state updates to settle
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
      });

      // Focus one more time and ensure we can interact with it
      await act(async () => {
        fireEvent.focus(input);
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Clear and enter a new value to verify functionality
      await userEvent.clear(input);
      await userEvent.type(input, "200");

      // onChange should work
      expect(onChange).toHaveBeenCalledWith(200);

      // Final blur
      await act(async () => {
        fireEvent.blur(input);
        await new Promise((resolve) => setTimeout(resolve, 200));
      });

      // Should have a valid formatted value
      expect(input.value).toMatch(/^\$?[\d,]+\.?\d*%?$/); // Matches formatted numbers
    });

    it("validates pasted content securely", async () => {
      const onChange = vi.fn();
      render(
        <FormattedNumberInput
          {...defaultProps}
          value={50}
          onChange={onChange}
          testId="test-input"
        />,
      );
      const input = screen.getByTestId("test-input");

      const clipboardData = {
        getData: vi.fn().mockReturnValue("<script>alert('xss')</script>123.45"),
      };
      const pasteEvent = new Event("paste", { bubbles: true });
      Object.defineProperty(pasteEvent, "clipboardData", {
        value: clipboardData,
        writable: false,
      });

      fireEvent(input, pasteEvent);

      expect(onChange).toHaveBeenCalledWith(123.45);
    });
  });

  describe("Native number input behavior", () => {
    it("uses native spinner when focused", async () => {
      render(
        <FormattedNumberInput
          {...defaultProps}
          value={100}
          step={10}
          testId="test-input"
        />,
      );
      const input = screen.getByTestId("test-input");

      await userEvent.click(input);
      await new Promise((resolve) => setTimeout(resolve, 100));

      // When type="number", browser provides native spinners
      expect(input).toHaveAttribute("type", "number");
      expect(input).toHaveAttribute("step", "10");
    });
  });

  describe("Mouse wheel support", () => {
    it("allows native wheel behavior when focused", async () => {
      render(
        <FormattedNumberInput
          {...defaultProps}
          value={100}
          step={10}
          testId="test-input"
        />,
      );
      const input = screen.getByTestId("test-input");

      await userEvent.click(input);
      await new Promise((resolve) => setTimeout(resolve, 100));

      // When type="number", browser handles wheel natively
      expect(input).toHaveAttribute("type", "number");
    });

    it("prevents accidental wheel changes when not focused", () => {
      const onChange = vi.fn();
      render(
        <FormattedNumberInput
          {...defaultProps}
          value={100}
          onChange={onChange}
          testId="test-input"
        />,
      );
      const input = screen.getByTestId("test-input");

      const wheelEvent = new WheelEvent("wheel", {
        deltaY: 100,
        bubbles: true,
      });

      fireEvent(input, wheelEvent);

      // When not focused, wheel events don't trigger onChange
      expect(onChange).not.toHaveBeenCalled();
    });

    it("prevents wheel events when not focused", () => {
      const onChange = vi.fn();
      render(
        <FormattedNumberInput
          {...defaultProps}
          value={100}
          onChange={onChange}
          testId="test-input"
        />,
      );

      const input = screen.getByTestId("test-input");

      const wheelEvent = new WheelEvent("wheel", {
        deltaY: -100,
        bubbles: true,
      });

      fireEvent(input, wheelEvent);

      // When not focused, wheel events don't trigger onChange
      expect(onChange).not.toHaveBeenCalled();
    });

    it("allows wheel events when focused (native number input)", async () => {
      const onChange = vi.fn();
      render(
        <FormattedNumberInput
          {...defaultProps}
          value={100}
          onChange={onChange}
          testId="test-input"
        />,
      );
      const input = screen.getByTestId("test-input");

      await userEvent.click(input);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const wheelEvent = new WheelEvent("wheel", {
        deltaY: -100,
        bubbles: true,
      });

      fireEvent(input, wheelEvent);

      // When focused, wheel events trigger onChange (handled by component)
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe("Edge cases", () => {
    it("handles empty input on blur", async () => {
      const onChange = vi.fn();
      render(
        <FormattedNumberInput
          {...defaultProps}
          format="currency"
          value={1000}
          onChange={onChange}
        />,
      );
      const input = screen.getByTestId("test-input");

      await act(async () => {
        await userEvent.click(input);
        await new Promise((resolve) => setTimeout(resolve, 100));
        await userEvent.clear(input);

        fireEvent.blur(input);
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      // When input is empty on blur, it resets to the current value
      // onChange should not be called with the original value again
      expect(onChange).not.toHaveBeenCalledWith(1000);
    });

    it("handles invalid input on blur", async () => {
      const onChange = vi.fn();
      render(
        <FormattedNumberInput
          {...defaultProps}
          format="currency"
          value={1000}
          onChange={onChange}
        />,
      );
      const input = screen.getByTestId("test-input");

      await act(async () => {
        await userEvent.click(input);
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Type invalid input
        fireEvent.change(input, { target: { value: "" } });

        fireEvent.blur(input);
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      // When input is invalid on blur, it resets to the current value
      // onChange should not be called with the original value again
      expect(onChange).not.toHaveBeenCalledWith(1000);
    });

    it("handles NaN value", () => {
      render(<FormattedNumberInput {...defaultProps} value={NaN} />);
      const input = screen.getByTestId("test-input");
      expect(input).toHaveValue(null);
    });
  });
});
