import { configureStore } from "@reduxjs/toolkit";
import calculatorReducer from "./calculatorSlice";

export const store = configureStore({
  reducer: {
    calculator: calculatorReducer,
  },
});

// Persist state to localStorage
store.subscribe(() => {
  const state = store.getState().calculator;
  const { principal, annualRate, months, frequency } = state;
  localStorage.setItem(
    "calculatorState",
    JSON.stringify({ principal, annualRate, months, frequency })
  );
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;