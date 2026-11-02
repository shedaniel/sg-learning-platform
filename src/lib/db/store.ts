import { randomUUID } from "node:crypto";
import { getDb, type SqlStatement } from "./index";

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

const globalForProfiles = globalThis as unknown as { __sgKnownProfiles?: Set<string> };
function knownProfiles(): Set<string> {
  if (!globalForProfiles.__sgKnownProfiles) globalForProfiles.__sgKnownProfiles = new Set();
  return globalForProfiles.__sgKnownProfiles;
}

export async function ensureProfile(profileId: string, name = "Learner"): Promise<void> {
  // One write per profile per server process; the insert itself is idempotent.
  const known = knownProfiles();
  if (known.has(profileId)) return;
  await getDb().run(
    "INSERT INTO profiles (id, name, created_at) VALUES (?, ?, ?) ON CONFLICT(id) DO NOTHING",
    [profileId, name, nowIso()],
  );
  known.add(profileId);
}

export async function getProfile(
  profileId: string,
): Promise<{ id: string; name: string; createdAt: string } | null> {
  const row = await getDb().get<{ id: string; name: string; created_at: string }>(
    "SELECT id, name, created_at FROM profiles WHERE id = ?",
    [profileId],
  );
  return row ? { id: row.id, name: row.name, createdAt: row.created_at } : null;
}

export async function touchLesson(profileId: string, lessonId: string): Promise<void> {
  await ensureProfile(profileId);
  const now = nowIso();
  await getDb().run(
    `INSERT INTO lesson_progress (profile_id, lesson_id, started_at, last_viewed_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(profile_id, lesson_id) DO UPDATE SET last_viewed_at = excluded.last_viewed_at`,
    [profileId, lessonId, now, now],
  );
}

export async function completeLesson(profileId: string, lessonId: string): Promise<void> {
  await ensureProfile(profileId);
  const now = nowIso();
  await getDb().run(
    `INSERT INTO lesson_progress (profile_id, lesson_id, started_at, completed_at, last_viewed_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(profile_id, lesson_id) DO UPDATE SET
         completed_at = COALESCE(lesson_progress.completed_at, excluded.completed_at),
         last_viewed_at = excluded.last_viewed_at`,
    [profileId, lessonId, now, now, now],
  );
}

export async function setLessonCompleted(
  profileId: string,
  lessonId: string,
  completed: boolean,
): Promise<void> {
  await ensureProfile(profileId);
  const now = nowIso();
  if (completed) {
    await completeLesson(profileId, lessonId);
  } else {
    await getDb().run(
      `INSERT INTO lesson_progress (profile_id, lesson_id, started_at, last_viewed_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(profile_id, lesson_id) DO UPDATE SET
           completed_at = NULL, last_viewed_at = excluded.last_viewed_at`,
      [profileId, lessonId, now, now],
    );
  }
}

export async function getLessonProgress(profileId: string) {
  const rows = await getDb().all(
    `SELECT lesson_id, started_at, completed_at, last_viewed_at
       FROM lesson_progress WHERE profile_id = ? ORDER BY last_viewed_at DESC`,
    [profileId],
  );
  return rows.map((item) => ({
    lessonId: String(item.lesson_id),
    startedAt: String(item.started_at),
    completedAt: item.completed_at ? String(item.completed_at) : null,
    lastViewedAt: String(item.last_viewed_at),
  }));
}

export async function getCompletedLessonIds(profileId: string): Promise<string[]> {
  const rows = await getDb().all<{ lesson_id: string }>(
    "SELECT lesson_id FROM lesson_progress WHERE profile_id = ? AND completed_at IS NOT NULL",
    [profileId],
  );
  return rows.map((row) => String(row.lesson_id));
}

export async function getStartedLessonIds(profileId: string): Promise<string[]> {
  const rows = await getDb().all<{ lesson_id: string }>(
    "SELECT lesson_id FROM lesson_progress WHERE profile_id = ?",
    [profileId],
  );
  return rows.map((row) => String(row.lesson_id));
}

export async function markTermLearned(profileId: string, termId: string, learned = true): Promise<void> {
  await ensureProfile(profileId);
  if (learned) {
    await getDb().run(
      "INSERT INTO term_progress (profile_id, term_id, learned_at) VALUES (?, ?, ?) ON CONFLICT DO NOTHING",
      [profileId, termId, nowIso()],
    );
  } else {
    await getDb().run("DELETE FROM term_progress WHERE profile_id = ? AND term_id = ?", [profileId, termId]);
  }
}

