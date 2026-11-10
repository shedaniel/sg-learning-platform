package app.sgstudy.logic

import app.sgstudy.data.model.Question
import kotlinx.serialization.Serializable

object ExamFacts {
    const val QUESTIONS = 60
    const val PART_A = 48
    const val PART_B = 12
    const val MINUTES = 120
}

@Serializable
data class MockAnswer(val selected: String, val elapsedMs: Long = 0)

@Serializable
data class PartScore(val total: Int, val correct: Int, val accuracy: Int)

@Serializable
data class TopicScore(val topicId: String, val total: Int, val correct: Int, val accuracy: Int)

@Serializable
data class DifficultyScore(val difficulty: String, val total: Int, val correct: Int, val accuracy: Int)

@Serializable
data class MockQuestionResult(
    val questionId: String,
    val part: String,
    val selected: String? = null,
    val correctOptionId: String,
    val correct: Boolean,
    val elapsedMs: Long,
)

@Serializable
data class MockResult(
    val total: Int,
    val answered: Int,
    val correct: Int,
    val accuracy: Int,
    val partA: PartScore,
    val partB: PartScore,
    val byTopic: List<TopicScore>,
    val byDifficulty: List<DifficultyScore>,
    val totalElapsedMs: Long,
    val averageElapsedMs: Long,
    val unanswered: Int,
    val questions: List<MockQuestionResult>,
    val weakTopicIds: List<String>,
)

private fun selectBalanced(questions: List<Question>, count: Int, rng: Mulberry32): List<Question> {
    if (questions.size <= count) return questions.toList()
    val groups = LinkedHashMap<String, ArrayDeque<Question>>()
    for (q in shuffled(questions, rng)) {
        groups.getOrPut(q.topicIds.firstOrNull() ?: "other") { ArrayDeque() }.addLast(q)
    }
    val buckets = shuffled(groups.values, rng)
    val selected = mutableListOf<Question>()
    var cursor = 0
    while (selected.size < count && buckets.any { it.isNotEmpty() }) {
        buckets[cursor % buckets.size].removeFirstOrNull()?.let { selected += it }
        cursor++
    }
    return selected
}

/** 48 科目A + 12 科目B, balanced across topics, shuffled. */
fun composeMockExam(
    questions: List<Question>,
    partA: Int = ExamFacts.PART_A,
    partB: Int = ExamFacts.PART_B,
    seed: Long? = null,
): List<Question> {
    val rng = newRng(seed)
    val a = questions.filter { it.part == "A" }.distinctBy { it.id }
    val b = questions.filter { it.part == "B" }.distinctBy { it.id }
    val pickedA = selectBalanced(a, minOf(partA, a.size), rng)
    val pickedB = selectBalanced(b, minOf(partB, b.size), rng)
    val used = (pickedA + pickedB).map { it.id }.toSet()
    val extras = questions.filter { it.id !in used }.distinctBy { it.id }
    val result = (pickedA + pickedB).toMutableList()
    val target = partA + partB
    if (result.size < target) result += selectBalanced(extras, target - result.size, rng)
    return shuffled(result, rng)
}

fun scoreMock(questionIds: List<String>, answers: Map<String, MockAnswer>, byId: Map<String, Question>): MockResult {
    val part = mutableMapOf("A" to intArrayOf(0, 0), "B" to intArrayOf(0, 0))
    val topicTotals = LinkedHashMap<String, IntArray>()
    val diffTotals = LinkedHashMap<String, IntArray>()
    var correct = 0; var answered = 0; var totalElapsed = 0L
    val details = mutableListOf<MockQuestionResult>()
    for (id in questionIds) {
        val q = byId[id] ?: continue
        val ans = answers[id]
        val selected = ans?.selected?.takeIf { it.isNotEmpty() }
        val ok = selected == q.correctOptionId
        val elapsed = maxOf(0L, ans?.elapsedMs ?: 0L)
        if (selected != null) answered++
        if (ok) correct++
        totalElapsed += elapsed
        part.getValue(q.part)[0]++; if (ok) part.getValue(q.part)[1]++
        for (t in q.topicIds) { val e = topicTotals.getOrPut(t) { IntArray(2) }; e[0]++; if (ok) e[1]++ }
        val d = diffTotals.getOrPut(q.difficulty) { IntArray(2) }; d[0]++; if (ok) d[1]++
        details += MockQuestionResult(id, q.part, selected, q.correctOptionId, ok, elapsed)
    }
    fun ps(k: String) = part.getValue(k).let { PartScore(it[0], it[1], percent(it[1], it[0])) }
    val byTopic = topicTotals.map { (t, v) -> TopicScore(t, v[0], v[1], percent(v[1], v[0])) }
        .sortedWith(compareBy<TopicScore> { it.accuracy }.thenByDescending { it.total })
    val order = mapOf("easy" to 0, "medium" to 1, "hard" to 2)
    val byDiff = diffTotals.map { (d, v) -> DifficultyScore(d, v[0], v[1], percent(v[1], v[0])) }
        .sortedBy { order[it.difficulty] ?: 9 }
    val total = details.size
    return MockResult(
        total = total, answered = answered, correct = correct, accuracy = percent(correct, total),
        partA = ps("A"), partB = ps("B"), byTopic = byTopic, byDifficulty = byDiff,
        totalElapsedMs = totalElapsed, averageElapsedMs = if (total > 0) totalElapsed / total else 0,
        unanswered = total - answered, questions = details,
        weakTopicIds = byTopic.filter { it.accuracy < 70 }.map { it.topicId },
    )
}

data class Readiness(val score: Int, val confidence: String, val note: String)

fun estimatedReadiness(
    lessonCoverage: Double, recentAccuracy: Double, topicBreadth: Double, mockAccuracy: Double, totalAttempts: Int,
): Readiness {
    val score = Math.round(lessonCoverage * 25 + recentAccuracy * 35 + topicBreadth * 20 + mockAccuracy * 20)
        .toInt().coerceIn(0, 100)
    val confidence = when {
        totalAttempts >= 120 && mockAccuracy > 0 -> "high"
        totalAttempts >= 40 -> "medium"
        else -> "low"
    }
    return Readiness(score, confidence, "本アプリ独自の暫定指標です。IPAのIRT評価点・合否判定ではありません。")
}
