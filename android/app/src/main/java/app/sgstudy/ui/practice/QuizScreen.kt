package app.sgstudy.ui.practice

import android.os.SystemClock
import androidx.activity.compose.BackHandler
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.relocation.BringIntoViewRequester
import androidx.compose.foundation.relocation.bringIntoViewRequester
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedIconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import app.sgstudy.LocalApp
import app.sgstudy.data.ContentJson
import app.sgstudy.logic.QuizConfig
import app.sgstudy.data.model.Question
import app.sgstudy.logic.formatClock
import app.sgstudy.ui.components.*
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.theme.Sg
import kotlinx.coroutines.NonCancellable
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/**
 * One quiz run: shows the questions of `LocalApp.current.pendingQuiz` one at a time, records every answer
 * and ends in a results page. Port of QuizRunner.tsx.
 */
@Composable
fun QuizScreen(nav: Navigator) {
    val app = LocalApp.current
    val scope = rememberCoroutineScope()
    // The pending config is consumed once; afterwards the run survives rotation through the saver.
    val run = rememberSaveable(saver = QuizRunSaver) { QuizRun.create(app) }
    val config = run.config

    if (config == null || run.questionIds.isEmpty()) {
        ScreenFrame("演習", onBack = nav::back) {
            Column(Modifier.padding(it).padding(ScreenPadding)) {
                EmptyState(
                    if (config == null) "演習の設定がありません" else "条件に合う問題がありません",
                    if (config == null) "演習タブから出題範囲を選んで開始してください。" else "出題範囲や難易度を変えてもう一度お試しください。",
                    action = { PrimaryButton("戻る", nav::back) },
                )
            }
        }
        return
    }

    // Create the quiz_attempts row once.
    LaunchedEffect(run) {
        if (run.attemptId == null) {
            run.attemptId = app.store.createQuizAttempt(
                config.mode, config.topicIds.singleOrNull(),
                ContentJson.encodeToString(QuizConfig.serializer(), config), run.questionIds.size,
            )
        }
    }

    val questions = remember(run.questionIds) { run.questionIds.mapNotNull { app.content.questionById[it] } }
    val title = config.title ?: "演習"
    var confirmLeave by remember { mutableStateOf(false) }
    val hasAnswers = run.answers.isNotEmpty() && !run.finished
    BackHandler(enabled = hasAnswers) { confirmLeave = true }
    val requestBack: () -> Unit = { if (hasAnswers) confirmLeave = true else nav.back() }

    if (run.finished) {
        QuizResultScreen(run, questions, title, nav)
    } else {
        QuizRunView(run, questions, title, nav, onBack = requestBack)
    }

    if (confirmLeave) {
        AlertDialog(
            onDismissRequest = { confirmLeave = false },
            title = { Text("演習を中断しますか？") },
            text = {
                Text(
                    if (run.instant) "回答済みの ${run.answers.size} 問は保存されています。"
                    else "「最後にまとめて答え合わせ」では、結果を見る前に中断すると回答は保存されません。",
                )
            },
            confirmButton = {
                TextButton(onClick = {
                    confirmLeave = false
                    scope.launch {
                        val id = run.attemptId
                        // only instant-feedback answers were written to the store
                        if (id != null && run.instant) app.store.updateQuizAttempt(id, run.answers.size, run.correctCount, false)
                        nav.back()
                    }
                }) { Text("中断する", color = Sg.colors.destructiveForeground) }
            },
            dismissButton = { TextButton(onClick = { confirmLeave = false }) { Text("続ける") } },
        )
    }
}

