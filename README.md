# Savings & Deposit Calculator — Term Deposit 

This web app focuses solely on computing compound reinvestment returns for a fixed deposit. Users enter:

* **Starting with**: the initial deposit amount
* **Interest rate**: the nominal interest rate (%)
* **Investment term**: term length
* **Interest paid**: reinvestment schedule (monthly, quarterly, annually, or at maturity)

The app instantly recalculates and displays a month-by-month breakdown, total interest earned, and final balance upon any input change.

---

## Assumptions

* Assumes all earned interest is reinvested at the selected frequency.
* Interest rate is constant for the entire term.
* No partial withdrawals or additional deposits during the term.
* **Principal amount**: Validates range from $1 to $10,000,000 with error handling for invalid inputs
* **Interest rate**: Allows calculating from 0.00% to 15.00% with validation
* **Investment term**: Minimum 3 months and maximum 5 years (60 months) with validation
* **Re-investment periods**: 
  * Monthly
  * Quarterly
  * Annually
  * At Maturity
* **Testing**: Comprehensive unit tests for all business logic, factories, and components
* **E2E Testing**: UI validation with Playwright
* **Validation**: All inputs use factory pattern with branded types for type safety

---

## Installation

1. Clone the repo:

   ```bash
   git clone git@github.com:maysam-tayyeb/term-deposits.git
   cd term-deposits
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

---

## File Structure

```
src/
└─ features/
   └─ savingsAndDepositCalculator/
```

---

## Testing

Run unit tests with Vitest:

```bash
npm run test
```

Run e2e tests with Playwright(needs dev server running):

in one terminal
```bash
npm run dev
```
in another terminal
```bash
npx playwright test
```

---

## Customisation

* **Theme Color**: Update `#de313b` in component class names.
* **Min Allowed Duration**: Change `MIN_ALLOWED_COMPOUNDING_MONTHS` in `durationMonths.factory.ts`.
* **Max Allowed Duration**: Change `MAX_ALLOWED_COMPOUNDING_MONTHS` in `durationMonths.factory.ts`.
* **Min Allowed Duration**: Change `MIN_ALLOWED_INTEREST_RATE` in `annualInterestRate.factory.ts`.
* **Max Allowed Duration**: Change `MAX_ALLOWED_INTEREST_RATE` in `annualInterestRate.factory.ts`.
