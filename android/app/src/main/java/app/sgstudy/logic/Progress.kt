package app.sgstudy.logic

import app.sgstudy.data.*
import app.sgstudy.data.model.Lesson
import app.sgstudy.data.model.Question
import app.sgstudy.data.model.SyllabusTopic

enum class Mastery(val label: String) {
    NotStarted("未着手"), Learning("学習中"), Developing("要強化"), Proficient("準習得"), Mastered("習得"),
}

val MODE_LABEL = mapOf(
    "custom" to "カスタム演習", "topic" to "分野別", "lesson" to "レッスン確認", "review" to "復習",
    "mock" to "模擬試験", "weak" to "弱点", "official" to "公式問題", "quiz" to "演習",
)

data class TopicProgress(
    val topic: SyllabusTopic,
    val lessonCount: Int,
    val questionCount: Int,
    val attempts: Int,
    val correct: Int,
    val accuracy: Int,
    val uniqueAttempted: Int,
    val lastAttemptedAt: String?,
    val mastery: Mastery,
    val completedLessons: Int,
)

data class QuestionProgress(
    val question: Question,
    val attempts: Int,
    val correct: Int,
    val lastSelected: String?,
    val lastCorrect: Boolean?,
    val lastAttemptedAt: String?,
    val averageMs: Long,
)

data class AreaProgress(
    val areaId: String,
    val title: String,
    val totalLessons: Int,
    val completedLessons: Int,
    val percent: Int,
    val accuracy: Int,
    val attempts: Int,
    val topicCount: Int,
    val masteredTopics: Int,
)

data class ProgressSnapshot(
    val lessonCount: Int,
    val completedLessonIds: Set<String>,
    val startedLessonIds: Set<String>,
    val completedLessons: Int,
    val lessonPercent: Int,
    val termCount: Int,
    val learnedTermIds: Set<String>,
    val termPercent: Int,
    val attemptCount: Int,
    val uniqueQuestionsAttempted: Int,
    val questionCount: Int,
    val accuracy: Int,
    val recentAccuracy: Int,
    val topics: List<TopicProgress>,
    val weakTopics: List<TopicProgress>,
    val strongTopics: List<TopicProgress>,
    /** Newest first, max 12. */
    val recentAttempts: List<RawAttempt>,
    val allAttempts: List<RawAttempt>,
    val quizHistory: List<QuizHistoryRow>,
    val mockHistory: List<MockHistoryRow>,
    val dueReviews: List<DueReview>,
    val dueCount: Int,
    val scheduledCount: Int,
    val bookmarks: List<BookmarkRow>,
    val studyDays: List<StudyDay>,
    val lastMockAccuracy: Int,
    val readiness: Readiness,
    val nextLessons: List<Lesson>,
    /** Questions whose last answer was wrong, most-attempted first (max 10). */
    val reviewQuestions: List<Question>,
    val questionProgress: Map<String, QuestionProgress>,
    val areaProgress: List<AreaProgress>,
) {
    fun lessonStatus(lessonId: String): String = when {
        lessonId in completedLessonIds -> "completed"
        lessonId in startedLessonIds -> "started"
        else -> "new"
    }
}

private class Agg(var attempts: Int = 0, var correct: Int = 0, var lastSelected: String = "", var lastCorrect: Boolean = false,
                  var lastAt: String = "", var totalMs: Long = 0)

private fun aggregate(attempts: List<RawAttempt>): Map<String, Agg> {
    val m = HashMap<String, Agg>()
    for (a in attempts) { // attempts are in chronological order
        val g = m.getOrPut(a.questionId) { Agg() }
        g.attempts++; if (a.correct) g.correct++
        g.lastSelected = a.selected; g.lastCorrect = a.correct; g.lastAt = a.attemptedAt; g.totalMs += a.elapsedMs
    }
    return m
}

fun masteryFor(topicAttempts: Int, unique: Int, accuracy: Int): Mastery = when {
    topicAttempts == 0 -> Mastery.NotStarted
    topicAttempts < 4 -> Mastery.Learning
    accuracy >= 85 && topicAttempts >= 10 && unique >= 5 -> Mastery.Mastered
    accuracy >= 70 && topicAttempts >= 6 && unique >= 3 -> Mastery.Proficient
    else -> Mastery.Developing
}

