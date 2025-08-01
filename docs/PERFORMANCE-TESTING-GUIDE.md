# Performance Testing Guide

## Overview

This guide explains how to use the comprehensive performance testing system to compare state management implementations.

## Quick Start

1. **Run the application**: `npm run dev`
2. **Click "Run Performance Test"** (bottom-left button)
3. **Wait ~35 seconds** for automated testing
4. **View results** in the comparison table

## Performance Measurement System

### What's Measured

Each interaction measures three key metrics:

1. **Calculation Time**: Time to compute new state
2. **Render Time**: Time for React to update the DOM
3. **Total Time**: Combined calculation + render time

### Statistical Analysis

- **Current**: Latest measurement
- **Average**: Mean of all samples
- **P50 (Median)**: 50% of operations are faster
- **P95**: 95% of operations are faster
- **P99**: 99% of operations are faster (worst-case)
- **Min/Max**: Range boundaries

### Sample Size

- Default: 1000 samples maximum per implementation
- Provides statistical significance
- ~10-15 minutes of active usage data

## Manual Performance Testing

### 1. Interactive Testing

Navigate between implementations and interact naturally:
- Change deposit amount
- Adjust interest rate
- Modify investment term
- Switch reinvestment frequency

Performance metrics update in real-time (bottom-right overlay).

### 2. Viewing Individual Metrics

Each implementation shows:
```
┌─────────────────────────────────┐
│ Custom Hook Performance         │
├─────────────────────────────────┤
│ Metric  Current  Avg  P50  P95  │
│ Calc    0.12ms  0.15  0.14 0.25 │
│ Render  0.45ms  0.52  0.50 0.89 │
│ Total   0.57ms  0.67  0.64 1.14 │
├─────────────────────────────────┤
│ Samples: 150/1000               │
└─────────────────────────────────┘
```

### 3. Comparison View

Click **"Show Performance Comparison"** (top-right) to see all implementations side-by-side.

## Automated Performance Testing

### Configuration Options

Click **"Configure Test"** before running:

| Option | Range | Default | Description |
|--------|-------|---------|-------------|
| Samples per route | 10-200 | 50 | Number of interactions per implementation |
| Interaction delay | 50-1000ms | 100ms | Time between value changes |
| Route change delay | 500-5000ms | 2000ms | Time to wait after navigation |

### Test Scenarios

The automated test uses 8 realistic scenarios:
- Principal: $1,000 to $100,000
- Interest Rate: 3.5% to 15%
- Terms: 6 to 120 months
- All reinvestment frequencies

### Running the Test

1. **Start Test**: Click "Run Performance Test"
2. **Monitor Progress**: Watch the progress bar and current route
3. **Stop Early**: Click "Stop Test" if needed
4. **View Results**: Comparison table opens automatically

### Understanding Results

The comparison table highlights:
- **Green values**: Best performer in that category
- **Sample count**: Ensures fair comparison (min 10 samples)
- **All metrics**: Average, P50, P95, P99 for comprehensive view

## Exporting Performance Data

### Individual Export
Click **"Export"** on any performance display to download:
```json
{
  "implementation": "Custom Hook",
  "stats": {
    "current": { ... },
    "average": { ... },
    "percentiles": { ... },
    "count": 150,
    "timestamp": "2024-01-20T10:30:00Z"
  }
}
```

### Bulk Analysis
Run automated tests and export each implementation for:
- Spreadsheet analysis
- Performance regression tracking
- Team reporting
- Historical comparison

## Interpreting Results

### What's "Good" Performance?

For user experience:
- **< 16ms total**: Smooth 60fps
- **< 100ms total**: Feels instant
- **< 1000ms total**: Acceptable

Our implementations typically show:
- **0.5-2ms total**: Excellent performance
- Differences are negligible for users
- Focus on percentiles, not averages

### Percentiles vs Averages

- **Average**: Can be skewed by outliers
- **P50**: Typical performance
- **P95/P99**: Worst-case scenarios
- **Use P95** for performance budgets

### Performance Factors

Results vary based on:
1. **Device**: CPU speed, memory
2. **Browser**: Chrome typically fastest
3. **System Load**: Other running applications
4. **React Version**: Optimizations vary
5. **Development vs Production**: Dev mode is slower

## Best Practices

### 1. Consistent Testing Environment
- Close unnecessary applications
- Use the same browser
- Test in production mode for final numbers
- Run multiple test cycles

### 2. Statistical Significance
- Collect at least 50 samples
- Look at percentiles, not just averages
- Consider variance (max-min spread)
- Test different scenarios

### 3. Real-World Testing
- Test with actual user workflows
- Include edge cases (large numbers)
- Test after warm-up (initial renders are slower)
- Consider mobile devices

## Troubleshooting

### Performance Display Not Showing
- Ensure you're on a route with an implementation
- Check browser console for errors
- Refresh the page

### Automated Test Not Working
- Check if inputs are being found (console logs)
- Ensure no browser extensions interfere
- Try with a fresh browser profile

### Inconsistent Results
- Normal variation is expected
- Run more samples for stability
- Check for background processes
- Test in production build

## Advanced Usage

### Custom Test Scenarios
Edit `testScenarios` in `AutomatedPerformanceTest.tsx`:
```typescript
const testScenarios = [
  { principal: 5000, rate: 10, months: 24, frequency: "monthly" },
  // Add your scenarios
];
```

### Adjusting Sample Limits
In `usePerformanceTracker`:
```typescript
usePerformanceTracker("Custom Hook", { 
  maxSamples: 5000,
  enableConsoleLogging: false 
})
```

### Adding New Metrics
Extend `PerformanceMetrics` interface to track:
- Memory usage
- Component mount time
- API call duration
- Custom business metrics

## Conclusion

The performance testing system provides professional-grade analysis for making informed decisions about state management. Remember:

1. **All implementations perform well** (<2ms typical)
2. **Choose based on DX**, not microscopic performance differences
3. **Use the tools** to understand behavior, not premature optimize
4. **Test in production mode** for real numbers
5. **Consider your specific use case** over generic benchmarks