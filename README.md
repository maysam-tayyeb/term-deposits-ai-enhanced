# Savings & Deposit Calculator — Term Deposit 

A React-based web application for calculating compound interest returns on fixed-term deposits. Users can explore different investment scenarios with real-time calculations and detailed month-by-month breakdowns.

## Features

* **Interactive Calculator**: Real-time recalculation as you adjust inputs
* **Flexible Investment Options**:
  * Starting deposit: $1 to $10,000,000
  * Interest rate: 0.00% to 15.00%
  * Investment term: 3 to 60 months
  * Multiple reinvestment frequencies
* **Detailed Results**: Month-by-month breakdown, total interest earned, and final balance
* **Accessibility**: WCAG 2.1 AA compliant with screen reader support
* **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

* **Frontend**: React 19.1.0 with TypeScript 5.8.3
* **Build Tool**: Vite 7.0.3
* **Styling**: Tailwind CSS 4.1.11
* **Testing**: Vitest (unit tests) + Playwright (E2E tests)
* **Code Quality**: ESLint + Prettier

## Prerequisites

* Node.js 18.x or higher
* npm 9.x or higher

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:maysam-tayyeb/term-deposits-ai-enhanced.git
   cd term-deposits-ai-enhanced
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173/`

## Development Scripts

* `npm run dev` - Start development server
* `npm run build` - Build for production
* `npm run preview` - Preview production build
* `npm run test` - Run unit tests in watch mode
* `npm run test -- --run` - Run unit tests once
* `npm run lint` - Run ESLint
* `npm run typecheck` - Run TypeScript compiler check

## Project Structure

```
src/
├── features/
│   └── savingsAndDepositCalculator/
│       ├── components/
│       │   ├── CalculatorForm/
│       │   ├── ResultsDisplay/
│       │   └── SavingsAndDepositCalculator/
│       ├── factories/
│       │   ├── annualInterestRate.factory.ts
│       │   └── durationMonths.factory.ts
│       ├── hooks/
│       │   └── useCalculator.ts
│       ├── types/
│       └── compoundingInterestCalculators.ts
├── shared/
│   ├── components/
│   │   ├── ErrorBoundary/
│   │   ├── FormFields/
│   │   └── LiveRegion/
│   ├── config/
│   │   └── constants.ts
│   ├── errors/
│   └── utils/
├── test/
│   └── setup.ts
└── main.tsx
```

## Testing

### Unit Tests

Run unit tests with Vitest:

```bash
npm run test              # Watch mode
npm run test -- --run     # Run once
npm run test -- --coverage # With coverage
```

### E2E Tests

Run end-to-end tests with Playwright:

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run Playwright tests
npx playwright test
```

## Business Rules

### Calculation Formula

The application uses the standard compound interest formula:

**A = P × (1 + r/n)^(n×t)**

Where:
* **A** = Final amount (balance)
* **P** = Principal amount (initial deposit)
* **r** = Annual interest rate (as decimal)
* **n** = Compounding frequency per year
* **t** = Time period in years

### Input Constraints

* **Principal Amount**: $1 - $10,000,000
* **Interest Rate**: 0.00% - 15.00%
* **Investment Term**: 3 - 60 months
* **Reinvestment Frequencies**:
  * Monthly (n = 12)
  * Quarterly (n = 4)
  * Annually (n = 1)
  * At Maturity (compounds once at end)

### Key Assumptions

* All earned interest is automatically reinvested at the selected frequency
* Interest rate remains constant throughout the term
* No partial withdrawals or additional deposits allowed
* All calculations assume end-of-period compounding

## Accessibility

This application is designed with accessibility in mind:

* **WCAG 2.1 AA Compliant**: Meets accessibility standards
* **Screen Reader Support**: Proper ARIA labels and live regions
* **Keyboard Navigation**: Full keyboard accessibility
* **High Contrast**: Sufficient color contrast ratios
* **Error Announcements**: Screen reader-friendly error messages
* **Focus Management**: Clear focus indicators

## Documentation

The project includes comprehensive documentation in the `/docs` folder:

### Active Documents
* **[Architecture](docs/ARCHITECTURE.md)** - Current and target architecture, patterns, and technology decisions
* **[Improvements Roadmap](docs/IMPROVEMENTS-V2.md)** - Prioritized list of improvements with criticality scores

### Archived Documents
* **[Completed Improvements](docs/archive/IMPROVEMENTS-COMPLETED.md)** - Record of implemented improvements
* **[Original Improvements](docs/archive/IMPROVEMENTS-ORIGINAL.md)** - Historical improvement tracking

For AI-assisted development guidance, see [CLAUDE.md](CLAUDE.md).

## Customization

### Theme Color
Update the primary color `#de313b` in component class names throughout the application.

### Business Rule Limits
Modify validation constraints in the factory files:
* **Duration limits**: `MIN_ALLOWED_COMPOUNDING_MONTHS` and `MAX_ALLOWED_COMPOUNDING_MONTHS` in `durationMonths.factory.ts`
* **Interest rate limits**: `MIN_ALLOWED_INTEREST_RATE` and `MAX_ALLOWED_INTEREST_RATE` in `annualInterestRate.factory.ts`

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines and contribution process.

## License

This project is proprietary software. All rights reserved.