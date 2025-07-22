import React from "react";

export interface FormFieldProps {
  label: string;
  icon?: React.ReactNode;
  error?: string[];
  helpText?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  icon,
  error,
  helpText,
  children,
  className = "",
}: FormFieldProps): React.JSX.Element {
  const hasError = error && error.length > 0;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
        {icon}
        {label}
      </label>
      
      {children}
      
      {hasError ? (
        <div className="mt-1">
          {error.map((errMsg, index) => (
            <p key={index} className="text-xs text-red-600">
              {errMsg}
            </p>
          ))}
        </div>
      ) : (
        helpText && (
          <p className="text-xs text-gray-500">
            {helpText}
          </p>
        )
      )}
    </div>
  );
}