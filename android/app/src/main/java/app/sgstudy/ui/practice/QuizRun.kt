package app.sgstudy.ui.practice

import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.listSaver
import androidx.compose.runtime.setValue
import app.sgstudy.AppContainer
import app.sgstudy.data.ContentJson
import app.sgstudy.logic.QuizConfig
import app.sgstudy.logic.selectQuizQuestions

/** One recorded answer inside a quiz run. */
data class AnswerRec(val selected: String, val correct: Boolean, val elapsedMs: Long)

/**
 * All mutable state of one quiz run. Questions are picked exactly once (in [create]) and the whole object
 * is saved with [QuizRunSaver] so rotation / process recreation neither reshuffles nor loses answers.
 */
@Stable
class QuizRun(
    val config: QuizConfig?,
    val questionIds: List<String>,
    val startedAt: Long,
    attemptId: String? = null,
    index: Int = 0,
    finished: Boolean = false,
    finishedAt: Long = 0L,
    pending: String? = null,
    answers: Map<String, AnswerRec> = emptyMap(),
) {
    /** Row id in quiz_attempts; null until [app.sgstudy.data.ProgressStore.createQuizAttempt] returned. */
    var attemptId by mutableStateOf(attemptId)
    var index by mutableIntStateOf(index)
    var finished by mutableStateOf(finished)
    var finishedAt by mutableLongStateOf(finishedAt)
    /** Option tapped but not yet confirmed (instant-feedback mode). */
    var pending by mutableStateOf(pending)
    val answers = mutableStateMapOf<String, AnswerRec>().apply { putAll(answers) }

    val instant get() = config?.instantFeedback != false
    val correctCount get() = answers.values.count { it.correct }

    companion object {
        /** Consumes [AppContainer.pendingQuiz] and selects the questions. */
        fun create(app: AppContainer): QuizRun {
            val config = app.pendingQuiz
            app.pendingQuiz = null
            val ids = config?.let { selectQuizQuestions(app.content.questions, it).questions.map { q -> q.id } }.orEmpty()
            return QuizRun(config, ids, System.currentTimeMillis())
        }
    }
}

private const val SEP = "\t"

val QuizRunSaver = listSaver<QuizRun, Any>(
    save = { r ->
        listOf(
            r.config?.let { ContentJson.encodeToString(QuizConfig.serializer(), it) }.orEmpty(),
            ArrayList(r.questionIds),
            r.startedAt,
            r.attemptId.orEmpty(),
            r.index,
            r.finished,
            r.finishedAt,
            r.pending.orEmpty(),
            ArrayList(r.answers.map { (id, a) -> listOf(id, a.selected, a.correct, a.elapsedMs).joinToString(SEP) }),
        )
    },
    restore = { l ->
        @Suppress("UNCHECKED_CAST")
        val answers = (l[8] as List<String>).associate { line ->
            val p = line.split(SEP)
            p[0] to AnswerRec(p[1], p[2].toBoolean(), p[3].toLong())
        }
        @Suppress("UNCHECKED_CAST")
        QuizRun(
            config = (l[0] as String).takeIf { it.isNotEmpty() }?.let { ContentJson.decodeFromString(QuizConfig.serializer(), it) },
            questionIds = l[1] as List<String>,
            startedAt = l[2] as Long,
            attemptId = (l[3] as String).ifEmpty { null },
            index = l[4] as Int,
            finished = l[5] as Boolean,
            finishedAt = l[6] as Long,
            pending = (l[7] as String).ifEmpty { null },
            answers = answers,
        )
    },
)
