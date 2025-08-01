import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface TestConfig {
  samplesPerRoute: number;
  interactionDelay: number;
  routeChangeDelay: number;
}

const routes = [
  { path: "/hook", name: "Custom Hook" },
  { path: "/context", name: "Context + Reducer" },
  { path: "/valtio", name: "Valtio" },
  { path: "/zustand", name: "Zustand" },
  { path: "/redux", name: "Redux Toolkit" },
];

// Test scenarios to generate diverse performance samples
const testScenarios = [
  { principal: 1000, rate: 5, months: 12, frequency: "monthly" },
  { principal: 10000, rate: 7.5, months: 24, frequency: "quarterly" },
  { principal: 50000, rate: 10, months: 36, frequency: "annually" },
  { principal: 100000, rate: 12.5, months: 60, frequency: "atMaturity" },
  { principal: 5000, rate: 3.5, months: 6, frequency: "monthly" },
  { principal: 25000, rate: 8, months: 48, frequency: "quarterly" },
  { principal: 75000, rate: 15, months: 120, frequency: "annually" },
  { principal: 2500, rate: 6, months: 18, frequency: "monthly" },
];

export function AutomatedPerformanceTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState<TestConfig>({
    samplesPerRoute: 50,
    interactionDelay: 100,
    routeChangeDelay: 2000,
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const abortRef = useRef(false);

  // Calculate total operations
  const totalOperations = routes.length * config.samplesPerRoute;

  const simulateInteraction = useCallback(async () => {
    // Pick a random scenario
    const scenario = testScenarios[Math.floor(Math.random() * testScenarios.length)];
    
    // Find form inputs using the correct test IDs
    const principalInput = document.querySelector('[data-testid="principal-input"]') as HTMLInputElement;
    const rateInput = document.querySelector('[data-testid="interest-rate-input"]') as HTMLInputElement;
    const monthsInput = document.querySelector('[data-testid="investment-term-input"]') as HTMLInputElement;
    
    if (principalInput && rateInput && monthsInput) {
      // Helper to trigger React's onChange
      const setNativeValue = (element: HTMLInputElement, value: string) => {
        const lastValue = element.value;
        element.value = value;
        const event = new Event('input', { bubbles: true });
        // React tracks this internally
        const tracker = (element as any)._valueTracker;
        if (tracker) {
          tracker.setValue(lastValue);
        }
        element.dispatchEvent(event);
      };
      
      // Update principal
      principalInput.focus();
      setNativeValue(principalInput, scenario.principal.toString());
      principalInput.blur();
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Update rate
      rateInput.focus();
      setNativeValue(rateInput, scenario.rate.toString());
      rateInput.blur();
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Update months
      monthsInput.focus();
      setNativeValue(monthsInput, scenario.months.toString());
      monthsInput.blur();
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Find and click frequency buttons using the correct test ID pattern
      const frequencyButtons = document.querySelectorAll(`[data-testid^="radio-re-invest-"]`);
      if (frequencyButtons.length > 0) {
        // Find the button matching our scenario frequency
        const targetButton = Array.from(frequencyButtons).find(btn => 
          btn.getAttribute('data-testid')?.includes(scenario.frequency)
        ) || frequencyButtons[Math.floor(Math.random() * frequencyButtons.length)];
        
        (targetButton as HTMLButtonElement).click();
      }
    }
  }, []);

  const runTests = useCallback(async () => {
    setIsRunning(true);
    abortRef.current = false;
    
    let completedOperations = 0;
    setProgress({ current: 0, total: totalOperations });

    // Clear any existing performance data
    const clearButtons = Array.from(document.querySelectorAll('button')).filter(
      btn => btn.textContent?.includes('Clear')
    );
    clearButtons.forEach(btn => btn.click());
    
    for (const route of routes) {
      if (abortRef.current) break;
      
      // Navigate to route
      navigate(route.path);
      console.log(`Testing ${route.name}...`);
      
      // Wait for route to load
      await new Promise(resolve => setTimeout(resolve, config.routeChangeDelay));
      
      // Run interactions for this route
      for (let i = 0; i < config.samplesPerRoute; i++) {
        if (abortRef.current) break;
        
        await simulateInteraction();
        await new Promise(resolve => setTimeout(resolve, config.interactionDelay));
        
        completedOperations++;
        setProgress({ current: completedOperations, total: totalOperations });
      }
    }
    
    setIsRunning(false);
    
    if (!abortRef.current) {
      // Show comparison table
      const showComparisonBtn = Array.from(document.querySelectorAll('button')).find(
        btn => btn.textContent?.includes('Show Performance Comparison')
      );
      if (showComparisonBtn) {
        showComparisonBtn.click();
      }
    }
  }, [navigate, config, totalOperations, simulateInteraction]);

  const stopTests = useCallback(() => {
    abortRef.current = true;
    setIsRunning(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current = true;
    };
  }, []);

  return (
    <>
      <div className="fixed bottom-4 left-4 bg-white shadow-lg rounded-lg p-4 border border-gray-200">
        <h3 className="font-bold text-sm mb-3">Automated Performance Test</h3>
        
        {!showConfig ? (
          <div className="space-y-3">
            <button
              onClick={() => setShowConfig(true)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Configure Test
            </button>
            
            {!isRunning ? (
              <button
                onClick={runTests}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
              >
                Run Performance Test
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={stopTests}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
                >
                  Stop Test
                </button>
                <div className="text-xs text-gray-600">
                  <div className="mb-1">
                    Progress: {progress.current}/{progress.total}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(progress.current / progress.total) * 100}%` }}
                    />
                  </div>
                  <div className="mt-1">
                    Current: {location.pathname}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Samples per route
              </label>
              <input
                type="number"
                min="10"
                max="200"
                value={config.samplesPerRoute}
                onChange={(e) => setConfig({ ...config, samplesPerRoute: parseInt(e.target.value) || 50 })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Interaction delay (ms)
              </label>
              <input
                type="number"
                min="50"
                max="1000"
                value={config.interactionDelay}
                onChange={(e) => setConfig({ ...config, interactionDelay: parseInt(e.target.value) || 100 })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Route change delay (ms)
              </label>
              <input
                type="number"
                min="500"
                max="5000"
                value={config.routeChangeDelay}
                onChange={(e) => setConfig({ ...config, routeChangeDelay: parseInt(e.target.value) || 2000 })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            
            <div className="text-xs text-gray-600">
              Total samples: {totalOperations}
              <br />
              Est. time: {Math.ceil((routes.length * config.routeChangeDelay + totalOperations * config.interactionDelay) / 1000)}s
            </div>
            
            <button
              onClick={() => setShowConfig(false)}
              className="w-full px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </>
  );
}