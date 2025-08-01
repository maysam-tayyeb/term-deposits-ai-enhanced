import { configureStore } from "@reduxjs/toolkit";
import calculatorReducer, { syncFromStorage } from "./calculatorSlice";

export const store = configureStore({
  reducer: {
    calculator: calculatorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["calculator/setError"],
        // Ignore these paths in the state
        ignoredPaths: ["calculator.error"],
      },
    }),
});

// Listen for storage changes from other tabs
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    const STORAGE_KEYS = {
      principal: "calculator.principal",
      annualRate: "calculator.annualRate",
      months: "calculator.months",
      frequency: "calculator.frequency",
    };

    if (e.key && Object.values(STORAGE_KEYS).includes(e.key) && e.newValue !== null) {
      store.dispatch(syncFromStorage({ key: e.key, value: e.newValue }));
    }
  });
}

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;