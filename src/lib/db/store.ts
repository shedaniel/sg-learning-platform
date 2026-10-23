import { randomUUID } from "node:crypto";
import { getDb, inTransaction } from "./index";

export type ItemType = "question" | "term" | "lesson";
export type AttemptMode = "quiz" | "mock" | "review" | "past-paper";

export interface AnswerRecord {
  selected: string;
  elapsedMs: number;
}

export interface ReviewRow {
  profileId: string;
  itemType: ItemType;
  itemId: string;
  dueAt: string;
  intervalDays: number;
  ease: number;
  reps: number;
  lapses: number;
  lastReviewedAt: string | null;
}

export interface MockRow {
  id: string;
  profileId: string;
  startedAt: string;
  expiresAt: string;
  submittedAt: string | null;
  questionIds: string[];
  answers: Record<string, AnswerRecord>;
  flags: string[];
  currentIndex: number;
  durationSec: number;
  total: number;
  correct: number | null;
  result: unknown | null;
}

function nowIso(): string {
  return new Date().toISOString();
}

export function ensureProfile(profileId: string, name = "Learner"): void {
  getDb()
    .prepare(
      "INSERT INTO profiles (id, name, created_at) VALUES (?, ?, ?) ON CONFLICT(id) DO NOTHING",
    )
    .run(profileId, name, nowIso());
}

export function getProfile(profileId: string): { id: string; name: string; createdAt: string } | null {
  const row = getDb()
    .prepare("SELECT id, name, created_at FROM profiles WHERE id = ?")
    .get(profileId) as { id: string; name: string; created_at: string } | undefined;
  return row ? { id: row.id, name: row.name, createdAt: row.created_at } : null;
}

export function touchLesson(profileId: string, lessonId: string): void {
  ensureProfile(profileId);
  const now = nowIso();
  getDb()
    .prepare(
      `INSERT INTO lesson_progress (profile_id, lesson_id, started_at, last_viewed_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(profile_id, lesson_id) DO UPDATE SET last_viewed_at = excluded.last_viewed_at`,
    )
    .run(profileId, lessonId, now, now);
}

export function completeLesson(profileId: string, lessonId: string): void {
  ensureProfile(profileId);
  const now = nowIso();
  getDb()
    .prepare(
      `INSERT INTO lesson_progress (profile_id, lesson_id, started_at, completed_at, last_viewed_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(profile_id, lesson_id) DO UPDATE SET
         completed_at = COALESCE(lesson_progress.completed_at, excluded.completed_at),
         last_viewed_at = excluded.last_viewed_at`,
    )
    .run(profileId, lessonId, now, now, now);
}

export function setLessonCompleted(profileId: string, lessonId: string, completed: boolean): void {
  ensureProfile(profileId);
  const now = nowIso();
  if (completed) {
    completeLesson(profileId, lessonId);
  } else {
    getDb()
      .prepare(
        `INSERT INTO lesson_progress (profile_id, lesson_id, started_at, last_viewed_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(profile_id, lesson_id) DO UPDATE SET
           completed_at = NULL, last_viewed_at = excluded.last_viewed_at`,
      )
      .run(profileId, lessonId, now, now);
  }
}

export function getLessonProgress(profileId: string) {
  return getDb()
    .prepare(
      `SELECT lesson_id, started_at, completed_at, last_viewed_at
       FROM lesson_progress WHERE profile_id = ? ORDER BY last_viewed_at DESC`,
    )
    .all(profileId)
    .map((row) => {
      const item = row as Record<string, unknown>;
      return {
        lessonId: String(item.lesson_id),
        startedAt: String(item.started_at),
        completedAt: item.completed_at ? String(item.completed_at) : null,
        lastViewedAt: String(item.last_viewed_at),
      };
    });
}

export function getCompletedLessonIds(profileId: string): string[] {
  return getDb()
    .prepare(
      "SELECT lesson_id FROM lesson_progress WHERE profile_id = ? AND completed_at IS NOT NULL",
    )
    .all(profileId)
    .map((row) => String((row as { lesson_id: string }).lesson_id));
}

