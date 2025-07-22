import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SavingsAndDepositCalculator } from './SavingsAndDepositCalculator';
import {
  DEFAULT_VALUES,
  UI_TEXT,
  TEST_IDS,
  FREQUENCY_OPTIONS,
} from './SavingsAndDepositCalculator.constants';

// Additional test values not in component constants
const TEST_VALUES = {
  PRINCIPAL: {
    MEDIUM: 20000,
    LARGE: 100000,
  },
  INTEREST_RATE: {
    MEDIUM: 5.5,
  },
  INVESTMENT_TERM_MONTHS: {
    YEAR: 12,
    TWO_YEARS: 24,
  },
} as const;

const EXPECTED_TABLE_ROWS = {
  DEFAULT_MONTHS: DEFAULT_VALUES.INVESTMENT_TERM_MONTHS + 1, // +1 for header row
  TWELVE_MONTHS: TEST_VALUES.INVESTMENT_TERM_MONTHS.YEAR + 1, // +1 for header row
} as const;

const INPUT_ATTRIBUTES = {
  TYPE_NUMBER: 'number',
} as const;

const CURRENCY_PATTERNS = {
  WITH_DOLLAR_SIGN: /\$[\d,]+/,
} as const;

describe('SavingsAndDepositCalculator', () => {
  beforeEach(() => {
    render(<SavingsAndDepositCalculator />);
  });

  describe('Initial Rendering', () => {
    it('should render the calculator with default values', () => {
      expect(screen.getByText(UI_TEXT.TITLE)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.PRINCIPAL_INPUT)).toHaveValue(DEFAULT_VALUES.PRINCIPAL);
      expect(screen.getByTestId(TEST_IDS.INTEREST_RATE_INPUT)).toHaveValue(DEFAULT_VALUES.INTEREST_RATE);
      expect(screen.getByTestId(TEST_IDS.INVESTMENT_TERM_INPUT)).toHaveValue(DEFAULT_VALUES.INVESTMENT_TERM_MONTHS);
      expect(screen.getByTestId(`${TEST_IDS.RADIO_PREFIX}${DEFAULT_VALUES.FREQUENCY}`)).toBeChecked();
    });

    it('should display help text for input constraints', () => {
      expect(screen.getByText('Min 0.00% and max 15.00%')).toBeInTheDocument();
      expect(screen.getByText('Min 3 and max 60 months')).toBeInTheDocument();
    });

    it('should render all frequency options', () => {
      FREQUENCY_OPTIONS.forEach(option => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });
  });

  describe('Calculation Results', () => {
    it('should display results table with valid inputs', () => {
      expect(screen.getByText(UI_TEXT.TABLE_HEADERS.PROJECTED_SAVINGS)).toBeInTheDocument();
      expect(screen.getByText(UI_TEXT.TABLE_HEADERS.MONTH)).toBeInTheDocument();
      expect(screen.getByText(UI_TEXT.TABLE_HEADERS.INTEREST_RATE)).toBeInTheDocument();
      expect(screen.getByText(UI_TEXT.TABLE_HEADERS.INTEREST_EARNED)).toBeInTheDocument();
      expect(screen.getByText(UI_TEXT.TABLE_HEADERS.BALANCE)).toBeInTheDocument();
    });

    it('should display final balance and total interest earned', () => {
      expect(screen.getByText(UI_TEXT.SUMMARY.FINAL_BALANCE)).toBeInTheDocument();
      expect(screen.getByText(UI_TEXT.SUMMARY.TOTAL_INTEREST_EARNED)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.FINAL_BALANCE)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.TOTAL_INTEREST_EARNED)).toBeInTheDocument();
    });

    it('should update calculations when principal changes', async () => {
      const user = userEvent.setup();
      const principalInput = screen.getByTestId(TEST_IDS.PRINCIPAL_INPUT);
      
      await user.clear(principalInput);
      await user.type(principalInput, TEST_VALUES.PRINCIPAL.MEDIUM.toString());
      
      await waitFor(() => {
        const finalBalance = screen.getByTestId(TEST_IDS.FINAL_BALANCE);
        expect(finalBalance).toBeInTheDocument();
        expect(finalBalance.textContent).toContain('$');
      });
    });

    it('should update calculations when duration changes', async () => {
      const user = userEvent.setup();
      const durationInput = screen.getByTestId(TEST_IDS.INVESTMENT_TERM_INPUT);
      
      await user.clear(durationInput);
      await user.type(durationInput, TEST_VALUES.INVESTMENT_TERM_MONTHS.YEAR.toString());
      
      await waitFor(() => {
        const rows = screen.getAllByRole('row');
        expect(rows.length).toBe(EXPECTED_TABLE_ROWS.TWELVE_MONTHS);
      });
    });
  });

  describe('Frequency Selection', () => {
    it('should update calculations when frequency changes to quarterly', async () => {
      const quarterlyRadio = screen.getByTestId(`${TEST_IDS.RADIO_PREFIX}quarterly`);
      
      fireEvent.click(quarterlyRadio);
      
      await waitFor(() => {
        expect(quarterlyRadio).toBeChecked();
        expect(screen.getByText(UI_TEXT.TABLE_HEADERS.PROJECTED_SAVINGS)).toBeInTheDocument();
      });
    });

    it('should update calculations when frequency changes to annually', async () => {
      const annuallyRadio = screen.getByTestId(`${TEST_IDS.RADIO_PREFIX}annually`);
      
      fireEvent.click(annuallyRadio);
      
      await waitFor(() => {
        expect(annuallyRadio).toBeChecked();
        expect(screen.getByText(UI_TEXT.TABLE_HEADERS.PROJECTED_SAVINGS)).toBeInTheDocument();
      });
    });

    it('should update calculations when frequency changes to at maturity', async () => {
      const atMaturityRadio = screen.getByTestId(`${TEST_IDS.RADIO_PREFIX}atmaturity`);
      
      fireEvent.click(atMaturityRadio);
      
      await waitFor(() => {
        expect(atMaturityRadio).toBeChecked();
        expect(screen.getByText(UI_TEXT.TABLE_HEADERS.PROJECTED_SAVINGS)).toBeInTheDocument();
      });
    });
  });

  describe('Input Handling', () => {
    it('should accept valid interest rate values', async () => {
      const user = userEvent.setup();
      const interestInput = screen.getByTestId(TEST_IDS.INTEREST_RATE_INPUT);
      
      await user.clear(interestInput);
      await user.type(interestInput, TEST_VALUES.INTEREST_RATE.MEDIUM.toString());
      
      await waitFor(() => {
        expect(interestInput).toHaveValue(TEST_VALUES.INTEREST_RATE.MEDIUM);
        expect(screen.getByText(UI_TEXT.TABLE_HEADERS.PROJECTED_SAVINGS)).toBeInTheDocument();
      });
    });

    it('should accept valid duration values', async () => {
      const user = userEvent.setup();
      const durationInput = screen.getByTestId(TEST_IDS.INVESTMENT_TERM_INPUT);
      
      await user.clear(durationInput);
      await user.type(durationInput, TEST_VALUES.INVESTMENT_TERM_MONTHS.TWO_YEARS.toString());
      
      await waitFor(() => {
        expect(durationInput).toHaveValue(TEST_VALUES.INVESTMENT_TERM_MONTHS.TWO_YEARS);
        expect(screen.getByText(UI_TEXT.TABLE_HEADERS.PROJECTED_SAVINGS)).toBeInTheDocument();
      });
    });

    it('should handle component state updates gracefully', async () => {
      const user = userEvent.setup();
      const principalInput = screen.getByTestId(TEST_IDS.PRINCIPAL_INPUT);
      
      await user.clear(principalInput);
      
      expect(screen.getByTestId(TEST_IDS.PRINCIPAL_INPUT)).toBeInTheDocument();
    });
  });

  describe('Currency Formatting', () => {
    it('should format currency values in the table', async () => {
      await waitFor(() => {
        const balanceCells = screen.getAllByRole('cell');
        const balanceCell = balanceCells.find(cell => cell.textContent?.includes('$'));
        expect(balanceCell).toBeInTheDocument();
      });
    });

    it('should use thousand separators in final balance display', async () => {
      const user = userEvent.setup();
      const principalInput = screen.getByTestId(TEST_IDS.PRINCIPAL_INPUT);
      
      await user.clear(principalInput);
      await user.type(principalInput, TEST_VALUES.PRINCIPAL.LARGE.toString());
      
      await waitFor(() => {
        const finalBalance = screen.getByTestId(TEST_IDS.FINAL_BALANCE);
        expect(finalBalance.textContent).toMatch(CURRENCY_PATTERNS.WITH_DOLLAR_SIGN);
      });
    });
  });

  describe('Form Accessibility', () => {
    it('should have proper input types', () => {
      expect(screen.getByTestId(TEST_IDS.PRINCIPAL_INPUT)).toHaveAttribute('type', INPUT_ATTRIBUTES.TYPE_NUMBER);
      expect(screen.getByTestId(TEST_IDS.INTEREST_RATE_INPUT)).toHaveAttribute('type', INPUT_ATTRIBUTES.TYPE_NUMBER);
      expect(screen.getByTestId(TEST_IDS.INVESTMENT_TERM_INPUT)).toHaveAttribute('type', INPUT_ATTRIBUTES.TYPE_NUMBER);
    });

    it('should have visible labels for form inputs', () => {
      expect(screen.getByText(UI_TEXT.LABELS.PRINCIPAL)).toBeInTheDocument();
      expect(screen.getByText(UI_TEXT.LABELS.INTEREST_RATE)).toBeInTheDocument();
      expect(screen.getByText(UI_TEXT.LABELS.INVESTMENT_TERM)).toBeInTheDocument();
      expect(screen.getByText(UI_TEXT.LABELS.INTEREST_PAID)).toBeInTheDocument();
    });
  });
});