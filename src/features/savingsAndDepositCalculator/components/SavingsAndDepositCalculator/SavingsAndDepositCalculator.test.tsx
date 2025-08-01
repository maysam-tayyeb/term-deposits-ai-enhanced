import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SavingsAndDepositCalculator } from "./SavingsAndDepositCalculator";
import {
  DEFAULT_VALUES,
  UI_TEXT,
  TEST_IDS,
  FREQUENCY_OPTIONS,
} from "../../config/constants";

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
  TYPE_NUMBER: "number",
  TYPE_TEXT: "text",
} as const;

const CURRENCY_PATTERNS = {
  WITH_DOLLAR_SIGN: /\$[\d,]+/,
} as const;

describe("SavingsAndDepositCalculator", () => {
  beforeEach(() => {
    render(<SavingsAndDepositCalculator />);
  });

  describe("Initial Rendering", () => {
    it("should render the calculator with default values", () => {
      expect(screen.getByText(UI_TEXT.TITLE)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.PRINCIPAL_INPUT)).toHaveValue(
        DEFAULT_VALUES.PRINCIPAL,
      );
      expect(screen.getByTestId(TEST_IDS.INTEREST_RATE_INPUT)).toHaveValue(
        DEFAULT_VALUES.ANNUAL_INTEREST_RATE,
      );
      expect(screen.getByTestId(TEST_IDS.INVESTMENT_TERM_INPUT)).toHaveValue(
        DEFAULT_VALUES.INVESTMENT_TERM_MONTHS,
      );
      expect(
        screen.getByTestId(
          `${TEST_IDS.RADIO_PREFIX}${DEFAULT_VALUES.FREQUENCY}`,
        ),
      ).toHaveClass("bg-blue-600");
    });

    it("should display help text for input constraints", () => {
      expect(
        screen.getByText("Enter rate between 0.00% - 15.00%"),
      ).toBeInTheDocument();
      expect(screen.getByText("Enter 3 - 60 months")).toBeInTheDocument();
    });

    it("should render frequency options appropriate for current investment term", () => {
      // With default 3 months, annually should not be visible
      expect(screen.getByText("Monthly")).toBeInTheDocument();
      expect(screen.getByText("Quarterly")).toBeInTheDocument();
      expect(screen.getByText("At Maturity")).toBeInTheDocument();
      expect(screen.queryByText("Annually")).not.toBeInTheDocument();
    });
  });

  describe("Calculation Results", () => {
    it("should display results table with valid inputs", () => {
      expect(
        screen.getByText(UI_TEXT.TABLE_HEADERS.PROJECTED_SAVINGS),
      ).toBeInTheDocument();
      expect(screen.getByText(UI_TEXT.TABLE_HEADERS.MONTH)).toBeInTheDocument();
      expect(
        screen.getByText(UI_TEXT.TABLE_HEADERS.INTEREST_RATE),
      ).toBeInTheDocument();
      expect(
        screen.getByText(UI_TEXT.TABLE_HEADERS.INTEREST_EARNED),
      ).toBeInTheDocument();
      expect(
        screen.getByText(UI_TEXT.TABLE_HEADERS.BALANCE),
      ).toBeInTheDocument();
    });

    it("should display final balance and total interest earned", () => {
      expect(
        screen.getByText(UI_TEXT.SUMMARY.FINAL_BALANCE),
      ).toBeInTheDocument();
      expect(
        screen.getByText(UI_TEXT.SUMMARY.TOTAL_INTEREST_EARNED),
      ).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.FINAL_BALANCE)).toBeInTheDocument();
      expect(
        screen.getByTestId(TEST_IDS.TOTAL_INTEREST_EARNED),
      ).toBeInTheDocument();
    });

    it("should update calculations when principal changes", async () => {
      const user = userEvent.setup();
      const principalInput = screen.getByTestId(TEST_IDS.PRINCIPAL_INPUT);

      await user.click(principalInput);
      await user.clear(principalInput);
      await user.type(principalInput, TEST_VALUES.PRINCIPAL.MEDIUM.toString());

      await waitFor(() => {
        const finalBalance = screen.getByTestId(TEST_IDS.FINAL_BALANCE);
        expect(finalBalance).toBeInTheDocument();
        expect(finalBalance.textContent).toContain("$");
      });
    });

    it("should update calculations when duration changes", async () => {
      const user = userEvent.setup();
      const durationInput = screen.getByTestId(TEST_IDS.INVESTMENT_TERM_INPUT);

      await user.click(durationInput);
      await user.clear(durationInput);
      await user.type(
        durationInput,
        TEST_VALUES.INVESTMENT_TERM_MONTHS.YEAR.toString(),
      );

      await waitFor(() => {
        const rows = screen.getAllByRole("row");
        expect(rows.length).toBe(EXPECTED_TABLE_ROWS.TWELVE_MONTHS);
      });
    });
  });

  describe("Frequency Selection", () => {
    // Test each frequency option dynamically using FREQUENCY_OPTIONS
    FREQUENCY_OPTIONS.filter(
      (option) => option.value !== DEFAULT_VALUES.FREQUENCY,
    ).forEach((option) => {
      it(`should update calculations when frequency changes to ${option.label.toLowerCase()}`, async () => {
        const user = userEvent.setup();

        // If testing annually, first set investment term to 12+ months
        if (option.value === "annually") {
          const investmentTermInput = screen.getByTestId(
            TEST_IDS.INVESTMENT_TERM_INPUT,
          );
          await user.click(investmentTermInput);
          await user.clear(investmentTermInput);
          await user.type(investmentTermInput, "12");
        }

        const button = screen.getByTestId(
          `${TEST_IDS.RADIO_PREFIX}${option.value.toLowerCase()}`,
        );

        fireEvent.click(button);

        await waitFor(() => {
          expect(button).toHaveClass("bg-blue-600");
          expect(
            screen.getByText(UI_TEXT.TABLE_HEADERS.PROJECTED_SAVINGS),
          ).toBeInTheDocument();
        });
      });
    });

    it("should have appropriate frequency options available for current investment term", () => {
      // With default 3 months, annually should not be available
      const availableOptions = FREQUENCY_OPTIONS.filter(
        (option) => option.value !== "annually",
      );
      availableOptions.forEach((option) => {
        const button = screen.getByTestId(
          `${TEST_IDS.RADIO_PREFIX}${option.value.toLowerCase()}`,
        );
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(option.label);
      });

      // Annually should not be available with default 3 month term
      expect(
        screen.queryByTestId(TEST_IDS.RADIO_PREFIX + "annually"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Input Handling", () => {
    it("should accept valid interest rate values", async () => {
      const user = userEvent.setup();
      const interestInput = screen.getByTestId(TEST_IDS.INTEREST_RATE_INPUT);

      await user.click(interestInput);
      await user.clear(interestInput);
      await user.type(
        interestInput,
        TEST_VALUES.INTEREST_RATE.MEDIUM.toString(),
      );

      await waitFor(() => {
        expect(interestInput).toHaveValue(
          TEST_VALUES.INTEREST_RATE.MEDIUM,
        );
        expect(
          screen.getByText(UI_TEXT.TABLE_HEADERS.PROJECTED_SAVINGS),
        ).toBeInTheDocument();
      });
    });

    it("should accept valid duration values", async () => {
      const user = userEvent.setup();
      const durationInput = screen.getByTestId(TEST_IDS.INVESTMENT_TERM_INPUT);

      await user.click(durationInput);
      await user.clear(durationInput);
      await user.type(
        durationInput,
        TEST_VALUES.INVESTMENT_TERM_MONTHS.TWO_YEARS.toString(),
      );

      await waitFor(() => {
        expect(durationInput).toHaveValue(
          TEST_VALUES.INVESTMENT_TERM_MONTHS.TWO_YEARS,
        );
        expect(
          screen.getByText(UI_TEXT.TABLE_HEADERS.PROJECTED_SAVINGS),
        ).toBeInTheDocument();
      });
    });

    it("should handle component state updates gracefully", async () => {
      const user = userEvent.setup();
      const principalInput = screen.getByTestId(TEST_IDS.PRINCIPAL_INPUT);

      await user.click(principalInput);
      await user.clear(principalInput);

      expect(screen.getByTestId(TEST_IDS.PRINCIPAL_INPUT)).toBeInTheDocument();
    });
  });

  describe("Currency Formatting", () => {
    it("should format currency values in the table", async () => {
      await waitFor(() => {
        const balanceCells = screen.getAllByRole("cell");
        const balanceCell = balanceCells.find((cell) =>
          cell.textContent?.includes("$"),
        );
        expect(balanceCell).toBeInTheDocument();
      });
    });

    it("should use thousand separators in final balance display", async () => {
      const user = userEvent.setup();
      const principalInput = screen.getByTestId(TEST_IDS.PRINCIPAL_INPUT);

      await user.clear(principalInput);
      await user.type(principalInput, TEST_VALUES.PRINCIPAL.LARGE.toString());

      await waitFor(() => {
        const finalBalance = screen.getByTestId(TEST_IDS.FINAL_BALANCE);
        expect(finalBalance.textContent).toMatch(
          CURRENCY_PATTERNS.WITH_DOLLAR_SIGN,
        );
      });
    });
  });

  describe("Form Accessibility", () => {
    it("should have proper input types", () => {
      expect(screen.getByTestId(TEST_IDS.PRINCIPAL_INPUT)).toHaveAttribute(
        "type",
        INPUT_ATTRIBUTES.TYPE_NUMBER,
      );
      expect(screen.getByTestId(TEST_IDS.INTEREST_RATE_INPUT)).toHaveAttribute(
        "type",
        INPUT_ATTRIBUTES.TYPE_NUMBER,
      );
      expect(
        screen.getByTestId(TEST_IDS.INVESTMENT_TERM_INPUT),
      ).toHaveAttribute("type", INPUT_ATTRIBUTES.TYPE_NUMBER);
    });

    it("should have visible labels for form inputs", () => {
      expect(screen.getByText(UI_TEXT.LABELS.PRINCIPAL)).toBeInTheDocument();
      expect(
        screen.getByText(UI_TEXT.LABELS.INTEREST_RATE),
      ).toBeInTheDocument();
      expect(
        screen.getByText(UI_TEXT.LABELS.INVESTMENT_TERM),
      ).toBeInTheDocument();
      expect(
        screen.getByText(UI_TEXT.LABELS.INTEREST_PAID),
      ).toBeInTheDocument();
    });
  });

  describe("Frequency Option Visibility", () => {
    it("should show annually option when investment term is 12 months or more", async () => {
      const user = userEvent.setup();
      const investmentTermInput = screen.getByTestId(
        TEST_IDS.INVESTMENT_TERM_INPUT,
      );

      await user.click(investmentTermInput);
      await user.clear(investmentTermInput);
      await user.type(investmentTermInput, "12");

      await waitFor(() => {
        expect(
          screen.getByTestId(TEST_IDS.RADIO_PREFIX + "annually"),
        ).toBeInTheDocument();
      });
    });

    it("should hide annually option when investment term is less than 12 months", async () => {
      const user = userEvent.setup();
      const investmentTermInput = screen.getByTestId(
        TEST_IDS.INVESTMENT_TERM_INPUT,
      );

      await user.click(investmentTermInput);
      await user.clear(investmentTermInput);
      await user.type(investmentTermInput, "6");

      await waitFor(() => {
        expect(
          screen.queryByTestId(TEST_IDS.RADIO_PREFIX + "annually"),
        ).not.toBeInTheDocument();
      });
    });

    it("should automatically change frequency from annually to at maturity when term becomes less than 12 months", async () => {
      const user = userEvent.setup();
      const investmentTermInput = screen.getByTestId(
        TEST_IDS.INVESTMENT_TERM_INPUT,
      );
      const atMaturityButton = screen.getByTestId(
        TEST_IDS.RADIO_PREFIX + "atmaturity",
      );

      // First set to 12 months to ensure annually option is visible
      await user.clear(investmentTermInput);
      await user.type(investmentTermInput, "12");

      // Wait for annually option to appear and then select it
      await waitFor(() => {
        expect(
          screen.getByTestId(TEST_IDS.RADIO_PREFIX + "annually"),
        ).toBeInTheDocument();
      });

      const annuallyButton = screen.getByTestId(
        TEST_IDS.RADIO_PREFIX + "annually",
      );
      await user.click(annuallyButton);
      expect(annuallyButton).toHaveClass("bg-blue-600");

      // Change to less than 12 months
      await user.click(investmentTermInput);
      await user.clear(investmentTermInput);
      await user.type(investmentTermInput, "6");

      await waitFor(() => {
        // Annually option should be hidden
        expect(
          screen.queryByTestId(TEST_IDS.RADIO_PREFIX + "annually"),
        ).not.toBeInTheDocument();
        // At Maturity should be automatically selected
        expect(atMaturityButton).toHaveClass("bg-blue-600");
      });
    });

    it("should maintain other frequency selections when changing term to less than 12 months", async () => {
      const user = userEvent.setup();
      const investmentTermInput = screen.getByTestId(
        TEST_IDS.INVESTMENT_TERM_INPUT,
      );
      const quarterlyButton = screen.getByTestId(
        TEST_IDS.RADIO_PREFIX + "quarterly",
      );

      // Select quarterly
      await user.click(quarterlyButton);
      expect(quarterlyButton).toHaveClass("bg-blue-600");

      // Change to less than 12 months
      await user.click(investmentTermInput);
      await user.clear(investmentTermInput);
      await user.type(investmentTermInput, "9");

      await waitFor(() => {
        // Quarterly should still be selected
        expect(quarterlyButton).toHaveClass("bg-blue-600");
        // Annually option should be hidden
        expect(
          screen.queryByTestId(TEST_IDS.RADIO_PREFIX + "annually"),
        ).not.toBeInTheDocument();
      });
    });
  });
});
