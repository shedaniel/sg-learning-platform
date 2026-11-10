package app.sgstudy.ui.stats

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import app.sgstudy.LocalApp
import app.sgstudy.data.RawAttempt
import app.sgstudy.logic.*
import app.sgstudy.rememberProgress
import app.sgstudy.ui.components.*
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.theme.Sg
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId

private val MONO = FontFamily.Monospace

private fun accTone(a: Int): Tone = when { a >= 80 -> Tone.Success; a >= 60 -> Tone.Warning; else -> Tone.Danger }

@Composable
private fun masteryTone(m: Mastery): Tone = when (m) {
    Mastery.Mastered -> Tone.Success
    Mastery.Proficient -> Tone.Info
    Mastery.Developing -> Tone.Warning
    Mastery.Learning -> Tone.Neutral
    Mastery.NotStarted -> Tone.Neutral
}

@Composable
fun StatisticsScreen(nav: Navigator) {
    val snapshot by rememberProgress()
    ScrollScreen("統計", onBack = nav::back) {
        val s = snapshot
        if (s == null) {
            Box(Modifier.fillMaxWidth().padding(vertical = 64.dp), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = Sg.colors.mutedForeground)
            }
        } else StatsContent(s, nav)
    }
}

@Composable
private fun ColumnScope.StatsContent(s: ProgressSnapshot, nav: Navigator) {
    val content = LocalApp.current.content
    val attemptedTopics = s.topics.filter { it.attempts > 0 }

    Text(
        "正答率だけでなく、分野の広がり・復習の滞留・模擬試験の推移を確認します。準備度は本アプリ独自の暫定指標です。",
        style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground,
    )

    // --- overall numbers
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
        StatTile("解答数", "${s.attemptCount}", Modifier.weight(1f), sub = "${s.uniqueQuestionsAttempted}問 / ${s.questionCount}問")
        StatTile(
            "全体正答率", if (s.attemptCount > 0) "${s.accuracy}%" else "—", Modifier.weight(1f),
            tone = if (s.attemptCount > 0) accTone(s.accuracy) else Tone.Neutral,
            sub = if (s.attemptCount > 0) "直近 ${s.recentAccuracy}%" else "未演習",
        )
    }
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
        StatTile("演習した分野", "${attemptedTopics.size}/${s.topics.size}", Modifier.weight(1f), sub = "1問以上の解答")
        StatTile(
            "暫定準備度", "${s.readiness.score}/100", Modifier.weight(1f),
            sub = "信頼度 " + (mapOf("high" to "高", "medium" to "中", "low" to "低")[s.readiness.confidence] ?: ""),
        )
    }

    // --- accuracy trend
    SectionTitle("正答率の推移")
    TrendCard(s.allAttempts)

    // --- mastery distribution
    SectionTitle("習得の分布")
    MasteryCard(s)

    // --- by area
    SectionTitle("分野別の正答率")
    SgCard {
        s.areaProgress.forEachIndexed { i, a ->
            if (i > 0) Spacer(Modifier.height(14.dp))
            Column(Modifier.fillMaxWidth().clickable { nav.openArea(a.areaId) }) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(a.title, style = MaterialTheme.typography.titleSmall, modifier = Modifier.weight(1f), maxLines = 1, overflow = TextOverflow.Ellipsis)
                    Text(
                        if (a.attempts > 0) "${a.accuracy}% · ${a.attempts}回" else "未演習",
                        style = MaterialTheme.typography.labelMedium.copy(fontFamily = MONO), color = Sg.colors.mutedForeground,
                    )
                }
                Spacer(Modifier.height(6.dp))
                SgProgressBar(
                    a.accuracy / 100f, height = 8.dp,
                    color = when (accTone(a.accuracy)) { Tone.Success -> Sg.colors.success; Tone.Warning -> Sg.colors.warning; else -> Sg.colors.destructive },
                )
            }
        }
    }

    // --- by topic
    SectionTitle("分野別の習熟度")
    if (attemptedTopics.isEmpty()) {
        Text("まだ演習データがありません。", style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)
    } else {
        Text("正答率が低い順。タップでその分野の10問を演習します。", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
        SgCard(contentPadding = 4.dp) {
            attemptedTopics.sortedWith(compareBy<TopicProgress> { it.accuracy }.thenByDescending { it.attempts }).forEachIndexed { i, t ->
                if (i > 0) Divider(Modifier.padding(horizontal = 12.dp))
                ListRow(
                    t.topic.title, Modifier.padding(horizontal = 12.dp),
                    subtitle = "${t.attempts}回 · ${t.uniqueAttempted}/${t.questionCount}問",
                    onClick = { nav.startQuiz(QuizConfig(topicIds = listOf(t.topic.id), count = 10, mode = "topic", title = t.topic.title)) },
                    trailing = {
                        Column(horizontalAlignment = Alignment.End, verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text("${t.accuracy}%", style = MaterialTheme.typography.titleMedium.copy(fontFamily = MONO), color = accTone(t.accuracy).color())
                            Badge(t.mastery.label, masteryTone(t.mastery))
                        }
                    },
                )
            }
        }
    }

    // --- mock history
    SectionTitle("模擬試験の推移")
    if (s.mockHistory.isEmpty()) {
        Text("まだ模擬試験の記録がありません。", style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)
        SecondaryButton("60問に挑戦する", nav::openMock)
    } else {
        if (s.mockHistory.size >= 2) {
            SgCard {
                val pts = s.mockHistory.take(10).reversed().map { m ->
                    val d = runCatching { Instant.parse(m.startedAt).atZone(ZoneId.systemDefault()).toLocalDate() }.getOrNull()
                    TrendPoint(d?.let { "${it.monthValue}/${it.dayOfMonth}" } ?: "", percent(m.correct, m.total), m.total)
                }
                TrendChart(pts, description = "模擬試験の得点率の推移")
            }
        }
        SgCard(contentPadding = 4.dp) {
            s.mockHistory.take(8).forEachIndexed { i, m ->
                if (i > 0) Divider(Modifier.padding(horizontal = 12.dp))
                ListRow(
                    formatDateTime(m.startedAt), Modifier.padding(horizontal = 12.dp),
                    subtitle = "${m.correct}/${m.total}問 · ${formatDuration(m.durationSec)}",
                    onClick = { nav.openMockResult(m.id) },
                    trailing = {
                        Text("${percent(m.correct, m.total)}%", style = MaterialTheme.typography.titleMedium.copy(fontFamily = MONO))
                        Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, null, tint = Sg.colors.mutedForeground)
                    },
                )
            }
        }
    }

    // --- quiz history
    SectionTitle("演習の履歴")
    if (s.quizHistory.isEmpty()) {
        Text("まだ演習の履歴がありません。", style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)
    } else {
        SgCard(contentPadding = 4.dp) {
            s.quizHistory.take(10).forEachIndexed { i, q ->
                if (i > 0) Divider(Modifier.padding(horizontal = 12.dp))
                val acc = percent(q.correct, q.answered)
                ListRow(
                    (MODE_LABEL[q.mode] ?: q.mode) + (q.topicId?.let { " · " + content.topicName(it) } ?: ""),
                    Modifier.padding(horizontal = 12.dp),
                    subtitle = "${formatDateTime(q.startedAt)} · ${q.answered}/${q.total}問" + if (q.completedAt == null) " · 途中" else "",
                    trailing = {
                        if (q.answered > 0) Text("${acc}%", style = MaterialTheme.typography.titleMedium.copy(fontFamily = MONO), color = accTone(acc).color())
                        else Text("—", color = Sg.colors.mutedForeground)
                    },
                )
            }
        }
    }

    // --- weakest questions
    val weakest = s.questionProgress.values.filter { it.attempts > 0 && it.correct < it.attempts }
        .sortedWith(compareBy<QuestionProgress> { percent(it.correct, it.attempts) }.thenByDescending { it.attempts }).take(8)
    if (weakest.isNotEmpty()) {
        SectionTitle("つまずきやすい問題")
        SgCard(contentPadding = 4.dp) {
            weakest.forEachIndexed { i, p ->
                if (i > 0) Divider(Modifier.padding(horizontal = 12.dp))
                val acc = percent(p.correct, p.attempts)
                Row(
                    Modifier.fillMaxWidth().clickable { nav.openQuestion(p.question.id) }.padding(horizontal = 12.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    Column(Modifier.weight(1f)) {
                        Text(p.question.stem, style = MaterialTheme.typography.bodyMedium, maxLines = 2, overflow = TextOverflow.Ellipsis)
                        Text("${p.correct}/${p.attempts}回正解 · ${content.topicName(p.question.topicIds.firstOrNull() ?: "")}", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground, maxLines = 1, overflow = TextOverflow.Ellipsis)
                    }
                    Text("$acc%", style = MaterialTheme.typography.titleMedium.copy(fontFamily = MONO), color = accTone(acc).color())
                }
            }
        }
    }

    // --- time per question
    TimeCard(s)

    // --- breakdown
    SectionTitle("学習の内訳")
    SgCard(contentPadding = 4.dp) {
        val rows = listOf(
            "レッスン" to "${s.completedLessons}/${s.lessonCount}",
            "用語" to "${s.learnedTermIds.size}/${s.termCount}",
            "復習待ち" to "${s.dueCount}",
            "ブックマーク" to "${s.bookmarks.size}",
        )
        rows.forEachIndexed { i, (k, v) ->
            if (i > 0) Divider(Modifier.padding(horizontal = 12.dp))
            Row(Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 12.dp), verticalAlignment = Alignment.CenterVertically) {
                Text(k, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground, modifier = Modifier.weight(1f))
                Text(v, style = MaterialTheme.typography.titleMedium.copy(fontFamily = MONO))
            }
        }
    }
    val modes = s.allAttempts.groupingBy { it.mode }.eachCount()
    if (modes.isNotEmpty()) {
        Text(
            "解答の内訳：" + modes.entries.sortedByDescending { it.value }.joinToString("、") { "${MODE_LABEL[it.key] ?: it.key} ${it.value}回" },
            style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
        )
    }
    Text(
        s.readiness.note + "準備度は、レッスン完了率25%、直近正答率35%、分野の広がり20%、模擬試験20%の独自加重です。データが少ないほど信頼度は低くなります。",
        style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
    )
}

