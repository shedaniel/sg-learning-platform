package app.sgstudy.data

import android.content.ContentValues
import android.database.Cursor
import app.sgstudy.data.db.SgDatabase
import app.sgstudy.data.model.Question
import app.sgstudy.logic.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.withContext
import kotlinx.serialization.builtins.MapSerializer
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.builtins.serializer
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import java.time.Instant
import java.util.UUID

data class RawAttempt(
    val questionId: String, val selected: String, val correct: Boolean,
    val elapsedMs: Long, val attemptedAt: String, val mode: String,
)
data class LessonProgressRow(val lessonId: String, val startedAt: String, val completedAt: String?, val lastViewedAt: String)
data class ReviewRow(
    val itemType: String, val itemId: String, val dueAt: String,
    val intervalDays: Double, val ease: Double, val reps: Int, val lapses: Int, val lastReviewedAt: String?,
)
data class DueReview(val itemType: String, val itemId: String, val dueAt: String, val intervalDays: Double, val reps: Int, val lapses: Int)
data class BookmarkRow(val itemType: String, val itemId: String, val createdAt: String)
data class QuizHistoryRow(
    val id: String, val mode: String, val topicId: String?, val total: Int, val answered: Int,
    val correct: Int, val startedAt: String, val completedAt: String?,
)
data class MockRow(
    val id: String, val startedAt: String, val expiresAt: String, val submittedAt: String?,
    val questionIds: List<String>, val answers: Map<String, MockAnswer>, val flags: List<String>,
    val currentIndex: Int, val durationSec: Int, val total: Int, val correct: Int?, val result: MockResult?,
)
data class MockHistoryRow(val id: String, val startedAt: String, val submittedAt: String, val total: Int, val correct: Int, val durationSec: Int)
data class StudyDay(val day: String, val minutes: Int)

/**
 * All learner progress, stored locally in SQLite. Every function is a suspend function that runs on
 * Dispatchers.IO. [version] increases after every write so screens can refresh (see rememberProgress()).
 *
 * Item types for bookmarks / reviews: "question", "term", "lesson".
 */
class ProgressStore(private val helper: SgDatabase) {
    private val _version = MutableStateFlow(0)
    val version: StateFlow<Int> = _version

    private fun changed() { _version.value += 1 }
    private fun id() = UUID.randomUUID().toString()

    private suspend fun <T> db(block: (android.database.sqlite.SQLiteDatabase) -> T): T =
        withContext(Dispatchers.IO) { block(helper.writableDatabase) }

    private fun <T> Cursor.mapRows(f: (Cursor) -> T): List<T> = use { c ->
        buildList { while (c.moveToNext()) add(f(c)) }
    }
    private fun Cursor.str(name: String) = getString(getColumnIndexOrThrow(name))
    private fun Cursor.strOrNull(name: String) = getColumnIndexOrThrow(name).let { if (isNull(it)) null else getString(it) }
    private fun Cursor.int(name: String) = getInt(getColumnIndexOrThrow(name))
    private fun Cursor.long(name: String) = getLong(getColumnIndexOrThrow(name))
    private fun Cursor.dbl(name: String) = getDouble(getColumnIndexOrThrow(name))

    // ------------------------------------------------------------------ lessons

    suspend fun touchLesson(lessonId: String) = db { d ->
        val now = nowIso()
        d.execSQL(
            """INSERT INTO lesson_progress (lesson_id, started_at, last_viewed_at) VALUES (?, ?, ?)
               ON CONFLICT(lesson_id) DO UPDATE SET last_viewed_at = excluded.last_viewed_at""",
            arrayOf(lessonId, now, now),
        )
        changed()
    }

    suspend fun setLessonCompleted(lessonId: String, completed: Boolean) = db { d ->
        val now = nowIso()
        d.execSQL(
            """INSERT INTO lesson_progress (lesson_id, started_at, completed_at, last_viewed_at) VALUES (?, ?, ?, ?)
               ON CONFLICT(lesson_id) DO UPDATE SET completed_at = excluded.completed_at, last_viewed_at = excluded.last_viewed_at""",
            arrayOf(lessonId, now, if (completed) now else null, now),
        )
        if (completed) scheduleReviewInternal(d, "lesson", lessonId, 2)
        changed()
    }

