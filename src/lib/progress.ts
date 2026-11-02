import {
  ALL_LESSONS,
  ALL_QUESTIONS,
  ALL_TERMS,
  AREAS,
  LESSON_BY_ID,
  QUESTION_BY_ID,
  TERM_BY_ID,
  topicCoverage,
} from "@/content";
import { SYLLABUS_TOPICS } from "@/content/syllabus";
import type { Lesson, Question, SyllabusTopic } from "@/lib/content/types";
import {
  getAllAttempts,
  getBookmarks,
  getCompletedLessonIds,
  getDueReviews,
  getLearnedTermIds,
  getLessonProgress,
  getMockHistory,
  getQuizHistory,
  getReviewCounts,
  getStudyMinutesByDay,
  type RawAttemptRow,
} from "@/lib/db/store";
import { estimatedReadiness } from "@/lib/exam";
import { percent } from "@/lib/utils";

export type MasteryLevel = "not-started" | "learning" | "developing" | "proficient" | "mastered";

export const MODE_LABEL: Record<string, string> = {
  custom: "カスタム演習",
  topic: "分野別",
  lesson: "レッスン確認",
  review: "復習",
  mock: "模擬試験",
  weak: "弱点",
  official: "公式問題",
};

export const MASTERY_LABEL: Record<MasteryLevel, string> = {
  "not-started": "未着手",
  learning: "学習中",
  developing: "要強化",
  proficient: "準習得",
  mastered: "習得",
};

export interface TopicProgress {
  topic: SyllabusTopic;
  lessonCount: number;
  questionCount: number;
  attempts: number;
  correct: number;
  accuracy: number;
  uniqueAttempted: number;
  lastAttemptedAt: string | null;
  mastery: MasteryLevel;
  completedLessons: number;
}

export interface QuestionProgress {
  question: Question;
  attempts: number;
  correct: number;
  lastSelected: string | null;
  lastCorrect: boolean | null;
  lastAttemptedAt: string | null;
  averageMs: number;
}

export interface ProgressSnapshot {
  lessonCount: number;
  completedLessonIds: string[];
  startedLessonIds: string[];
  completedLessons: number;
  lessonPercent: number;
  termCount: number;
  learnedTermIds: string[];
  termPercent: number;
  attemptCount: number;
  uniqueQuestionsAttempted: number;
  questionCount: number;
  accuracy: number;
  recentAccuracy: number;
  topics: TopicProgress[];
  weakTopics: TopicProgress[];
  strongTopics: TopicProgress[];
  recentAttempts: RawAttemptRow[];
  quizHistory: ReturnType<typeof getQuizHistory>;
  mockHistory: ReturnType<typeof getMockHistory>;
  dueReviews: ReturnType<typeof getDueReviews>;
  reviewCounts: { due: number; total: number };
  bookmarks: ReturnType<typeof getBookmarks>;
  studyDays: ReturnType<typeof getStudyMinutesByDay>;
  lastMockAccuracy: number;
  readiness: { score: number; confidence: "low" | "medium" | "high"; note: string };
  nextLessons: Lesson[];
  reviewQuestions: Question[];
  uncoveredTopics: number;
}

function aggregateAttempts(attempts: RawAttemptRow[]) {
  const byQuestion = new Map<
    string,
    {
      attempts: number;
      correct: number;
      lastSelected: string;
      lastCorrect: boolean;
      lastAttemptedAt: string;
      totalMs: number;
    }
  >();
  for (const attempt of attempts) {
    const existing = byQuestion.get(attempt.questionId);
    byQuestion.set(attempt.questionId, {
      attempts: (existing?.attempts ?? 0) + 1,
      correct: (existing?.correct ?? 0) + (attempt.correct ? 1 : 0),
      lastSelected: attempt.selected,
      lastCorrect: attempt.correct,
      lastAttemptedAt: attempt.attemptedAt,
      totalMs: (existing?.totalMs ?? 0) + attempt.elapsedMs,
    });
  }
  return byQuestion;
}

function masteryFor(topicAttempts: number, unique: number, accuracy: number): MasteryLevel {
  if (topicAttempts === 0) return "not-started";
  if (topicAttempts < 4) return "learning";
  if (accuracy >= 85 && topicAttempts >= 10 && unique >= 5) return "mastered";
  if (accuracy >= 70 && topicAttempts >= 6 && unique >= 3) return "proficient";
  return "developing";
}

