import React, { useState, useEffect, useRef, useCallback } from "react";

export interface FormattedNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  format: "currency" | "percentage" | "number";
  min?: number;
  max?: number;
  step?: number;
  hasError?: boolean;
  placeholder?: string;
  className?: string;
  testId?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
  ariaErrorMessage?: string;
  id?: string;
  decimalPlaces?: number;
  showSteppers?: boolean;
}

export function FormattedNumberInput({
  value,
  onChange,
  format,
  min,
  max,
  step = 1,
  hasError = false,
  placeholder,
  className = "",
  testId,
  ariaLabel,
  ariaDescribedBy,
  ariaInvalid,
  ariaErrorMessage,
  id,
  decimalPlaces = 2,
  showSteppers = true,
}: FormattedNumberInputProps): React.JSX.Element {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);
  const stepIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stepTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stepCountRef = useRef(0);

  // Format number for display
  const formatNumber = useCallback(
    (num: number): string => {
      if (isNaN(num)) return "";

      switch (format) {
        case "currency":
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(num);

        case "percentage":
          return `${num.toFixed(decimalPlaces)}%`;

        default:
          return num.toFixed(decimalPlaces);
      }
    },
    [format, decimalPlaces],
  );

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setLocalValue(input);

    const numValue = parseFloat(input);
    if (!isNaN(numValue)) {
      let constrained = numValue;
      if (min !== undefined && numValue < min) constrained = min;
      if (max !== undefined && numValue > max) constrained = max;
      onChange(constrained);
    }
  };

  // Handle focus/blur
  const handleFocus = () => {
    setIsFocused(true);
    setLocalValue(value.toString());
    // Select all text on focus for easy replacement
    setTimeout(() => {
      inputRef.current?.select();
    }, 0);
  };

  const handleBlur = () => {
    setIsFocused(false);
    const numValue = parseFloat(localValue);
    if (!isNaN(numValue)) {
      let constrained = numValue;
      if (min !== undefined && numValue < min) constrained = min;
      if (max !== undefined && numValue > max) constrained = max;
      onChange(constrained);
      setLocalValue(constrained.toString());
    } else {
      // Reset to current value if invalid
      setLocalValue(value.toString());
    }
  };

  // Handle paste events
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    // Remove all non-numeric characters except decimal point and minus
    const cleaned = pastedText.replace(/[^0-9.-]/g, "");

    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed)) {
      let constrained = parsed;
      if (min !== undefined && parsed < min) constrained = min;
      if (max !== undefined && parsed > max) constrained = max;

      onChange(constrained);
      setLocalValue(constrained.toString());
    }
  };

  // Handle step increment/decrement
  const handleStep = useCallback(
    (direction: "up" | "down") => {
      const currentValue = value;
      const stepValue = step || 1;

      let newValue: number;
      if (direction === "up") {
        newValue = currentValue + stepValue;
        if (max !== undefined && newValue > max) newValue = max;
      } else {
        newValue = currentValue - stepValue;
        if (min !== undefined && newValue < min) newValue = min;
      }

      // Fix floating point precision issues
      const stepDecimals = (stepValue.toString().split(".")[1] || "").length;
      if (stepDecimals > 0) {
        newValue =
          Math.round(newValue * Math.pow(10, stepDecimals)) /
          Math.pow(10, stepDecimals);
      }

      onChange(newValue);
    },
    [value, step, min, max, onChange],
  );

  // Handle auto-repeat stepping
  const startAutoStep = useCallback(
    (direction: "up" | "down") => {
      // Clear any existing intervals
      if (stepIntervalRef.current) {
        clearInterval(stepIntervalRef.current);
      }
      if (stepTimeoutRef.current) {
        clearTimeout(stepTimeoutRef.current);
      }

      // Reset step count
      stepCountRef.current = 0;

      // Immediately do the first step
      handleStep(direction);
      stepCountRef.current++;

      // Start repeating after a delay
      stepTimeoutRef.current = setTimeout(() => {
        let currentDelay = 200;

        const performStep = () => {
          handleStep(direction);
          stepCountRef.current++;

          // Accelerate the stepping speed
          if (stepCountRef.current > 5 && currentDelay > 100) {
            currentDelay = 100;
            clearInterval(stepIntervalRef.current!);
            stepIntervalRef.current = setInterval(performStep, currentDelay);
          } else if (stepCountRef.current > 10 && currentDelay > 50) {
            currentDelay = 50;
            clearInterval(stepIntervalRef.current!);
            stepIntervalRef.current = setInterval(performStep, currentDelay);
          } else if (stepCountRef.current > 20 && currentDelay > 25) {
            currentDelay = 25;
            clearInterval(stepIntervalRef.current!);
            stepIntervalRef.current = setInterval(performStep, currentDelay);
          }
        };

        stepIntervalRef.current = setInterval(performStep, currentDelay);
      }, 300);
    },
    [handleStep],
  );

  const stopAutoStep = useCallback(() => {
    if (stepIntervalRef.current) {
      clearInterval(stepIntervalRef.current);
      stepIntervalRef.current = null;
    }
    if (stepTimeoutRef.current) {
      clearTimeout(stepTimeoutRef.current);
      stepTimeoutRef.current = null;
    }
    stepCountRef.current = 0;
  }, []);

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      stopAutoStep();
    };
  }, [stopAutoStep]);

  // Add wheel event listener with proper options
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const wheelHandler = (e: WheelEvent) => {
      if (!isFocused) return;

      // Prevent default scrolling behavior
      e.preventDefault();

      if (e.deltaY < 0) {
        handleStep("up");
      } else if (e.deltaY > 0) {
        handleStep("down");
      }
    };

    // Add event listener with passive: false to allow preventDefault
    input.addEventListener("wheel", wheelHandler, { passive: false });

    return () => {
      input.removeEventListener("wheel", wheelHandler);
    };
  }, [isFocused, handleStep]);

  const baseClass =
    "w-full px-4 py-3 rounded-lg border transition-all duration-200 text-gray-900 bg-white placeholder-gray-400";
  const errorClass = hasError
    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
    : "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none";

  const inputClassName = `${baseClass} ${errorClass} ${className}`;

  // Get appropriate placeholder
  const getPlaceholder = (): string => {
    if (placeholder) return placeholder;

    switch (format) {
      case "currency":
        return "$0.00";
      case "percentage":
        return "0.00%";
      default:
        return "0";
    }
  };

  const showOverlay = !isFocused;

  return (
    <div className="relative group">
      {/* Formatted display overlay */}
      {showOverlay && (
        <div
          className={`absolute inset-0 flex items-center px-4 pointer-events-none ${inputClassName}`}
          data-testid={testId ? `${testId}-display` : undefined}
        >
          <span className={value === 0 ? "text-gray-400" : ""}>
            {value === 0 && !formatNumber(value)
              ? getPlaceholder()
              : formatNumber(value)}
          </span>
        </div>
      )}

      {/* Number input (always rendered) */}
      <input
        ref={inputRef}
        type="number"
        id={id}
        value={localValue}
        onChange={handleChange}
        onPaste={handlePaste}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={getPlaceholder()}
        className={`${inputClassName} ${showSteppers ? "pr-10" : ""} ${showOverlay ? "text-transparent" : ""}`}
        data-testid={testId}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid ?? hasError}
        aria-errormessage={ariaErrorMessage}
        inputMode="decimal"
        autoComplete="off"
        min={min}
        max={max}
        step={step}
      />

      {/* Custom stepper buttons */}
      {showSteppers && (
        <div className="absolute inset-y-0 right-2 flex items-center opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
          <div className="flex flex-col h-5">
            <button
              type="button"
              onMouseDown={() => startAutoStep("up")}
              onMouseUp={stopAutoStep}
              onMouseLeave={stopAutoStep}
              onTouchStart={() => startAutoStep("up")}
              onTouchEnd={stopAutoStep}
              className="flex items-center justify-center h-2.5 w-5 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label={`Increase ${ariaLabel || "value"}`}
              tabIndex={-1}
              data-testid={testId ? `${testId}-increment` : undefined}
            >
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 8L6 5L9 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onMouseDown={() => startAutoStep("down")}
              onMouseUp={stopAutoStep}
              onMouseLeave={stopAutoStep}
              onTouchStart={() => startAutoStep("down")}
              onTouchEnd={stopAutoStep}
              className="flex items-center justify-center h-2.5 w-5 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label={`Decrease ${ariaLabel || "value"}`}
              tabIndex={-1}
              data-testid={testId ? `${testId}-decrement` : undefined}
            >
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 4L6 7L9 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
