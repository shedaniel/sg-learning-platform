import { test, expect } from "@playwright/test";

test("review page and coverage render", async ({ page }) => {
  await page.goto("/review");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("復習");
  await page.goto("/coverage");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("シラバス対応表");
  await expect(page.getByText("2027年度 新試験制度のシラバス案について")).toBeVisible();
});
