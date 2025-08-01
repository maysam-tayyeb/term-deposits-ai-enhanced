import { configureStore } from "@reduxjs/toolkit";
import calculatorReducer, {
  setPrincipal,
  setAnnualRate,
  setMonths,
  setFrequency,
} from "./calculatorSlice";
import { saveAllToStorage, setupStorageListener } from "../../shared/utils";

export const store = configureStore({
  reducer: {
    calculator: calculatorReducer,
  },
});

// Persist state to localStorage using individual keys
store.subscribe(() => {
  const state = store.getState().calculator;
  saveAllToStorage(state);
});

// Listen for localStorage changes from other tabs/implementations
setupStorageListener({
  setPrincipal: (value) => store.dispatch(setPrincipal(value)),
  setAnnualRate: (value) => store.dispatch(setAnnualRate(value)),
  setMonths: (value) => store.dispatch(setMonths(value)),
  setFrequency: (value) => store.dispatch(setFrequency(value)),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;