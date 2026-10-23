export interface Migration {
  version: number;
  name: string;
  statements: string[];
}

export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    name: "initial",
    statements: [
      `CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL DEFAULT 'Learner',
        created_at TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS lesson_progress (
        profile_id TEXT NOT NULL,
        lesson_id TEXT NOT NULL,
        started_at TEXT NOT NULL,
        completed_at TEXT,
        last_viewed_at TEXT NOT NULL,
        PRIMARY KEY (profile_id, lesson_id)
      )`,
      `CREATE TABLE IF NOT EXISTS term_progress (
        profile_id TEXT NOT NULL,
        term_id TEXT NOT NULL,
        learned_at TEXT NOT NULL,
        PRIMARY KEY (profile_id, term_id)
      )`,
      `CREATE TABLE IF NOT EXISTS quiz_attempts (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL,
        mode TEXT NOT NULL,
        topic_id TEXT,
        config_json TEXT NOT NULL DEFAULT '{}',
        total INTEGER NOT NULL,
        answered INTEGER NOT NULL DEFAULT 0,
        correct INTEGER NOT NULL DEFAULT 0,
        started_at TEXT NOT NULL,
        completed_at TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS question_attempts (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL,
        question_id TEXT NOT NULL,
        mode TEXT NOT NULL,
        selected TEXT NOT NULL,
        correct INTEGER NOT NULL,
        elapsed_ms INTEGER NOT NULL DEFAULT 0,
        attempted_at TEXT NOT NULL,
        quiz_attempt_id TEXT,
        mock_attempt_id TEXT
      )`,
      `CREATE INDEX IF NOT EXISTS idx_attempt_profile_time
        ON question_attempts (profile_id, attempted_at DESC)`,
      `CREATE INDEX IF NOT EXISTS idx_attempt_question
        ON question_attempts (profile_id, question_id)`,
      `CREATE TABLE IF NOT EXISTS mock_attempts (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL,
        started_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        submitted_at TEXT,
        questions_json TEXT NOT NULL,
        answers_json TEXT NOT NULL DEFAULT '{}',
        flags_json TEXT NOT NULL DEFAULT '[]',
        current_index INTEGER NOT NULL DEFAULT 0,
        duration_sec INTEGER NOT NULL,
        total INTEGER NOT NULL,
        correct INTEGER,
        result_json TEXT
      )`,
      `CREATE INDEX IF NOT EXISTS idx_mock_profile
        ON mock_attempts (profile_id, started_at DESC)`,
      `CREATE TABLE IF NOT EXISTS bookmarks (
        profile_id TEXT NOT NULL,
        item_type TEXT NOT NULL,
        item_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        PRIMARY KEY (profile_id, item_type, item_id)
      )`,
      `CREATE TABLE IF NOT EXISTS review_items (
        profile_id TEXT NOT NULL,
        item_type TEXT NOT NULL,
        item_id TEXT NOT NULL,
        due_at TEXT NOT NULL,
        interval_days REAL NOT NULL DEFAULT 0,
        ease REAL NOT NULL DEFAULT 2.5,
        reps INTEGER NOT NULL DEFAULT 0,
        lapses INTEGER NOT NULL DEFAULT 0,
        last_reviewed_at TEXT,
        PRIMARY KEY (profile_id, item_type, item_id)
      )`,
      `CREATE INDEX IF NOT EXISTS idx_review_due
        ON review_items (profile_id, due_at)`,
      `CREATE TABLE IF NOT EXISTS study_sessions (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL,
        started_at TEXT NOT NULL,
        ended_at TEXT,
        minutes INTEGER NOT NULL DEFAULT 0,
        source TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS content_meta (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )`,
    ],
  },
  {
    version: 2,
    name: "retire_study_plans",
    statements: [`DROP TABLE IF EXISTS study_plans`],
  },
];
