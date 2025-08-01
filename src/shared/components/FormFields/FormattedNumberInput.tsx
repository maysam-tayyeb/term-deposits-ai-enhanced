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
  const [displayValue, setDisplayValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Format number for display
  const formatNumber = useCallback((num: number): string => {
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
  }, [format, decimalPlaces]);

  // Parse user input to number
  const parseInput = (input: string): number | null => {
    // Remove all non-numeric characters except decimal point and minus
    const cleaned = input.replace(/[^0-9.-]/g, "");
    
    // Handle empty or invalid input
    if (!cleaned || cleaned === "-" || cleaned === ".") return null;
    
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  };

  // Update display value when value prop changes or focus changes
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatNumber(value));
    } else {
      setDisplayValue(value.toString());
    }
  }, [value, isFocused, format, decimalPlaces, formatNumber]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDisplayValue(input);

    const parsed = parseInput(input);
    if (parsed !== null) {
      // Apply min/max constraints
      let constrained = parsed;
      if (min !== undefined && parsed < min) constrained = min;
      if (max !== undefined && parsed > max) constrained = max;
      
      onChange(constrained);
    }
  };

  // Handle paste events
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const parsed = parseInput(pastedText);
    
    if (parsed !== null) {
      let constrained = parsed;
      if (min !== undefined && parsed < min) constrained = min;
      if (max !== undefined && parsed > max) constrained = max;
      
      onChange(constrained);
      setDisplayValue(isFocused ? constrained.toString() : formatNumber(constrained));
    }
  };

  // Handle keyboard events to prevent invalid characters
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle arrow keys for stepping
    if (e.key === "ArrowUp") {
      e.preventDefault();
      handleStep('up');
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      handleStep('down');
      return;
    }

    // Allow control keys
    if (
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "Tab" ||
      e.key === "Enter" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "Home" ||
      e.key === "End" ||
      (e.ctrlKey && (e.key === "a" || e.key === "c" || e.key === "v" || e.key === "x"))
    ) {
      return;
    }

    // Allow numbers
    if (/[0-9]/.test(e.key)) {
      return;
    }

    // Allow decimal point if not already present
    if (e.key === "." && !displayValue.includes(".")) {
      return;
    }

    // Allow minus sign at the beginning
    if (e.key === "-" && inputRef.current?.selectionStart === 0 && !displayValue.includes("-")) {
      return;
    }

    // Prevent all other characters
    e.preventDefault();
  };

  // Handle focus events
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Format number when blurred
    const parsed = parseInput(displayValue);
    if (parsed !== null) {
      let constrained = parsed;
      if (min !== undefined && parsed < min) constrained = min;
      if (max !== undefined && parsed > max) constrained = max;
      
      onChange(constrained);
      setDisplayValue(formatNumber(constrained));
    } else {
      // Reset to current value if input is invalid
      onChange(value);
      setDisplayValue(formatNumber(value));
    }
  };

  const baseClass = "w-full px-4 py-3 rounded-lg border transition-all duration-200 text-gray-900 bg-white placeholder-gray-400";
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

  // Handle step increment/decrement
  const handleStep = (direction: 'up' | 'down') => {
    const currentValue = value;
    const stepValue = step || 1;
    
    let newValue: number;
    if (direction === 'up') {
      newValue = currentValue + stepValue;
      if (max !== undefined && newValue > max) newValue = max;
    } else {
      newValue = currentValue - stepValue;
      if (min !== undefined && newValue < min) newValue = min;
    }
    
    onChange(newValue);
  };

  // Handle mouse wheel events
  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    if (!isFocused) return;
    
    e.preventDefault();
    if (e.deltaY < 0) {
      handleStep('up');
    } else if (e.deltaY > 0) {
      handleStep('down');
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        id={id}
        value={displayValue}
        onChange={handleChange}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={getPlaceholder()}
        className={`${inputClassName} ${showSteppers ? 'pr-7' : ''}`}
        data-testid={testId}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid ?? hasError}
        aria-errormessage={ariaErrorMessage}
        inputMode="decimal"
        autoComplete="off"
      />
      {showSteppers && (
        <div className="absolute inset-y-0 right-0 flex flex-col">
          <button
            type="button"
            onClick={() => handleStep('up')}
            className="flex-1 px-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors duration-150 rounded-tr-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            aria-label={`Increase ${ariaLabel || 'value'}`}
            tabIndex={-1}
            data-testid={testId ? `${testId}-increment` : undefined}
          >
            <svg className="w-2.5 h-2.5 mx-auto" viewBox="0 0 10 10">
              <path d="M5 2L8.5 6H1.5L5 2Z" fill="currentColor" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleStep('down')}
            className="flex-1 px-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors duration-150 rounded-br-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            aria-label={`Decrease ${ariaLabel || 'value'}`}
            tabIndex={-1}
            data-testid={testId ? `${testId}-decrement` : undefined}
          >
            <svg className="w-2.5 h-2.5 mx-auto" viewBox="0 0 10 10">
              <path d="M5 8L1.5 4H8.5L5 8Z" fill="currentColor" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}