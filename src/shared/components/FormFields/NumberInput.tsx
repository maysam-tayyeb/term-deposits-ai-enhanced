import React from "react";

export interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
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
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
  hasError = false,
  placeholder,
  className = "",
  testId,
  ariaLabel,
  ariaDescribedBy,
  ariaInvalid,
  ariaErrorMessage,
  id,
}: NumberInputProps): React.JSX.Element {
  const baseClass = "w-full px-4 py-3 rounded-lg border transition-all duration-200 text-gray-900 bg-white placeholder-gray-400";
  const errorClass = hasError 
    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none" 
    : "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none";
  
  const inputClassName = `${baseClass} ${errorClass} ${className}`;

  return (
    <input
      type="number"
      id={id}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      className={inputClassName}
      data-testid={testId}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid ?? hasError}
      aria-errormessage={ariaErrorMessage}
      inputMode="decimal"
      autoComplete="off"
    />
  );
}