import type {
  Area,
  GlossaryTerm,
  Lesson,
  Question,
  SyllabusTopic,
} from "@/lib/content/types";
import { AREA_META, SYLLABUS_TOPICS, TOPIC_BY_ID, topicsForArea } from "@/content/syllabus";
import { area as security } from "@/content/areas/security";
import { area as risk } from "@/content/areas/risk";
import { area as management } from "@/content/areas/management";
import { area as tech } from "@/content/areas/tech";
import { area as ops } from "@/content/areas/ops";
import { area as law } from "@/content/areas/law";
import { area as org } from "@/content/areas/org";
import { area as it } from "@/content/areas/it";
import { OFFICIAL_QUESTIONS, OFFICIAL_PAPERS } from "@/content/official";
import { HISTORICAL_PAPERS } from "@/content/official/historical";

export { OFFICIAL_QUESTIONS, OFFICIAL_PAPERS, HISTORICAL_PAPERS, topicsForArea };

export const AREAS: Area[] = [
  security,
  risk,
  management,
  tech,
  ops,
  law,
  org,
  it,
].sort((a, b) => a.order - b.order);

export const ALL_LESSONS: Lesson[] = AREAS.flatMap((area) => area.lessons);
export const ALL_TERMS: GlossaryTerm[] = AREAS.flatMap((area) => area.terms);
export const ORIGINAL_QUESTIONS: Question[] = AREAS.flatMap(
  (area) => area.questions,
);
export const ALL_QUESTIONS: Question[] = [
  ...ORIGINAL_QUESTIONS,
  ...OFFICIAL_QUESTIONS,
];

export const LESSON_BY_ID = new Map(ALL_LESSONS.map((lesson) => [lesson.id, lesson]));
export const AREA_BY_ID = new Map(AREAS.map((area) => [area.id, area]));
export const TERM_BY_ID = new Map(ALL_TERMS.map((term) => [term.id, term]));
export const QUESTION_BY_ID = new Map(
  ALL_QUESTIONS.map((question) => [question.id, question]),
);
export const OFFICIAL_BY_ID = new Map(
  OFFICIAL_QUESTIONS.map((question) => [question.id, question]),
);
export const TOPIC_BY_SLUG = TOPIC_BY_ID;

export function getArea(id: string): Area | undefined {
  return AREA_BY_ID.get(id);
}

export function getLesson(id: string): Lesson | undefined {
  return LESSON_BY_ID.get(id);
}

export function getTerm(id: string): GlossaryTerm | undefined {
  return TERM_BY_ID.get(id);
}

export function getQuestion(id: string): Question | undefined {
  return QUESTION_BY_ID.get(id);
}

export function lessonsForTopic(topicId: string): Lesson[] {
  return ALL_LESSONS.filter((lesson) => lesson.topicIds.includes(topicId));
}

export function questionsForTopic(topicId: string): Question[] {
  return ALL_QUESTIONS.filter((question) => question.topicIds.includes(topicId));
}

export function questionsForLesson(lessonId: string): Question[] {
  return ALL_QUESTIONS.filter((question) => question.lessonIds.includes(lessonId));
}

export function termsForLesson(lessonId: string): GlossaryTerm[] {
  return ALL_TERMS.filter((term) => term.lessonIds.includes(lessonId));
}

export function relatedLessons(lesson: Lesson): Lesson[] {
  return lesson.relatedLessonIds
    .map((id) => getLesson(id))
    .filter((item): item is Lesson => Boolean(item));
}

export function areaProgress(
  area: Area,
  completedLessonIds: readonly string[],
): { total: number; completed: number; percent: number } {
  const total = area.lessons.length;
  const completed = area.lessons.filter((lesson) =>
    completedLessonIds.includes(lesson.id),
  ).length;
  return { total, completed, percent: total ? Math.round((completed / total) * 100) : 0 };
}

export interface TopicCoverage {
  topic: SyllabusTopic;
  lessons: Lesson[];
  questionCount: number;
  status: "complete" | "partial" | "missing";
}

export function topicCoverage(): TopicCoverage[] {
  return SYLLABUS_TOPICS.map((topic) => {
    const lessons = lessonsForTopic(topic.id);
    const questionCount = questionsForTopic(topic.id).length;
    const status: TopicCoverage["status"] =
      lessons.length >= 1 && questionCount >= 4
        ? "complete"
        : lessons.length >= 1 || questionCount > 0
          ? "partial"
          : "missing";
    return { topic, lessons, questionCount, status };
  });
}

export function coverageStats() {
  const rows = topicCoverage();
  return {
    total: rows.length,
    complete: rows.filter((row) => row.status === "complete").length,
    partial: rows.filter((row) => row.status === "partial").length,
    missing: rows.filter((row) => row.status === "missing").length,
    rows,
  };
}

export function areaMeta(id: string) {
  return AREA_META.find((area) => area.id === id);
}

export const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "基礎",
  medium: "標準",
  hard: "応用",
};

export const PART_LABEL: Record<string, string> = {
  A: "科目A",
  B: "科目B",
};
