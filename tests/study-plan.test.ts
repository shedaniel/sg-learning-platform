import { describe, expect, it } from "vitest";
import { generateStudyPlan, planSummary } from "@/lib/study-plan";
import type { StudyPlanInput } from "@/lib/content/types";

const input: StudyPlanInput = {
  examDate: "2026-12-20",
  minutesPerDay: 60,
  daysPerWeek: 5,
  familiarity: "basic",
  japaneseConfidence: "medium",
};

describe("generateStudyPlan", () => {
  it("ends on or before the exam date and includes reviews", () => {
    const plan = generateStudyPlan(input, { startDate: new Date("2026-10-01T00:00:00") });
    expect(plan.days.length).toBeGreaterThan(0);
    expect(plan.days.at(-1)?.date).toBe("2026-12-20");
    expect(plan.days.every((day) => day.date <= input.examDate)).toBe(true);
    expect(plan.days.some((day) => day.kind === "review")).toBe(true);
    expect(plan.days.some((day) => day.kind === "mock")).toBe(true);
  });

  it("does not schedule completed lessons", () => {
    const completed = ["security/cia-and-design", "risk/fundamentals"];
    const plan = generateStudyPlan(input, {
      startDate: new Date("2026-10-01T00:00:00"),
      completedLessonIds: completed,
    });
    const lessonIds = plan.days.flatMap((day) => day.lessonIds ?? []);
    for (const id of completed) expect(lessonIds).not.toContain(id);
  });

  it("counts study days and total hours", () => {
    const plan = generateStudyPlan(input, { startDate: new Date("2026-11-01T00:00:00") });
    const summary = planSummary(plan);
    expect(summary.studyDays).toBeGreaterThan(0);
    expect(summary.totalHours).toBeGreaterThan(0);
  });
});