/** Accuracy trend, either per 10 answers (last 12 buckets, like the web) or per calendar day (last 14 days with data). */
@Composable
private fun TrendCard(attempts: List<RawAttempt>) {
    var byDay by rememberSaveable { mutableStateOf(false) }
    val points = remember(attempts, byDay) {
        if (!byDay) {
            attempts.chunked(10).mapIndexed { i, chunk ->
                TrendPoint("${i * 10 + 1}", percent(chunk.count { it.correct }, chunk.size), chunk.size)
            }.takeLast(12)
        } else {
            val zone = ZoneId.systemDefault()
            val perDay = attempts.groupBy { a -> runCatching { Instant.parse(a.attemptedAt).atZone(zone).toLocalDate() }.getOrNull() }
                .filterKeys { it != null }
            val today = LocalDate.now(zone)
            (13 downTo 0).map { back ->
                val d = today.minusDays(back.toLong())
                val list = perDay[d]
                TrendPoint("${d.monthValue}/${d.dayOfMonth}", list?.let { percent(it.count { a -> a.correct }, it.size) }, list?.size ?: 0)
            }
        }
    }
    SgCard {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            ChoiceChip("10問ごと", !byDay, { byDay = false })
            ChoiceChip("日別（14日）", byDay, { byDay = true })
        }
        Spacer(Modifier.height(12.dp))
        if (points.none { it.value != null }) {
            Box(Modifier.fillMaxWidth().height(100.dp), contentAlignment = Alignment.Center) {
                Text("演習すると正答率の推移が表示されます", style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)
            }
        } else {
            TrendChart(points)
            Spacer(Modifier.height(8.dp))
            Text(
                if (byDay) "1日に解いた問題の正答率。解答のない日は線が途切れます。"
                else "10問ごと・直近12区間。後半で下がっている場合は、難易度の高い科目Bや未学習分野に進んだ影響もあります。",
                style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
            )
        }
    }
}

