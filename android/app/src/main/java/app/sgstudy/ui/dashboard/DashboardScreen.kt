package app.sgstudy.ui.dashboard

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Replay
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import app.sgstudy.LocalApp
import app.sgstudy.rememberProgress
import app.sgstudy.logic.*
import app.sgstudy.ui.components.*
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.stats.BarChart
import app.sgstudy.ui.stats.BarPoint
import app.sgstudy.ui.theme.Sg
import app.sgstudy.ui.theme.areaColor
import java.time.LocalDate
import java.time.ZoneOffset

/** Tone for an accuracy percentage: ≥80 good, ≥60 middling, below that weak. */
internal fun accuracyTone(accuracy: Int): Tone = when {
    accuracy >= 80 -> Tone.Success
    accuracy >= 60 -> Tone.Warning
    else -> Tone.Danger
}

private val CONFIDENCE_LABEL = mapOf("high" to "高", "medium" to "中", "low" to "低")
private val MONO = FontFamily.Monospace

/**
 * Tab 概要. Factual progress only — no streaks, quotas or goals (DECISIONS.md "Learner pace").
 */
@Composable
fun DashboardScreen(nav: Navigator) {
    val snapshot by rememberProgress()
    ScrollScreen(
        "概要",
        actions = {
            IconButton(onClick = nav::openSearch) { Icon(Icons.Filled.Search, contentDescription = "検索") }
            IconButton(onClick = nav::openSettings) { Icon(Icons.Filled.Settings, contentDescription = "設定") }
        },
    ) {
        val s = snapshot
        if (s == null) {
            Box(Modifier.fillMaxWidth().padding(vertical = 64.dp), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = Sg.colors.mutedForeground)
            }
        } else {
            DashboardContent(s, nav)
        }
    }
}

