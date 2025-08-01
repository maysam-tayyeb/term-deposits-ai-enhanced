# State Management Demo

## Overview

This project includes two implementations of state management for comparison:

1. **Custom Hook** (`/hook`) - The current production implementation
2. **Context + Reducer** (`/context`) - An alternative implementation for comparison

## Running the Demo

### With Routing (Recommended)

The default setup includes routing to switch between implementations:

```bash
npm run dev
```

Then navigate to:
- http://localhost:5173/hook - Custom Hook implementation
- http://localhost:5173/context - Context + Reducer implementation

### Without Routing

To run the standard app without routing, edit `src/main.tsx`:

```typescript
// Change this:
const USE_ROUTES = true;

// To this:
const USE_ROUTES = false;
```

## Key Differences

### Custom Hook (`/hook`)
- **Files**: 2 files (~300 lines)
- **Pattern**: Component-level state with custom hook
- **Performance**: Optimal - only component re-renders
- **Persistence**: Via useLocalStorage hook

### Context + Reducer (`/context`)
- **Files**: 5 files (~450 lines)
- **Pattern**: Global state with Context API
- **Performance**: Good - all consumers re-render
- **Persistence**: Built into Provider

## Testing State Persistence

Both implementations persist state to localStorage. To test:

1. Enter values in the calculator
2. Refresh the page
3. Values should be restored

To test cross-tab synchronization:
1. Open the app in two tabs
2. Change values in one tab
3. Switch to the other tab - values should update

## Architecture Diagrams

### Custom Hook
```
Component → useCalculator() → localStorage
```

### Context + Reducer
```
Component → useContext() → dispatch(action) → reducer → localStorage
```

## Which to Use?

- **Custom Hook**: Recommended for single-feature apps (current choice)
- **Context + Reducer**: Better for multi-feature apps with shared state

## File Locations

### Custom Hook Implementation
- Logic: `/src/features/savingsAndDepositCalculator/logic/hooks/useCalculator.ts`
- Storage: `/src/shared/hooks/useLocalStorage.ts`

### Context Implementation
- Context: `/src/features/savingsAndDepositCalculator/context/CalculatorContext.tsx`
- Reducer: `/src/features/savingsAndDepositCalculator/context/calculatorReducer.ts`
- Types: `/src/features/savingsAndDepositCalculator/context/types.ts`
- Actions: `/src/features/savingsAndDepositCalculator/context/actions.ts`