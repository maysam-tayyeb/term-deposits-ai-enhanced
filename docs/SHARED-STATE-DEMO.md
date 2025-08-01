# Shared State Demo

## Overview

All four state management implementations now **share the same localStorage keys**, meaning changes in any implementation immediately sync to all others!

## How It Works

### Shared Keys
All implementations use these localStorage keys:
- `calculator.principal` - Principal amount
- `calculator.annualRate` - Annual interest rate
- `calculator.months` - Investment duration
- `calculator.frequency` - Payment frequency

### Real-Time Synchronization

1. **Same Tab**: When you navigate between implementations, values persist
2. **Different Tabs**: Open multiple tabs with different implementations - they sync in real-time!
3. **Cross-Browser Windows**: Even works across different browser windows

## Demo Scenarios

### Scenario 1: Basic Sync
1. Open `/hook` (Custom Hook)
2. Set principal to $50,000
3. Navigate to `/zustand`
4. ✅ Principal is already $50,000!

### Scenario 2: Multi-Tab Sync
1. Open `/hook` in Tab 1
2. Open `/valtio` in Tab 2
3. Change interest rate in Tab 1
4. ✅ Tab 2 updates automatically!

### Scenario 3: Four-Way Sync
1. Open 4 tabs, each with different implementation
2. Change any value in any tab
3. ✅ All 4 tabs update simultaneously!

## Implementation Details

### Custom Hook
```typescript
const [principal, setPrincipal] = useLocalStorage("calculator.principal", DEFAULT);
```

### Context + Reducer
```typescript
useEffect(() => {
  localStorage.setItem("calculator.principal", state.principal);
}, [state.principal]);
```

### Valtio
```typescript
subscribe(calculatorStore, () => {
  localStorage.setItem("calculator.principal", calculatorStore.principal);
});
```

### Zustand
```typescript
setPrincipal: (value) => {
  set({ principal: value });
  localStorage.setItem("calculator.principal", value);
}
```

## Visual Indicators

- **Green sync indicator**: Shows when values sync from another tab
- **Navigation bar**: Shows "All implementations share the same localStorage state"
- **Real-time updates**: Watch values change as you type in another tab!

## Benefits

1. **True Comparison**: See how different state solutions handle the same data
2. **Persistence**: Your values persist across page reloads
3. **Collaboration**: Multiple users can see the same calculations
4. **Testing**: Easy to verify all implementations produce identical results

## Try It Out!

1. Open the app in multiple tabs
2. Try different implementations in each tab
3. Change values and watch them sync
4. Notice how each implementation handles updates differently but achieves the same result

This demonstrates that regardless of the state management approach, they can all work with the same underlying data source!