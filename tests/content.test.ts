import { describe, expect, it } from "vitest";
import {
  ALL_LESSONS,
  ALL_QUESTIONS,
  ALL_TERMS,
  AREAS,
  OFFICIAL_PAPERS,
  OFFICIAL_QUESTIONS,
  coverageStats,
} from "@/content";
import { SYLLABUS_VERSION } from "@/content/syllabus";

describe("content bank", () => {
  it("contains all areas with lessons", () => {
    expect(AREAS).toHaveLength(8);
    for (const area of AREAS) expect(area.lessons.length).toBeGreaterThanOrEqual(3);
    expect(new Set(ALL_LESSONS.map((lesson) => lesson.id)).size).toBe(ALL_LESSONS.length);
  });

  it("has enough questions for a 60-question mock", () => {
    expect(ALL_QUESTIONS.filter((q) => q.part === "A").length).toBeGreaterThanOrEqual(48);
    expect(ALL_QUESTIONS.filter((q) => q.part === "B").length).toBeGreaterThanOrEqual(12);
  });

  it("has complete syllabus coverage", () => {
    const stats = coverageStats();
    expect(stats.missing).toBe(0);
  });

  it("keeps every question answerable", () => {
    for (const question of ALL_QUESTIONS) {
      expect(question.options.length).toBeGreaterThanOrEqual(4);
      expect(question.options.some((option) => option.id === question.correctOptionId)).toBe(true);
      expect(new Set(question.options.map((option) => option.id)).size).toBe(question.options.length);
    }
  });

  it("links every term reference", () => {
    const ids = new Set(ALL_TERMS.map((term) => term.id));
    for (const term of ALL_TERMS) {
      for (const related of term.relatedTermIds) expect(ids.has(related)).toBe(true);
    }
  });

  it("has four official public papers with 15 questions each", () => {
    expect(OFFICIAL_PAPERS).toHaveLength(4);
    for (const paper of OFFICIAL_PAPERS) {
      expect(paper.publishedCount).toBe(15);
      expect(paper.actualCount).toBe(60);
      expect(paper.questions.length).toBe(15);
      for (const question of paper.questions) {
        expect(question.source.kind).toBe("official");
        expect(question.source.attribution).toContain("IPA");
      }
    }
    expect(OFFICIAL_QUESTIONS).toHaveLength(60);
  });

  it("pins the current syllabus version", () => {
    expect(SYLLABUS_VERSION.current).toBe("Ver.4.1");
    expect(SYLLABUS_VERSION.examStructure.questions).toBe(60);
    expect(SYLLABUS_VERSION.examStructure.partA + SYLLABUS_VERSION.examStructure.partB).toBe(60);
  });
});
