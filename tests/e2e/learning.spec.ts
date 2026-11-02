import { test, expect } from "./fixtures";

test("dashboard and learning map render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("学習状況");
  await expect(page.getByRole("link", { name: "学習", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "学習", exact: true }).click();
  await expect(page.getByRole("heading", { name: "学習マップ" })).toBeVisible();
  await expect(page.getByText("どの順番で読んでも構いません")).toBeVisible();
});

test("lesson reading, completion and persistence", async ({ page }) => {
  await page.goto("/learn");
  const firstLesson = page.locator('a[href^="/learn/"]').filter({ hasText: "分" }).first();
  await firstLesson.click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("このレッスンの到達点")).toBeVisible();
  await expect(page.getByRole("heading", { name: "このレッスンの要点" })).toBeVisible();

  const complete = page.getByRole("button", { name: "読了にする" });
  if (await complete.count()) {
    await complete.click();
    await expect(page.getByRole("button", { name: "読了済み" })).toBeVisible();
  }
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("button", { name: "読了済み" })).toBeVisible();
});

test("glossary search and term detail", async ({ page }) => {
  await page.goto("/glossary");
  await page.getByLabel("用語を検索").fill("可用性");
  await page.getByRole("button", { name: "検索" }).click();
  await expect(page.getByText("可用性").first()).toBeVisible();
  await page.getByRole("link", { name: /^可用性/ }).first().click();
  await expect(page.getByText("日本語の説明")).toBeVisible();
  await expect(page.getByText("English support")).toBeVisible();
});

test("global search returns terms and lessons", async ({ page }) => {
  await page.goto("/search?q=ISMS");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("ISMS");
  await expect(page.getByText("用語").first()).toBeVisible();
});