@Composable
private fun MasteryCard(s: ProgressSnapshot) {
    val counts = s.topics.groupingBy { it.mastery }.eachCount()
    val rows = listOf(
        Triple(Mastery.Mastered, Sg.colors.success, "習得"),
        Triple(Mastery.Proficient, Sg.colors.info, "準習得"),
        Triple(Mastery.Developing, Sg.colors.warning, "要強化"),
        Triple(Mastery.Learning, Sg.colors.chart.getOrElse(3) { Sg.colors.warning }, "学習中"),
        Triple(Mastery.NotStarted, Sg.colors.mutedForeground, "未着手"),
    )
    SgCard {
        Text("レッスン閲覧ではなく、複数回の解答に基づく判定です。", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
        Spacer(Modifier.height(12.dp))
        rows.forEachIndexed { i, (m, color, label) ->
            if (i > 0) Spacer(Modifier.height(12.dp))
            val n = counts[m] ?: 0
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(label, style = MaterialTheme.typography.bodyMedium, modifier = Modifier.weight(1f))
                Text("$n トピック", style = MaterialTheme.typography.labelMedium.copy(fontFamily = MONO), color = Sg.colors.mutedForeground)
            }
            Spacer(Modifier.height(5.dp))
            SgProgressBar(n / maxOf(1, s.topics.size).toFloat(), color = color, height = 6.dp)
        }
    }
}