@Composable
private fun ColumnScope.DashboardContent(s: ProgressSnapshot, nav: Navigator) {
    val content = LocalApp.current.content
    val hasActivity = s.completedLessons > 0 || s.attemptCount > 0

    Text(
        "読んだだけでは習得とみなさず、複数回の解答で判定します。",
        style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground,
    )

    // --- next lesson / first-run
    val next = s.nextLessons.firstOrNull()
    if (next != null) {
        SgCard(container = Sg.colors.muted, contentPadding = 18.dp) {
            Text(if (!hasActivity) "最初のレッスン" else "次のレッスン", style = MaterialTheme.typography.labelMedium, color = Sg.colors.mutedForeground)
            Spacer(Modifier.height(4.dp))
            Text(next.title, style = MaterialTheme.typography.titleLarge)
            Spacer(Modifier.height(4.dp))
            Text(next.summary, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground, maxLines = 3, overflow = TextOverflow.Ellipsis)
            Spacer(Modifier.height(4.dp))
            Text("${next.readingMinutes}分 · ${next.sections.size}セクション", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
            Spacer(Modifier.height(14.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                PrimaryButton(if (s.completedLessons == 0) "読み始める" else "続きを読む", { nav.openLesson(next.id) }, Modifier.weight(1f))
                SecondaryButton("先に問題を解く", {
                    nav.startQuiz(QuizConfig(lessonIds = listOf(next.id), count = 10, mode = "lesson", title = next.title))
                }, Modifier.weight(1f))
            }
        }
    }

    if (!hasActivity) {
        SgCard(contentPadding = 18.dp) {
            Text("まずは学習タブから", style = MaterialTheme.typography.titleMedium)
            Spacer(Modifier.height(6.dp))
            Text(
                "まずは学習タブから、気になる分野のレッスンを読んでみましょう。レッスンを読んだり問題を解いたりすると、ここに進捗・正答率・復習待ち・暫定準備度が表示されます。順番は自由で、毎日の目標や連続記録はありません。",
                style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground,
            )
            Spacer(Modifier.height(14.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                PrimaryButton("学習タブを開く", nav::openLearn, Modifier.weight(1f))
                SecondaryButton("10問クイズ", { nav.startQuiz(QuizConfig(count = 10, mode = "custom")) }, Modifier.weight(1f))
            }
        }
    }

    // --- headline progress
    SectionTitle("これまでの記録")
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
        StatTile("レッスン完了", "${s.completedLessons}/${s.lessonCount}", Modifier.weight(1f), sub = "${s.lessonPercent}%")
        StatTile("覚えた用語", "${s.learnedTermIds.size}/${s.termCount}", Modifier.weight(1f), sub = "${s.termPercent}%")
    }
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
        StatTile(
            "直近の正答率", if (s.attemptCount > 0) "${s.recentAccuracy}%" else "—", Modifier.weight(1f),
            tone = if (s.attemptCount > 0) accuracyTone(s.recentAccuracy) else Tone.Neutral,
            sub = if (s.attemptCount > 0) "直近${minOf(120, s.attemptCount)}回・全体${s.accuracy}%" else "未演習",
        )
        StatTile("解答数", "${s.attemptCount}", Modifier.weight(1f), sub = "${s.uniqueQuestionsAttempted} / ${s.questionCount}問")
    }

    // --- due reviews
    DueReviewCard(s, nav)

    // --- readiness
    ReadinessCard(s.readiness, hasActivity)

    // --- weak topics
    SectionTitle("伸ばしたい分野")
    if (s.weakTopics.isEmpty()) {
        Text("5〜10問解くと、誤答の多い分野がここに表示されます。", style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)
        if (!hasActivity && s.nextLessons.size > 1) {
            SgCard(contentPadding = 4.dp) {
                s.nextLessons.drop(1).take(3).forEachIndexed { i, l ->
                    if (i > 0) Divider(Modifier.padding(horizontal = 12.dp))
                    ListRow(l.title, Modifier.padding(horizontal = 12.dp), subtitle = "${l.readingMinutes}分", onClick = { nav.openLesson(l.id) },
                        trailing = { Chevron() })
                }
            }
        }
    } else {
        SgCard(contentPadding = 4.dp) {
            s.weakTopics.take(5).forEachIndexed { i, t ->
                if (i > 0) Divider(Modifier.padding(horizontal = 12.dp))
                ListRow(
                    t.topic.title, Modifier.padding(horizontal = 12.dp),
                    subtitle = "${t.attempts}回 · ${t.mastery.label} · タップで演習",
                    onClick = { nav.startQuiz(QuizConfig(topicIds = listOf(t.topic.id), count = 10, mode = "topic", title = t.topic.title)) },
                    trailing = { Text("${t.accuracy}%", style = MaterialTheme.typography.titleMedium.copy(fontFamily = MONO), color = accuracyTone(t.accuracy).color()) },
                )
            }
        }
    }

    // --- suggested lessons
    if (s.nextLessons.size > 1 || (next != null && hasActivity)) {
        SectionTitle("おすすめのレッスン", action = { TextLink("学習マップ", nav::openLearn) })
        SgCard(contentPadding = 4.dp) {
            s.nextLessons.forEachIndexed { i, l ->
                if (i > 0) Divider(Modifier.padding(horizontal = 12.dp))
                val weak = s.weakTopics.any { it.topic.id in l.topicIds }
                ListRow(
                    l.title, Modifier.padding(horizontal = 12.dp),
                    subtitle = "${content.areaById[l.areaId]?.shortTitle ?: ""} · ${l.readingMinutes}分" + if (weak) " · 弱点に関連" else "",
                    onClick = { nav.openLesson(l.id) }, trailing = { Chevron() },
                )
            }
        }
    }

    // --- per-area progress
    SectionTitle("分野ごとの進捗", action = { TextLink("学習マップ", nav::openLearn) })
    SgCard(contentPadding = 16.dp) {
        s.areaProgress.forEachIndexed { i, a ->
            val area = content.areaById[a.areaId]
            if (i > 0) Spacer(Modifier.height(14.dp))
            Column(Modifier.fillMaxWidth().clickable { nav.openArea(a.areaId) }) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(a.title, style = MaterialTheme.typography.titleSmall, modifier = Modifier.weight(1f), maxLines = 1, overflow = TextOverflow.Ellipsis)
                    Text("${a.completedLessons}/${a.totalLessons}", style = MaterialTheme.typography.labelMedium.copy(fontFamily = MONO), color = Sg.colors.mutedForeground)
                }
                Spacer(Modifier.height(6.dp))
                SgProgressBar(a.percent / 100f, color = if (area != null) areaColor(area.color) else Sg.colors.info, height = 8.dp)
            }
        }
    }

    // --- last mock
    val mock = s.mockHistory.firstOrNull()
    if (mock != null) {
        SectionTitle("模擬試験の結果", action = { TextLink("模擬試験へ", nav::openMock) })
        SgCard(onClick = nav::openMock) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    Text(formatDateTime(mock.startedAt), style = MaterialTheme.typography.bodyMedium)
                    Text("${mock.correct}/${mock.total}問 · ${formatDuration(mock.durationSec)}", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
                }
                Text("${percent(mock.correct, mock.total)}%", style = MaterialTheme.typography.headlineSmall.copy(fontFamily = MONO))
            }
        }
    }

    // --- 14-day activity
    SectionTitle("直近14日の学習時間")
    ActivityChart(s)

    // --- recent activity
    SectionTitle("最近の演習", action = if (s.recentAttempts.isNotEmpty()) ({ TextLink("復習へ", nav::openReview) }) else null)
    if (s.recentAttempts.isEmpty()) {
        Text("まだ解答履歴がありません。10問クイズから始められます。", style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)
        SecondaryButton("10問クイズ", { nav.startQuiz(QuizConfig(count = 10, mode = "custom")) })
    } else {
        SgCard(contentPadding = 4.dp) {
            s.recentAttempts.take(6).forEachIndexed { i, a ->
                if (i > 0) Divider(Modifier.padding(horizontal = 12.dp))
                val q = content.questionById[a.questionId]
                Row(
                    Modifier.fillMaxWidth().clickable(enabled = q != null) { nav.openQuestion(a.questionId) }.padding(horizontal = 12.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    Box(
                        Modifier.size(24.dp).clip(CircleShape).background(if (a.correct) Sg.colors.success else Sg.colors.destructive),
                        contentAlignment = Alignment.Center,
                    ) {
                        Icon(if (a.correct) Icons.Filled.Check else Icons.Filled.Close, if (a.correct) "正解" else "不正解", Modifier.size(15.dp), tint = androidx.compose.ui.graphics.Color.White)
                    }
                    Column(Modifier.weight(1f)) {
                        Text(q?.stem ?: a.questionId, style = MaterialTheme.typography.bodyMedium, maxLines = 2, overflow = TextOverflow.Ellipsis)
                        Text("${formatDateTime(a.attemptedAt)} · ${MODE_LABEL[a.mode] ?: a.mode}", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
                    }
                }
            }
        }
    }
}

@Composable
private fun Chevron() = Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, null, tint = Sg.colors.mutedForeground)