    suspend fun lessonProgress(): List<LessonProgressRow> = db { d ->
        d.rawQuery("SELECT lesson_id, started_at, completed_at, last_viewed_at FROM lesson_progress", null).mapRows {
            LessonProgressRow(it.str("lesson_id"), it.str("started_at"), it.strOrNull("completed_at"), it.str("last_viewed_at"))
        }
    }

    // ------------------------------------------------------------------ terms

    suspend fun markTermLearned(termId: String, learned: Boolean = true) = db { d ->
        if (learned) {
            d.execSQL("INSERT OR IGNORE INTO term_progress (term_id, learned_at) VALUES (?, ?)", arrayOf(termId, nowIso()))
        } else {
            d.execSQL("DELETE FROM term_progress WHERE term_id = ?", arrayOf(termId))
        }
        changed()
    }

    suspend fun learnedTermIds(): List<String> = db { d ->
        d.rawQuery("SELECT term_id FROM term_progress", null).mapRows { it.getString(0) }
    }

    // ------------------------------------------------------------------ attempts

    /**
     * Records one answer and applies the same review scheduling as the web app: a wrong answer is scheduled
     * immediately (grade 0); a correct answer in mode "review" expands the interval (grade 2).
     */
    suspend fun recordAnswer(
        question: Question,
        selected: String,
        mode: String,
        elapsedMs: Long = 0,
        quizAttemptId: String? = null,
        mockAttemptId: String? = null,
    ): Boolean = db { d ->
        val correct = selected == question.correctOptionId
        insertAttempt(d, question.id, selected, correct, mode, elapsedMs, quizAttemptId, mockAttemptId, nowIso())
        if (!correct) scheduleReviewInternal(d, "question", question.id, 0)
        else if (mode == "review") scheduleReviewInternal(d, "question", question.id, 2)
        changed()
        correct
    }

    private fun insertAttempt(
        d: android.database.sqlite.SQLiteDatabase, questionId: String, selected: String, correct: Boolean,
        mode: String, elapsedMs: Long, quizAttemptId: String?, mockAttemptId: String?, at: String,
    ) {
        d.insert("question_attempts", null, ContentValues().apply {
            put("id", id()); put("question_id", questionId); put("mode", mode); put("selected", selected)
            put("correct", if (correct) 1 else 0); put("elapsed_ms", elapsedMs.coerceAtLeast(0))
            put("attempted_at", at); put("quiz_attempt_id", quizAttemptId); put("mock_attempt_id", mockAttemptId)
        })
    }

    suspend fun allAttempts(): List<RawAttempt> = db { d ->
        d.rawQuery(
            "SELECT question_id, selected, correct, elapsed_ms, attempted_at, mode FROM question_attempts ORDER BY attempted_at ASC, rowid ASC",
            null,
        ).mapRows {
            RawAttempt(it.str("question_id"), it.str("selected"), it.int("correct") == 1, it.long("elapsed_ms"), it.str("attempted_at"), it.str("mode"))
        }
    }

    suspend fun createQuizAttempt(mode: String, topicId: String?, configJson: String, total: Int): String = db { d ->
        val id = id()
        d.insert("quiz_attempts", null, ContentValues().apply {
            put("id", id); put("mode", mode); put("topic_id", topicId); put("config_json", configJson)
            put("total", total); put("started_at", nowIso())
        })
        changed(); id
    }

    suspend fun updateQuizAttempt(id: String, answered: Int, correct: Int, completed: Boolean) = db { d ->
        d.execSQL(
            "UPDATE quiz_attempts SET answered = ?, correct = ?, completed_at = CASE WHEN ? = 1 THEN ? ELSE completed_at END WHERE id = ?",
            arrayOf<Any?>(answered, correct, if (completed) 1 else 0, nowIso(), id),
        )
        changed()
    }

    suspend fun quizHistory(limit: Int = 20): List<QuizHistoryRow> = db { d ->
        d.rawQuery(
            "SELECT id, mode, topic_id, total, answered, correct, started_at, completed_at FROM quiz_attempts ORDER BY started_at DESC LIMIT ?",
            arrayOf(limit.toString()),
        ).mapRows {
            QuizHistoryRow(it.str("id"), it.str("mode"), it.strOrNull("topic_id"), it.int("total"), it.int("answered"),
                it.int("correct"), it.str("started_at"), it.strOrNull("completed_at"))
        }
    }

