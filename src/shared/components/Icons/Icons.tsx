import React from "react";

export interface IconProps {
  className?: string;
  size?: number;
}


// Currency & Financial Icons
export function DollarSignIcon({ className = "w-5 h-5", size }: IconProps): React.JSX.Element {
  const sizeClass = size ? `w-${size} h-${size}` : className;
  return (
    <svg className={sizeClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  );
}

export function TrendingUpIcon({ className = "w-5 h-5", size }: IconProps): React.JSX.Element {
  const sizeClass = size ? `w-${size} h-${size}` : className;
  return (
    <svg className={sizeClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

export function ClockIcon({ className = "w-5 h-5", size }: IconProps): React.JSX.Element {
  const sizeClass = size ? `w-${size} h-${size}` : className;
  return (
    <svg className={sizeClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function RefreshIcon({ className = "w-5 h-5", size }: IconProps): React.JSX.Element {
  const sizeClass = size ? `w-${size} h-${size}` : className;
  return (
    <svg className={sizeClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

// Table & Data Icons
export function TableIcon({ className = "w-5 h-5", size }: IconProps): React.JSX.Element {
  const sizeClass = size ? `w-${size} h-${size}` : className;
  return (
    <svg className={sizeClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  );
}

export function CalculatorIcon({ className = "w-5 h-5", size }: IconProps): React.JSX.Element {
  const sizeClass = size ? `w-${size} h-${size}` : className;
  return (
    <svg className={sizeClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}

export function ChartBarIcon({ className = "w-5 h-5", size }: IconProps): React.JSX.Element {
  const sizeClass = size ? `w-${size} h-${size}` : className;
  return (
    <svg className={sizeClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

// Status & Alert Icons
export function ExclamationTriangleIcon({ className = "w-5 h-5", size }: IconProps): React.JSX.Element {
  const sizeClass = size ? `w-${size} h-${size}` : className;
  return (
    <svg className={sizeClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  );
}

export function InformationCircleIcon({ className = "w-5 h-5", size }: IconProps): React.JSX.Element {
  const sizeClass = size ? `w-${size} h-${size}` : className;
  return (
    <svg className={sizeClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
  );
}

export function CheckCircleIcon({ className = "w-5 h-5", size }: IconProps): React.JSX.Element {
  const sizeClass = size ? `w-${size} h-${size}` : className;
  return (
    <svg className={sizeClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// Brand Icon (App Logo)
export function AppLogoIcon({ className = "w-6 h-6", size }: IconProps): React.JSX.Element {
  const sizeClass = size ? `w-${size} h-${size}` : className;
  return (
    <svg className={sizeClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  );
}