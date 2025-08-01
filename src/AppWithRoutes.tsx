import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { SavingsAndDepositCalculatorWithErrorBoundary } from "./features/savingsAndDepositCalculator";
import { SavingsAndDepositCalculatorWithContextProvider } from "./features/savingsAndDepositCalculator/components/SavingsAndDepositCalculator/SavingsAndDepositCalculatorWithContextProvider";
import { StateManagementNav } from "./components/StateManagementNav";

function AppWithRoutes() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <StateManagementNav />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Navigate to="/hook" replace />} />
          <Route path="/hook" element={<SavingsAndDepositCalculatorWithErrorBoundary />} />
          <Route path="/context" element={<SavingsAndDepositCalculatorWithContextProvider />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default AppWithRoutes;