export function getStartedLessonIds(profileId: string): string[] {
  return getDb()
    .prepare("SELECT lesson_id FROM lesson_progress WHERE profile_id = ?")
    .all(profileId)
    .map((row) => String((row as { lesson_id: string }).lesson_id));
}

export function markTermLearned(profileId: string, termId: string, learned = true): void {
  ensureProfile(profileId);
  if (learned) {
    getDb()
      .prepare(
        "INSERT INTO term_progress (profile_id, term_id, learned_at) VALUES (?, ?, ?) ON CONFLICT DO NOTHING",
      )
      .run(profileId, termId, nowIso());
  } else {
    getDb()
      .prepare("DELETE FROM term_progress WHERE profile_id = ? AND term_id = ?")
      .run(profileId, termId);
  }
}

export function getLearnedTermIds(profileId: string): string[] {
  return getDb()
    .prepare("SELECT term_id FROM term_progress WHERE profile_id = ?")
    .all(profileId)
    .map((row) => String((row as { term_id: string }).term_id));
}

export function recordQuestionAttempt(input: {
  profileId: string;
  questionId: string;
  selected: string;
  correct: boolean;
  mode: AttemptMode | string;
  elapsedMs?: number;
  quizAttemptId?: string;
  mockAttemptId?: string;
}): string {
  ensureProfile(input.profileId);
  const id = randomUUID();
  getDb()
    .prepare(
      `INSERT INTO question_attempts
       (id, profile_id, question_id, mode, selected, correct, elapsed_ms, attempted_at, quiz_attempt_id, mock_attempt_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      input.profileId,
      input.questionId,
      input.mode,
      input.selected,
      input.correct ? 1 : 0,
      Math.max(0, Math.round(input.elapsedMs ?? 0)),
      nowIso(),
      input.quizAttemptId ?? null,
      input.mockAttemptId ?? null,
    );
  return id;
}

export function createQuizAttempt(input: {
  profileId: string;
  mode: string;
  topicId?: string;
  total: number;
  config?: unknown;
}): string {
  ensureProfile(input.profileId);
  const id = randomUUID();
  getDb()
    .prepare(
      `INSERT INTO quiz_attempts
       (id, profile_id, mode, topic_id, config_json, total, answered, correct, started_at)
       VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?)`,
    )
    .run(
      id,
      input.profileId,
      input.mode,
      input.topicId ?? null,
      JSON.stringify(input.config ?? {}),
      input.total,
      nowIso(),
    );
  return id;
}

export function updateQuizAttempt(
  id: string,
  answered: number,
  correct: number,
): void {
  getDb()
    .prepare(
      "UPDATE quiz_attempts SET answered = ?, correct = ?, completed_at = ? WHERE id = ?",
    )
    .run(answered, correct, nowIso(), id);
}

export interface RawAttemptRow {
  questionId: string;
  selected: string;
  correct: boolean;
  elapsedMs: number;
  attemptedAt: string;
  mode: string;
}

export function getRecentAttempts(profileId: string, limit = 200): RawAttemptRow[] {
  return getDb()
    .prepare(
      `SELECT question_id, selected, correct, elapsed_ms, attempted_at, mode
       FROM question_attempts WHERE profile_id = ? ORDER BY attempted_at DESC LIMIT ?`,
    )
    .all(profileId, limit)
    .map((row) => {
      const item = row as Record<string, unknown>;
      return {
        questionId: String(item.question_id),
        selected: String(item.selected),
        correct: Boolean(item.correct),
        elapsedMs: Number(item.elapsed_ms),
        attemptedAt: String(item.attempted_at),
        mode: String(item.mode),
      };
    });
}

export function getAllAttempts(profileId: string): RawAttemptRow[] {
  return getDb()
    .prepare(
      `SELECT question_id, selected, correct, elapsed_ms, attempted_at, mode
       FROM question_attempts WHERE profile_id = ? ORDER BY attempted_at ASC`,
    )
    .all(profileId)
    .map((row) => {
      const item = row as Record<string, unknown>;
      return {
        questionId: String(item.question_id),
        selected: String(item.selected),
        correct: Boolean(item.correct),
        elapsedMs: Number(item.elapsed_ms),
        attemptedAt: String(item.attempted_at),
        mode: String(item.mode),
      };
    });
}

export function getQuizHistory(profileId: string, limit = 20) {
  return getDb()
    .prepare(
      `SELECT id, mode, topic_id, total, answered, correct, started_at, completed_at
       FROM quiz_attempts WHERE profile_id = ? ORDER BY started_at DESC LIMIT ?`,
    )
    .all(profileId, limit)
    .map((row) => {
      const item = row as Record<string, unknown>;
      return {
        id: String(item.id),
        mode: String(item.mode),
        topicId: item.topic_id ? String(item.topic_id) : null,
        total: Number(item.total),
        answered: Number(item.answered),
        correct: Number(item.correct),
        startedAt: String(item.started_at),
        completedAt: item.completed_at ? String(item.completed_at) : null,
      };
    });
}

export function toggleBookmark(
  profileId: string,
  itemType: ItemType,
  itemId: string,
): boolean {
  ensureProfile(profileId);
  const db = getDb();
  const existing = db
    .prepare(
      "SELECT 1 FROM bookmarks WHERE profile_id = ? AND item_type = ? AND item_id = ?",
    )
    .get(profileId, itemType, itemId);
  if (existing) {
    db.prepare(
      "DELETE FROM bookmarks WHERE profile_id = ? AND item_type = ? AND item_id = ?",
    ).run(profileId, itemType, itemId);
    return false;
  }
  db.prepare(
    "INSERT INTO bookmarks (profile_id, item_type, item_id, created_at) VALUES (?, ?, ?, ?)",
  ).run(profileId, itemType, itemId, nowIso());
  return true;
}

export function getBookmarks(profileId: string, itemType?: ItemType) {
  const rows = itemType
    ? getDb()
        .prepare(
          "SELECT item_type, item_id, created_at FROM bookmarks WHERE profile_id = ? AND item_type = ? ORDER BY created_at DESC",
        )
        .all(profileId, itemType)
    : getDb()
        .prepare(
          "SELECT item_type, item_id, created_at FROM bookmarks WHERE profile_id = ? ORDER BY created_at DESC",
        )
        .all(profileId);
  return rows.map((row) => {
    const item = row as Record<string, unknown>;
    return {
      itemType: String(item.item_type) as ItemType,
      itemId: String(item.item_id),
      createdAt: String(item.created_at),
    };
  });
}

export function isBookmarked(profileId: string, itemType: ItemType, itemId: string): boolean {
  return Boolean(
    getDb()
      .prepare(
        "SELECT 1 FROM bookmarks WHERE profile_id = ? AND item_type = ? AND item_id = ?",
      )
      .get(profileId, itemType, itemId),
  );
}

export function getReviewRow(
  profileId: string,
  itemType: ItemType,
  itemId: string,
): ReviewRow | null {
  const row = getDb()
    .prepare(
      `SELECT profile_id, item_type, item_id, due_at, interval_days, ease, reps, lapses, last_reviewed_at
       FROM review_items WHERE profile_id = ? AND item_type = ? AND item_id = ?`,
    )
    .get(profileId, itemType, itemId) as Record<string, unknown> | undefined;
  return row ? mapReviewRow(row) : null;
}

function mapReviewRow(row: Record<string, unknown>): ReviewRow {
  return {
    profileId: String(row.profile_id),
    itemType: String(row.item_type) as ItemType,
    itemId: String(row.item_id),
    dueAt: String(row.due_at),
    intervalDays: Number(row.interval_days),
    ease: Number(row.ease),
    reps: Number(row.reps),
    lapses: Number(row.lapses),
    lastReviewedAt: row.last_reviewed_at ? String(row.last_reviewed_at) : null,
  };
}

export function scheduleReview(
  profileId: string,
  itemType: ItemType,
  itemId: string,
  grade: 0 | 1 | 2 | 3,
): ReviewRow {
  ensureProfile(profileId);
  const existing = getReviewRow(profileId, itemType, itemId);
  const result = nextSchedule(existing, grade);
  const now = new Date();
  const due = new Date(now.getTime() + result.intervalDays * 86_400_000);
  getDb()
    .prepare(
      `INSERT INTO review_items
       (profile_id, item_type, item_id, due_at, interval_days, ease, reps, lapses, last_reviewed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(profile_id, item_type, item_id) DO UPDATE SET
         due_at = excluded.due_at,
         interval_days = excluded.interval_days,
         ease = excluded.ease,
         reps = excluded.reps,
         lapses = excluded.lapses,
         last_reviewed_at = excluded.last_reviewed_at`,
    )
    .run(
      profileId,
      itemType,
      itemId,
      due.toISOString(),
      result.intervalDays,
      result.ease,
      result.reps,
      result.lapses,
      now.toISOString(),
    );
  return {
    profileId,
    itemType,
    itemId,
    dueAt: due.toISOString(),
    intervalDays: result.intervalDays,
    ease: result.ease,
    reps: result.reps,
    lapses: result.lapses,
    lastReviewedAt: now.toISOString(),
  };
}

export function nextSchedule(
  existing: Pick<ReviewRow, "intervalDays" | "ease" | "reps" | "lapses"> | null,
  grade: 0 | 1 | 2 | 3,
): { intervalDays: number; ease: number; reps: number; lapses: number } {
  const prev = existing ?? { intervalDays: 0, ease: 2.5, reps: 0, lapses: 0 };
  let ease = prev.ease;
  let interval = prev.intervalDays;
  let reps = prev.reps;
  let lapses = prev.lapses;

  if (grade === 0) {
    lapses += 1;
    reps = 0;
    ease = Math.max(1.3, ease - 0.2);
    interval = 0;
  } else if (grade === 1) {
    ease = Math.max(1.3, ease - 0.15);
    interval = interval <= 0 ? 1 : Math.max(1, interval * 1.2);
    reps = Math.min(reps + 1, 3);
  } else if (grade === 2) {
    interval = interval <= 0 ? 1 : interval * ease;
    reps = Math.min(reps + 1, 3);
  } else {
    ease = Math.min(3.0, ease + 0.15);
    interval = interval <= 0 ? 2 : interval * ease * 1.3;
    reps = Math.min(reps + 1, 3);
  }
  return {
    intervalDays: Math.min(180, Math.round(interval * 10) / 10),
    ease: Math.round(ease * 100) / 100,
    reps,
    lapses,
  };
}

export interface DueReview {
  itemType: ItemType;
  itemId: string;
  dueAt: string;
  intervalDays: number;
  reps: number;
  lapses: number;
}

export function getDueReviews(profileId: string, limit = 50): DueReview[] {
  const now = nowIso();
  return getDb()
    .prepare(
      `SELECT item_type, item_id, due_at, interval_days, reps, lapses
       FROM review_items WHERE profile_id = ? AND due_at <= ?
       ORDER BY due_at ASC LIMIT ?`,
    )
    .all(profileId, now, limit)
    .map((row) => {
      const item = row as Record<string, unknown>;
      return {
        itemType: String(item.item_type) as ItemType,
        itemId: String(item.item_id),
        dueAt: String(item.due_at),
        intervalDays: Number(item.interval_days),
        reps: Number(item.reps),
        lapses: Number(item.lapses),
      };
    });
}

export function getReviewCounts(profileId: string) {
  const now = nowIso();
  const due = getDb()
    .prepare("SELECT COUNT(*) AS n FROM review_items WHERE profile_id = ? AND due_at <= ?")
    .get(profileId, now) as { n: number };
  const total = getDb()
    .prepare("SELECT COUNT(*) AS n FROM review_items WHERE profile_id = ?")
    .get(profileId) as { n: number };
  return { due: Number(due.n), total: Number(total.n) };
}

export function createMockAttempt(input: {
  profileId: string;
  questionIds: string[];
  durationSec: number;
}): string {
  ensureProfile(input.profileId);
  const id = randomUUID();
  const now = new Date();
  const expires = new Date(now.getTime() + input.durationSec * 1000);
  getDb()
    .prepare(
      `INSERT INTO mock_attempts
       (id, profile_id, started_at, expires_at, questions_json, answers_json, flags_json, current_index, duration_sec, total)
       VALUES (?, ?, ?, ?, ?, '{}', '[]', 0, ?, ?)`,
    )
    .run(
      id,
      input.profileId,
      now.toISOString(),
      expires.toISOString(),
      JSON.stringify(input.questionIds),
      input.durationSec,
      input.questionIds.length,
    );
  return id;
}

export function getMockAttempt(id: string, profileId?: string): MockRow | null {
  const row = getDb()
    .prepare("SELECT * FROM mock_attempts WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;
  if (!row) return null;
  if (profileId && String(row.profile_id) !== profileId) return null;
  return mapMockRow(row);
}

function mapMockRow(row: Record<string, unknown>): MockRow {
  return {
    id: String(row.id),
    profileId: String(row.profile_id),
    startedAt: String(row.started_at),
    expiresAt: String(row.expires_at),
    submittedAt: row.submitted_at ? String(row.submitted_at) : null,
    questionIds: JSON.parse(String(row.questions_json)) as string[],
    answers: JSON.parse(String(row.answers_json)) as Record<string, AnswerRecord>,
    flags: JSON.parse(String(row.flags_json)) as string[],
    currentIndex: Number(row.current_index),
    durationSec: Number(row.duration_sec),
    total: Number(row.total),
    correct: row.correct === null || row.correct === undefined ? null : Number(row.correct),
    result: row.result_json ? (JSON.parse(String(row.result_json)) as unknown) : null,
  };
}

export function saveMockState(
  id: string,
  profileId: string,
  input: {
    answers: Record<string, AnswerRecord>;
    flags: string[];
    currentIndex: number;
  },
): void {
  getDb()
    .prepare(
      `UPDATE mock_attempts SET answers_json = ?, flags_json = ?, current_index = ?
       WHERE id = ? AND profile_id = ? AND submitted_at IS NULL`,
    )
    .run(
      JSON.stringify(input.answers),
      JSON.stringify(input.flags),
      input.currentIndex,
      id,
      profileId,
    );
}

export function submitMockAttempt(
  id: string,
  profileId: string,
  input: {
    answers: Record<string, AnswerRecord>;
    flags: string[];
    currentIndex: number;
    correct: number;
    result: unknown;
    attemptRecords: Array<{
      questionId: string;
      selected: string;
      correct: boolean;
      elapsedMs: number;
    }>;
  },
): void {
  const db = getDb();
  inTransaction(db, () => {
    db.prepare(
      `UPDATE mock_attempts SET answers_json = ?, flags_json = ?, current_index = ?,
         submitted_at = ?, correct = ?, result_json = ?
       WHERE id = ? AND profile_id = ? AND submitted_at IS NULL`,
    ).run(
      JSON.stringify(input.answers),
      JSON.stringify(input.flags),
      input.currentIndex,
      nowIso(),
      input.correct,
      JSON.stringify(input.result),
      id,
      profileId,
    );
    const insert = db.prepare(
      `INSERT INTO question_attempts
       (id, profile_id, question_id, mode, selected, correct, elapsed_ms, attempted_at, mock_attempt_id)
       VALUES (?, ?, ?, 'mock', ?, ?, ?, ?, ?)`,
    );
    for (const record of input.attemptRecords) {
      insert.run(
        randomUUID(),
        profileId,
        record.questionId,
        record.selected,
        record.correct ? 1 : 0,
        Math.round(record.elapsedMs),
        nowIso(),
        id,
      );
    }
  });
}

export function getMockHistory(profileId: string, limit = 20) {
  return getDb()
    .prepare(
      `SELECT id, started_at, submitted_at, total, correct, duration_sec
       FROM mock_attempts WHERE profile_id = ? AND submitted_at IS NOT NULL
       ORDER BY started_at DESC LIMIT ?`,
    )
    .all(profileId, limit)
    .map((row) => {
      const item = row as Record<string, unknown>;
      return {
        id: String(item.id),
        startedAt: String(item.started_at),
        submittedAt: String(item.submitted_at),
        total: Number(item.total),
        correct: Number(item.correct),
        durationSec: Number(item.duration_sec),
      };
    });
}

export function recordStudySession(input: {
  profileId: string;
  minutes: number;
  source: string;
  startedAt?: string;
}): void {
  ensureProfile(input.profileId);
  const started = input.startedAt ?? nowIso();
  getDb()
    .prepare(
      "INSERT INTO study_sessions (id, profile_id, started_at, ended_at, minutes, source) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .run(
      randomUUID(),
      input.profileId,
      started,
      nowIso(),
      Math.max(0, Math.round(input.minutes)),
      input.source,
    );
}

export function getStudySessions(profileId: string, limit = 200) {
  return getDb()
    .prepare(
      "SELECT started_at, minutes, source FROM study_sessions WHERE profile_id = ? ORDER BY started_at DESC LIMIT ?",
    )
    .all(profileId, limit)
    .map((row) => {
      const item = row as Record<string, unknown>;
      return {
        startedAt: String(item.started_at),
        minutes: Number(item.minutes),
        source: String(item.source),
      };
    });
}

export function getStudyMinutesByDay(profileId: string, days = 14) {
  const start = new Date(Date.now() - days * 86_400_000).toISOString();
  return getDb()
    .prepare(
      `SELECT substr(started_at, 1, 10) AS day, SUM(minutes) AS minutes
       FROM study_sessions WHERE profile_id = ? AND started_at >= ?
       GROUP BY day ORDER BY day ASC`,
    )
    .all(profileId, start)
    .map((row) => {
      const item = row as Record<string, unknown>;
      return { day: String(item.day), minutes: Number(item.minutes) };
    });
}

export function saveStudyPlan(profileId: string, input: unknown, plan: unknown): void {
  ensureProfile(profileId);
  const now = nowIso();
  getDb()
    .prepare(
      `INSERT INTO study_plans (profile_id, input_json, plan_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(profile_id) DO UPDATE SET
         input_json = excluded.input_json,
         plan_json = excluded.plan_json,
         updated_at = excluded.updated_at`,
    )
    .run(profileId, JSON.stringify(input), JSON.stringify(plan), now, now);
}

export function getStudyPlan(profileId: string): { input: unknown; plan: unknown } | null {
  const row = getDb()
    .prepare("SELECT input_json, plan_json FROM study_plans WHERE profile_id = ?")
    .get(profileId) as { input_json: string; plan_json: string } | undefined;
  if (!row) return null;
  return { input: JSON.parse(row.input_json), plan: JSON.parse(row.plan_json) };
}

export function resetProgress(profileId: string): void {
  inTransaction(getDb(), () => {
    for (const table of [
      "lesson_progress",
      "term_progress",
      "quiz_attempts",
      "question_attempts",
      "mock_attempts",
      "bookmarks",
      "review_items",
      "study_sessions",
      "study_plans",
    ]) {
      getDb().prepare(`DELETE FROM ${table} WHERE profile_id = ?`).run(profileId);
    }
  });
}

export function setMeta(key: string, value: string): void {
  getDb()
    .prepare(
      "INSERT INTO content_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    )
    .run(key, value);
}

export function getMeta(key: string): string | null {
  const row = getDb()
    .prepare("SELECT value FROM content_meta WHERE key = ?")
    .get(key) as { value: string } | undefined;
  return row ? row.value : null;
}
