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
    }
  ];

  const currentImpl = implementations.find(impl => impl.path === location.pathname);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">State Management Comparison</h1>
            {currentImpl && (
              <p className="text-sm text-gray-400 mt-1">
                {currentImpl.description} - {currentImpl.details}
              </p>
            )}
            <p className="text-xs text-green-400 mt-1">
              ✨ All implementations share the same localStorage state
            </p>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {implementations.map((impl) => (
              <NavLink
                key={impl.path}
                to={impl.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 text-sm ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                  }`
                }
              >
                <span className="font-medium">{impl.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
        
        {/* Implementation Details Banner */}
        {currentImpl && (
          <div className="mt-4 p-3 bg-gray-700 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Pattern:</span>
                <span className="ml-2 text-white">
                  {currentImpl.path === "/hook" ? "Component Hook" : 
                   currentImpl.path === "/context" ? "Provider Pattern" :
                   currentImpl.path === "/valtio" ? "Proxy State" : "Store Pattern"}
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