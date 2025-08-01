import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { SavingsAndDepositCalculatorWithErrorBoundary } from "./features/savingsAndDepositCalculator";
import { SavingsAndDepositCalculatorWithContextProvider } from "./features/savingsAndDepositCalculator/components/SavingsAndDepositCalculator/SavingsAndDepositCalculatorWithContextProvider";
import { SavingsAndDepositCalculatorWithValtio } from "./features/savingsAndDepositCalculator/components/SavingsAndDepositCalculator/SavingsAndDepositCalculatorWithValtio";
import { SavingsAndDepositCalculatorWithZustand } from "./features/savingsAndDepositCalculator/components/SavingsAndDepositCalculator/SavingsAndDepositCalculatorWithZustand";
import { SavingsAndDepositCalculatorWithRedux } from "./features/savingsAndDepositCalculator/components/SavingsAndDepositCalculator/SavingsAndDepositCalculatorWithRedux";
import { StateManagementNav } from "./components/StateManagementNav";
import { SyncIndicator } from "./components/SyncIndicator";

function AppWithRoutes() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <StateManagementNav />
        
        {/* Sync Indicator */}
        <SyncIndicator />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Navigate to="/hook" replace />} />
          <Route path="/hook" element={<SavingsAndDepositCalculatorWithErrorBoundary />} />
          <Route path="/context" element={<SavingsAndDepositCalculatorWithContextProvider />} />
          <Route path="/valtio" element={<SavingsAndDepositCalculatorWithValtio />} />
          <Route path="/zustand" element={<SavingsAndDepositCalculatorWithZustand />} />
          <Route path="/redux" element={<SavingsAndDepositCalculatorWithRedux />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default AppWithRoutes;