export function computeTopicProgress(
  attempts: RawAttemptRow[],
  completedLessonIds: string[],
): TopicProgress[] {
  const byQuestion = aggregateAttempts(attempts);
  return SYLLABUS_TOPICS.map((topic) => {
    const lessons = ALL_LESSONS.filter((lesson) => lesson.topicIds.includes(topic.id));
    const questions = ALL_QUESTIONS.filter((question) => question.topicIds.includes(topic.id));
    let topicAttempts = 0;
    let topicCorrect = 0;
    let lastAttemptedAt: string | null = null;
    const unique = new Set<string>();
    for (const question of questions) {
      const record = byQuestion.get(question.id);
      if (!record) continue;
      topicAttempts += record.attempts;
      topicCorrect += record.correct;
      unique.add(question.id);
      if (!lastAttemptedAt || record.lastAttemptedAt > lastAttemptedAt) {
        lastAttemptedAt = record.lastAttemptedAt;
      }
    }
    const accuracy = percent(topicCorrect, topicAttempts);
    return {
      topic,
      lessonCount: lessons.length,
      questionCount: questions.length,
      attempts: topicAttempts,
      correct: topicCorrect,
      accuracy,
      uniqueAttempted: unique.size,
      lastAttemptedAt,
      mastery: masteryFor(topicAttempts, unique.size, accuracy),
      completedLessons: lessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length,
    };
  });
}

export function getQuestionProgress(attempts: RawAttemptRow[]): QuestionProgress[] {
  const byQuestion = aggregateAttempts(attempts);
  return ALL_QUESTIONS.map((question) => {
    const record = byQuestion.get(question.id);
    return {
      question,
      attempts: record?.attempts ?? 0,
      correct: record?.correct ?? 0,
      lastSelected: record?.lastSelected ?? null,
      lastCorrect: record?.lastCorrect ?? null,
      lastAttemptedAt: record?.lastAttemptedAt ?? null,
      averageMs: record ? Math.round(record.totalMs / record.attempts) : 0,
    };
  });
}

export function getProgressSnapshot(profileId: string): ProgressSnapshot {
  const attempts = getAllAttempts(profileId);
  const completedLessonIds = getCompletedLessonIds(profileId);
  const startedLessonIds = getLessonProgress(profileId).map((row) => row.lessonId);
  const learnedTermIds = getLearnedTermIds(profileId);
  const topics = computeTopicProgress(attempts, completedLessonIds);
  const byQuestion = aggregateAttempts(attempts);
  const recentAttempts = attempts.slice(-120);
  const recentAccuracy = percent(
    recentAttempts.filter((attempt) => attempt.correct).length,
    recentAttempts.length,
  );
  const accuracy = percent(
    attempts.filter((attempt) => attempt.correct).length,
    attempts.length,
  );
  const mockHistory = getMockHistory(profileId);
  const latestMock = mockHistory[0];
  const lastMockAccuracy = latestMock
    ? percent(latestMock.correct, latestMock.total)
    : 0;

  const attemptedTopics = topics.filter((topic) => topic.attempts > 0);
  const topicBreadth = attemptedTopics.length / Math.max(1, topics.length);
  const coverage = completedLessonIds.length / Math.max(1, ALL_LESSONS.length);
  const readiness = estimatedReadiness({
    lessonCoverage: coverage,
    recentAccuracy: recentAccuracy / 100,
    topicBreadth,
    mockAccuracy: lastMockAccuracy / 100,
    totalAttempts: attempts.length,
  });

  const weakTopics = [...topics]
    .filter((topic) => topic.attempts > 0)
    .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts)
    .slice(0, 6);
  const strongTopics = [...topics]
    .filter((topic) => topic.attempts >= 4)
    .sort((a, b) => b.accuracy - a.accuracy || b.attempts - a.attempts)
    .slice(0, 4);

  const nextLessons = [...ALL_LESSONS]
    .filter((lesson) => !completedLessonIds.includes(lesson.id))
    .sort((a, b) => {
      const aWeak = weakTopics.some((topic) => a.topicIds.includes(topic.topic.id)) ? 0 : 1;
      const bWeak = weakTopics.some((topic) => b.topicIds.includes(topic.topic.id)) ? 0 : 1;
      return aWeak - bWeak;
    })
    .slice(0, 4);

  const reviewQuestions = ALL_QUESTIONS.filter((question) => {
    const record = byQuestion.get(question.id);
    return record && !record.lastCorrect;
  })
    .sort((a, b) => {
      const aRecord = byQuestion.get(a.id);
      const bRecord = byQuestion.get(b.id);
      return (bRecord?.attempts ?? 0) - (aRecord?.attempts ?? 0);
    })
    .slice(0, 10);

  const studyDays = getStudyMinutesByDay(profileId, 14);

  const coverageRows = topicCoverage();
  const uncoveredTopics = coverageRows.filter((row) => row.status === "missing").length;

  return {
    lessonCount: ALL_LESSONS.length,
    completedLessonIds,
    startedLessonIds,
    completedLessons: completedLessonIds.length,
    lessonPercent: percent(completedLessonIds.length, ALL_LESSONS.length),
    termCount: ALL_TERMS.length,
    learnedTermIds,
    termPercent: percent(learnedTermIds.length, ALL_TERMS.length),
    attemptCount: attempts.length,
    uniqueQuestionsAttempted: new Set(attempts.map((attempt) => attempt.questionId)).size,
    questionCount: ALL_QUESTIONS.length,
    accuracy,
    recentAccuracy,
    topics,
    weakTopics,
    strongTopics,
    recentAttempts: [...attempts].reverse().slice(0, 12),
    quizHistory: getQuizHistory(profileId),
    mockHistory,
    dueReviews: getDueReviews(profileId, 20),
    reviewCounts: getReviewCounts(profileId),
    bookmarks: getBookmarks(profileId),
    studyDays,
    lastMockAccuracy,
    readiness,
    nextLessons,
    reviewQuestions,
    uncoveredTopics,
  };
}