    // ------------------------------------------------------------------ bookmarks

    /** Returns true when the item is now bookmarked. */
    suspend fun toggleBookmark(itemType: String, itemId: String): Boolean = db { d ->
        val exists = d.rawQuery("SELECT 1 FROM bookmarks WHERE item_type = ? AND item_id = ?", arrayOf(itemType, itemId))
            .use { it.moveToFirst() }
        if (exists) d.execSQL("DELETE FROM bookmarks WHERE item_type = ? AND item_id = ?", arrayOf(itemType, itemId))
        else d.execSQL("INSERT INTO bookmarks (item_type, item_id, created_at) VALUES (?, ?, ?)", arrayOf(itemType, itemId, nowIso()))
        changed(); !exists
    }

    suspend fun isBookmarked(itemType: String, itemId: String): Boolean = db { d ->
        d.rawQuery("SELECT 1 FROM bookmarks WHERE item_type = ? AND item_id = ?", arrayOf(itemType, itemId)).use { it.moveToFirst() }
    }

    suspend fun bookmarks(itemType: String? = null): List<BookmarkRow> = db { d ->
        val c = if (itemType == null) d.rawQuery("SELECT item_type, item_id, created_at FROM bookmarks ORDER BY created_at DESC", null)
        else d.rawQuery("SELECT item_type, item_id, created_at FROM bookmarks WHERE item_type = ? ORDER BY created_at DESC", arrayOf(itemType))
        c.mapRows { BookmarkRow(it.str("item_type"), it.str("item_id"), it.str("created_at")) }
    }

    // ------------------------------------------------------------------ spaced repetition

    private fun scheduleReviewInternal(d: android.database.sqlite.SQLiteDatabase, type: String, itemId: String, grade: Int) {
        val existing = d.rawQuery(
            "SELECT interval_days, ease, reps, lapses FROM review_items WHERE item_type = ? AND item_id = ?", arrayOf(type, itemId),
        ).use { c -> if (c.moveToFirst()) ReviewSchedule(c.getDouble(0), c.getDouble(1), c.getInt(2), c.getInt(3)) else null }
        val next = nextSchedule(existing, grade)
        val now = Instant.now()
        val due = now.plusMillis((next.intervalDays * 86_400_000).toLong())
        d.execSQL(
            """INSERT INTO review_items (item_type, item_id, due_at, interval_days, ease, reps, lapses, last_reviewed_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)
               ON CONFLICT(item_type, item_id) DO UPDATE SET due_at = excluded.due_at, interval_days = excluded.interval_days,
                 ease = excluded.ease, reps = excluded.reps, lapses = excluded.lapses, last_reviewed_at = excluded.last_reviewed_at""",
            arrayOf<Any?>(type, itemId, due.toString(), next.intervalDays, next.ease, next.reps, next.lapses, now.toString()),
        )
    }

    /** grade 0 = wrong, 1 = hard, 2 = good, 3 = easy. */
    suspend fun scheduleReview(itemType: String, itemId: String, grade: Int) = db { d ->
        scheduleReviewInternal(d, itemType, itemId, grade.coerceIn(0, 3)); changed()
    }

    suspend fun dueReviews(limit: Int = 50): List<DueReview> = db { d ->
        d.rawQuery(
            "SELECT item_type, item_id, due_at, interval_days, reps, lapses FROM review_items WHERE due_at <= ? ORDER BY due_at ASC LIMIT ?",
            arrayOf(nowIso(), limit.toString()),
        ).mapRows { DueReview(it.str("item_type"), it.str("item_id"), it.str("due_at"), it.dbl("interval_days"), it.int("reps"), it.int("lapses")) }
    }

    /** (due now, total scheduled) */
    suspend fun reviewCounts(): Pair<Int, Int> = db { d ->
        val due = d.rawQuery("SELECT COUNT(*) FROM review_items WHERE due_at <= ?", arrayOf(nowIso())).use { it.moveToFirst(); it.getInt(0) }
        val total = d.rawQuery("SELECT COUNT(*) FROM review_items", null).use { it.moveToFirst(); it.getInt(0) }
        due to total
    }

    // ------------------------------------------------------------------ mock exams

