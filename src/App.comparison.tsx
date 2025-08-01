import { useState } from "react";
import "./App.css";
import { SavingsAndDepositCalculatorWithErrorBoundary } from "./features/savingsAndDepositCalculator";
import { SavingsAndDepositCalculatorWithContextProvider } from "./features/savingsAndDepositCalculator/components/SavingsAndDepositCalculator/SavingsAndDepositCalculatorWithContextProvider";

function AppComparison() {
  const [implementation, setImplementation] = useState<"hook" | "context">("hook");

  return (
    <div>
      {/* Implementation Switcher */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-center gap-4">
        <span className="font-medium">State Management:</span>
        <button
          onClick={() => setImplementation("hook")}
          className={`px-4 py-2 rounded-md transition-colors ${
            implementation === "hook"
              ? "bg-blue-600 text-white"
              : "bg-gray-600 hover:bg-gray-700"
          }`}
        >
          Custom Hook (Current)
        </button>
        <button
          onClick={() => setImplementation("context")}
          className={`px-4 py-2 rounded-md transition-colors ${
            implementation === "context"
              ? "bg-blue-600 text-white"
              : "bg-gray-600 hover:bg-gray-700"
          }`}
        >
          Context + Reducer
        </button>
        <span className="ml-4 text-sm text-gray-300">
          {implementation === "hook"
            ? "Using useCalculator with localStorage"
            : "Using Context API with useReducer"}
        </span>
      </div>

      {/* Render selected implementation */}
      {implementation === "hook" ? (
        <SavingsAndDepositCalculatorWithErrorBoundary />
      ) : (
        <SavingsAndDepositCalculatorWithContextProvider />
      )}
    </div>
  );
}

export default AppComparison;