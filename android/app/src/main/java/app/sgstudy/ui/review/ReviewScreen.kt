package app.sgstudy.ui.review

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import app.sgstudy.LocalApp
import app.sgstudy.data.model.Question
import app.sgstudy.logic.QuizConfig
import app.sgstudy.logic.formatDateTime
import app.sgstudy.rememberProgress
import app.sgstudy.ui.components.*
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.practice.sourceLabel
import app.sgstudy.ui.theme.Sg

/** Spaced-repetition hub. Port of src/app/review/page.tsx. */
@Composable
fun ReviewScreen(nav: Navigator) {
    val app = LocalApp.current
    val content = app.content
    val c = Sg.colors
    val snapshot by rememberProgress()
    val snap = snapshot

    ScreenFrame("復習") { padding ->
        if (snap == null) {
            Box(Modifier.padding(padding).fillMaxSize())
            return@ScreenFrame
        }

        val dueQuestionIds = snap.dueReviews.filter { it.itemType == "question" && it.itemId in content.questionById }
            .map { it.itemId }.take(20)
        val missed = snap.reviewQuestions
        val nothingToReview = dueQuestionIds.isEmpty() && missed.isEmpty()

        fun startReview() {
            val config = when {
                dueQuestionIds.isNotEmpty() -> QuizConfig(questionIds = dueQuestionIds, count = dueQuestionIds.size)
                missed.isNotEmpty() -> missed.take(15).map { it.id }.let { QuizConfig(questionIds = it, count = it.size) }
                else -> QuizConfig(preferWeak = snap.weakTopics.map { it.topic.id }, count = 10)
            }
            nav.startQuiz(config.copy(mode = "review", instantFeedback = true, title = "復習"))
        }

        val dueItems = snap.dueReviews.filter {
            when (it.itemType) {
                "question" -> it.itemId in content.questionById
                "term" -> it.itemId in content.termById
                else -> it.itemId in content.lessonById
            }
        }
        val bookmarkedQuestions = snap.bookmarks.filter { it.itemType == "question" }.mapNotNull { content.questionById[it.itemId] }
        val bookmarkedTerms = snap.bookmarks.filter { it.itemType == "term" }.mapNotNull { content.termById[it.itemId] }
        val bookmarkedLessons = snap.bookmarks.filter { it.itemType == "lesson" }.mapNotNull { content.lessonById[it.itemId] }

        LazyColumn(
            Modifier.padding(padding).fillMaxSize(),
            contentPadding = PaddingValues(start = ScreenPadding, end = ScreenPadding, top = 4.dp, bottom = 24.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            item("intro") {
                Text(
                    "誤答と期限の来た用語を、間隔反復で戻します。正解した問題も、時間を空けて再挑戦することで定着を確認します。",
                    style = MaterialTheme.typography.bodyMedium, color = c.mutedForeground,
                )
            }
            item("stats") {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    StatTile("期限到来", "${snap.dueCount}", Modifier.weight(1f), tone = if (snap.dueCount > 0) Tone.Warning else Tone.Neutral, sub = "件")
                    StatTile("前回誤答", "${missed.size}", Modifier.weight(1f), tone = if (missed.isNotEmpty()) Tone.Danger else Tone.Neutral, sub = "問")
                    StatTile("保存済み", "${snap.bookmarks.size}", Modifier.weight(1f), sub = "件")
                }
            }
            item("start") {
                if (nothingToReview) {
                    SgCard {
                        Text("復習する問題はまだありません", style = MaterialTheme.typography.titleSmall)
                        Spacer(Modifier.height(4.dp))
                        Text(
                            "問題を解いて間違えると、翌日以降の復習キューに自動で追加されます。",
                            style = MaterialTheme.typography.bodyMedium, color = c.mutedForeground,
                        )
                        Spacer(Modifier.height(12.dp))
                        PrimaryButton("問題を解く", nav::openPractice, Modifier.fillMaxWidth())
                    }
                } else {
                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        PrimaryButton("復習を始める", ::startReview, Modifier.fillMaxWidth())
                        Text(
                            when {
                                dueQuestionIds.isNotEmpty() -> "期限の来た問題 ${dueQuestionIds.size} 問から出題します"
                                missed.isNotEmpty() -> "期限の来た問題はありません。前回間違えた問題 ${minOf(15, missed.size)} 問から出題します"
                                else -> "弱点分野から10問出題します"
                            },
                            style = MaterialTheme.typography.bodySmall, color = c.mutedForeground,
                        )
                    }
                }
            }

            // ---- due queue
            item("queue-h") { SectionTitle("今日の復習キュー") }
            if (dueItems.isEmpty()) {
                item("queue-empty") {
                    Text(
                        "期限の来た復習はありません。新しく問題を解くと、誤答が翌日以降のキューに追加されます。",
                        style = MaterialTheme.typography.bodyMedium, color = c.mutedForeground,
                    )
                }
            } else {
                items(dueItems, key = { "due-${it.itemType}-${it.itemId}" }) { item ->
                    when (item.itemType) {
                        "question" -> {
                            val q = content.questionById.getValue(item.itemId)
                            NavRow(
                                title = q.stem, maxLines = 2, kind = "問題",
                                subtitle = "誤答 ${item.lapses}回 · 間隔 ${Math.round(item.intervalDays)}日",
                            ) { nav.openQuestion(q.id) }
                        }
                        "term" -> {
                            val t = content.termById.getValue(item.itemId)
                            NavRow(title = "${t.ja}（${t.en}）", kind = "用語", subtitle = t.shortJa, maxLines = 1) { nav.openTerm(t.id) }
                        }
                        else -> {
                            val l = content.lessonById.getValue(item.itemId)
                            NavRow(title = l.title, kind = "レッスン", subtitle = "読了済みの再確認", maxLines = 1) { nav.openLesson(l.id) }
                        }
                    }
                }
            }

            // ---- missed
            item("missed-h") {
                SectionTitle("直近で間違えた問題") {
                    Text("${missed.size}問", style = MaterialTheme.typography.bodySmall, color = c.mutedForeground)
                }
            }
            if (missed.isEmpty()) {
                item("missed-empty") { Text("誤答はありません。", style = MaterialTheme.typography.bodyMedium, color = c.mutedForeground) }
            } else {
                items(missed.take(10), key = { "missed-${it.id}" }) { q ->
                    NavRow(title = q.stem, maxLines = 2, kind = q.part, subtitle = questionSubtitle(q, content::topicName)) { nav.openQuestion(q.id) }
                }
            }

            // ---- bookmarks
            item("saved-h") { SectionTitle("保存したもの") }
            if (snap.bookmarks.isEmpty()) {
                item("saved-empty") {
                    Text(
                        "まだありません。問題・用語・レッスンのブックマークから保存できます。",
                        style = MaterialTheme.typography.bodyMedium, color = c.mutedForeground,
                    )
                }
            } else {
                if (bookmarkedQuestions.isNotEmpty()) {
                    item("saved-q-h") { GroupLabel("問題 ${bookmarkedQuestions.size}件") }
                    items(bookmarkedQuestions, key = { "bq-${it.id}" }) { q ->
                        NavRow(title = q.stem, maxLines = 2, kind = q.part, subtitle = questionSubtitle(q, content::topicName)) { nav.openQuestion(q.id) }
                    }
                }
                if (bookmarkedTerms.isNotEmpty()) {
                    item("saved-t-h") { GroupLabel("用語 ${bookmarkedTerms.size}件") }
                    items(bookmarkedTerms, key = { "bt-${it.id}" }) { t ->
                        NavRow(title = "${t.ja}（${t.en}）", maxLines = 1, subtitle = t.shortJa) { nav.openTerm(t.id) }
                    }
                }
                if (bookmarkedLessons.isNotEmpty()) {
                    item("saved-l-h") { GroupLabel("レッスン ${bookmarkedLessons.size}件") }
                    items(bookmarkedLessons, key = { "bl-${it.id}" }) { l ->
                        NavRow(title = l.title, maxLines = 1, subtitle = l.summary) { nav.openLesson(l.id) }
                    }
                }
            }

            // ---- explanation
            item("how") {
                SgCard(container = c.muted, borderColor = c.muted) {
                    Text("間隔反復の仕組み", style = MaterialTheme.typography.titleSmall)
                    Spacer(Modifier.height(6.dp))
                    Text(
                        "誤答は翌日に再出題。正解すると 1日 → 2.5日 → 約6日と間隔が伸びます。間違えると間隔がリセットされ、難しい問題ほど頻繁に戻ります。暗記ではなく、問題の理由づけを思い出すことを目的にしています。",
                        style = MaterialTheme.typography.bodyMedium, color = c.mutedForeground,
                    )
                    Spacer(Modifier.height(8.dp))
                    Text(
                        "復習キュー全体: ${snap.scheduledCount} 件",
                        style = MaterialTheme.typography.bodySmall.copy(fontFamily = FontFamily.Monospace), color = c.mutedForeground,
                    )
                }
            }
            item("updated") {
                Text(
                    "最終更新: ${snap.recentAttempts.firstOrNull()?.let { formatDateTime(it.attemptedAt) } ?: "—"}",
                    style = MaterialTheme.typography.bodySmall, color = c.mutedForeground,
                )
            }
        }
    }
}

