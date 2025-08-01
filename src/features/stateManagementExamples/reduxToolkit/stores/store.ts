import { configureStore } from "@reduxjs/toolkit";
import calculatorReducer, {
  setPrincipal,
  setAnnualRate,
  setMonths,
  setFrequency,
} from "./calculatorSlice";

export const store = configureStore({
  reducer: {
    calculator: calculatorReducer,
  },
});

// Persist state to localStorage using individual keys
store.subscribe(() => {
  const state = store.getState().calculator;
  localStorage.setItem("calculator.principal", JSON.stringify(state.principal));
  localStorage.setItem("calculator.annualRate", JSON.stringify(state.annualRate));
  localStorage.setItem("calculator.months", JSON.stringify(state.months));
  localStorage.setItem("calculator.frequency", JSON.stringify(state.frequency));
});

// Listen for localStorage changes from other tabs/implementations
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (!e.key || !e.newValue) return;
    
    const value = JSON.parse(e.newValue);
    
    switch (e.key) {
      case "calculator.principal":
        store.dispatch(setPrincipal(value));
        break;
      case "calculator.annualRate":
        store.dispatch(setAnnualRate(value));
        break;
      case "calculator.months":
        store.dispatch(setMonths(value));
        break;
      case "calculator.frequency":
        store.dispatch(setFrequency(value));
        break;
    }
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;