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

test("shows error if interest rate is out of range", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByTestId("interest-rate-input").fill("15.1");
  const $totalInterestEarned = page.locator('[data-testid="error"]');
  await expect($totalInterestEarned).toHaveText(
    "Interest rate must be between 0.00% and 15.00%. Received: 15.10%",
  );
});

test("shows error if investment term is out of range", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByTestId("investment-term-input").fill("61");
  const $totalInterestEarned = page.locator('[data-testid="error"]');
  await expect($totalInterestEarned).toHaveText(
    "Duration must be between 3 and 60 months. Received: 61 months",
  );
});
