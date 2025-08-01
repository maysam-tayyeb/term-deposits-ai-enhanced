import React from "react";

export interface FormFieldProps {
  label: string;
  icon?: React.ReactNode;
  error?: string[];
  helpText?: string;
  children: React.ReactNode;
  className?: string;
  fieldId?: string;
}

export function FormField({
  label,
  icon,
  error,
  helpText,
  children,
  className = "",
  fieldId,
}: FormFieldProps): React.JSX.Element {
  const hasError = error && error.length > 0;
  const helpTextId = fieldId ? `${fieldId}-help` : undefined;
  const errorId = fieldId ? `${fieldId}-error` : undefined;

  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={fieldId}
        className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2"
      >
        {icon}
        {label}
      </label>
      
      {children}
      
      {hasError ? (
        <div className="mt-1" id={errorId} role="alert">
          {error.map((errMsg, index) => (
            <p key={index} className="text-xs text-red-600">
              {errMsg}
            </p>
          ))}
        </div>
      ) : (
        helpText && (
          <p id={helpTextId} className="text-xs text-gray-500">
            {helpText}
          </p>
        )
      )}
    </div>
  );
}