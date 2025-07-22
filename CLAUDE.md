# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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