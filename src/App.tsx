import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { SavingsAndDepositCalculatorWithHook } from "./features/stateManagementExamples/customHook";
import { SavingsAndDepositCalculatorWithContext } from "./features/stateManagementExamples/contextReducer";
import { SavingsAndDepositCalculatorWithValtio } from "./features/stateManagementExamples/valtio";
import { SavingsAndDepositCalculatorWithZustand } from "./features/stateManagementExamples/zustand";
import { SavingsAndDepositCalculatorWithRedux } from "./features/stateManagementExamples/reduxToolkit";
import { PerformanceComparison, AutomatedPerformanceTest } from "./features/stateManagementExamples/shared/components";
import { StateManagementNav } from "./components/StateManagementNav";
import { SyncIndicator } from "./components/SyncIndicator";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <StateManagementNav />
        
        {/* Sync Indicator */}
        <SyncIndicator />
        
        {/* Performance Comparison */}
        <PerformanceComparison />
        
        {/* Automated Performance Test */}
        <AutomatedPerformanceTest />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Navigate to="/hook" replace />} />
          <Route path="/hook" element={<SavingsAndDepositCalculatorWithHook />} />
          <Route path="/context" element={<SavingsAndDepositCalculatorWithContext />} />
          <Route path="/valtio" element={<SavingsAndDepositCalculatorWithValtio />} />
          <Route path="/zustand" element={<SavingsAndDepositCalculatorWithZustand />} />
          <Route path="/redux" element={<SavingsAndDepositCalculatorWithRedux />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;