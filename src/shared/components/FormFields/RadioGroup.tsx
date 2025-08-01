import React from "react";

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  className?: string;
  testIdPrefix?: string;
}

export function RadioGroup({
  options,
  value,
  onChange,
  name,
  className = "",
  testIdPrefix = "radio",
}: RadioGroupProps): React.JSX.Element {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {options.map((option) => (
        <label
          key={option.value}
          className="inline-flex items-center cursor-pointer group"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="w-4 h-4 text-blue-600 bg-white border-2 border-slate-300 focus:ring-blue-500 focus:ring-2 transition-all"
            data-testid={`${testIdPrefix}${option.value.toLowerCase()}`}
          />
          <span className="ml-2 text-sm text-slate-600 group-hover:text-slate-800 transition-colors font-medium">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}
