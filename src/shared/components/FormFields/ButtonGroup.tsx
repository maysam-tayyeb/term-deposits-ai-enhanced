import React, { useRef } from "react";

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
  ariaLabel?: string;
}

export function ButtonGroup({
  options,
  value,
  onChange,
  className = "",
  testIdPrefix = "button",
  ariaLabel,
}: ButtonGroupProps): React.JSX.Element {
  const gridCols =
    options.length === 2
      ? "grid-cols-2"
      : options.length === 3
        ? "grid-cols-3"
        : options.length === 4
          ? "grid-cols-4"
          : "grid-cols-5";

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let newIndex = index;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        newIndex = (index + 1) % options.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        newIndex = index === 0 ? options.length - 1 : index - 1;
        break;
      case "Home":
        e.preventDefault();
        newIndex = 0;
        break;
      case "End":
        e.preventDefault();
        newIndex = options.length - 1;
        break;
      default:
        return;
    }

    if (newIndex !== index) {
      onChange(options[newIndex].value);
      buttonRefs.current[newIndex]?.focus();
    }
  };

  return (
    <div
      className={`grid ${gridCols} gap-0 rounded-lg overflow-hidden border border-gray-300 h-[44px] ${className}`}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {options.map((option, index) => (
        <button
          key={option.value}
          ref={(el) => {
            buttonRefs.current[index] = el;
          }}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          data-testid={`${testIdPrefix}${option.value.toLowerCase()}`}
          tabIndex={value === option.value ? 0 : -1}
          className={`
            px-4 text-sm font-medium transition-all duration-200
            ${
              value === option.value
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }
            ${index > 0 ? "border-l border-gray-300" : ""}
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
          `}
          aria-label={option.label}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