export async function getLearnedTermIds(profileId: string): Promise<string[]> {
  const rows = await getDb().all<{ term_id: string }>(
    "SELECT term_id FROM term_progress WHERE profile_id = ?",
    [profileId],
  );
  return rows.map((row) => String(row.term_id));
}

export async function recordQuestionAttempt(input: {
  profileId: string;
  questionId: string;
  selected: string;
  correct: boolean;
  mode: AttemptMode | string;
  elapsedMs?: number;
  quizAttemptId?: string;
  mockAttemptId?: string;
}): Promise<string> {
  await ensureProfile(input.profileId);
  const id = randomUUID();
  await getDb().run(
    `INSERT INTO question_attempts
       (id, profile_id, question_id, mode, selected, correct, elapsed_ms, attempted_at, quiz_attempt_id, mock_attempt_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
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
    ],
  );
  return id;
}

export async function createQuizAttempt(input: {
  profileId: string;
  mode: string;
  topicId?: string;
  total: number;
  config?: unknown;
}): Promise<string> {
  await ensureProfile(input.profileId);
  const id = randomUUID();
  await getDb().run(
    `INSERT INTO quiz_attempts
       (id, profile_id, mode, topic_id, config_json, total, answered, correct, started_at)
       VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?)`,
    [
      id,
      input.profileId,
      input.mode,
      input.topicId ?? null,
      JSON.stringify(input.config ?? {}),
      input.total,
      nowIso(),
    ],
  );
  return id;
}

export async function updateQuizAttempt(
  id: string,
  answered: number,
  correct: number,
): Promise<void> {
  await getDb().run(
    "UPDATE quiz_attempts SET answered = ?, correct = ?, completed_at = ? WHERE id = ?",
    [answered, correct, nowIso(), id],
  );
}

export interface RawAttemptRow {
  questionId: string;
  selected: string;
  correct: boolean;
  elapsedMs: number;
  attemptedAt: string;
  mode: string;
}

function mapAttemptRow(item: Record<string, unknown>): RawAttemptRow {
  return {
    questionId: String(item.question_id),
    selected: String(item.selected),
    correct: Boolean(item.correct),
    elapsedMs: Number(item.elapsed_ms),
    attemptedAt: String(item.attempted_at),
    mode: String(item.mode),
  };
}

export async function getRecentAttempts(profileId: string, limit = 200): Promise<RawAttemptRow[]> {
  const rows = await getDb().all(
    `SELECT question_id, selected, correct, elapsed_ms, attempted_at, mode
       FROM question_attempts WHERE profile_id = ? ORDER BY attempted_at DESC, rowid DESC LIMIT ?`,
    [profileId, limit],
  );
  return rows.map(mapAttemptRow);
}

export async function getAllAttempts(profileId: string): Promise<RawAttemptRow[]> {
  const rows = await getDb().all(
    `SELECT question_id, selected, correct, elapsed_ms, attempted_at, mode
       FROM question_attempts WHERE profile_id = ? ORDER BY attempted_at ASC, rowid ASC`,
    [profileId],
  );
  return rows.map(mapAttemptRow);
}

export async function getQuizHistory(profileId: string, limit = 20) {
  const rows = await getDb().all(
    `SELECT id, mode, topic_id, total, answered, correct, started_at, completed_at
       FROM quiz_attempts WHERE profile_id = ? ORDER BY started_at DESC LIMIT ?`,
    [profileId, limit],
  );
  return rows.map((item) => ({
    id: String(item.id),
    mode: String(item.mode),
    topicId: item.topic_id ? String(item.topic_id) : null,
    total: Number(item.total),
    answered: Number(item.answered),
    correct: Number(item.correct),
    startedAt: String(item.started_at),
    completedAt: item.completed_at ? String(item.completed_at) : null,
  }));
}

export async function toggleBookmark(
  profileId: string,
  itemType: ItemType,
  itemId: string,
): Promise<boolean> {
  await ensureProfile(profileId);
  const db = getDb();
  const existing = await db.get(
    "SELECT 1 FROM bookmarks WHERE profile_id = ? AND item_type = ? AND item_id = ?",
    [profileId, itemType, itemId],
  );
  if (existing) {
    await db.run("DELETE FROM bookmarks WHERE profile_id = ? AND item_type = ? AND item_id = ?", [
      profileId,
      itemType,
      itemId,
    ]);
    return false;
  }
  await db.run(
    "INSERT INTO bookmarks (profile_id, item_type, item_id, created_at) VALUES (?, ?, ?, ?)",
    [profileId, itemType, itemId, nowIso()],
  );
  return true;
}

export async function getBookmarks(profileId: string, itemType?: ItemType) {
  const rows = itemType
    ? await getDb().all(
        "SELECT item_type, item_id, created_at FROM bookmarks WHERE profile_id = ? AND item_type = ? ORDER BY created_at DESC",
        [profileId, itemType],
      )
    : await getDb().all(
        "SELECT item_type, item_id, created_at FROM bookmarks WHERE profile_id = ? ORDER BY created_at DESC",
        [profileId],
      );
  return rows.map((item) => ({
    itemType: String(item.item_type) as ItemType,
    itemId: String(item.item_id),
    createdAt: String(item.created_at),
  }));
}

export async function isBookmarked(profileId: string, itemType: ItemType, itemId: string): Promise<boolean> {
  const row = await getDb().get(
    "SELECT 1 FROM bookmarks WHERE profile_id = ? AND item_type = ? AND item_id = ?",
    [profileId, itemType, itemId],
  );
  return Boolean(row);
}

export async function getReviewRow(
  profileId: string,
  itemType: ItemType,
  itemId: string,
): Promise<ReviewRow | null> {
  const row = await getDb().get(
    `SELECT profile_id, item_type, item_id, due_at, interval_days, ease, reps, lapses, last_reviewed_at
       FROM review_items WHERE profile_id = ? AND item_type = ? AND item_id = ?`,
    [profileId, itemType, itemId],
  );
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

export async function scheduleReview(
  profileId: string,
  itemType: ItemType,
  itemId: string,
  grade: 0 | 1 | 2 | 3,
): Promise<ReviewRow> {
  await ensureProfile(profileId);
  const existing = await getReviewRow(profileId, itemType, itemId);
  const result = nextSchedule(existing, grade);
  const now = new Date();
  const due = new Date(now.getTime() + result.intervalDays * 86_400_000);
  await getDb().run(
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
    [
      profileId,
      itemType,
      itemId,
      due.toISOString(),
      result.intervalDays,
      result.ease,
      result.reps,
      result.lapses,
      now.toISOString(),
    ],
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

export async function getDueReviews(profileId: string, limit = 50): Promise<DueReview[]> {
  const now = nowIso();
  const rows = await getDb().all(
    `SELECT item_type, item_id, due_at, interval_days, reps, lapses
       FROM review_items WHERE profile_id = ? AND due_at <= ?
       ORDER BY due_at ASC LIMIT ?`,
    [profileId, now, limit],
  );
  return rows.map((item) => ({
    itemType: String(item.item_type) as ItemType,
    itemId: String(item.item_id),
    dueAt: String(item.due_at),
    intervalDays: Number(item.interval_days),
    reps: Number(item.reps),
    lapses: Number(item.lapses),
  }));
}

export async function getReviewCounts(profileId: string) {
  const now = nowIso();
  const [due, total] = await Promise.all([
    getDb().get<{ n: number }>(
      "SELECT COUNT(*) AS n FROM review_items WHERE profile_id = ? AND due_at <= ?",
      [profileId, now],
    ),
    getDb().get<{ n: number }>("SELECT COUNT(*) AS n FROM review_items WHERE profile_id = ?", [profileId]),
  ]);
  return { due: Number(due?.n ?? 0), total: Number(total?.n ?? 0) };
}

export async function createMockAttempt(input: {
  profileId: string;
  questionIds: string[];
  durationSec: number;
}): Promise<string> {
  await ensureProfile(input.profileId);
  const id = randomUUID();
  const now = new Date();
  const expires = new Date(now.getTime() + input.durationSec * 1000);
  await getDb().run(
    `INSERT INTO mock_attempts
       (id, profile_id, started_at, expires_at, questions_json, answers_json, flags_json, current_index, duration_sec, total)
       VALUES (?, ?, ?, ?, ?, '{}', '[]', 0, ?, ?)`,
    [
      id,
      input.profileId,
      now.toISOString(),
      expires.toISOString(),
      JSON.stringify(input.questionIds),
      input.durationSec,
      input.questionIds.length,
    ],
  );
  return id;
}

export async function getMockAttempt(id: string, profileId?: string): Promise<MockRow | null> {
  const row = await getDb().get("SELECT * FROM mock_attempts WHERE id = ?", [id]);
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

export async function saveMockState(
  id: string,
  profileId: string,
  input: {
    answers: Record<string, AnswerRecord>;
    flags: string[];
    currentIndex: number;
  },
): Promise<void> {
  await getDb().run(
    `UPDATE mock_attempts SET answers_json = ?, flags_json = ?, current_index = ?
       WHERE id = ? AND profile_id = ? AND submitted_at IS NULL`,
    [JSON.stringify(input.answers), JSON.stringify(input.flags), input.currentIndex, id, profileId],
  );
}

export async function submitMockAttempt(
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
): Promise<void> {
  const submittedAt = nowIso();
  const statements: SqlStatement[] = [
    {
      sql: `UPDATE mock_attempts SET answers_json = ?, flags_json = ?, current_index = ?,
         submitted_at = ?, correct = ?, result_json = ?,
         duration_sec = CAST((julianday(?) - julianday(started_at)) * 86400 AS INTEGER)
       WHERE id = ? AND profile_id = ? AND submitted_at IS NULL`,
      args: [
        JSON.stringify(input.answers),
        JSON.stringify(input.flags),
        input.currentIndex,
        submittedAt,
        input.correct,
        JSON.stringify(input.result),
        submittedAt,
        id,
        profileId,
      ],
    },
    ...input.attemptRecords.map((record) => ({
      sql: `INSERT INTO question_attempts
       (id, profile_id, question_id, mode, selected, correct, elapsed_ms, attempted_at, mock_attempt_id)
       VALUES (?, ?, ?, 'mock', ?, ?, ?, ?, ?)`,
      args: [
        randomUUID(),
        profileId,
        record.questionId,
        record.selected,
        record.correct ? 1 : 0,
        Math.round(record.elapsedMs),
        nowIso(),
        id,
      ],
    })),
  ];
  // One atomic round trip: the result row and its 60 attempt rows land together or not at all.
  await getDb().batch(statements);
}

export async function getMockHistory(profileId: string, limit = 20) {
  const rows = await getDb().all(
    `SELECT id, started_at, submitted_at, total, correct, duration_sec
       FROM mock_attempts WHERE profile_id = ? AND submitted_at IS NOT NULL
       ORDER BY started_at DESC LIMIT ?`,
    [profileId, limit],
  );
  return rows.map((item) => ({
    id: String(item.id),
    startedAt: String(item.started_at),
    submittedAt: String(item.submitted_at),
    total: Number(item.total),
    correct: Number(item.correct),
    durationSec: Number(item.duration_sec),
  }));
}

export async function recordStudySession(input: {
  profileId: string;
  minutes: number;
  source: string;
  startedAt?: string;
}): Promise<void> {
  await ensureProfile(input.profileId);
  const started = input.startedAt ?? nowIso();
  await getDb().run(
    "INSERT INTO study_sessions (id, profile_id, started_at, ended_at, minutes, source) VALUES (?, ?, ?, ?, ?, ?)",
    [
      randomUUID(),
      input.profileId,
      started,
      nowIso(),
      Math.max(0, Math.round(input.minutes)),
      input.source,
    ],
  );
}

export async function getStudyMinutesByDay(profileId: string, days = 14) {
  const start = new Date(Date.now() - days * 86_400_000).toISOString();
  const rows = await getDb().all(
    `SELECT substr(started_at, 1, 10) AS day, SUM(minutes) AS minutes
       FROM study_sessions WHERE profile_id = ? AND started_at >= ?
       GROUP BY day ORDER BY day ASC`,
    [profileId, start],
  );
  return rows.map((item) => ({ day: String(item.day), minutes: Number(item.minutes) }));
}

export async function resetProgress(profileId: string): Promise<void> {
  await getDb().batch(
    [
      "lesson_progress",
      "term_progress",
      "quiz_attempts",
      "question_attempts",
      "mock_attempts",
      "bookmarks",
      "review_items",
      "study_sessions",
    ].map((table) => ({ sql: `DELETE FROM ${table} WHERE profile_id = ?`, args: [profileId] })),
  );
}

export async function setMeta(key: string, value: string): Promise<void> {
  await getDb().run(
    "INSERT INTO content_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    [key, value],
  );
}

export async function getMeta(key: string): Promise<string | null> {
  const row = await getDb().get<{ value: string }>("SELECT value FROM content_meta WHERE key = ?", [key]);
  return row ? row.value : null;
}
