import { useState, useEffect } from "react";

interface PerformanceData {
  implementation: string;
  samples: number;
  average: {
    calculation: number;
    render: number;
    total: number;
  };
  p50: {
    calculation: number;
    render: number;
    total: number;
  };
  p95: {
    calculation: number;
    render: number;
    total: number;
  };
  p99: {
    calculation: number;
    render: number;
    total: number;
  };
}

export function PerformanceComparison() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [showTable, setShowTable] = useState(false);

  // Function to manually collect current performance data
  const collectCurrentData = () => {
    // Dispatch event to request current stats from all implementations
    window.dispatchEvent(new CustomEvent('request-performance-data'));
  };

  useEffect(() => {
    // Listen for performance updates from all implementations
    const handlePerformanceUpdate = (event: CustomEvent) => {
      const { implementation, stats } = event.detail;
      
      setPerformanceData(prev => {
        const existing = prev.findIndex(p => p.implementation === implementation);
        const newData: PerformanceData = {
          implementation,
          samples: stats.count,
          average: {
            calculation: stats.average.calculationTime,
            render: stats.average.renderTime,
            total: stats.average.totalTime,
          },
          p50: {
            calculation: stats.percentiles.p50.calculationTime,
            render: stats.percentiles.p50.renderTime,
            total: stats.percentiles.p50.totalTime,
          },
          p95: {
            calculation: stats.percentiles.p95.calculationTime,
            render: stats.percentiles.p95.renderTime,
            total: stats.percentiles.p95.totalTime,
          },
          p99: {
            calculation: stats.percentiles.p99.calculationTime,
            render: stats.percentiles.p99.renderTime,
            total: stats.percentiles.p99.totalTime,
          },
        };
        
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = newData;
          return updated;
        }
        return [...prev, newData];
      });
    };

    window.addEventListener('performance-update', handlePerformanceUpdate as EventListener);
    
    // Collect data when table is opened
    if (showTable) {
      collectCurrentData();
    }
    
    return () => {
      window.removeEventListener('performance-update', handlePerformanceUpdate as EventListener);
    };
  }, [showTable]);

  const formatTime = (time: number) => {
    if (!time || time === 0) return "—";
    return time.toFixed(2);
  };

  const getBestPerformer = (metric: 'calculation' | 'render' | 'total', percentile: 'average' | 'p50' | 'p95' | 'p99') => {
    if (performanceData.length === 0) return '';
    
    const validData = performanceData.filter(d => d.samples >= 10);
    if (validData.length === 0) return '';
    
    return validData.reduce((best, current) => {
      const bestValue = best[percentile][metric];
      const currentValue = current[percentile][metric];
      return currentValue < bestValue ? current : best;
    }).implementation;
  };

  if (!showTable) {
    return (
      <button
        onClick={() => setShowTable(true)}
        className="fixed top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 text-sm"
      >
        Show Performance Comparison
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-white shadow-xl rounded-lg p-6 max-w-5xl border border-gray-200 z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Performance Comparison</h2>
        <button
          onClick={() => setShowTable(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {performanceData.length === 0 ? (
        <p className="text-gray-500">No performance data collected yet. Interact with the calculators to see metrics.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-4">Implementation</th>
                <th className="text-center py-2 px-4">Samples</th>
                <th className="text-center py-2 px-4" colSpan={3}>Average (ms)</th>
                <th className="text-center py-2 px-4" colSpan={3}>P50 (ms)</th>
                <th className="text-center py-2 px-4" colSpan={3}>P95 (ms)</th>
                <th className="text-center py-2 px-4" colSpan={3}>P99 (ms)</th>
              </tr>
              <tr className="border-b border-gray-200 text-xs text-gray-600">
                <th></th>
                <th></th>
                <th className="text-center py-1">Calc</th>
                <th className="text-center py-1">Render</th>
                <th className="text-center py-1">Total</th>
                <th className="text-center py-1">Calc</th>
                <th className="text-center py-1">Render</th>
                <th className="text-center py-1">Total</th>
                <th className="text-center py-1">Calc</th>
                <th className="text-center py-1">Render</th>
                <th className="text-center py-1">Total</th>
                <th className="text-center py-1">Calc</th>
                <th className="text-center py-1">Render</th>
                <th className="text-center py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((data) => {
                const bestAvgCalc = getBestPerformer('calculation', 'average');
                const bestAvgRender = getBestPerformer('render', 'average');
                const bestAvgTotal = getBestPerformer('total', 'average');
                const bestP50Total = getBestPerformer('total', 'p50');
                const bestP95Total = getBestPerformer('total', 'p95');
                const bestP99Total = getBestPerformer('total', 'p99');

                return (
                  <tr key={data.implementation} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium">{data.implementation}</td>
                    <td className="text-center py-2 px-4">{data.samples}</td>
                    
                    {/* Average */}
                    <td className={`text-center py-2 px-4 font-mono ${data.implementation === bestAvgCalc ? 'text-green-600 font-bold' : ''}`}>
                      {formatTime(data.average.calculation)}
                    </td>
                    <td className={`text-center py-2 px-4 font-mono ${data.implementation === bestAvgRender ? 'text-green-600 font-bold' : ''}`}>
                      {formatTime(data.average.render)}
                    </td>
                    <td className={`text-center py-2 px-4 font-mono ${data.implementation === bestAvgTotal ? 'text-green-600 font-bold' : ''}`}>
                      {formatTime(data.average.total)}
                    </td>
                    
                    {/* P50 */}
                    <td className="text-center py-2 px-4 font-mono text-gray-600">
                      {formatTime(data.p50.calculation)}
                    </td>
                    <td className="text-center py-2 px-4 font-mono text-gray-600">
                      {formatTime(data.p50.render)}
                    </td>
                    <td className={`text-center py-2 px-4 font-mono ${data.implementation === bestP50Total ? 'text-green-600 font-bold' : ''}`}>
                      {formatTime(data.p50.total)}
                    </td>
                    
                    {/* P95 */}
                    <td className="text-center py-2 px-4 font-mono text-gray-600">
                      {formatTime(data.p95.calculation)}
                    </td>
                    <td className="text-center py-2 px-4 font-mono text-gray-600">
                      {formatTime(data.p95.render)}
                    </td>
                    <td className={`text-center py-2 px-4 font-mono ${data.implementation === bestP95Total ? 'text-green-600 font-bold' : ''}`}>
                      {formatTime(data.p95.total)}
                    </td>
                    
                    {/* P99 */}
                    <td className="text-center py-2 px-4 font-mono text-gray-600">
                      {formatTime(data.p99.calculation)}
                    </td>
                    <td className="text-center py-2 px-4 font-mono text-gray-600">
                      {formatTime(data.p99.render)}
                    </td>
                    <td className={`text-center py-2 px-4 font-mono ${data.implementation === bestP99Total ? 'text-green-600 font-bold' : ''}`}>
                      {formatTime(data.p99.total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <div className="mt-4 text-xs text-gray-600">
            <p>• Green values indicate best performance in that category</p>
            <p>• Minimum 10 samples required for comparison</p>
            <p>• P50/P95/P99 = 50th/95th/99th percentile (lower is better)</p>
          </div>
        </div>
      )}
    </div>
  );
}