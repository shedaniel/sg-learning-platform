import { randomUUID } from "node:crypto";
import { test, expect } from "@playwright/test";

test("a visitor must choose a sync code, and the same code opens the same progress elsewhere", async ({ browser }) => {
  const code = `e2e-sync-${randomUUID().slice(0, 8)}`;

  const first = await browser.newContext();
  const page = await first.newPage();
  await page.goto("/learn");
  await expect(page).toHaveURL(/\/profile\?next=%2Flearn/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("プロフィールを選ぶ");

  const unauthenticatedApi = await page.request.post("/api/lesson-progress", {
    data: { lessonId: "security/cia-and-design", completed: true },
  });
  expect(unauthenticatedApi.status()).toBe(401);

  await page.getByLabel("同期コード").fill("ab");
  await page.getByRole("button", { name: "このコードで開く" }).click();
  await expect(page.locator("#profile-code-error")).toContainText("形式が正しくありません");

  await page.getByLabel("同期コード").fill(code.toUpperCase());
  await page.getByRole("button", { name: "このコードで開く" }).click();
  await expect(page.getByText("まだ使われていないコード")).toBeVisible();
  await page.getByRole("button", { name: "新しく始める" }).click();
  await expect(page).toHaveURL(/\/learn$/);
  await expect(page.getByRole("heading", { name: "学習マップ" })).toBeVisible();
  await expect(page.getByRole("link", { name: new RegExp(code) })).toBeVisible();

  const saved = await page.request.post("/api/lesson-progress", {
    data: { lessonId: "security/cia-and-design", completed: true },
  });
  expect(saved.ok()).toBe(true);
  await first.close();

  // A different browser knows nothing but the code.
  const second = await browser.newContext();
  const other = await second.newPage();
  await other.goto("/");
  await expect(other).toHaveURL(/\/profile$/);
  await other.getByLabel("同期コード").fill(code);
  await other.getByRole("button", { name: "このコードで開く" }).click();
  await expect(other.getByRole("heading", { level: 1 })).toContainText("学習状況");
  await expect(other.getByText("レッスン完了")).toBeVisible();
  await expect(other.locator("dd", { hasText: /^1\/27/ })).toBeVisible();

  // Forgetting the code on this device keeps the data but requires entering the code again.
  await other.goto("/profile");
  await other.getByRole("button", { name: "この端末から外す" }).click();
  // The page reloads without a selected profile, so the button disappears.
  await expect(other.getByRole("button", { name: "この端末から外す" })).toHaveCount(0);
  await other.goto("/");
  await expect(other).toHaveURL(/\/profile$/);
  await second.close();
});