export interface AreaProgress {
  areaId: string;
  title: string;
  totalLessons: number;
  completedLessons: number;
  percent: number;
  accuracy: number;
  attempts: number;
  topicCount: number;
  masteredTopics: number;
}

export function getAreaProgress(snapshot: ProgressSnapshot): AreaProgress[] {
  return AREAS.map((area) => {
    const lessons = area.lessons.length;
    const completed = area.lessons.filter((lesson) =>
      snapshot.completedLessonIds.includes(lesson.id),
    ).length;
    const topicRows = snapshot.topics.filter((topic) => topic.topic.areaId === area.id);
    const attempts = topicRows.reduce((total, topic) => total + topic.attempts, 0);
    const correct = topicRows.reduce((total, topic) => total + topic.correct, 0);
    return {
      areaId: area.id,
      title: area.title,
      totalLessons: lessons,
      completedLessons: completed,
      percent: percent(completed, lessons),
      accuracy: percent(correct, attempts),
      attempts,
      topicCount: topicRows.length,
      masteredTopics: topicRows.filter((topic) => topic.mastery === "mastered").length,
    };
  });
}

export function getLessonStatus(
  lesson: Lesson,
  snapshot: ProgressSnapshot,
): "completed" | "started" | "new" {
  if (snapshot.completedLessonIds.includes(lesson.id)) return "completed";
  if (snapshot.startedLessonIds.includes(lesson.id)) return "started";
  return "new";
}

export function questionWeakness(questionId: string, attempts: RawAttemptRow[]): number {
  const rows = attempts.filter((attempt) => attempt.questionId === questionId);
  if (rows.length === 0) return 0.5;
  return 1 - rows.filter((row) => row.correct).length / rows.length;
}

export function topicName(topicId: string): string {
  return SYLLABUS_TOPICS.find((topic) => topic.id === topicId)?.title ?? topicId;
}

export function lessonName(lessonId: string): string {
  return LESSON_BY_ID.get(lessonId)?.title ?? lessonId;
}

export function questionById(id: string) {
  return QUESTION_BY_ID.get(id);
}

export function termById(id: string) {
  return TERM_BY_ID.get(id);
}

export function isReviewedRecently(
  question: Question,
  attempts: RawAttemptRow[],
  days = 3,
): boolean {
  const cutoff = Date.now() - days * 86_400_000;
  return attempts.some(
    (attempt) =>
      attempt.questionId === question.id &&
      attempt.correct &&
      new Date(attempt.attemptedAt).getTime() >= cutoff,
  );
}
