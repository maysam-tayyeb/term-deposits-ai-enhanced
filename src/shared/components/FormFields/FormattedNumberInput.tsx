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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const stepIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stepTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stepCountRef = useRef(0);
  const focusTimeoutRef = useRef<NodeJS.Timeout>();

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
    if (isTransitioning) return;
    
    if (!isFocused) {
      setDisplayValue(formatNumber(value));
    } else {
      setDisplayValue(value.toString());
    }
  }, [value, isFocused, isTransitioning, formatNumber]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDisplayValue(input);

    if (isFocused) {
      // When focused (type="number"), parse directly
      const numValue = parseFloat(input);
      if (!isNaN(numValue)) {
        let constrained = numValue;
        if (min !== undefined && numValue < min) constrained = min;
        if (max !== undefined && numValue > max) constrained = max;
        onChange(constrained);
      } else if (input === "" || input === "-") {
        // Allow empty or minus sign while typing
        setDisplayValue(input);
      }
    } else {
      // When not focused (type="text"), use parseInput for formatting
      const parsed = parseInput(input);
      if (parsed !== null) {
        let constrained = parsed;
        if (min !== undefined && parsed < min) constrained = min;
        if (max !== undefined && parsed > max) constrained = max;
        onChange(constrained);
      }
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
    // When type="number" and focused, let browser handle arrow keys natively
    if (isFocused && !isTransitioning) {
      // Don't interfere with number input's native behavior
      return;
    }
    
    // Handle arrow keys for stepping when type="text"
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

  // Handle focus events with debouncing
  const handleFocus = () => {
    // Clear any pending blur
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
    }
    
    if (!isFocused && !isTransitioning) {
      setIsTransitioning(true);
      setIsFocused(true);
      
      // Set numeric value for number input
      setDisplayValue(value.toString());
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }
  };

  const handleBlur = () => {
    // Debounce blur to prevent rapid switching
    focusTimeoutRef.current = setTimeout(() => {
      if (isFocused && !isTransitioning) {
        setIsTransitioning(true);
        setIsFocused(false);
        
        // Parse and validate the current input
        const currentInput = inputRef.current?.value || displayValue;
        const parsed = parseFloat(currentInput);
        
        let validValue = value;
        if (!isNaN(parsed)) {
          validValue = parsed;
          if (min !== undefined && validValue < min) validValue = min;
          if (max !== undefined && validValue > max) validValue = max;
        }
        
        onChange(validValue);
        setDisplayValue(formatNumber(validValue));
        
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }
    }, 100);
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
  const handleStep = useCallback((direction: 'up' | 'down') => {
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
    
    // Fix floating point precision issues
    // Count decimal places in step to determine precision
    const stepDecimals = (stepValue.toString().split('.')[1] || '').length;
    if (stepDecimals > 0) {
      newValue = Math.round(newValue * Math.pow(10, stepDecimals)) / Math.pow(10, stepDecimals);
    }
    
    onChange(newValue);
  }, [value, step, min, max, onChange]);

  // Handle auto-repeat stepping when holding mouse down
  const startAutoStep = useCallback((direction: 'up' | 'down') => {
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
      // Initial repeat interval (slower)
      let currentDelay = 200;
      
      const performStep = () => {
        handleStep(direction);
        stepCountRef.current++;
        
        // Accelerate the stepping speed based on how long the button is held
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
    }, 300); // Initial delay before auto-repeat starts
  }, [handleStep]);

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

  // Clean up intervals and timeouts on unmount
  useEffect(() => {
    return () => {
      stopAutoStep();
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
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
        handleStep('up');
      } else if (e.deltaY > 0) {
        handleStep('down');
      }
    };

    // Add event listener with passive: false to allow preventDefault
    input.addEventListener('wheel', wheelHandler, { passive: false });

    return () => {
      input.removeEventListener('wheel', wheelHandler);
    };
  }, [isFocused, handleStep]);

  return (
    <div className="relative group">
      <input
        ref={inputRef}
        type={isFocused && !isTransitioning ? "number" : "text"}
        id={id}
        value={displayValue}
        onChange={handleChange}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={getPlaceholder()}
        className={`${inputClassName} ${showSteppers ? 'pr-10' : ''}`}
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
      {showSteppers && (
        <div className="absolute inset-y-0 right-2 flex items-center opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
          <div className="flex flex-col h-5">
            <button
              type="button"
              onMouseDown={() => startAutoStep('up')}
              onMouseUp={stopAutoStep}
              onMouseLeave={stopAutoStep}
              onTouchStart={() => startAutoStep('up')}
              onTouchEnd={stopAutoStep}
              className="flex items-center justify-center h-2.5 w-5 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label={`Increase ${ariaLabel || 'value'}`}
              tabIndex={-1}
              data-testid={testId ? `${testId}-increment` : undefined}
            >
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path d="M3 8L6 5L9 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              type="button"
              onMouseDown={() => startAutoStep('down')}
              onMouseUp={stopAutoStep}
              onMouseLeave={stopAutoStep}
              onTouchStart={() => startAutoStep('down')}
              onTouchEnd={stopAutoStep}
              className="flex items-center justify-center h-2.5 w-5 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label={`Decrease ${ariaLabel || 'value'}`}
              tabIndex={-1}
              data-testid={testId ? `${testId}-decrement` : undefined}
            >
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path d="M3 4L6 7L9 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}