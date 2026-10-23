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
  await page.locator('a[href^="/practice/question/"]').first().click();
  await page.waitForURL(/\/practice\/question\//);
  await expect(page.getByText(/出典：IPA 情報セキュリティマネジメント試験/).first()).toBeVisible();
  await expect(page.getByText("公式PDF・出題年度ページ")).toBeVisible();
});

test("a wrong answer enters the spaced-repetition queue", async ({ page }) => {
  await page.goto("/practice");
  await page.evaluate(async () => {
    const start = await fetch("/api/quiz/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count: 1, part: "A", includeOfficial: true }),
    }).then((response) => response.json());
    const question = start.questions[0];
    const wrong = question.options.find((option: { id: string }) => option.id !== question.correctOptionId);
    await fetch("/api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: question.id, selected: wrong.id, elapsedMs: 1000, mode: "quiz" }),
    });
    return { id: question.id };
  });
  await page.goto("/review");
  await expect(page.getByText("今日の復習キュー")).toBeVisible();
  await expect(page.locator('a[href^="/practice/question/"]').first()).toBeVisible();
});
