import { NavLink, useLocation } from "react-router-dom";

interface Implementation {
  path: string;
  label: string;
  description: string;
  details: string;
  complexity: string;
  performance: string;
  bestFor: string;
  mfeSupport: string;
  debugging: string;
  enterprise: string;
  teamSize: string;
  learning: string;
}

export function StateManagementNav() {
  const location = useLocation();
  
  const implementations: Implementation[] = [
    {
      path: "/hook",
      label: "Custom Hook",
      description: "useCalculator with localStorage",
      details: "Current implementation - Simple and performant",
      complexity: "Low (2 files)",
      performance: "Optimal",
      bestFor: "Single features",
      mfeSupport: "Isolated per MFE",
      debugging: "Easy (React DevTools)",
      enterprise: "Good for isolated modules",
      teamSize: "1-3 developers",
      learning: "Minimal - React basics"
    },
    {
      path: "/context",
      label: "Context + Reducer",
      description: "Context API with useReducer",
      details: "Redux-like pattern with actions",
      complexity: "High (5 files)",
      performance: "Good",
      bestFor: "Complex apps",
      mfeSupport: "Requires coordination",
      debugging: "Good (action logs)",
      enterprise: "Good for medium apps",
      teamSize: "3-10 developers",
      learning: "Medium - Redux concepts"
    },
    {
      path: "/valtio",
      label: "Valtio",
      description: "Proxy-based state with Valtio",
      details: "Modern proxy state - Mutable API",
      complexity: "Low (1 file)",
      performance: "Excellent",
      bestFor: "React + mutations",
      mfeSupport: "Good with module federation",
      debugging: "Good (Valtio DevTools)",
      enterprise: "Growing adoption",
      teamSize: "2-8 developers",
      learning: "Low - intuitive API"
    },
    {
      path: "/zustand",
      label: "Zustand",
      description: "Zustand store with persistence",
      details: "Lightweight Redux alternative",
      complexity: "Medium (1 file)",
      performance: "Excellent",
      bestFor: "Modern apps",
      mfeSupport: "Excellent for MFEs",
      debugging: "Good (Zustand DevTools)",
      enterprise: "Recommended for modern stack",
      teamSize: "2-15 developers",
      learning: "Low - simple API"
    },
    {
      path: "/redux",
      label: "Redux Toolkit",
      description: "Redux Toolkit with slices",
      details: "Industry standard state management",
      complexity: "High (4 files)",
      performance: "Good",
      bestFor: "Large apps",
      mfeSupport: "Complex but proven",
      debugging: "Excellent (Redux DevTools)",
      enterprise: "Industry standard",
      teamSize: "5+ developers",
      learning: "High - full ecosystem"
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
        
        {/* Implementation Details */}
        {currentImpl && (
          <div className="mt-4 p-3 bg-gray-700 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <div className="text-gray-400 mb-1">Pattern</div>
                <div className="text-white font-medium">
                  {currentImpl.path === "/hook" ? "Component Hook" : 
                   currentImpl.path === "/context" ? "Provider Pattern" :
                   currentImpl.path === "/valtio" ? "Proxy State" : 
                   currentImpl.path === "/redux" ? "Redux Pattern" : "Store Pattern"}
                </div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Complexity</div>
                <div className="text-white font-medium">{currentImpl.complexity}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Performance</div>
                <div className="text-white font-medium">{currentImpl.performance}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Best For</div>
                <div className="text-white font-medium">{currentImpl.bestFor}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">MFE Support</div>
                <div className="text-white font-medium">{currentImpl.mfeSupport}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Debugging</div>
                <div className="text-white font-medium">{currentImpl.debugging}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Enterprise</div>
                <div className="text-white font-medium">{currentImpl.enterprise}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Team Size</div>
                <div className="text-white font-medium">{currentImpl.teamSize}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}