@OptIn(androidx.compose.foundation.ExperimentalFoundationApi::class)
@Composable
private fun QuizRunView(run: QuizRun, questions: List<Question>, title: String, nav: Navigator, onBack: () -> Unit) {
    val app = LocalApp.current
    val scope = rememberCoroutineScope()
    val config = run.config!!
    val question = questions.getOrNull(run.index.coerceIn(0, questions.lastIndex)) ?: return
    val answer = run.answers[question.id]
    val instant = run.instant
    val revealed = instant && answer != null
    val last = run.index == questions.lastIndex
    var finishing by remember { mutableStateOf(false) }
    var confirmFinish by remember { mutableStateOf(false) }

    // elapsed time of the question currently on screen
    val shownAt = remember(run.index) { SystemClock.elapsedRealtime() }
    val scroll = rememberScrollState()
    LaunchedEffect(run.index) { scroll.scrollTo(0) }
    val explanationRequester = remember { BringIntoViewRequester() }
    LaunchedEffect(revealed, run.index) {
        if (revealed) { delay(120); explanationRequester.bringIntoView() }
    }

    fun finish() {
        if (finishing) return
        finishing = true
        scope.launch {
            withContext(NonCancellable) {
                if (!instant) {
                    for (q in questions) {
                        val a = run.answers[q.id] ?: continue
                        app.store.recordAnswer(q, a.selected, config.mode, a.elapsedMs, run.attemptId)
                    }
                }
                val now = System.currentTimeMillis()
                run.attemptId?.let { app.store.updateQuizAttempt(it, run.answers.size, run.correctCount, true) }
                val minutes = Math.round((now - run.startedAt) / 60000.0).toInt().coerceIn(1, 300)
                app.store.recordStudySession(minutes, "quiz")
                run.finishedAt = now
                run.finished = true
            }
        }
    }

    fun confirmAnswer() {
        val selected = run.pending ?: return
        val rec = AnswerRec(selected, selected == question.correctOptionId, SystemClock.elapsedRealtime() - shownAt)
        run.answers[question.id] = rec
        run.pending = null
        scope.launch { app.store.recordAnswer(question, selected, config.mode, rec.elapsedMs, run.attemptId) }
    }

    fun requestFinish() {
        if (run.answers.size < questions.size) confirmFinish = true else finish()
    }

    ScreenFrame(title, onBack = onBack, actions = {
        BookmarkButton("question", question.id)
    }) { padding ->
        Column(Modifier.padding(padding).fillMaxSize()) {
            // progress header
            Column(Modifier.padding(horizontal = ScreenPadding), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        "問 ${run.index + 1} / ${questions.size}",
                        style = MaterialTheme.typography.titleSmall.copy(fontFamily = FontFamily.Monospace),
                    )
                    Text("解答済み ${run.answers.size}", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
                    Spacer(Modifier.weight(1f))
                    ElapsedClock(run.startedAt)
                    TextButton(onClick = ::requestFinish, enabled = !finishing && run.answers.isNotEmpty()) {
                        Text(if (finishing) "採点中…" else "結果を見る", style = MaterialTheme.typography.labelLarge)
                    }
                }
                SgProgressBar((run.index + 1f) / questions.size, height = 4.dp)
            }

            // question body
            Column(
                Modifier.weight(1f).verticalScroll(scroll).padding(horizontal = ScreenPadding).padding(top = 12.dp, bottom = 24.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp),
            ) {
                QuestionMetaChips(question)
                QuestionBody(
                    question, nav,
                    stateOf = { id ->
                        when {
                            revealed -> when {
                                id == question.correctOptionId -> OptionState.Correct
                                id == answer.selected -> OptionState.Wrong
                                else -> OptionState.Dimmed
                            }
                            instant -> if (run.pending == id) OptionState.Selected else OptionState.Idle
                            else -> if (answer?.selected == id) OptionState.Selected else OptionState.Idle
                        }
                    },
                    onSelect = if (revealed) null else { id ->
                        if (instant) run.pending = id
                        else run.answers[question.id] = AnswerRec(id, id == question.correctOptionId, SystemClock.elapsedRealtime() - shownAt)
                    },
                )
                if (revealed) {
                    ExplanationPanel(question, nav, answer.selected, Modifier.bringIntoViewRequester(explanationRequester))
                }
            }

            // action bar
            Divider()
            Row(
                Modifier.fillMaxWidth().padding(horizontal = ScreenPadding, vertical = 10.dp).navigationBarsPadding(),
                verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                OutlinedIconButton(
                    onClick = { run.index -= 1; run.pending = null }, enabled = run.index > 0,
                    modifier = Modifier.size(48.dp), border = BorderStroke(1.dp, Sg.colors.input),
                ) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "前の問題") }

                val primaryText: String
                val primaryEnabled: Boolean
                val primaryAction: () -> Unit
                when {
                    instant && !revealed -> { primaryText = "回答する"; primaryEnabled = run.pending != null; primaryAction = ::confirmAnswer }
                    last -> { primaryText = "結果を見る"; primaryEnabled = !finishing; primaryAction = ::requestFinish }
                    else -> { primaryText = "次の問題へ"; primaryEnabled = true; primaryAction = { run.index += 1; run.pending = null } }
                }
                PrimaryButton(primaryText, primaryAction, Modifier.weight(1f), enabled = primaryEnabled)

                OutlinedIconButton(
                    onClick = { run.index += 1; run.pending = null }, enabled = !last,
                    modifier = Modifier.size(48.dp), border = BorderStroke(1.dp, Sg.colors.input),
                ) { Icon(Icons.AutoMirrored.Filled.ArrowForward, "次の問題") }
            }
        }
    }

    if (confirmFinish) {
        AlertDialog(
            onDismissRequest = { confirmFinish = false },
            title = { Text("結果を見ますか？") },
            text = { Text("未回答の問題が ${questions.size - run.answers.size} 問あります。未回答は不正解として扱われます。") },
            confirmButton = { TextButton(onClick = { confirmFinish = false; finish() }) { Text("結果を見る") } },
            dismissButton = { TextButton(onClick = { confirmFinish = false }) { Text("続ける") } },
        )
    }
}

/** Ticking mm:ss since [startedAt]; isolated so only this text recomposes every second. */
@Composable
private fun ElapsedClock(startedAt: Long) {
    var now by remember { mutableLongStateOf(System.currentTimeMillis()) }
    LaunchedEffect(Unit) { while (true) { delay(1000); now = System.currentTimeMillis() } }
    Text(
        formatClock(((now - startedAt) / 1000).toInt()),
        style = MaterialTheme.typography.labelLarge.copy(fontFamily = FontFamily.Monospace), color = Sg.colors.mutedForeground,
    )
}
