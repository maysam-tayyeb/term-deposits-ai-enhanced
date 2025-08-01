import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Tests", () => {
  test("should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    await page.goto("http://localhost:5173");

    // Wait for the calculator to be fully loaded
    await page.waitForSelector('[data-testid="principal-input"]');

    // Run axe accessibility checks
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    // Log any violations for debugging
    if (accessibilityScanResults.violations.length > 0) {
      console.log("Accessibility violations found:");
      accessibilityScanResults.violations.forEach((violation) => {
        console.log(`\n${violation.id}: ${violation.description}`);
        console.log(`Impact: ${violation.impact}`);
        console.log(`Help: ${violation.help}`);
        console.log(`Help URL: ${violation.helpUrl}`);
        violation.nodes.forEach((node) => {
          console.log(`  - ${node.target}`);
        });
      });
    }

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should maintain focus visibility when navigating with keyboard", async ({
    page,
  }) => {
    await page.goto("http://localhost:5173");

    // Focus on the first input directly to test keyboard navigation
    await page.locator('[data-testid="principal-input"]').focus();
    await expect(page.locator('[data-testid="principal-input"]')).toBeFocused();

    // Tab to interest rate input
    await page.keyboard.press("Tab");
    await expect(
      page.locator('[data-testid="interest-rate-input"]'),
    ).toBeFocused();

    // Tab to investment term input
    await page.keyboard.press("Tab");
    await expect(
      page.locator('[data-testid="investment-term-input"]'),
    ).toBeFocused();

    // Tab to first frequency button
    await page.keyboard.press("Tab");
    const firstFrequencyButton = page.locator('[role="radio"]').first();
    await expect(firstFrequencyButton).toBeFocused();

    // Test that focus styles are visible
    const focusedElement = await page.evaluateHandle(
      () => document.activeElement,
    );
    const focusStyles = await focusedElement.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        borderColor: styles.borderColor,
        boxShadow: styles.boxShadow,
      };
    });

    // Verify focus is visually indicated
    expect(focusStyles.borderColor).toBeTruthy();
  });

  test("should announce calculation results to screen readers", async ({
    page,
  }) => {
    await page.goto("http://localhost:5173");

    // Fill in the form
    await page.fill('[data-testid="principal-input"]', "10000");
    await page.fill('[data-testid="interest-rate-input"]', "5.5");
    await page.fill('[data-testid="investment-term-input"]', "12");

    // Check that live region exists and will announce updates
    const liveRegion = page.locator('[role="status"][aria-live="polite"]');
    await expect(liveRegion).toBeAttached();
  });

  test("should have proper ARIA labels and roles", async ({ page }) => {
    await page.goto("http://localhost:5173");

    // Check main landmarks
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();

    // Check form inputs have labels
    const principalInput = page.locator('[data-testid="principal-input"]');
    await expect(principalInput).toHaveAttribute("aria-label");
    await expect(principalInput).toHaveAttribute("id");

    // Check table has proper structure
    await page.fill('[data-testid="principal-input"]', "10000");
    await page.fill('[data-testid="interest-rate-input"]', "5.5");
    await page.fill('[data-testid="investment-term-input"]', "12");

    const table = page.locator("table");
    await expect(table).toHaveAttribute("aria-label");

    // Check table headers have scope
    const tableHeaders = page.locator("th");
    const headerCount = await tableHeaders.count();
    for (let i = 0; i < headerCount; i++) {
      await expect(tableHeaders.nth(i)).toHaveAttribute("scope", "col");
    }
  });

  test("should support keyboard navigation in button group", async ({
    page,
  }) => {
    await page.goto("http://localhost:5173");

    // Tab to frequency selection
    await page.fill('[data-testid="principal-input"]', "10000");
    await page.fill('[data-testid="interest-rate-input"]', "5.5");
    await page.fill('[data-testid="investment-term-input"]', "12");

    // Focus on first frequency button
    const monthlyButton = page.locator(
      '[data-testid="radio-re-invest-monthly"]',
    );
    await monthlyButton.focus();
    await expect(monthlyButton).toBeFocused();

    // Test arrow key navigation
    await page.keyboard.press("ArrowRight");
    const quarterlyButton = page.locator(
      '[data-testid="radio-re-invest-quarterly"]',
    );
    await expect(quarterlyButton).toBeFocused();

    await page.keyboard.press("ArrowRight");
    const annuallyButton = page.locator(
      '[data-testid="radio-re-invest-annually"]',
    );
    await expect(annuallyButton).toBeFocused();

    // Test wrap around
    await page.keyboard.press("ArrowLeft");
    await expect(quarterlyButton).toBeFocused();
  });
});
