package app.sgstudy.logic

import app.sgstudy.data.model.Question
import kotlinx.serialization.Serializable

@Serializable
data class QuizConfig(
    val topicIds: List<String> = emptyList(),
    val lessonIds: List<String> = emptyList(),
    /** "A" | "B" | "both" */
    val part: String = "both",
    /** "easy" | "medium" | "hard" | "mixed" */
    val difficulty: String = "mixed",
    val count: Int = 10,
    val seed: Long? = null,
    /** Topic ids to put first (weak areas). */
    val preferWeak: List<String> = emptyList(),
    val includeOfficial: Boolean = true,
    val questionIds: List<String> = emptyList(),
    val officialYear: Int? = null,
    /** Attempt mode recorded with every answer: custom|topic|lesson|review|weak|official */
    val mode: String = "custom",
    /** true = show correctness/explanation after each answer, false = only at the end */
    val instantFeedback: Boolean = true,
    val title: String? = null,
)

data class QuizSelection(val questions: List<Question>, val skipped: Int)

fun selectQuizQuestions(questions: List<Question>, config: QuizConfig): QuizSelection {
    val rng = newRng(config.seed)
    var pool = questions.filter { q ->
        (config.topicIds.isEmpty() || q.topicIds.any { it in config.topicIds }) &&
            (config.lessonIds.isEmpty() || q.lessonIds.any { it in config.lessonIds }) &&
            (config.part == "both" || q.part == config.part) &&
            (config.difficulty == "mixed" || q.difficulty == config.difficulty) &&
            (config.includeOfficial || !q.isOfficial) &&
            (config.questionIds.isEmpty() || q.id in config.questionIds) &&
            (config.officialYear == null || q.source.year == config.officialYear)
    }
    pool = if (config.preferWeak.isNotEmpty()) {
        // Stable sort: weak-topic questions first, otherwise shuffled order is kept.
        shuffled(pool, rng).sortedBy { q -> if (q.topicIds.any { it in config.preferWeak }) 0 else 1 }
    } else {
        shuffled(pool, rng)
    }
    val selected = pool.take(config.count.coerceAtLeast(0))
    return QuizSelection(selected, pool.size - selected.size)
}