/** Time per question: overall average, per part, and the slowest questions (from attempts that recorded a time). */
@Composable
private fun ColumnScope.TimeCard(s: ProgressSnapshot) {
    val content = LocalApp.current.content
    val timed = remember(s.allAttempts) { s.allAttempts.filter { it.elapsedMs > 0 } }
    if (timed.isEmpty()) return
    SectionTitle("1問あたりの解答時間")
    fun avgSec(list: List<RawAttempt>) = if (list.isEmpty()) null else list.sumOf { it.elapsedMs } / list.size / 1000.0
    val partA = timed.filter { content.questionById[it.questionId]?.part == "A" }
    val partB = timed.filter { content.questionById[it.questionId]?.part == "B" }
    val sorted = timed.map { it.elapsedMs }.sorted()
    val median = sorted[sorted.size / 2] / 1000.0
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
        StatTile("平均", avgSec(timed)?.let { "%.0f秒".format(it) } ?: "—", Modifier.weight(1f), sub = "中央値 %.0f秒".format(median))
        StatTile("科目A / 科目B", "${avgSec(partA)?.let { "%.0f".format(it) } ?: "—"} / ${avgSec(partB)?.let { "%.0f".format(it) } ?: "—"}秒", Modifier.weight(1f), sub = "本番は1問あたり約2分")
    }
    val slow = s.questionProgress.values.filter { it.attempts > 0 && it.averageMs > 0 }.sortedByDescending { it.averageMs }.take(5)
    if (slow.isNotEmpty()) {
        Text("時間がかかっている問題", style = MaterialTheme.typography.titleSmall)
        SgCard(contentPadding = 4.dp) {
            slow.forEachIndexed { i, p ->
                if (i > 0) Divider(Modifier.padding(horizontal = 12.dp))
                Row(Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 12.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text(p.question.stem, style = MaterialTheme.typography.bodyMedium, maxLines = 2, overflow = TextOverflow.Ellipsis, modifier = Modifier.weight(1f))
                    Text("${p.averageMs / 1000}秒", style = MaterialTheme.typography.titleSmall.copy(fontFamily = MONO))
                }
            }
        }
    }
}
