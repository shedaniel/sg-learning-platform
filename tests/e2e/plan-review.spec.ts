import { test, expect } from "@playwright/test";

test("study plan generation", async ({ page }) => {
  await page.goto("/plan");
  await page.getByRole("button", { name: "プランを生成・更新" }).click();
  await expect(page.getByText("学習カレンダー")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText("設計の前提")).toBeVisible();
});

test("review page and coverage render", async ({ page }) => {
  await page.goto("/review");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("忘れる前に");
  await page.goto("/coverage");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("抜けを、見える化");
  await expect(page.getByText("2027年度 新試験制度のシラバス案について")).toBeVisible();
});
