import React from "react";

export interface ButtonOption {
  value: string;
  label: string;
}

export interface ButtonGroupProps {
  options: ButtonOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  testIdPrefix?: string;
}

export function ButtonGroup({
  options,
  value,
  onChange,
  className = "",
  testIdPrefix = "button",
}: ButtonGroupProps): React.JSX.Element {
  const gridCols = options.length === 2 ? 'grid-cols-2' : 
                   options.length === 3 ? 'grid-cols-3' : 
                   options.length === 4 ? 'grid-cols-4' : 
                   'grid-cols-5';
  
  return (
    <div className={`grid ${gridCols} gap-0 rounded-lg overflow-hidden border border-gray-300 h-[44px] ${className}`}>
      {options.map((option, index) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          data-testid={`${testIdPrefix}${option.value.toLowerCase()}`}
          className={`
            px-4 text-sm font-medium transition-all duration-200
            ${value === option.value 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-50'
            }
            ${index > 0 ? 'border-l border-gray-300' : ''}
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}