    suspend fun createMock(questionIds: List<String>, durationSec: Int): String = db { d ->
        val id = id()
        val now = Instant.now()
        d.insert("mock_attempts", null, ContentValues().apply {
            put("id", id); put("started_at", now.toString()); put("expires_at", now.plusSeconds(durationSec.toLong()).toString())
            put("questions_json", ContentJson.encodeToString(ListSerializer(String.serializer()), questionIds))
            put("duration_sec", durationSec); put("total", questionIds.size)
        })
        changed(); id
    }

    private fun mapMock(c: Cursor): MockRow = MockRow(
        id = c.str("id"), startedAt = c.str("started_at"), expiresAt = c.str("expires_at"), submittedAt = c.strOrNull("submitted_at"),
        questionIds = ContentJson.decodeFromString(ListSerializer(String.serializer()), c.str("questions_json")),
        answers = ContentJson.decodeFromString(MapSerializer(String.serializer(), MockAnswer.serializer()), c.str("answers_json")),
        flags = ContentJson.decodeFromString(ListSerializer(String.serializer()), c.str("flags_json")),
        currentIndex = c.int("current_index"), durationSec = c.int("duration_sec"), total = c.int("total"),
        correct = c.getColumnIndexOrThrow("correct").let { if (c.isNull(it)) null else c.getInt(it) },
        result = c.strOrNull("result_json")?.let { ContentJson.decodeFromString(MockResult.serializer(), it) },
    )

    suspend fun mock(id: String): MockRow? = db { d ->
        d.rawQuery("SELECT * FROM mock_attempts WHERE id = ?", arrayOf(id)).use { c -> if (c.moveToFirst()) mapMock(c) else null }
    }

    /** The most recent mock exam that has not been submitted yet (resume after leaving the app). */
    suspend fun unfinishedMock(): MockRow? = db { d ->
        d.rawQuery("SELECT * FROM mock_attempts WHERE submitted_at IS NULL ORDER BY started_at DESC LIMIT 1", null)
            .use { c -> if (c.moveToFirst()) mapMock(c) else null }
    }

    suspend fun saveMockState(id: String, answers: Map<String, MockAnswer>, flags: List<String>, currentIndex: Int) = db { d ->
        d.execSQL(
            "UPDATE mock_attempts SET answers_json = ?, flags_json = ?, current_index = ? WHERE id = ? AND submitted_at IS NULL",
            arrayOf<Any?>(
                ContentJson.encodeToString(MapSerializer(String.serializer(), MockAnswer.serializer()), answers),
                ContentJson.encodeToString(ListSerializer(String.serializer()), flags), currentIndex, id,
            ),
        )
    }

    /** Scores and finalises a mock exam atomically; wrong answers are scheduled for review. Returns the result. */
    suspend fun submitMock(
        id: String, answers: Map<String, MockAnswer>, flags: List<String>, currentIndex: Int,
        questionIds: List<String>, byId: Map<String, Question>,
    ): MockResult = db { d ->
        val result = scoreMock(questionIds, answers, byId)
        val submittedAt = nowIso()
        d.beginTransaction()
        try {
            d.execSQL(
                """UPDATE mock_attempts SET answers_json = ?, flags_json = ?, current_index = ?, submitted_at = ?, correct = ?, result_json = ?,
                   duration_sec = CAST((julianday(?) - julianday(started_at)) * 86400 AS INTEGER) WHERE id = ? AND submitted_at IS NULL""",
                arrayOf<Any?>(
                    ContentJson.encodeToString(MapSerializer(String.serializer(), MockAnswer.serializer()), answers),
                    ContentJson.encodeToString(ListSerializer(String.serializer()), flags), currentIndex, submittedAt, result.correct,
                    ContentJson.encodeToString(MockResult.serializer(), result), submittedAt, id,
                ),
            )
            for (r in result.questions) {
                val sel = r.selected ?: continue
                insertAttempt(d, r.questionId, sel, r.correct, "mock", r.elapsedMs, null, id, submittedAt)
                if (!r.correct) scheduleReviewInternal(d, "question", r.questionId, 0)
            }
            d.execSQL(
                "INSERT INTO study_sessions (id, started_at, ended_at, minutes, source) VALUES (?, ?, ?, ?, 'mock')",
                arrayOf<Any?>(id(), submittedAt, submittedAt, (result.totalElapsedMs / 60_000).toInt().coerceAtLeast(1)),
            )
            d.setTransactionSuccessful()
        } finally { d.endTransaction() }
        changed(); result
    }

