import { NavLink, useLocation } from "react-router-dom";

export function StateManagementNav() {
  const location = useLocation();
  
  const implementations = [
    {
      path: "/hook",
      label: "Custom Hook",
      description: "useCalculator with localStorage",
      details: "Current implementation - Simple and performant"
    },
    {
      path: "/context",
      label: "Context + Reducer",
      description: "Context API with useReducer",
      details: "Alternative implementation - Redux-like pattern"
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
          </div>
          
          <div className="flex gap-2">
            {implementations.map((impl) => (
              <NavLink
                key={impl.path}
                to={impl.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                  }`
                }
              >
                <span className="font-medium">{impl.label}</span>
                {location.pathname === impl.path && (
                  <span className="text-xs bg-blue-500 px-2 py-0.5 rounded">Active</span>
                )}
              </NavLink>
            ))}
          </div>
        </div>
        
        {/* Implementation Details Banner */}
        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Pattern:</span>
              <span className="ml-2 text-white">
                {location.pathname === "/hook" ? "Component Hook" : "Provider Pattern"}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Complexity:</span>
              <span className="ml-2 text-white">
                {location.pathname === "/hook" ? "Low (2 files)" : "High (5 files)"}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Performance:</span>
              <span className="ml-2 text-white">
                {location.pathname === "/hook" ? "Optimal" : "Good (with optimizations)"}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Best For:</span>
              <span className="ml-2 text-white">
                {location.pathname === "/hook" ? "Single features" : "Complex apps"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}