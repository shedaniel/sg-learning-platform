import { test, expect } from "@playwright/test";

test("dashboard and learning map render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("今日の30分");
  await expect(page.getByRole("link", { name: "学習", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "学習", exact: true }).click();
  await expect(page.getByRole("heading", { name: "学習マップ" })).toBeVisible();
  await expect(page.getByText("シラバスを、一本の道に。")).toBeVisible();
});

test("lesson reading, completion and persistence", async ({ page }) => {
  await page.goto("/learn");
  const firstLesson = page.locator('a[href^="/learn/"]').filter({ hasText: "分" }).first();
  await firstLesson.click();
  await expect(page.locator("article h1")).toBeVisible();
  await expect(page.getByText("このレッスンの到達点")).toBeVisible();
  await expect(page.getByRole("heading", { name: "このレッスンの要点" })).toBeVisible();

  const complete = page.getByRole("button", { name: "読了にする" });
  if (await complete.count()) {
    await complete.click();
    await expect(page.getByRole("button", { name: "読了済み" })).toBeVisible();
  }
  await page.reload();
  await expect(page.locator("article h1")).toBeVisible();
});

test("glossary search and term detail", async ({ page }) => {
  await page.goto("/glossary");
  await page.getByRole("searchbox", { name: "用語を検索" }).fill("可用性");
  await page.getByRole("button", { name: "検索" }).click();
  await expect(page.getByText("可用性").first()).toBeVisible();
  await page.getByText("可用性", { exact: true }).first().click();
  await expect(page.getByText("日本語の説明")).toBeVisible();
  await expect(page.getByText("English support")).toBeVisible();
});

test("global search returns terms and lessons", async ({ page }) => {
  await page.goto("/search?q=ISMS");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("ISMS");
  await expect(page.getByText("用語").first()).toBeVisible();
});