@Composable
private fun TextLink(text: String, onClick: () -> Unit) {
    Text(
        text, style = MaterialTheme.typography.labelLarge, color = Sg.colors.infoForeground,
        modifier = Modifier.clip(MaterialTheme.shapes.small).clickable(onClick = onClick).padding(horizontal = 8.dp, vertical = 10.dp),
    )
}

@Composable
private fun DueReviewCard(s: ProgressSnapshot, nav: Navigator) {
    val due = s.dueCount
    SgCard(onClick = nav::openReview, container = if (due > 0) Tone.Warning.container() else Sg.colors.card) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(14.dp)) {
            Icon(Icons.Filled.Replay, null, tint = if (due > 0) Sg.colors.warningForeground else Sg.colors.mutedForeground, modifier = Modifier.size(26.dp))
            Column(Modifier.weight(1f)) {
                Text(if (due > 0) "復習待ち $due 件" else "復習待ちはありません", style = MaterialTheme.typography.titleMedium)
                Text(
                    if (s.scheduledCount == 0) "間違えた問題や読んだレッスンが、間隔をあけて自動的に復習に追加されます。"
                    else if (due > 0) "全${s.scheduledCount}件のうち、今すぐ復習できるもの。タップして開く。"
                    else "全${s.scheduledCount}件が予定されています。",
                    style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
                )
            }
            Chevron()
        }
    }
}

@Composable
private fun ReadinessCard(r: Readiness, hasActivity: Boolean) {
    SgCard {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text("暫定準備度", style = MaterialTheme.typography.titleMedium, modifier = Modifier.weight(1f))
            Badge(
                "信頼度 ${CONFIDENCE_LABEL[r.confidence] ?: r.confidence}",
                when (r.confidence) { "high" -> Tone.Success; "medium" -> Tone.Warning; else -> Tone.Neutral },
            )
        }
        Spacer(Modifier.height(8.dp))
        Row(verticalAlignment = Alignment.Bottom) {
            Text("${r.score}", style = MaterialTheme.typography.displaySmall.copy(fontFamily = MONO, fontWeight = FontWeight.SemiBold))
            Text(" / 100", style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground, modifier = Modifier.padding(bottom = 6.dp))
        }
        Spacer(Modifier.height(6.dp))
        SgProgressBar(r.score / 100f, height = 8.dp)
        Spacer(Modifier.height(10.dp))
        Text(r.note, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
        if (!hasActivity) {
            Text("まだ学習データがないため、値は0から始まります。", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
        }
    }
}

/** Study minutes per day for the last 14 days; days without a session show an empty track. */
@Composable
private fun ActivityChart(s: ProgressSnapshot) {
    val today = remember { LocalDate.now(ZoneOffset.UTC) }
    val points = remember(s.studyDays, today) {
        val byDay = s.studyDays.associate { it.day to it.minutes }
        (13 downTo 0).map { back ->
            val d = today.minusDays(back.toLong())
            BarPoint(
                label = if (back == 0 || back == 13 || back == 7) "${d.monthValue}/${d.dayOfMonth}" else "",
                value = (byDay[d.toString()] ?: 0).toFloat(), highlight = back == 0,
            )
        }
    }
    val total = points.sumOf { it.value.toInt() }
    SgCard {
        if (total == 0) {
            Text("この期間の学習時間はまだ記録されていません。", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
            Spacer(Modifier.height(10.dp))
        } else {
            Text("合計 ${total}分", style = MaterialTheme.typography.titleSmall)
            Spacer(Modifier.height(10.dp))
        }
        BarChart(points, description = "直近14日の学習時間（分）", minMax = 10f)
    }
}
