/**
 * Exports the study content as JSON assets for the native Android app
 * (android/app/src/main/assets/content). The shapes mirror src/lib/content/types.ts.
 *
 *   assets/content/meta.json        areas, syllabus, topics, official papers (ids only), historical papers
 *   assets/content/lessons/<id>.json one lesson per file ("/" in ids becomes "__")
 *   assets/content/terms.json       all glossary terms
 *   assets/content/questions.json   all questions (original + official)
 *
 * Diagram SVGs are exported separately by scripts/export-diagrams.ts.
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { ALL_LESSONS, ALL_QUESTIONS, ALL_TERMS, AREAS, HISTORICAL_PAPERS, OFFICIAL_PAPERS } from "../src/content";
import { AREA_META, SYLLABUS_TOPICS, SYLLABUS_VERSION } from "../src/content/syllabus";

const OUT = join(import.meta.dirname, "..", "android", "app", "src", "main", "assets", "content");

function write(rel: string, data: unknown) {
  const file = join(OUT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(data));
}

rmSync(join(OUT, "lessons"), { recursive: true, force: true });

write("meta.json", {
  syllabus: SYLLABUS_VERSION,
  areas: AREAS.map((area) => ({
    id: area.id,
    order: area.order,
    title: area.title,
    titleEn: area.titleEn,
    shortTitle: area.shortTitle,
    description: area.description,
    color: AREA_META.find((meta) => meta.id === area.id)?.color ?? area.color,
    lessonIds: area.lessons.map((lesson) => lesson.id),
  })),
  topics: SYLLABUS_TOPICS,
  papers: OFFICIAL_PAPERS.map(({ questions, ...paper }) => ({
    ...paper,
    questionIds: questions.map((question) => question.id),
  })),
  historicalPapers: HISTORICAL_PAPERS,
});

for (const lesson of ALL_LESSONS) {
  write(`lessons/${lesson.id.replace(/\//g, "__")}.json`, lesson);
}
write("terms.json", ALL_TERMS);
write("questions.json", ALL_QUESTIONS);

console.log(
  `exported ${AREAS.length} areas, ${ALL_LESSONS.length} lessons, ${ALL_TERMS.length} terms, ` +
    `${ALL_QUESTIONS.length} questions, ${OFFICIAL_PAPERS.length} papers -> ${OUT}`,
);
