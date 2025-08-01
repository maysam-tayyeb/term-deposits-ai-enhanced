import type { PerformanceStats } from "../hooks/usePerformanceTracker";

interface PerformanceDisplayProps {
  stats: PerformanceStats;
  implementation: string;
  onExport?: () => void;
  onClear?: () => void;
}

export function PerformanceDisplay({ stats, implementation, onExport, onClear }: PerformanceDisplayProps) {
  if (!stats.current) {
    return null;
  }

  const formatTime = (time: number) => {
    if (time === Infinity) return "—";
    return `${time.toFixed(2)}ms`;
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 text-xs max-w-md border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm text-gray-800">{implementation} Performance</h3>
        <div className="flex gap-2">
          {onExport && (
            <button 
              onClick={onExport}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Export
            </button>
          )}
          {onClear && (
            <button 
              onClick={onClear}
              className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-6 gap-1 text-gray-600 text-xs">
        <div className="font-semibold">Metric</div>
        <div className="font-semibold text-right">Current</div>
        <div className="font-semibold text-right">Avg</div>
        <div className="font-semibold text-right">P50</div>
        <div className="font-semibold text-right">P95</div>
        <div className="font-semibold text-right">P99</div>
        
        <div>Calc</div>
        <div className="text-right font-mono">{formatTime(stats.current.calculationTime)}</div>
        <div className="text-right font-mono">{formatTime(stats.average.calculationTime)}</div>
        <div className="text-right font-mono">{formatTime(stats.percentiles.p50.calculationTime)}</div>
        <div className="text-right font-mono">{formatTime(stats.percentiles.p95.calculationTime)}</div>
        <div className="text-right font-mono">{formatTime(stats.percentiles.p99.calculationTime)}</div>
        
        <div>Render</div>
        <div className="text-right font-mono">{formatTime(stats.current.renderTime)}</div>
        <div className="text-right font-mono">{formatTime(stats.average.renderTime)}</div>
        <div className="text-right font-mono">{formatTime(stats.percentiles.p50.renderTime)}</div>
        <div className="text-right font-mono">{formatTime(stats.percentiles.p95.renderTime)}</div>
        <div className="text-right font-mono">{formatTime(stats.percentiles.p99.renderTime)}</div>
        
        <div className="font-semibold">Total</div>
        <div className="text-right font-mono font-semibold">{formatTime(stats.current.totalTime)}</div>
        <div className="text-right font-mono font-semibold">{formatTime(stats.average.totalTime)}</div>
        <div className="text-right font-mono font-semibold">{formatTime(stats.percentiles.p50.totalTime)}</div>
        <div className="text-right font-mono font-semibold">{formatTime(stats.percentiles.p95.totalTime)}</div>
        <div className="text-right font-mono font-semibold">{formatTime(stats.percentiles.p99.totalTime)}</div>
      </div>
      
      <div className="mt-2 text-gray-500 flex justify-between">
        <span>Samples: {stats.count}/1000</span>
        <span>Min/Max: {formatTime(stats.min.totalTime)}/{formatTime(stats.max.totalTime)}</span>
      </div>
    </div>
  );
}