private fun questionSubtitle(q: Question, topicName: (String) -> String): String =
    sourceLabel(q) + " · " + q.topicIds.joinToString("、") { topicName(it) }

@Composable
private fun GroupLabel(text: String) {
    Text(text, style = MaterialTheme.typography.labelLarge, color = Sg.colors.mutedForeground, modifier = Modifier.padding(top = 4.dp))
}

/** A flat tappable card row: optional kind badge, title, subtitle and chevron. */
@Composable
private fun NavRow(title: String, maxLines: Int, subtitle: String?, kind: String? = null, onClick: () -> Unit) {
    SgCard(onClick = onClick, contentPadding = 14.dp) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(
                    plainText(title), style = MaterialTheme.typography.bodyMedium, maxLines = maxLines, overflow = TextOverflow.Ellipsis,
                    color = Sg.colors.foreground,
                )
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    if (kind != null) Badge(kind, if (kind == "問題" || kind == "A" || kind == "B") Tone.Info else Tone.Neutral)
                    if (subtitle != null) Text(
                        plainText(subtitle), style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
                        maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.weight(1f, fill = false),
                    )
                }
            }
            Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, null, tint = Sg.colors.mutedForeground)
        }
    }
}

private val MARKUP = Regex("\\*\\*([^*]+)\\*\\*|`([^`]+)`|\\{\\{term:[^}|]+\\|([^}]+)\\}\\}|\\{\\{term:([^}]+)\\}\\}")

/** Strips the lesson mini-markup for single-line previews. */
private fun plainText(s: String) = MARKUP.replace(s) { m -> m.groupValues.drop(1).firstOrNull { it.isNotEmpty() } ?: "" }
