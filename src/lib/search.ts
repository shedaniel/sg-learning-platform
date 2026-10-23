import {
  ALL_LESSONS,
  ALL_QUESTIONS,
  ALL_TERMS,
  AREAS,
  TERM_BY_ID,
} from "@/content";
import { SYLLABUS_TOPICS } from "@/content/syllabus";
import type { Block, Lesson } from "@/lib/content/types";
import { normalizeJapanese } from "@/lib/utils";

export type SearchKind = "lesson" | "term" | "question" | "topic";

export interface SearchResult {
  kind: SearchKind;
  id: string;
  title: string;
  subtitle: string;
  snippet: string;
  href: string;
  meta: string;
  score: number;
}

function blocksText(blocks: readonly Block[]): string {
  const parts: string[] = [];
  for (const block of blocks) {
    switch (block.type) {
      case "lead":
      case "p":
        parts.push(block.text);
        break;
      case "callout":
        parts.push(block.title, block.text);
        break;
      case "list":
        parts.push(...block.items);
        break;
      case "table":
        parts.push(...block.headers, ...block.rows.flat());
        break;
      case "comparison":
        parts.push(...block.left.items, ...block.right.items);
        break;
      case "steps":
        parts.push(...block.items.flatMap((item) => [item.title, item.text]));
        break;
      default:
        break;
    }
  }
  return parts.join(" ");
}

function lessonText(lesson: Lesson): string {
  return [
    lesson.title,
    lesson.titleEn,
    lesson.summary,
    ...lesson.sections.flatMap((section) => [
      section.title,
      blocksText(section.blocks),
    ]),
    ...lesson.keyPoints,
    ...lesson.examTraps,
  ].join(" ");
}

function snippet(text: string, query: string, length = 96): string {
  const normalized = normalizeJapanese(text);
  const index = normalized.indexOf(query);
  if (index === -1) return text.slice(0, length) + (text.length > length ? "…" : "");
  const start = Math.max(0, index - 28);
  return `${start > 0 ? "…" : ""}${text.slice(start, start + length)}${
    text.length > start + length ? "…" : ""
  }`;
}

function scoreField(field: string | undefined, query: string, weight: number): number {
  if (!field) return 0;
  const normalized = normalizeJapanese(field);
  if (normalized === query) return 100 * weight;
  if (normalized.startsWith(query)) return 70 * weight;
  if (normalized.includes(query)) return 45 * weight;
  return 0;
}

const TERM_SEARCH_FIELDS = (term: (typeof ALL_TERMS)[number]) => [
  term.ja,
  term.reading ?? "",
  term.en,
  term.abbr ?? "",
  term.shortJa,
  term.explanationJa,
  ...term.tags,
];

export function searchContent(rawQuery: string, limit = 40): SearchResult[] {
  const query = normalizeJapanese(rawQuery);
  if (query.length === 0) return [];
  const tokens = query.split(" ").filter((token) => token.length > 0);
  const results: SearchResult[] = [];

  for (const term of ALL_TERMS) {
    const fields = TERM_SEARCH_FIELDS(term);
    let score = 0;
    for (const token of tokens) {
      score += scoreField(term.ja, token, 4);
      score += scoreField(term.reading, token, 2.4);
      score += scoreField(term.en, token, 3.2);
      score += scoreField(term.abbr, token, 3.4);
      score += scoreField(term.shortJa, token, 1.2);
      score += scoreField(term.explanationJa, token, 0.4);
    }
    if (score === 0) continue;
    results.push({
      kind: "term",
      id: term.id,
      title: `${term.ja}${term.reading ? `（${term.reading}）` : ""}`,
      subtitle: `${term.abbr ? `${term.abbr} · ` : ""}${term.en}`,
      snippet: snippet(term.shortJa || term.explanationJa, tokens[0] ?? query),
      href: `/glossary/${term.id}`,
      meta: term.tags.slice(0, 2).join(" · "),
      score: score + (term.en.toLowerCase() === query ? 20 : 0),
    });
  }

  for (const lesson of ALL_LESSONS) {
    const area = AREAS.find((item) => item.id === lesson.areaId);
    let score = 0;
    for (const token of tokens) {
      score += scoreField(lesson.title, token, 4);
      score += scoreField(lesson.titleEn, token, 3);
      score += scoreField(lesson.summary, token, 1.2);
      score += scoreField(lessonText(lesson), token, 0.35);
    }
    if (score === 0) continue;
    results.push({
      kind: "lesson",
      id: lesson.id,
      title: lesson.title,
      subtitle: `${area?.title ?? lesson.areaId} · ${lesson.titleEn}`,
      snippet: snippet(lesson.summary, tokens[0] ?? query),
      href: `/learn/${lesson.id}`,
      meta: `${lesson.readingMinutes}分 · 基礎〜応用`,
      score,
    });
  }

  for (const question of ALL_QUESTIONS) {
    let score = 0;
    for (const token of tokens) {
      score += scoreField(question.stem, token, 1.6);
      score += scoreField(question.options.map((option) => option.text).join(" "), token, 0.5);
      score += scoreField(question.tags.join(" "), token, 1.4);
      score += scoreField(question.explanation.correct, token, 0.3);
    }
    if (score === 0) continue;
    results.push({
      kind: "question",
      id: question.id,
      title: question.stem.slice(0, 54) + (question.stem.length > 54 ? "…" : ""),
      subtitle:
        question.source.kind === "official"
          ? `IPA 公開問題 ${question.source.year ?? ""} 問${question.source.questionNo ?? ""}`
          : `独自問題 · ${question.part === "B" ? "科目B" : "科目A"}`,
      snippet: snippet(question.stem, tokens[0] ?? query),
      href: `/practice/question/${question.id}`,
      meta: `${question.part === "B" ? "科目B" : "科目A"} · ${question.difficulty}`,
      score,
    });
  }

  for (const topic of SYLLABUS_TOPICS) {
    let score = 0;
    for (const token of tokens) {
      score += scoreField(topic.title, token, 3.4);
      score += scoreField(topic.titleEn, token, 2.5);
      score += scoreField(topic.summary, token, 0.9);
    }
    if (score === 0) continue;
    results.push({
      kind: "topic",
      id: topic.id,
      title: topic.title,
      subtitle: topic.titleEn,
      snippet: snippet(topic.summary, tokens[0] ?? query),
      href: `/coverage#${topic.id}`,
      meta: topic.reference,
      score,
    });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function suggestionsForTerm(termId: string, limit = 6) {
  const term = TERM_BY_ID.get(termId);
  if (!term) return [];
  return term.relatedTermIds
    .map((id) => TERM_BY_ID.get(id))
    .filter(Boolean)
    .slice(0, limit);
}
