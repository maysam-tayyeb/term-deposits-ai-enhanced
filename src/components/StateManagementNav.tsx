import { NavLink, useLocation } from "react-router-dom";

export function StateManagementNav() {
  const location = useLocation();
  
  const implementations = [
    {
      path: "/hook",
      label: "Custom Hook",
      description: "useCalculator with localStorage",
      details: "Current implementation - Simple and performant",
      complexity: "Low (2 files)",
      performance: "Optimal",
      bestFor: "Single features"
    },
    {
      path: "/context",
      label: "Context + Reducer",
      description: "Context API with useReducer",
      details: "Redux-like pattern with actions",
      complexity: "High (5 files)",
      performance: "Good",
      bestFor: "Complex apps"
    },
    {
      path: "/valtio",
      label: "Valtio",
      description: "Proxy-based state with Valtio",
      details: "Modern proxy state - Mutable API",
      complexity: "Low (1 file)",
      performance: "Excellent",
      bestFor: "React + mutations"
    },
    {
      path: "/zustand",
      label: "Zustand",
      description: "Zustand store with persistence",
      details: "Lightweight Redux alternative",
      complexity: "Medium (1 file)",
      performance: "Excellent",
      bestFor: "Modern apps"
    },
    {
      path: "/redux",
      label: "Redux Toolkit",
      description: "Redux Toolkit with slices",
      details: "Industry standard state management",
      complexity: "High (4 files)",
      performance: "Good",
      bestFor: "Large apps"
    }
  ];

  const currentImpl = implementations.find(impl => impl.path === location.pathname);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">State Management Comparison</h1>
            <p className="text-xs text-green-400 mt-1">
              ✨ All implementations share the same localStorage state
            </p>
          </div>
          
          <div className="flex gap-1.5 flex-wrap flex-shrink-0">
            {implementations.map((impl) => (
              <NavLink
                key={impl.path}
                to={impl.path}
                className={({ isActive }) =>
                  `px-2.5 py-1.5 rounded-md transition-all duration-200 flex items-center text-xs font-medium whitespace-nowrap ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                  }`
                }
              >
                {impl.label}
              </NavLink>
            ))}
          </div>
        </div>
        
        {/* Current Implementation Description - Below the nav */}
        {currentImpl && (
          <p className="text-sm text-gray-400 mt-2">
            {currentImpl.description} - {currentImpl.details}
          </p>
        )}
        
        {/* Implementation Details Banner */}
        {currentImpl && (
          <div className="mt-4 p-3 bg-gray-700 rounded-lg">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs md:text-sm">
              <div>
                <span className="text-gray-400">Pattern:</span>
                <span className="ml-2 text-white">
                  {currentImpl.path === "/hook" ? "Component Hook" : 
                   currentImpl.path === "/context" ? "Provider Pattern" :
                   currentImpl.path === "/valtio" ? "Proxy State" : 
                   currentImpl.path === "/redux" ? "Redux Pattern" : "Store Pattern"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Complexity:</span>
                <span className="ml-2 text-white">{currentImpl.complexity}</span>
              </div>
              <div>
                <span className="text-gray-400">Performance:</span>
                <span className="ml-2 text-white">{currentImpl.performance}</span>
              </div>
              <div>
                <span className="text-gray-400">Best For:</span>
                <span className="ml-2 text-white">{currentImpl.bestFor}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}