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
}: NumberInputProps): React.JSX.Element {
  const baseClass = "w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium text-slate-700 bg-white/50 backdrop-blur-sm";
  const errorClass = hasError 
    ? "border-red-400 bg-red-50/80 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 focus:outline-none" 
    : "border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none";
  
  const inputClassName = `${baseClass} ${errorClass} ${className}`;

  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      className={inputClassName}
      data-testid={testId}
    />
  );
}