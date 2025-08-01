import { test, expect } from "@playwright/test";

test.describe("State Persistence", () => {
  test("should persist calculator values across page reloads", async ({ page }) => {
    // Navigate to the calculator
    await page.goto("/");

    // Set custom values
    const principalInput = page.getByTestId("principal-input");
    const interestRateInput = page.getByTestId("interest-rate-input");
    const investmentTermInput = page.getByTestId("investment-term-input");
    const quarterlyButton = page.getByTestId("radio-re-invest-quarterly");

    // Clear and set new values
    await principalInput.click();
    await principalInput.fill("");
    await principalInput.type("50000");
    
    await interestRateInput.click();
    await interestRateInput.fill("");
    await interestRateInput.type("8.5");
    
    await investmentTermInput.click();
    await investmentTermInput.fill("");
    await investmentTermInput.type("36");
    
    await quarterlyButton.click();

    // Wait for calculations to complete
    await page.waitForTimeout(500);

    // Reload the page
    await page.reload();

    // Verify values are persisted
    await expect(principalInput).toHaveValue("50000");
    await expect(interestRateInput).toHaveValue("8.5");
    await expect(investmentTermInput).toHaveValue("36");
    await expect(quarterlyButton).toHaveClass(/bg-blue-600/);

    // Verify the calculation results are still shown
    await expect(page.getByTestId("final-balance")).toContainText("$67,451");
    await expect(page.getByTestId("total-interest")).toContainText("$17,451");
  });

  test("should persist values across browser tabs", async ({ browser }) => {
    // Create two browser contexts (simulating different tabs)
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // Navigate to the calculator in tab 1
    await page1.goto("/");

    // Set values in tab 1
    const principalInput1 = page1.getByTestId("principal-input");
    await principalInput1.click();
    await principalInput1.fill("");
    await principalInput1.type("30000");

    // Wait for the value to be saved to localStorage
    await page1.waitForTimeout(100);

    // Navigate to the calculator in tab 2
    await page2.goto("/");

    // Verify the value is loaded from localStorage in tab 2
    const principalInput2 = page2.getByTestId("principal-input");
    await expect(principalInput2).toHaveValue("30000");

    // Clean up
    await context1.close();
    await context2.close();
  });

  test("should handle reset to defaults correctly", async ({ page }) => {
    await page.goto("/");

    // Set custom values
    const principalInput = page.getByTestId("principal-input");
    const resetButton = page.getByRole("button", { name: "Reset to Default" });

    await principalInput.click();
    await principalInput.fill("");
    await principalInput.type("75000");

    // Verify custom value is set
    await expect(principalInput).toHaveValue("75000");

    // Reset to defaults
    await resetButton.click();

    // Verify default values are restored
    await expect(principalInput).toHaveValue("20000");
    await expect(page.getByTestId("interest-rate-input")).toHaveValue("5.5");
    await expect(page.getByTestId("investment-term-input")).toHaveValue("3");
    await expect(page.getByTestId("radio-re-invest-monthly")).toHaveClass(/bg-blue-600/);

    // Reload page to verify defaults are persisted
    await page.reload();
    await expect(principalInput).toHaveValue("20000");
  });

  test("should handle invalid localStorage data gracefully", async ({ page, context }) => {
    // Set invalid data in localStorage before navigating
    await context.addInitScript(() => {
      window.localStorage.setItem("calculator.principal", "invalid-json{");
      window.localStorage.setItem("calculator.annualRate", '{"bad": "data"}');
    });

    // Navigate to the calculator
    await page.goto("/");

    // Should fall back to default values when localStorage data is invalid
    await expect(page.getByTestId("principal-input")).toHaveValue("20000");
    await expect(page.getByTestId("interest-rate-input")).toHaveValue("5.5");
  });
});