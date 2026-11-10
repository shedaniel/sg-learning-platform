package app.sgstudy.ui.practice

import android.os.SystemClock
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.draw.clip
import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.sgstudy.LocalApp
import app.sgstudy.logic.QuizConfig
import app.sgstudy.rememberProgress
import app.sgstudy.ui.components.*
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.theme.Sg
import kotlinx.coroutines.launch

/** A single question to study (opened from lists elsewhere via nav.openQuestion). */
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun QuestionScreen(questionId: String, nav: Navigator) {
    val app = LocalApp.current
    val scope = rememberCoroutineScope()
    val question = app.content.questionById[questionId]
    val c = Sg.colors

    if (question == null) {
        ScreenFrame("問題", onBack = nav::back) {
            Column(Modifier.padding(it).padding(ScreenPadding)) {
                EmptyState("問題が見つかりません", action = { PrimaryButton("戻る", nav::back) })
            }
        }
        return
    }

    var pending by rememberSaveable(questionId) { mutableStateOf<String?>(null) }
    var answered by rememberSaveable(questionId) { mutableStateOf<String?>(null) }
    // restarts whenever the learner tries again
    var attempt by rememberSaveable(questionId) { mutableIntStateOf(0) }
    val shownAt = remember(questionId, attempt) { SystemClock.elapsedRealtime() }
    val progress by rememberProgress()
    val history = progress?.questionProgress?.get(questionId)

    fun confirm() {
        val selected = pending ?: return
        answered = selected
        scope.launch {
            // A question that is due in the review queue is a review answer (a correct one pushes the interval out);
            // otherwise it is plain practice. Wrong answers are always scheduled by recordAnswer.
            val due = app.store.dueReviews(1000).any { it.itemType == "question" && it.itemId == questionId }
            app.store.recordAnswer(question, selected, if (due) "review" else "quiz", SystemClock.elapsedRealtime() - shownAt)
        }
    }

    ScrollScreen("問題", onBack = nav::back, actions = { BookmarkButton("question", question.id) }) {
        QuestionMetaChips(question)
        QuestionBody(
            question, nav,
            stateOf = { id ->
                val a = answered
                when {
                    a != null -> when {
                        id == question.correctOptionId -> OptionState.Correct
                        id == a -> OptionState.Wrong
                        else -> OptionState.Dimmed
                    }
                    pending == id -> OptionState.Selected
                    else -> OptionState.Idle
                }
            },
            onSelect = if (answered != null) null else { id -> pending = id },
        )

        if (answered == null) {
            PrimaryButton("回答する", ::confirm, Modifier.fillMaxWidth(), enabled = pending != null)
            if (history != null && history.attempts > 0) {
                Text(
                    "これまでの解答 ${history.attempts} 回 · 正解 ${history.correct} 回",
                    style = MaterialTheme.typography.bodySmall, color = c.mutedForeground,
                )
            }
        } else {
            ExplanationPanel(question, nav, answered, showLessonLink = false, showSource = false)
            SecondaryButton("もう一度解く", { answered = null; pending = null; attempt += 1 }, Modifier.fillMaxWidth())
        }

        // where this question sits: topics, lessons, source
        SgCard {
            Text("この問題の位置づけ", style = MaterialTheme.typography.titleSmall)
            Spacer(Modifier.height(10.dp))
            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                question.topicIds.forEach { topicId ->
                    Text(
                        app.content.topicName(topicId),
                        Modifier.heightIn(min = 40.dp).chipFrame()
                            .clickable {
                                nav.startQuiz(QuizConfig(topicIds = listOf(topicId), count = 10, mode = "topic", title = app.content.topicName(topicId)))
                            }
                            .padding(horizontal = 12.dp, vertical = 8.dp),
                        style = MaterialTheme.typography.labelLarge,
                    )
                }
            }
            Text("タップするとこの分野を10問演習します", style = MaterialTheme.typography.bodySmall, color = c.mutedForeground, modifier = Modifier.padding(top = 4.dp))
            val lessons = question.lessonIds.mapNotNull { app.content.lessonById[it] }
            lessons.forEach { lesson ->
                Text(
                    "関連レッスン: ${lesson.title} →",
                    Modifier.fillMaxWidth().heightIn(min = 48.dp).clickable { nav.openLesson(lesson.id) }.padding(top = 12.dp),
                    style = MaterialTheme.typography.labelLarge, color = c.infoForeground,
                )
            }
            Spacer(Modifier.height(12.dp))
            Divider()
            Spacer(Modifier.height(10.dp))
            SourceNote(question)
            if (question.tags.isNotEmpty()) {
                FlowRow(Modifier.padding(top = 10.dp), horizontalArrangement = Arrangement.spacedBy(6.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    question.tags.forEach { Badge(it) }
                }
            }
        }
    }
}

@Composable
private fun Modifier.chipFrame(): Modifier = this
    .clip(RoundedCornerShape(10.dp))
    .border(1.dp, Sg.colors.input, RoundedCornerShape(10.dp))
