# Term Deposits Calculator - Architecture Document

## Table of Contents

1. [Overview](#overview)
2. [Current Architecture](#current-architecture)
3. [Target Enterprise Architecture](#target-enterprise-architecture)
4. [Key Architectural Decisions](#key-architectural-decisions)
5. [Migration Roadmap](#migration-roadmap)
6. [Architecture Patterns](#architecture-patterns)
7. [Technology Stack](#technology-stack)

---

## Overview

This document outlines the current architecture of the Term Deposits Calculator and provides a roadmap for evolving it into an enterprise-grade application. The focus is on scalability, maintainability, and developer experience while keeping the implementation pragmatic.

### Architecture Goals

- **Modularity**: Clear separation of concerns with well-defined boundaries
- **Scalability**: Architecture that grows with the application
- **Maintainability**: Easy to understand, modify, and extend
- **Type Safety**: Leverage TypeScript for compile-time guarantees
- **Performance**: Optimized for speed and efficiency
- **Developer Experience**: Fast development cycle with good tooling

---

## Current Architecture

### Structure Overview

```
src/
├── App.tsx                          # Root component
├── main.tsx                         # Application entry point
├── features/                        # Feature-based modules
│   └── savingsAndDepositCalculator/
│       ├── __tests__/               # Feature tests
│       │   └── integration/         # Integration tests
│       ├── components/              # UI components
│       │   ├── CalculatorForm/      # Main form component
│       │   ├── ErrorHandling/       # Error components
│       │   ├── ResultsDisplay/      # Results view
│       │   └── SavingsAndDepositCalculator/  # Main container
│       ├── config/                  # Configuration
│       ├── domain/                  # Business logic & types
│       │   ├── types/               # Domain types
│       │   └── valueObjects/        # Value objects
│       │       ├── duration/        # Duration value object
│       │       └── interestRate/    # Interest rate value object
│       └── logic/                   # Hooks & calculations
│           ├── calculations/        # Calculation functions
│           └── hooks/               # Custom React hooks
├── shared/                          # Shared utilities
│   ├── components/                  # Reusable UI components
│   │   ├── ErrorBoundary/          # Error boundary wrapper
│   │   ├── FormFields/             # Form field components
│   │   └── LiveRegion/             # Accessibility announcements
│   ├── config/                      # Shared configuration
│   ├── errors/                      # Error handling system
│   ├── types/                       # Shared TypeScript types
│   └── utils/                       # Utility functions
└── test/                            # Test setup and utilities
```

### Current Patterns

#### 1. **Feature-Based Organization**

Each feature is self-contained with its own components, logic, and domain models.

```typescript
// features/savingsAndDepositCalculator/
├── __tests__/          # Feature-specific tests
├── components/         # Feature-specific UI
├── config/            # Feature configuration
├── domain/            # Business rules & types
│   ├── types/         # Domain type definitions
│   └── valueObjects/  # Branded types with validation
└── logic/             # Hooks & calculations
    ├── calculations/  # Pure calculation functions
    └── hooks/         # React hooks for UI logic
```

#### 2. **Domain-Driven Design**

- **Value Objects**: Branded types with validation (e.g., `PrincipalAmount`, `DurationMonths`)
- **Factory Pattern**: Consistent creation of domain objects
- **Business Logic Separation**: Pure functions for calculations

#### 3. **Error Handling**

- Custom error types with severity levels
- Error boundaries for React components
- Centralized error logging service

### Current Limitations

1. **State Management**: Local state only, no global state solution
2. **Component Library**: No standardized design system
3. **Performance**: No code splitting or lazy loading
4. **Bundle Size**: All code loaded upfront
5. **Development Tools**: Limited developer tooling

---

## Target Enterprise Architecture

### Proposed Structure

```
src/
├── core/                           # Core business logic (pure, framework-agnostic)
│   ├── domain/                     # Domain models & value objects
│   │   ├── models/                 # Business entities
│   │   ├── valueObjects/           # Value objects with validation
│   │   └── types/                  # Domain-specific types
│   ├── useCases/                   # Application business rules
│   │   ├── calculateInterest/      # Use case implementations
│   │   └── manageScenarios/        # Scenario management
│   └── interfaces/                 # Ports & adapters pattern
│       ├── repositories/           # Data access interfaces
│       └── services/               # External service interfaces
│
├── infrastructure/                 # External services & frameworks
│   ├── store/                      # State management (when implemented)
│   │   ├── slices/                 # Feature slices
│   │   └── middleware/             # Custom middleware
│   └── persistence/                # Local storage adapters
│
├── presentation/                   # UI layer
│   ├── components/                 # Reusable UI components
│   │   ├── atoms/                  # Basic building blocks
│   │   ├── molecules/              # Composite components
│   │   ├── organisms/              # Complex components
│   │   └── templates/              # Page templates
│   ├── pages/                      # Page-level components
│   ├── layouts/                    # Layout components
│   ├── hooks/                      # Custom React hooks
│   └── styles/                     # Global styles & themes
│
├── shared/                         # Shared utilities & constants
│   ├── config/                     # App configuration
│   ├── constants/                  # Global constants
│   ├── types/                      # Shared TypeScript types
│   ├── utils/                      # Utility functions
│   └── designSystem/               # Design tokens & theme
│
└── tests/                          # Comprehensive test suites
    ├── unit/                       # Unit tests
    ├── integration/                # Integration tests
    ├── e2e/                        # End-to-end tests
    └── performance/                # Performance benchmarks
```

### Key Components

#### 1. **Core Layer**

Pure business logic, independent of frameworks:

- Domain models and value objects
- Use cases implementing business rules
- Interface definitions (ports)

#### 2. **Infrastructure Layer**

Framework-specific implementations:

- State management solution (to be determined)
- Local storage for data persistence

#### 3. **Presentation Layer**

React-specific UI code:

- Atomic design component hierarchy
- Custom hooks for UI logic
- Styled components with theme support

#### 4. **Shared Layer**

Cross-cutting concerns:

- Configuration management
- Type definitions
- Utility functions
- Design system tokens

---

## Key Architectural Decisions

### 1. **State Management Options**

**Current State**: Local React state with hooks
**Consideration**: Evaluate global state management solutions

**Options to Consider**:

#### Option A: Redux Toolkit

**Pros**:

- Predictable state updates
- Excellent DevTools for debugging
- Built-in best practices
- Strong TypeScript support
- Large ecosystem

**Cons**:

- More boilerplate
- Learning curve
- May be overkill for current app size

#### Option B: Zustand

**Pros**:

- Minimal boilerplate
- Simple API
- TypeScript friendly
- Small bundle size (~2.9kb)
- No providers needed

**Cons**:

- Smaller ecosystem
- Less established patterns

#### Option C: Context API + useReducer

**Pros**:

- Built into React
- No additional dependencies
- Familiar patterns
- Good for medium complexity

**Cons**:

- Performance concerns with frequent updates
- No DevTools
- More manual optimization needed

**Recommendation**: Start with Context API for immediate needs, evaluate Redux Toolkit or Zustand as complexity grows.

### 2. **Design System - Atomic Design**

**Decision**: Implement atomic design methodology
**Rationale**:

- Consistent UI components
- Reusable building blocks
- Clear component hierarchy
- Easy to maintain and scale

**Structure**:

```
components/
├── atoms/          # Button, Input, Label
├── molecules/      # FormField, Card, Modal
├── organisms/      # CalculatorForm, ResultsTable
└── templates/      # PageLayout, DashboardTemplate
```

### 3. **Performance - Code Splitting**

**Decision**: Implement route-based code splitting
**Rationale**:

- Faster initial load
- Better performance metrics
- Reduced bundle size
- Progressive loading

**Implementation**:

```typescript
// Lazy load feature modules
const Calculator = lazy(() => import("./pages/Calculator"));
const Reports = lazy(() => import("./pages/Reports"));
```

### 4. **Type Safety - Strict TypeScript**

**Decision**: Enable strict TypeScript configuration
**Rationale**:

- Catch errors at compile time
- Better IDE support
- Self-documenting code
- Easier refactoring

### 5. **Testing Strategy - Testing Trophy**

**Decision**: Follow the testing trophy approach
**Rationale**:

- Focus on integration tests
- Good cost/benefit ratio
- Better confidence
- Faster test execution

```
       /\
      /  \    E2E (few)
     /----\
    /      \  Integration (more)
   /--------\
  /          \ Unit (many)
 /____________\
```

---

## Migration Roadmap

### Phase 1: Foundation (Week 1-2)

**Goal**: Set up core infrastructure without breaking existing functionality

1. **State Management Evaluation**
   - Analyze current state complexity
   - Prototype with different solutions
   - Choose based on team preference
   - Implement chosen solution incrementally

2. **Folder Structure Refactoring**
   - Create new folder structure
   - Move files gradually
   - Update import paths
   - Ensure tests pass

3. **TypeScript Configuration**
   - Enable strict mode
   - Add path aliases
   - Configure build tools

### Phase 2: Design System (Week 3-4)

**Goal**: Create reusable component library

1. **Component Library Setup**
   - Install Storybook
   - Create atomic components
   - Document with stories
   - Add visual regression tests

2. **Theme System**
   - Create design tokens
   - Implement theme provider
   - Add CSS variables
   - Support theme switching

3. **Component Migration**
   - Refactor existing components
   - Apply atomic design
   - Add proper TypeScript types
   - Update tests

### Phase 3: Performance (Week 5-6)

**Goal**: Optimize application performance

1. **Code Splitting**
   - Implement lazy loading
   - Add route-based splitting
   - Optimize bundle size
   - Add loading states

2. **React Optimizations**
   - Add React.memo where needed
   - Implement useMemo/useCallback
   - Optimize re-renders
   - Add performance monitoring

3. **Asset Optimization**
   - Optimize images
   - Add resource hints
   - Implement caching strategies
   - Configure CDN (if applicable)

### Phase 4: Polish (Week 7-8)

**Goal**: Final improvements and documentation

1. **Developer Experience**
   - Add development tools
   - Create component generators
   - Improve build process
   - Add pre-commit hooks

2. **Documentation**
   - Update architecture docs
   - Create component docs
   - Add code examples
   - Write migration guide

3. **Testing & Quality**
   - Achieve 90% coverage
   - Add performance tests
   - Fix any issues
   - Final review

---

## Key Focus Areas

### 1. **State Management Evolution**

As the application grows, consider implementing global state management:

- Move from local state to global state
- Evaluate options based on actual needs
- Consider developer experience and bundle size
- Implement incrementally as complexity increases

### 2. **Design System Implementation**

Creating a comprehensive design system:

- Atomic design methodology
- Reusable component library
- Consistent styling with design tokens
- Storybook for component development

### 3. **Performance Optimization**

Ensuring the application performs well at scale:

- Code splitting for faster initial load
- React performance optimizations (memo, useMemo)
- Bundle size optimization
- Progressive loading strategies

---

## Architecture Patterns

### 1. **Ports and Adapters (Hexagonal)**

Separate business logic from external concerns:

```typescript
// core/interfaces/repositories/CalculatorRepository.ts
export interface CalculatorRepository {
  saveScenario(scenario: Scenario): Promise<void>;
  loadScenario(id: string): Promise<Scenario>;
}

// infrastructure/persistence/LocalStorageCalculatorRepository.ts
export class LocalStorageCalculatorRepository implements CalculatorRepository {
  async saveScenario(scenario: Scenario): Promise<void> {
    localStorage.setItem(`scenario_${scenario.id}`, JSON.stringify(scenario));
  }

  async loadScenario(id: string): Promise<Scenario> {
    const data = localStorage.getItem(`scenario_${id}`);
    if (!data) throw new Error("Scenario not found");
    return JSON.parse(data);
  }
}
```

### 2. **Use Case Pattern**

Encapsulate business rules:

```typescript
// core/useCases/calculateInterest/CalculateInterestUseCase.ts
export class CalculateInterestUseCase {
  execute(params: CalculateInterestParams): CalculationResult {
    // Business logic here
    return calculateCompoundInterest(params);
  }
}
```

### 3. **Factory Pattern**

Consistent object creation:

```typescript
// core/domain/valueObjects/factories/MoneyFactory.ts
export function createMoney(amount: number, currency: Currency): Money {
  if (amount < 0) throw new Error("Amount cannot be negative");
  return { amount, currency } as Money;
}
```

### 4. **Observer Pattern**

State management pattern (implementation varies by chosen solution):

```typescript
// Example with Context API
const { principal, setPrincipal } = useCalculatorContext();

// Example with Zustand
const principal = useStore((state) => state.principal);

// Example with Redux
const principal = useSelector(selectPrincipal);
```

---

## Technology Stack

### Core Technologies

- **React 19**: UI library
- **TypeScript 5.8**: Type safety
- **Vite 7**: Build tool
- **Tailwind CSS 4**: Styling
- **State Management**: TBD (Context API, Redux Toolkit, or Zustand)

### Development Tools

- **Storybook**: Component development
- **Vitest**: Unit testing
- **Playwright**: E2E testing
- **ESLint**: Code linting
- **Prettier**: Code formatting

### Performance Tools

- **React DevTools**: React debugging
- **Redux DevTools**: State debugging
- **Lighthouse**: Performance auditing
- **Bundle Analyzer**: Bundle optimization

### Future Considerations

- **React Hook Form**: Form management
- **Zod**: Runtime validation
- **Recharts**: Data visualization

---

## Conclusion

This architecture provides a solid foundation for scaling the Term Deposits Calculator into an enterprise-grade application. The migration can be done incrementally without disrupting existing functionality, and each phase delivers tangible benefits.

The key principles are:

1. **Separation of Concerns**: Clear boundaries between layers
2. **Incremental Migration**: No big-bang rewrites
3. **Developer Experience**: Good tooling and documentation
4. **Performance First**: Optimized from the start
5. **Type Safety**: Leverage TypeScript fully

For questions or clarifications, please refer to the implementation examples in the codebase or create an issue for discussion.
