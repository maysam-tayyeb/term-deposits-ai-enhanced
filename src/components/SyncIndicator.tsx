import { useEffect, useState } from "react";

export function SyncIndicator() {
  const [showSync, setShowSync] = useState(false);
  const [syncSource, setSyncSource] = useState("");

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key?.startsWith("calculator.") && e.newValue !== null) {
        // Determine which value changed
        const field = e.key.replace("calculator.", "");
        setSyncSource(`${field} synced from another tab`);
        setShowSync(true);
        
        // Hide after 2 seconds
        setTimeout(() => setShowSync(false), 2000);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (!showSync) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="text-sm font-medium">{syncSource}</span>
      </div>
    </div>
  );
}