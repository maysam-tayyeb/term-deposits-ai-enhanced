import { test, expect } from "@playwright/test";

test.describe("Cross-Implementation State Synchronization", () => {
  test("should sync state changes across all implementations", async ({ browser }) => {
    // Create two browser contexts to simulate different tabs
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // Navigate to different implementations
    await page1.goto("/hook");
    await page2.goto("/zustand");

    // Wait for initial load
    await page1.waitForTimeout(500);
    await page2.waitForTimeout(500);

    // Change principal in Custom Hook implementation
    const principalInput1 = page1.getByTestId("principal-input");
    await principalInput1.click();
    await principalInput1.fill("");
    await principalInput1.type("75000");

    // Wait for localStorage sync
    await page2.waitForTimeout(100);

    // Verify the value synced to Zustand implementation
    const principalInput2 = page2.getByTestId("principal-input");
    await expect(principalInput2).toHaveValue("75000");

    // Now change interest rate in Zustand implementation
    const interestInput2 = page2.getByTestId("interest-rate-input");
    await interestInput2.click();
    await interestInput2.fill("");
    await interestInput2.type("9.5");

    // Wait for sync
    await page1.waitForTimeout(100);

    // Verify it synced back to Custom Hook implementation
    const interestInput1 = page1.getByTestId("interest-rate-input");
    await expect(interestInput1).toHaveValue("9.5");

    // Clean up
    await context1.close();
    await context2.close();
  });

  test("should sync across all four implementations in same tab", async ({ page }) => {
    // Start with Custom Hook
    await page.goto("/hook");
    
    // Set custom values
    const principalInput = page.getByTestId("principal-input");
    await principalInput.click();
    await principalInput.fill("");
    await principalInput.type("100000");

    const monthsInput = page.getByTestId("investment-term-input");
    await monthsInput.click();
    await monthsInput.fill("");
    await monthsInput.type("24");

    // Navigate to Context implementation
    await page.goto("/context");
    await expect(page.getByTestId("principal-input")).toHaveValue("100000");
    await expect(page.getByTestId("investment-term-input")).toHaveValue("24");

    // Navigate to Valtio implementation
    await page.goto("/valtio");
    await expect(page.getByTestId("principal-input")).toHaveValue("100000");
    await expect(page.getByTestId("investment-term-input")).toHaveValue("24");

    // Navigate to Zustand implementation
    await page.goto("/zustand");
    await expect(page.getByTestId("principal-input")).toHaveValue("100000");
    await expect(page.getByTestId("investment-term-input")).toHaveValue("24");

    // Change frequency in Zustand
    await page.getByTestId("radio-re-invest-quarterly").click();

    // Go back to Custom Hook and verify frequency changed
    await page.goto("/hook");
    await expect(page.getByTestId("radio-re-invest-quarterly")).toHaveClass(/bg-blue-600/);
  });

  test("should maintain calculation results across implementations", async ({ page }) => {
    await page.goto("/hook");
    
    // Set specific values
    await page.getByTestId("principal-input").fill("50000");
    await page.getByTestId("interest-rate-input").fill("6.5");
    await page.getByTestId("investment-term-input").fill("12");
    
    // Wait for calculation
    await page.waitForTimeout(500);
    
    // Get the final balance
    const finalBalance1 = await page.getByTestId("final-balance").textContent();
    
    // Navigate to each implementation and verify same result
    for (const route of ["/context", "/valtio", "/zustand"]) {
      await page.goto(route);
      await page.waitForTimeout(500);
      const finalBalance = await page.getByTestId("final-balance").textContent();
      expect(finalBalance).toBe(finalBalance1);
    }
  });
});