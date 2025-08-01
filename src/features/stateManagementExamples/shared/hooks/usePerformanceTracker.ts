import { useRef, useEffect, useState, useCallback } from "react";

interface PerformanceMetrics {
  calculationTime: number;
  renderTime: number;
  totalTime: number;
  timestamp: number;
}

export interface PerformanceStats {
  current: PerformanceMetrics | null;
  average: {
    calculationTime: number;
    renderTime: number;
    totalTime: number;
  };
  min: {
    calculationTime: number;
    renderTime: number;
    totalTime: number;
  };
  max: {
    calculationTime: number;
    renderTime: number;
    totalTime: number;
  };
  percentiles: {
    p50: {
      calculationTime: number;
      renderTime: number;
      totalTime: number;
    };
    p95: {
      calculationTime: number;
      renderTime: number;
      totalTime: number;
    };
    p99: {
      calculationTime: number;
      renderTime: number;
      totalTime: number;
    };
  };
  count: number;
  history: PerformanceMetrics[];
}

interface PerformanceTrackerOptions {
  maxSamples?: number;
  enableConsoleLogging?: boolean;
}

export function usePerformanceTracker(
  implementation: string, 
  options: PerformanceTrackerOptions = {}
) {
  const { 
    maxSamples = 1000, 
    enableConsoleLogging = true 
  } = options;
  const startTimeRef = useRef<number>(0);
  const calculationStartRef = useRef<number>(0);
  const renderStartRef = useRef<number>(0);
  const metricsRef = useRef<PerformanceMetrics[]>([]);
  const [stats, setStats] = useState<PerformanceStats>({
    current: null,
    average: { calculationTime: 0, renderTime: 0, totalTime: 0 },
    min: { calculationTime: Infinity, renderTime: Infinity, totalTime: Infinity },
    max: { calculationTime: 0, renderTime: 0, totalTime: 0 },
    percentiles: {
      p50: { calculationTime: 0, renderTime: 0, totalTime: 0 },
      p95: { calculationTime: 0, renderTime: 0, totalTime: 0 },
      p99: { calculationTime: 0, renderTime: 0, totalTime: 0 },
    },
    count: 0,
    history: [],
  });

  // Mark the start of a calculation
  const startCalculation = useCallback(() => {
    startTimeRef.current = performance.now();
    calculationStartRef.current = performance.now();
  }, []);

  // Mark the end of calculation and start of render
  const endCalculation = useCallback(() => {
    renderStartRef.current = performance.now();
  }, []);

  // Mark the end of render and record metrics
  const endRender = useCallback(() => {
    const endTime = performance.now();
    
    if (startTimeRef.current && calculationStartRef.current && renderStartRef.current) {
      const calculationTime = renderStartRef.current - calculationStartRef.current;
      const renderTime = endTime - renderStartRef.current;
      const totalTime = endTime - startTimeRef.current;
      
      const newMetric: PerformanceMetrics = {
        calculationTime,
        renderTime,
        totalTime,
        timestamp: Date.now(),
      };
      
      metricsRef.current.push(newMetric);
      
      // Keep only last N measurements
      // This prevents unbounded memory growth while maintaining statistical significance
      if (metricsRef.current.length > maxSamples) {
        metricsRef.current.shift();
      }
      
      // Calculate stats
      const history = [...metricsRef.current];
      const count = history.length;
      
      const sum = history.reduce((acc, m) => ({
        calculationTime: acc.calculationTime + m.calculationTime,
        renderTime: acc.renderTime + m.renderTime,
        totalTime: acc.totalTime + m.totalTime,
      }), { calculationTime: 0, renderTime: 0, totalTime: 0 });
      
      const average = {
        calculationTime: sum.calculationTime / count,
        renderTime: sum.renderTime / count,
        totalTime: sum.totalTime / count,
      };
      
      const min = history.reduce((acc, m) => ({
        calculationTime: Math.min(acc.calculationTime, m.calculationTime),
        renderTime: Math.min(acc.renderTime, m.renderTime),
        totalTime: Math.min(acc.totalTime, m.totalTime),
      }), { calculationTime: Infinity, renderTime: Infinity, totalTime: Infinity });
      
      const max = history.reduce((acc, m) => ({
        calculationTime: Math.max(acc.calculationTime, m.calculationTime),
        renderTime: Math.max(acc.renderTime, m.renderTime),
        totalTime: Math.max(acc.totalTime, m.totalTime),
      }), { calculationTime: 0, renderTime: 0, totalTime: 0 });
      
      // Calculate percentiles
      const getPercentile = (arr: number[], p: number) => {
        const sorted = [...arr].sort((a, b) => a - b);
        const index = Math.ceil((p / 100) * sorted.length) - 1;
        return sorted[Math.max(0, index)] || 0;
      };
      
      const calcTimes = history.map(m => m.calculationTime);
      const renderTimes = history.map(m => m.renderTime);
      const totalTimes = history.map(m => m.totalTime);
      
      const percentiles = {
        p50: {
          calculationTime: getPercentile(calcTimes, 50),
          renderTime: getPercentile(renderTimes, 50),
          totalTime: getPercentile(totalTimes, 50),
        },
        p95: {
          calculationTime: getPercentile(calcTimes, 95),
          renderTime: getPercentile(renderTimes, 95),
          totalTime: getPercentile(totalTimes, 95),
        },
        p99: {
          calculationTime: getPercentile(calcTimes, 99),
          renderTime: getPercentile(renderTimes, 99),
          totalTime: getPercentile(totalTimes, 99),
        },
      };
      
      const newStats = {
        current: newMetric,
        average,
        min,
        max,
        percentiles,
        count,
        history,
      };
      
      setStats(newStats);
      
      // Emit event for comparison table
      if (typeof window !== "undefined" && count >= 5) {
        window.dispatchEvent(new CustomEvent('performance-update', {
          detail: { implementation, stats: newStats }
        }));
      }
      
      // Log to console for debugging
      if (enableConsoleLogging) {
        console.log(`[${implementation}] Performance:`, {
          calculation: `${calculationTime.toFixed(2)}ms`,
          render: `${renderTime.toFixed(2)}ms`,
          total: `${totalTime.toFixed(2)}ms`,
        });
      }
    }
    
    // Reset refs
    startTimeRef.current = 0;
    calculationStartRef.current = 0;
    renderStartRef.current = 0;
  }, [implementation]);

  // Track component mount/unmount and listen for data requests
  useEffect(() => {
    console.log(`[${implementation}] Component mounted`);
    
    // Respond to data collection requests
    const handleDataRequest = () => {
      if (stats.count > 0) {
        window.dispatchEvent(new CustomEvent('performance-update', {
          detail: { implementation, stats }
        }));
      }
    };
    
    window.addEventListener('request-performance-data', handleDataRequest);
    
    return () => {
      window.removeEventListener('request-performance-data', handleDataRequest);
      console.log(`[${implementation}] Component unmounted`);
    };
  }, [implementation, stats]);

  // Export data for analysis
  const exportData = useCallback(() => {
    const data = {
      implementation,
      stats: {
        ...stats,
        timestamp: new Date().toISOString(),
      }
    };
    
    // Create a downloadable JSON file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${implementation.toLowerCase().replace(/\s+/g, '-')}-performance-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [implementation, stats]);

  // Clear all metrics
  const clearMetrics = useCallback(() => {
    metricsRef.current = [];
    setStats({
      current: null,
      average: { calculationTime: 0, renderTime: 0, totalTime: 0 },
      min: { calculationTime: Infinity, renderTime: Infinity, totalTime: Infinity },
      max: { calculationTime: 0, renderTime: 0, totalTime: 0 },
      percentiles: {
        p50: { calculationTime: 0, renderTime: 0, totalTime: 0 },
        p95: { calculationTime: 0, renderTime: 0, totalTime: 0 },
        p99: { calculationTime: 0, renderTime: 0, totalTime: 0 },
      },
      count: 0,
      history: [],
    });
  }, []);

  return {
    startCalculation,
    endCalculation,
    endRender,
    stats,
    exportData,
    clearMetrics,
  };
}