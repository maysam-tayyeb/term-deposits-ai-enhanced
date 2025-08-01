# Contributing to Savings & Deposit Calculator

Thank you for your interest in contributing to the Savings & Deposit Calculator project! This guide will help you get started with development and ensure your contributions align with our standards.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Architecture Guidelines](#architecture-guidelines)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Initial Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone git@github.com:YOUR-USERNAME/term-deposits-ai-enhanced.git
   cd term-deposits-ai-enhanced
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream git@github.com:maysam-tayyeb/term-deposits-ai-enhanced.git
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Strategy

- Create feature branches from `main`: `feature/your-feature-name`
- Use descriptive branch names that reflect the change
- Keep branches focused on a single feature or fix

### Development Process

1. **Plan your work**: Check [IMPROVEMENTS-V2.md](docs/IMPROVEMENTS-V2.md) for priority items
2. **Create a branch**: `git checkout -b feature/your-feature`
3. **Make changes**: Follow our code standards and patterns
4. **Test thoroughly**: Run all tests before committing
5. **Commit changes**: Use conventional commit messages
6. **Push and create PR**: Push to your fork and open a pull request

### Pre-commit Checklist

Before committing, ensure:

1. **TypeScript compiles**: `npm run build`
2. **All tests pass**: `npm run test -- --run`
3. **Linting passes**: `npm run lint`
4. **Type checking passes**: `npm run typecheck`

## Code Standards

### TypeScript Guidelines

- Use strict TypeScript with no `any` types
- Prefer interfaces over type aliases for object shapes
- Use branded types for domain values (see existing factories)
- Ensure all functions have explicit return types
- Document complex types with JSDoc comments

### React Patterns

- Use functional components with hooks
- Follow the established component structure:
  ```
  ComponentName/
  ├── ComponentName.tsx
  ├── ComponentName.test.tsx
  └── index.ts
  ```
- Props interfaces should be named `[ComponentName]Props`
- Keep components focused and single-purpose
- Extract complex logic into custom hooks

### File Organization

- Feature code goes in `src/features/`
- Shared utilities in `src/shared/`
- Follow existing patterns for factories, hooks, and components
- Use barrel exports (`index.ts`) for clean imports

### Styling

- Use Tailwind CSS utility classes
- Follow existing color scheme (primary: `#de313b`)
- Ensure responsive design works on all screen sizes
- Maintain WCAG 2.1 AA accessibility standards

## Testing Guidelines

### Unit Tests

- Write tests alongside implementation files (`*.test.ts`, `*.test.tsx`)
- Aim for high coverage of business logic
- Test edge cases and error conditions
- Use descriptive test names that explain the behavior

Example:
```typescript
describe('calculateCompoundInterest', () => {
  it('should calculate monthly compound interest correctly', () => {
    // Test implementation
  });
  
  it('should handle zero interest rate', () => {
    // Test implementation
  });
});
```

### E2E Tests

- Place E2E tests in `/tests/` directory
- Use data-testid attributes for element selection
- Test critical user flows end-to-end
- Ensure tests are reliable and not flaky

### Running Tests

```bash
# Unit tests
npm run test              # Watch mode
npm run test -- --run     # Run once
npm run test -- --coverage # With coverage

# E2E tests (requires dev server)
npm run dev               # Terminal 1
npx playwright test       # Terminal 2
```

## Commit Guidelines

We follow conventional commits for clear history:

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(calculator): add print functionality
fix(validation): correct interest rate boundary check
docs(readme): update installation instructions
test(calculator): add edge case tests for zero principal
```

## Pull Request Process

1. **Update your fork**: 
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create your PR**:
   - Use a descriptive title
   - Reference any related issues
   - Provide a clear description of changes
   - Include screenshots for UI changes

3. **PR Description Template**:
   ```markdown
   ## Description
   Brief description of what this PR does

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests pass
   - [ ] E2E tests pass
   - [ ] Manual testing completed

   ## Checklist
   - [ ] Code follows project standards
   - [ ] Self-review completed
   - [ ] Comments added for complex code
   - [ ] Documentation updated
   - [ ] No console.logs or debugging code
   ```

4. **Review Process**:
   - Address review feedback promptly
   - Keep discussions focused and professional
   - Update PR based on feedback
   - Ensure CI checks pass

## Architecture Guidelines

### Key Principles

1. **Separation of Concerns**: Keep business logic separate from UI
2. **Type Safety**: Use TypeScript's type system effectively
3. **Testability**: Write code that's easy to test
4. **Accessibility**: Ensure all features are accessible
5. **Performance**: Consider performance implications

### Patterns to Follow

- **Factory Pattern**: For creating validated domain objects
- **Custom Hooks**: For encapsulating component logic
- **Error Boundaries**: For graceful error handling
- **Branded Types**: For type-safe domain values

### Adding New Features

1. Review [ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design
2. Follow existing patterns and conventions
3. Consider accessibility from the start
4. Write tests as you develop
5. Update documentation as needed

## Getting Help

- Check existing issues and PRs
- Review documentation in `/docs`
- Ask questions in PR discussions
- Reference [CLAUDE.md](CLAUDE.md) for AI-assisted development

## Code of Conduct

- Be respectful and professional
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Celebrate diversity and inclusion

Thank you for contributing to making this project better!