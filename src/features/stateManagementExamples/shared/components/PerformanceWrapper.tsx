import { useEffect } from "react";
import { BaseCalculatorWrapper } from "./BaseCalculatorWrapper";
import { PerformanceDisplay } from "./PerformanceDisplay";
import { usePerformanceTracker } from "../hooks/usePerformanceTracker";
import type { CalculatorHookReturn } from "../types";

interface PerformanceWrapperProps {
  calculator: CalculatorHookReturn;
  implementation: string;
}

export function PerformanceWrapper({ calculator, implementation }: PerformanceWrapperProps) {
  const { startCalculation, endCalculation, endRender, stats, exportData, clearMetrics } = usePerformanceTracker(implementation);
  
  // Track when state changes trigger recalculation
  useEffect(() => {
    startCalculation();
    // The calculation happens synchronously in the hook/store
    endCalculation();
  }, [calculator.principal, calculator.annualRate, calculator.months, calculator.frequency, startCalculation, endCalculation]);
  
  // Track render completion
  useEffect(() => {
    endRender();
  });
  
  return (
    <>
      <BaseCalculatorWrapper calculator={calculator} />
      <PerformanceDisplay 
        stats={stats} 
        implementation={implementation} 
        onExport={exportData}
        onClear={clearMetrics}
      />
    </>
  );
}