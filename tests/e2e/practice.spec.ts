import { test, expect } from "@playwright/test";

test("topic quiz gives feedback and saves attempts", async ({ page }) => {
  await page.goto("/practice/run?count=5&feedback=instant");
  const firstOption = page.locator('[role="group"][aria-label="選択肢"] button').first();
  await expect(firstOption).toBeVisible({ timeout: 20_000 });
  await firstOption.click();
  await expect(page.getByText(/正解|不正解/).first()).toBeVisible();
  await expect(page.getByText("なぜそうなるか")).toBeVisible();
  await page.getByRole("button", { name: "次へ" }).click();
  await expect(page.locator('[role="group"][aria-label="選択肢"] button').first()).toBeVisible();
});

test("end-of-quiz feedback and result screen", async ({ page }) => {
  await page.goto("/practice/run?count=3&feedback=end");
  for (let i = 0; i < 3; i += 1) {
    const option = page.locator('[role="group"][aria-label="選択肢"] button').first();
    await expect(option).toBeVisible({ timeout: 20_000 });
    await option.click();
    if (i < 2) await page.getByRole("button", { name: "次へ" }).click();
  }
  await page.getByRole("button", { name: "結果を見る" }).click();
  await expect(page.getByText(/問正解/)).toBeVisible();
  await expect(page.getByText("問題ごとの結果")).toBeVisible();
});

test("official past paper exposes source and answer", async ({ page }) => {
  await page.goto("/past-papers/2026");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("2026年度");
  await expect(page.getByText("出典：IPA").first()).toBeVisible();
  await page.getByRole("link", { name: /問1|問題/ }).first().click();
  await expect(page.getByText(/出典：IPA 情報セキュリティマネジメント試験/)).toBeVisible();
  await expect(page.getByText("公式PDF・出題年度ページ")).toBeVisible();
});
