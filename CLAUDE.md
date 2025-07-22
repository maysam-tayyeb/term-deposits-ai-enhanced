# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Instructions

- **ALWAYS** create a plan using the TodoWrite tool before taking any action
- **ALWAYS** analyze code and offer improvements when reviewing
- **NEVER** commit or push changes unless explicitly requested by the user
- When asked to review or improve code, provide suggestions and analysis but do not make commits
- Only use `git commit` or `git push` when the user specifically says "commit" or "push"
- Always run the typescript compiler to check the code is compilable

## Commit and Push Workflow

- **ALWAYS** wait for explicit user permission before committing or pushing
- **BEFORE** asking for permission to commit/push, **ALWAYS** run `npm run test -- --run` to ensure all tests pass
- If tests fail, fix issues first, then ask for permission
- When ready for commit/push, inform the user that tests are passing and ask for permission
- Never assume permission to commit/push - always wait for explicit user instruction

## Project Overview

React-based term deposit calculator that computes compound interest returns for fixed deposits. Built with React 19, TypeScript, Vite, and Tailwind CSS.

## Development Commands

- `npm run dev` - Start development server at http://localhost:5173/
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run test` - Run unit tests with Vitest
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Testing

**Unit Tests**: Use `npm run test` for Vitest tests. All calculation logic, factories, and utilities should be unit tested.

**E2E Tests**: Run Playwright tests with:
1. Start dev server: `npm run dev` 
2. In another terminal: `npx playwright test`

## Architecture

**Feature-based structure**: Main functionality lives in `src/features/savingsAndDepositCalculator/`

**Key patterns**:
- Factory pattern for value objects (`durationMonths.factory.ts`, `annualInterestRate.factory.ts`)
- Separation of calculation logic from UI components
- Pure calculation functions in `compoundingInterestCalculators.ts`

**Business Rules**:
- Interest rate: 0.00% - 15.00%
- Duration: 3-60 months
- Reinvestment frequencies: Monthly, Quarterly, Annually, At Maturity
- All interest is automatically reinvested at selected frequency

## Compound Interest Formula

The application calculates compound interest using the standard formula:

**A = P × (1 + r/n)^(n×t)**

Where:
- **A** = Final amount (balance)
- **P** = Principal amount (initial deposit)
- **r** = Annual interest rate (as decimal, e.g., 5% = 0.05)
- **n** = Number of times interest is compounded per year
  - Monthly: n = 12
  - Quarterly: n = 4
  - Annually: n = 1
  - At Maturity: n = 12/months (compounds once at the end)
- **t** = Time period in years (months/12)

The implementation is found in `src/features/savingsAndDepositCalculator/compoundingInterestCalculators.ts` in the `calculateRawBalanceForMonth` function.

## Configuration Limits

Modify these constants for business rule changes:
- Duration limits: `MIN_ALLOWED_COMPOUNDING_MONTHS` and `MAX_ALLOWED_COMPOUNDING_MONTHS` in `durationMonths.factory.ts`
- Interest rate limits: `MIN_ALLOWED_INTEREST_RATE` and `MAX_ALLOWED_INTEREST_RATE` in `annualInterestRate.factory.ts`
- Theme color: Update `#de313b` in component class names

## Tech Stack

- **Frontend**: React 19.1.0 + TypeScript 5.8.3
- **Build**: Vite 7.0.3
- **Styling**: Tailwind CSS 4.1.11
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Code Quality**: ESLint + Prettier