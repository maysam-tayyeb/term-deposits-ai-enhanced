import { test, expect } from "@playwright/test";

test("has title Term Deposit", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await expect(page).toHaveTitle(/Term Deposit/);
});

test("loaded correctly", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  const $finalBalance = page.locator('[data-testid="final-balance"]');
  await expect($finalBalance).toHaveText("$10,030");

  const $totalInterestEarned = page.locator(
    '[data-testid="total-interest-earned"]',
  );
  await expect($totalInterestEarned).toHaveText("$30");
});

test("calculates correctly", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByTestId("principal-input").fill("600000");
  await page.getByTestId("interest-rate-input").fill("3.2");
  await page.getByTestId("investment-term-input").fill("6");
  await page.getByTestId("radio-re-invest-quarterly").check();

  const $finalBalance = page.locator('[data-testid="final-balance"]');
  await expect($finalBalance).toHaveText("$609,638");

  const $totalInterestEarned = page.locator(
    '[data-testid="total-interest-earned"]',
  );
  await expect($totalInterestEarned).toHaveText("$9,638");
});

test("constrains interest rate to valid range", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Try to enter value above max
  await page.getByTestId("interest-rate-input").fill("15.1");
  await page.getByTestId("interest-rate-input").blur();
  // Value should be constrained to max (15.0)
  await expect(page.getByTestId("interest-rate-input")).toHaveValue("15");
  
  // Try to enter negative value  
  await page.getByTestId("interest-rate-input").fill("-5");
  await page.getByTestId("interest-rate-input").blur();
  // Value should be constrained to min (0)
  await expect(page.getByTestId("interest-rate-input")).toHaveValue("0");
});

test("constrains investment term to valid range", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Try to enter value above max
  await page.getByTestId("investment-term-input").fill("121");
  await page.getByTestId("investment-term-input").blur();
  // Value should be constrained to max (120)
  await expect(page.getByTestId("investment-term-input")).toHaveValue("120");
  
  // Try to enter value below min
  await page.getByTestId("investment-term-input").fill("2");
  await page.getByTestId("investment-term-input").blur();
  // Value should be constrained to min (3)
  await expect(page.getByTestId("investment-term-input")).toHaveValue("3");
});
