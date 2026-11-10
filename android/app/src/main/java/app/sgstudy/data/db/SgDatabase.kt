package app.sgstudy.data.db

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

/** Local on-device progress database (single learner, no profile column). */
class SgDatabase(context: Context, name: String = "sg-progress.db") : SQLiteOpenHelper(context, name, null, 1) {
    override fun onConfigure(db: SQLiteDatabase) {
        db.setForeignKeyConstraintsEnabled(false)
        db.enableWriteAheadLogging()
    }

    override fun onCreate(db: SQLiteDatabase) {
        listOf(
            """CREATE TABLE lesson_progress (
                lesson_id TEXT PRIMARY KEY,
                started_at TEXT NOT NULL,
                completed_at TEXT,
                last_viewed_at TEXT NOT NULL)""",
            """CREATE TABLE term_progress (
                term_id TEXT PRIMARY KEY,
                learned_at TEXT NOT NULL)""",
            """CREATE TABLE quiz_attempts (
                id TEXT PRIMARY KEY,
                mode TEXT NOT NULL,
                topic_id TEXT,
                config_json TEXT NOT NULL DEFAULT '{}',
                total INTEGER NOT NULL,
                answered INTEGER NOT NULL DEFAULT 0,
                correct INTEGER NOT NULL DEFAULT 0,
                started_at TEXT NOT NULL,
                completed_at TEXT)""",
            """CREATE TABLE question_attempts (
                id TEXT PRIMARY KEY,
                question_id TEXT NOT NULL,
                mode TEXT NOT NULL,
                selected TEXT NOT NULL,
                correct INTEGER NOT NULL,
                elapsed_ms INTEGER NOT NULL DEFAULT 0,
                attempted_at TEXT NOT NULL,
                quiz_attempt_id TEXT,
                mock_attempt_id TEXT)""",
            "CREATE INDEX idx_attempt_time ON question_attempts (attempted_at)",
            "CREATE INDEX idx_attempt_question ON question_attempts (question_id)",
            """CREATE TABLE mock_attempts (
                id TEXT PRIMARY KEY,
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
                result_json TEXT)""",
            """CREATE TABLE bookmarks (
                item_type TEXT NOT NULL,
                item_id TEXT NOT NULL,
                created_at TEXT NOT NULL,
                PRIMARY KEY (item_type, item_id))""",
            """CREATE TABLE review_items (
                item_type TEXT NOT NULL,
                item_id TEXT NOT NULL,
                due_at TEXT NOT NULL,
                interval_days REAL NOT NULL DEFAULT 0,
                ease REAL NOT NULL DEFAULT 2.5,
                reps INTEGER NOT NULL DEFAULT 0,
                lapses INTEGER NOT NULL DEFAULT 0,
                last_reviewed_at TEXT,
                PRIMARY KEY (item_type, item_id))""",
            "CREATE INDEX idx_review_due ON review_items (due_at)",
            """CREATE TABLE study_sessions (
                id TEXT PRIMARY KEY,
                started_at TEXT NOT NULL,
                ended_at TEXT,
                minutes INTEGER NOT NULL DEFAULT 0,
                source TEXT NOT NULL)""",
        ).forEach(db::execSQL)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) = Unit

    companion object {
        val TABLES = listOf(
            "lesson_progress", "term_progress", "quiz_attempts", "question_attempts",
            "mock_attempts", "bookmarks", "review_items", "study_sessions",
        )
    }
}
