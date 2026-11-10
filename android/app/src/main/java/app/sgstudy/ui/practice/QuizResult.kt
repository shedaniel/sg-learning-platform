package app.sgstudy.ui.practice

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import app.sgstudy.LocalApp
import app.sgstudy.data.model.Question
import app.sgstudy.data.model.optionLabel
import app.sgstudy.logic.QuizConfig
import app.sgstudy.logic.formatClock
import app.sgstudy.logic.percent
import app.sgstudy.ui.components.*
import app.sgstudy.ui.lesson.BlockList
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.theme.Sg

/** Results of a finished run: score ring, per-topic breakdown and every question with its explanation. */
@Composable
fun QuizResultScreen(run: QuizRun, questions: List<Question>, title: String, nav: Navigator) {
    val app = LocalApp.current
    val c = Sg.colors
    val total = questions.size
    val correct = run.correctCount
    val acc = percent(correct, total)
    // wrong = answered incorrectly or left unanswered; only the former were added to the review queue
    val wrong = questions.filter { run.answers[it.id]?.correct != true }
    val wrongAnswered = run.answers.values.count { !it.correct }
    val seconds = ((run.finishedAt - run.startedAt) / 1000).toInt()
    var expanded by rememberSaveable { mutableStateOf(listOf<String>()) }

    // primary topic per question for the breakdown
    val byTopic = remember(questions) {
        questions.groupBy { it.topicIds.firstOrNull() ?: "" }.entries
            .sortedByDescending { it.value.size }
    }

    ScreenFrame("$title · 結果", onBack = nav::back) { padding ->
        LazyColumn(
            Modifier.padding(padding).fillMaxSize(),
            contentPadding = PaddingValues(start = ScreenPadding, end = ScreenPadding, top = 4.dp, bottom = 32.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            item("summary") {
                SgCard {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(20.dp)) {
                        ScoreRing(acc, size = 120.dp)
                        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text("$correct / $total 問正解", style = MaterialTheme.typography.headlineSmall)
                            Text("所要時間 ${formatClock(seconds)}", style = MaterialTheme.typography.bodyMedium, color = c.mutedForeground)
                            val unanswered = total - run.answers.size
                            if (unanswered > 0) Text("未回答 $unanswered 問", style = MaterialTheme.typography.bodyMedium, color = c.warningForeground)
                        }
                    }
                    Spacer(Modifier.height(12.dp))
                    Text(
                        when {
                            wrong.isEmpty() -> "全問正解です。時間を空けてもう一度解くと定着を確認できます。"
                            wrongAnswered > 0 -> "誤答 $wrongAnswered 問は自動的に復習キューへ追加されました。解説を読み、翌日にもう一度解いてください。"
                            else -> "未回答の問題があります。解説を読んで解き直してみましょう。"
                        },
                        style = MaterialTheme.typography.bodyMedium, color = c.mutedForeground,
                    )
                }
            }

            item("actions") {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    if (wrong.isNotEmpty()) {
                        PrimaryButton(
                            if (wrong.size > wrongAnswered) "間違えた・未回答の ${wrong.size} 問だけ解き直す" else "間違えた ${wrong.size} 問だけ解き直す",
                            {
                                nav.startQuiz(
                                    QuizConfig(
                                        questionIds = wrong.map { it.id }, count = wrong.size,
                                        mode = "review", instantFeedback = true, title = "解き直し",
                                    ),
                                )
                            },
                            Modifier.fillMaxWidth(),
                        )
                    }
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        SecondaryButton("復習キュー", nav::openReview, Modifier.weight(1f))
                        SecondaryButton("演習に戻る", nav::back, Modifier.weight(1f))
                    }
                }
            }

            if (byTopic.size > 1 || byTopic.firstOrNull()?.key?.isNotEmpty() == true) {
                item("topics-h") { SectionTitle("分野別の結果") }
                item("topics") {
                    SgCard {
                        byTopic.forEachIndexed { i, (topicId, qs) ->
                            if (i > 0) Spacer(Modifier.height(14.dp))
                            val ok = qs.count { run.answers[it.id]?.correct == true }
                            val p = percent(ok, qs.size)
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    app.content.topicName(topicId).ifEmpty { "その他" }, Modifier.weight(1f),
                                    style = MaterialTheme.typography.bodyMedium, maxLines = 2, overflow = TextOverflow.Ellipsis,
                                )
                                Spacer(Modifier.width(8.dp))
                                Text(
                                    "$ok/${qs.size}  $p%",
                                    style = MaterialTheme.typography.labelLarge.copy(fontFamily = FontFamily.Monospace),
                                )
                            }
                            Spacer(Modifier.height(6.dp))
                            SgProgressBar(p / 100f, color = if (p >= 70) c.success else if (p >= 50) c.warning else c.destructive)
                        }
                    }
                }
            }

            item("q-h") { SectionTitle("問題ごとの結果") }
            items(questions.size, key = { questions[it].id }) { i ->
                val q = questions[i]
                val a = run.answers[q.id]
                val open = q.id in expanded
                SgCard(contentPadding = 0.dp) {
                    Row(
                        Modifier.fillMaxWidth().clickable { expanded = if (open) expanded - q.id else expanded + q.id }.padding(14.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.Top,
                    ) {
                        ResultMark(a?.correct)
                        Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                            Text(
                                "問${i + 1} · ${if (q.part == "B") "科目B" else "科目A"} · ${sourceLabel(q)}",
                                style = MaterialTheme.typography.bodySmall, color = c.mutedForeground,
                            )
                            if (!open) Text(
                                rememberRichString(q.stem, null), maxLines = 2, overflow = TextOverflow.Ellipsis,
                                style = MaterialTheme.typography.bodyMedium, color = c.foreground,
                            )
                            Text(
                                if (a == null) "未回答 · 正答 ${optionLabel(q.correctOptionId)}"
                                else if (a.correct) "あなたの答え ${optionLabel(a.selected)} · 正解"
                                else "あなたの答え ${optionLabel(a.selected)} · 正答 ${optionLabel(q.correctOptionId)}",
                                style = MaterialTheme.typography.labelMedium,
                                color = if (a?.correct == true) c.successForeground else if (a == null) c.mutedForeground else c.destructiveForeground,
                            )
                        }
                        Icon(if (open) Icons.Filled.ExpandLess else Icons.Filled.ExpandMore, if (open) "閉じる" else "解説を開く", tint = c.mutedForeground)
                    }
                    if (open) {
                        Column(Modifier.padding(start = 14.dp, end = 14.dp, bottom = 14.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                            RichText(q.stem, nav, style = MaterialTheme.typography.bodyMedium)
                            q.presentation?.takeIf { it.isNotEmpty() }?.let { BlockList(it, nav) }
                            ExplanationPanel(q, nav, a?.selected)
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                SecondaryButton("この問題を開く", { nav.openQuestion(q.id) })
                                Spacer(Modifier.weight(1f))
                                BookmarkButton("question", q.id)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ResultMark(correct: Boolean?) {
    val c = Sg.colors
    val bg: Color = when (correct) { true -> c.success; false -> c.destructive; null -> c.mutedForeground }
    Box(Modifier.padding(top = 2.dp).size(24.dp).clip(CircleShape).background(bg), contentAlignment = Alignment.Center) {
        Icon(
            when (correct) { true -> Icons.Filled.Check; false -> Icons.Filled.Close; null -> Icons.Filled.Remove },
            null, Modifier.size(16.dp), tint = Color.White,
        )
    }
}
