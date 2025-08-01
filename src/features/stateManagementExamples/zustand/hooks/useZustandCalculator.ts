import type { CalculatorHookReturn } from "../../shared/types";
import { useCalculatorStore } from "../stores/calculatorStore";

export function useZustandCalculator(): CalculatorHookReturn {
  return useCalculatorStore();
}