    suspend fun deleteMock(id: String) = db { d -> d.execSQL("DELETE FROM mock_attempts WHERE id = ?", arrayOf(id)); changed() }

    suspend fun mockHistory(limit: Int = 20): List<MockHistoryRow> = db { d ->
        d.rawQuery(
            "SELECT id, started_at, submitted_at, total, correct, duration_sec FROM mock_attempts WHERE submitted_at IS NOT NULL ORDER BY started_at DESC LIMIT ?",
            arrayOf(limit.toString()),
        ).mapRows { MockHistoryRow(it.str("id"), it.str("started_at"), it.str("submitted_at"), it.int("total"), it.int("correct"), it.int("duration_sec")) }
    }

    // ------------------------------------------------------------------ study time

    suspend fun recordStudySession(minutes: Int, source: String) = db { d ->
        val now = nowIso()
        d.execSQL(
            "INSERT INTO study_sessions (id, started_at, ended_at, minutes, source) VALUES (?, ?, ?, ?, ?)",
            arrayOf<Any?>(id(), now, now, minutes.coerceAtLeast(0), source),
        )
        changed()
    }

    suspend fun studyMinutesByDay(days: Int = 14): List<StudyDay> = db { d ->
        val start = Instant.now().minusSeconds(days * 86_400L).toString()
        d.rawQuery(
            "SELECT substr(started_at, 1, 10) AS day, SUM(minutes) AS minutes FROM study_sessions WHERE started_at >= ? GROUP BY day ORDER BY day ASC",
            arrayOf(start),
        ).mapRows { StudyDay(it.str("day"), it.int("minutes")) }
    }

    // ------------------------------------------------------------------ backup / reset

    suspend fun reset() = db { d ->
        d.beginTransaction()
        try { SgDatabase.TABLES.forEach { d.execSQL("DELETE FROM $it") }; d.setTransactionSuccessful() } finally { d.endTransaction() }
        changed()
    }

    /** Whole database as one JSON document ({table: [row,...]}) for backup to a file. */
    suspend fun exportJson(): String = db { d ->
        val root = buildJsonObject {
            put("app", "sg-study"); put("format", 1)
            SgDatabase.TABLES.forEach { table ->
                d.rawQuery("SELECT * FROM $table", null).use { c ->
                    val rows = buildList<JsonElement> {
                        while (c.moveToNext()) add(buildJsonObject {
                            for (i in 0 until c.columnCount) {
                                val name = c.getColumnName(i)
                                when (c.getType(i)) {
                                    Cursor.FIELD_TYPE_NULL -> put(name, JsonNull)
                                    Cursor.FIELD_TYPE_INTEGER -> put(name, c.getLong(i))
                                    Cursor.FIELD_TYPE_FLOAT -> put(name, c.getDouble(i))
                                    else -> put(name, c.getString(i))
                                }
                            }
                        })
                    }
                    put(table, JsonArray(rows))
                }
            }
        }
        root.toString()
    }

    /** Replaces all progress with the contents of a document produced by [exportJson]. */
    suspend fun importJson(json: String) = db { d ->
        val root = Json.parseToJsonElement(json) as? JsonObject ?: error("Invalid backup")
        require((root["app"] as? JsonPrimitive)?.content == "sg-study") { "これはSG学習のバックアップではありません" }
        d.beginTransaction()
        try {
            SgDatabase.TABLES.forEach { table ->
                d.execSQL("DELETE FROM $table")
                (root[table] as? JsonArray)?.forEach { row ->
                    val obj = row as JsonObject
                    d.insert(table, null, ContentValues().apply {
                        obj.forEach { (k, v) ->
                            val p = v as? JsonPrimitive
                            when {
                                p == null || p is JsonNull -> putNull(k)
                                p.isString -> put(k, p.content)
                                p.content.contains('.') -> put(k, p.content.toDouble())
                                else -> put(k, p.content.toLong())
                            }
                        }
                    })
                }
            }
            d.setTransactionSuccessful()
        } finally { d.endTransaction() }
        changed()
    }
}
