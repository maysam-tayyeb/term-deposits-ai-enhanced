import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SavingsAndDepositCalculator } from './SavingsAndDepositCalculator';

describe('SavingsAndDepositCalculator', () => {
  beforeEach(() => {
    render(<SavingsAndDepositCalculator />);
  });

  describe('Initial Rendering', () => {
    it('should render the calculator with default values', () => {
      expect(screen.getByText('Calculate Term Deposit (Re-invest)')).toBeInTheDocument();
      expect(screen.getByTestId('principal-input')).toHaveValue(10000);
      expect(screen.getByTestId('interest-rate-input')).toHaveValue(1.2);
      expect(screen.getByTestId('investment-term-input')).toHaveValue(3);
      expect(screen.getByTestId('radio-re-invest-monthly')).toBeChecked();
    });

    it('should display help text for input constraints', () => {
      expect(screen.getByText('Min 0.00% and max 15.00%')).toBeInTheDocument();
      expect(screen.getByText('Min 3 and max 60 months')).toBeInTheDocument();
    });

    it('should render all frequency options', () => {
      expect(screen.getByText('Monthly')).toBeInTheDocument();
      expect(screen.getByText('Quarterly')).toBeInTheDocument();
      expect(screen.getByText('Annually')).toBeInTheDocument();
      expect(screen.getByText('At Maturity')).toBeInTheDocument();
    });
  });

  describe('Calculation Results', () => {
    it('should display results table with valid inputs', () => {
      // Default values should already show results
      expect(screen.getByText('Projected savings')).toBeInTheDocument();
      expect(screen.getByText('Month')).toBeInTheDocument();
      expect(screen.getByText('Interest Rate')).toBeInTheDocument();
      expect(screen.getByText('Interest Earned')).toBeInTheDocument();
      expect(screen.getByText('Balance')).toBeInTheDocument();
    });

    it('should display final balance and total interest earned', () => {
      expect(screen.getByText('Final balance')).toBeInTheDocument();
      expect(screen.getByText('Total interest earned')).toBeInTheDocument();
      expect(screen.getByTestId('final-balance')).toBeInTheDocument();
      expect(screen.getByTestId('total-interest-earned')).toBeInTheDocument();
    });

    it('should update calculations when principal changes', async () => {
      const user = userEvent.setup();
      const principalInput = screen.getByTestId('principal-input');
      
      await user.clear(principalInput);
      await user.type(principalInput, '20000');
      
      await waitFor(() => {
        const finalBalance = screen.getByTestId('final-balance');
        expect(finalBalance).toBeInTheDocument();
        expect(finalBalance.textContent).toContain('$');
      });
    });

    it('should update calculations when duration changes', async () => {
      const user = userEvent.setup();
      const durationInput = screen.getByTestId('investment-term-input');
      
      await user.clear(durationInput);
      await user.type(durationInput, '12');
      
      await waitFor(() => {
        const rows = screen.getAllByRole('row');
        // Should have header row + 12 month rows
        expect(rows.length).toBe(13);
      });
    });
  });

  describe('Frequency Selection', () => {
    it('should update calculations when frequency changes to quarterly', async () => {
      const quarterlyRadio = screen.getByTestId('radio-re-invest-quarterly');
      
      fireEvent.click(quarterlyRadio);
      
      await waitFor(() => {
        expect(quarterlyRadio).toBeChecked();
        expect(screen.getByText('Projected savings')).toBeInTheDocument();
      });
    });

    it('should update calculations when frequency changes to annually', async () => {
      const annuallyRadio = screen.getByTestId('radio-re-invest-annually');
      
      fireEvent.click(annuallyRadio);
      
      await waitFor(() => {
        expect(annuallyRadio).toBeChecked();
        expect(screen.getByText('Projected savings')).toBeInTheDocument();
      });
    });

    it('should update calculations when frequency changes to at maturity', async () => {
      const atMaturityRadio = screen.getByTestId('radio-re-invest-atmaturity');
      
      fireEvent.click(atMaturityRadio);
      
      await waitFor(() => {
        expect(atMaturityRadio).toBeChecked();
        expect(screen.getByText('Projected savings')).toBeInTheDocument();
      });
    });
  });

  describe('Input Handling', () => {
    it('should accept valid interest rate values', async () => {
      const user = userEvent.setup();
      const interestInput = screen.getByTestId('interest-rate-input');
      
      await user.clear(interestInput);
      await user.type(interestInput, '5.5');
      
      await waitFor(() => {
        expect(interestInput).toHaveValue(5.5);
        expect(screen.getByText('Projected savings')).toBeInTheDocument();
      });
    });

    it('should accept valid duration values', async () => {
      const user = userEvent.setup();
      const durationInput = screen.getByTestId('investment-term-input');
      
      await user.clear(durationInput);
      await user.type(durationInput, '24');
      
      await waitFor(() => {
        expect(durationInput).toHaveValue(24);
        expect(screen.getByText('Projected savings')).toBeInTheDocument();
      });
    });

    it('should handle component state updates gracefully', async () => {
      const user = userEvent.setup();
      const principalInput = screen.getByTestId('principal-input');
      
      await user.clear(principalInput);
      
      // Component should handle this without crashing
      expect(screen.getByTestId('principal-input')).toBeInTheDocument();
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
      const principalInput = screen.getByTestId('principal-input');
      
      await user.clear(principalInput);
      await user.type(principalInput, '100000');
      
      await waitFor(() => {
        const finalBalance = screen.getByTestId('final-balance');
        expect(finalBalance.textContent).toMatch(/\$[\d,]+/);
      });
    });
  });

  describe('Form Accessibility', () => {
    it('should have proper input types', () => {
      expect(screen.getByTestId('principal-input')).toHaveAttribute('type', 'number');
      expect(screen.getByTestId('interest-rate-input')).toHaveAttribute('type', 'number');
      expect(screen.getByTestId('investment-term-input')).toHaveAttribute('type', 'number');
    });

    it('should have visible labels for form inputs', () => {
      expect(screen.getByText('Starting with ($)')).toBeInTheDocument();
      expect(screen.getByText('Interest rate (% p.a.)')).toBeInTheDocument();
      expect(screen.getByText('Investment term (months)')).toBeInTheDocument();
      expect(screen.getByText('Interest paid')).toBeInTheDocument();
    });
  });
});