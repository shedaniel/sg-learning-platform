import { test, expect } from "@playwright/test";

test("mock exam starts, saves and submits", async ({ page }) => {
  await page.goto("/mock");
  await page.getByRole("button", { name: /120分の模擬試験を開始/ }).click();
  await expect(page.getByText("解答状況")).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(/問 1 \/ 60/)).toBeVisible();
  await page.locator('[role="group"][aria-label="選択肢"] button').first().click();

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "解答を確定して提出" }).click();
  await expect(page.getByRole("heading", { name: "模擬試験の結果" })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText("素点正答率")).toBeVisible();
});

test("mock answers survive a refresh", async ({ page }) => {
  await page.goto("/mock");
  await page.getByRole("button", { name: /120分の模擬試験を開始/ }).click();
  await expect(page.getByText("解答状況")).toBeVisible({ timeout: 30_000 });
  const firstOption = page.locator('[role="group"][aria-label="選択肢"] button').first();
  await firstOption.click();
  await expect(firstOption).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("自動保存済み")).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(1000);
  await page.reload();
  await expect(page.getByText("解答状況")).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('[role="group"][aria-label="選択肢"] button').first()).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
