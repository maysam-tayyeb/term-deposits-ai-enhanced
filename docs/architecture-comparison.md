# Architecture Comparison: Custom Hook vs Context + Reducer

## Custom Hook Architecture (Current)

```
┌─────────────────────────────────────────────────┐
│                    App                          │
│                     │                           │
│    SavingsAndDepositCalculatorWithErrorBoundary │
│                     │                           │
│         SavingsAndDepositCalculator             │
│                     │                           │
│              useCalculator()                    │
│                     │                           │
│         ┌───────────┴───────────┐               │
│         │                       │               │
│    useLocalStorage          useMemo             │
│         │                       │               │
│    localStorage           calculations          │
└─────────────────────────────────────────────────┘

Component Tree Depth: 3
State Management: Local (component-scoped)
```

## Context + Reducer Architecture

```
┌─────────────────────────────────────────────────┐
│                    App                          │
│                     │                           │
│         CalculatorErrorBoundary                 │
│                     │                           │
│           CalculatorProvider                    │
│          ┌──────────┴──────────┐                │
│          │                     │                │
│      useReducer          Context.Provider       │
│          │                     │                │
│    calculatorReducer           │                │
│          │                     │                │
│   SavingsAndDepositCalculatorWithContext       │
│                     │                           │
│            useCalculatorContext()               │
│                     │                           │
│         ┌───────────┴───────────┐               │
│         │                       │               │
│    CalculatorForm        ResultsDisplay         │
└─────────────────────────────────────────────────┘

Component Tree Depth: 5
State Management: Global (context-scoped)
```

## Key Differences

### 1. State Location
- **Custom Hook**: State lives in the component using the hook
- **Context**: State lives in the Provider, accessible anywhere below

### 2. Update Flow

**Custom Hook**:
```
User Input → setState → Re-render → Update localStorage
```

**Context + Reducer**:
```
User Input → dispatch(action) → Reducer → New State → Context Update → Re-render → Update localStorage
```

### 3. File Structure

**Custom Hook**:
```
src/
├── features/savingsAndDepositCalculator/
│   └── logic/hooks/
│       └── useCalculator.ts (220 lines)
└── shared/hooks/
    └── useLocalStorage.ts (94 lines)
```

**Context + Reducer**:
```
src/
└── features/savingsAndDepositCalculator/
    └── context/
        ├── types.ts (28 lines)
        ├── calculatorReducer.ts (65 lines)
        ├── CalculatorContext.tsx (290 lines)
        ├── actions.ts (40 lines)
        └── index.ts (3 lines)
```

## Performance Impact

### Re-render Behavior

**Custom Hook**:
- Only the component using the hook re-renders
- Child components re-render only if props change

**Context**:
- All components using the context re-render on any state change
- Can be optimized with React.memo and useMemo

### Bundle Size
- **Custom Hook**: Baseline
- **Context + Reducer**: +~2KB (minified)

## Developer Experience

### Adding a New State Field

**Custom Hook** (2 steps):
1. Add state variable
2. Return it from hook

**Context + Reducer** (5 steps):
1. Update type definitions
2. Add action type
3. Update reducer
4. Create action creator
5. Add persistence logic

### Debugging

**Custom Hook**:
- Standard React DevTools
- State visible in component

**Context + Reducer**:
- React DevTools shows Provider
- Can add Redux DevTools integration
- Better action tracking

## When Each Shines

### Custom Hook Excels At:
- Single-feature applications
- Performance-critical updates
- Rapid development
- Simple state logic

### Context + Reducer Excels At:
- Multi-feature applications
- Complex state transitions
- Time-travel debugging needs
- Team familiar with Redux patterns

## Conclusion

For the Term Deposits Calculator:
- **Custom Hook**: ✅ Right choice - Simple, performant, maintainable
- **Context + Reducer**: ❌ Over-engineered - Adds complexity without benefits

The Context approach would become valuable when:
- Multiple features need the calculator state
- Complex undo/redo is required
- Middleware for logging/analytics is needed
- Team prefers Redux-style architecture