suspend fun computeSnapshot(content: ContentRepository, store: ProgressStore): ProgressSnapshot {
    val attempts = store.allAttempts()
    val lessonRows = store.lessonProgress()
    val learned = store.learnedTermIds().toSet()
    val mockHistory = store.mockHistory()
    val quizHistory = store.quizHistory()
    val due = store.dueReviews(20)
    val (dueCount, scheduled) = store.reviewCounts()
    val bookmarks = store.bookmarks()
    val studyDays = store.studyMinutesByDay(14)

    val started = lessonRows.map { it.lessonId }.toSet()
    val completed = lessonRows.filter { it.completedAt != null }.map { it.lessonId }.toSet()
    val agg = aggregate(attempts)

    val topics = content.topics.map { topic ->
        val lessons = content.lessonsForTopic(topic.id)
        val questions = content.questionsForTopic(topic.id)
        var ta = 0; var tc = 0; var last: String? = null; var unique = 0
        for (q in questions) {
            val r = agg[q.id] ?: continue
            ta += r.attempts; tc += r.correct; unique++
            if (last == null || r.lastAt > last) last = r.lastAt
        }
        val acc = percent(tc, ta)
        TopicProgress(topic, lessons.size, questions.size, ta, tc, acc, unique, last, masteryFor(ta, unique, acc),
            lessons.count { it.id in completed })
    }
    val questionProgress = content.questions.associate { q ->
        val r = agg[q.id]
        q.id to QuestionProgress(q, r?.attempts ?: 0, r?.correct ?: 0, r?.lastSelected, r?.lastCorrect, r?.lastAt,
            if (r != null) r.totalMs / r.attempts else 0)
    }
    val recent = attempts.takeLast(120)
    val recentAcc = percent(recent.count { it.correct }, recent.size)
    val acc = percent(attempts.count { it.correct }, attempts.size)
    val lastMockAcc = mockHistory.firstOrNull()?.let { percent(it.correct, it.total) } ?: 0
    val breadth = topics.count { it.attempts > 0 }.toDouble() / maxOf(1, topics.size)
    val coverage = completed.size.toDouble() / maxOf(1, content.lessons.size)
    val readiness = estimatedReadiness(coverage, recentAcc / 100.0, breadth, lastMockAcc / 100.0, attempts.size)

    val weak = topics.filter { it.attempts > 0 }
        .sortedWith(compareBy<TopicProgress> { it.accuracy }.thenByDescending { it.attempts }).take(6)
    val strong = topics.filter { it.attempts >= 4 }
        .sortedWith(compareByDescending<TopicProgress> { it.accuracy }.thenByDescending { it.attempts }).take(4)
    val nextLessons = content.lessons.filter { it.id !in completed }
        .sortedBy { l -> if (weak.any { it.topic.id in l.topicIds }) 0 else 1 }.take(4)
    val reviewQuestions = content.questions.filter { agg[it.id]?.lastCorrect == false }
        .sortedByDescending { agg[it.id]?.attempts ?: 0 }.take(10)
    val areaProgress = content.areas.map { area ->
        val lessons = content.lessonsOfArea(area.id)
        val rows = topics.filter { it.topic.areaId == area.id }
        val a = rows.sumOf { it.attempts }; val c = rows.sumOf { it.correct }
        val done = lessons.count { it.id in completed }
        AreaProgress(area.id, area.title, lessons.size, done, percent(done, lessons.size), percent(c, a), a, rows.size,
            rows.count { it.mastery == Mastery.Mastered })
    }

    return ProgressSnapshot(
        lessonCount = content.lessons.size, completedLessonIds = completed, startedLessonIds = started,
        completedLessons = completed.size, lessonPercent = percent(completed.size, content.lessons.size),
        termCount = content.terms.size, learnedTermIds = learned, termPercent = percent(learned.size, content.terms.size),
        attemptCount = attempts.size, uniqueQuestionsAttempted = agg.size, questionCount = content.questions.size,
        accuracy = acc, recentAccuracy = recentAcc, topics = topics, weakTopics = weak, strongTopics = strong,
        recentAttempts = attempts.takeLast(12).reversed(), allAttempts = attempts, quizHistory = quizHistory,
        mockHistory = mockHistory, dueReviews = due, dueCount = dueCount, scheduledCount = scheduled,
        bookmarks = bookmarks, studyDays = studyDays, lastMockAccuracy = lastMockAcc, readiness = readiness,
        nextLessons = nextLessons, reviewQuestions = reviewQuestions, questionProgress = questionProgress,
        areaProgress = areaProgress,
    )
}
