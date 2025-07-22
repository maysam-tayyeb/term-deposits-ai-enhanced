import React from "react";

export interface IconWrapperProps {
  children: React.ReactNode;
  gradient: string;
  className?: string;
}

export function IconWrapper({ 
  children, 
  gradient,
  className = "w-5 h-5 rounded-md"
}: IconWrapperProps): React.JSX.Element {
  return (
    <div className={`${gradient} ${className} flex items-center justify-center`}>
      {children}
    </div>
  );
}

// Pre-defined gradient combinations for consistency
export const IconGradients = {
  green: "bg-gradient-to-br from-green-400 to-emerald-500",
  purple: "bg-gradient-to-br from-purple-400 to-indigo-500", 
  blue: "bg-gradient-to-br from-blue-400 to-cyan-500",
  amber: "bg-gradient-to-br from-amber-400 to-orange-500",
  emerald: "bg-gradient-to-br from-emerald-500 to-teal-600",
  orange: "bg-gradient-to-br from-amber-500 to-orange-600",
  indigo: "bg-gradient-to-br from-blue-500 to-indigo-600",
  red: "bg-gradient-to-br from-red-500 to-red-600",
} as const;