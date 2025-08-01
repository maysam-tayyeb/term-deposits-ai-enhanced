import { useSnapshot } from "valtio";
import type { CalculatorHookReturn } from "../../shared/types";
import { calculatorStore, calculatorActions } from "../stores/calculatorStore";

export function useValtioCalculator(): CalculatorHookReturn {
  const snap = useSnapshot(calculatorStore);

  return {
    principal: snap.principal,
    annualRate: snap.annualRate,
    months: snap.months,
    frequency: snap.frequency,
    schedule: snap.schedule,
    error: snap.error,
    setPrincipal: calculatorActions.setPrincipal,
    setAnnualRate: calculatorActions.setAnnualRate,
    setMonths: calculatorActions.setMonths,
    setFrequency: calculatorActions.setFrequency,
    resetToDefaults: calculatorActions.resetToDefaults,
  };
}