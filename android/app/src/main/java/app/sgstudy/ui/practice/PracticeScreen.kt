package app.sgstudy.ui.practice

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.outlined.*
import androidx.compose.material.icons.automirrored.outlined.Article
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import app.sgstudy.LocalApp
import app.sgstudy.rememberProgress
import app.sgstudy.data.QuizHistoryRow
import app.sgstudy.logic.*
import app.sgstudy.ui.components.*
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.theme.Sg
import app.sgstudy.ui.theme.areaColor

fun masteryTone(m: Mastery): Tone = when (m) {
    Mastery.NotStarted -> Tone.Neutral
    Mastery.Learning -> Tone.Info
    Mastery.Developing -> Tone.Warning
    Mastery.Proficient, Mastery.Mastered -> Tone.Success
}

@Composable
fun PracticeScreen(nav: Navigator) {
    val app = LocalApp.current
    val content = app.content
    val c = Sg.colors
    val snapshot by rememberProgress()
    val snap = snapshot

    ScreenFrame("演習") { padding ->
        LazyColumn(
            Modifier.padding(padding).fillMaxSize(),
            contentPadding = PaddingValues(start = ScreenPadding, end = ScreenPadding, top = 4.dp, bottom = 24.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            // ---- summary
            item("stats") {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    StatTile("問題数", "${content.questions.size}", Modifier.weight(1f))
                    StatTile("解いた問題", "${snap?.uniqueQuestionsAttempted ?: 0}", Modifier.weight(1f))
                    StatTile(
                        "直近の正答率", if (snap != null && snap.attemptCount > 0) "${snap.recentAccuracy}%" else "—",
                        Modifier.weight(1f),
                    )
                }
            }

            // ---- quick start
            item("quick-h") { SectionTitle("すぐに始める") }
            item("quick") { QuickStart(nav, snap?.weakTopics?.map { it.topic.id }.orEmpty()) }

            // ---- mock exam + past papers
            item("entry") {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    EntryRow(Icons.Outlined.Timer, "60問 模擬試験", "本番と同じ120分・科目A/B 構成で通しで解く", nav::openMock)
                    EntryRow(Icons.Outlined.Description, "過去問・公開問題", "IPA公開問題と過去問題のPDFを年度別に", nav::openPastPapers)
                }
            }

            // ---- custom quiz
            item("custom-h") { SectionTitle("カスタム演習") }
            item("custom") { CustomQuizCard(nav) }

            // ---- topics by area
            item("topics-h") { SectionTitle("分野別に解く") }
            for (area in content.areas) {
                val topics = content.topicsOfArea(area.id).filter { content.questionsForTopic(it.id).isNotEmpty() }
                if (topics.isEmpty()) continue
                val attempts = snap?.topics?.filter { it.topic.areaId == area.id }?.sumOf { it.attempts } ?: 0
                item("area-${area.id}") {
                    Row(Modifier.fillMaxWidth().padding(top = 8.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Box(Modifier.size(10.dp).clip(CircleShape).background(areaColor(area.color)))
                        Text(area.title, Modifier.weight(1f), style = MaterialTheme.typography.titleSmall)
                        Text(if (attempts > 0) "${attempts}回解答" else "未演習", style = MaterialTheme.typography.bodySmall, color = c.mutedForeground)
                    }
                }
                items(topics, key = { "topic-${it.id}" }) { topic ->
                    val stat = snap?.topics?.firstOrNull { it.topic.id == topic.id }
                    val count = content.questionsForTopic(topic.id).size
                    SgCard(
                        contentPadding = 14.dp,
                        onClick = {
                            nav.startQuiz(QuizConfig(topicIds = listOf(topic.id), count = 10, mode = "topic", title = topic.title))
                        },
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                                Text(topic.title, style = MaterialTheme.typography.titleSmall)
                                Text(
                                    "${count}問 · ${if (topic.examPart == "both") "科目A/B" else "科目${topic.examPart}"}" +
                                        (if (stat != null && stat.attempts > 0) " · ${stat.attempts}回解答" else ""),
                                    style = MaterialTheme.typography.bodySmall, color = c.mutedForeground,
                                )
                            }
                            if (stat != null) {
                                Column(horizontalAlignment = Alignment.End, verticalArrangement = Arrangement.spacedBy(2.dp)) {
                                    Badge(stat.mastery.label, masteryTone(stat.mastery))
                                    if (stat.attempts > 0) Text(
                                        "${stat.accuracy}%",
                                        style = MaterialTheme.typography.labelLarge.copy(fontFamily = FontFamily.Monospace),
                                    )
                                }
                            }
                            Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, null, tint = c.mutedForeground)
                        }
                    }
                }
            }

            // ---- history
            item("history-h") { SectionTitle("演習の履歴") }
            val history = snap?.quizHistory.orEmpty()
            if (history.isEmpty()) {
                item("history-empty") {
                    Text("まだ演習の履歴がありません。上から演習を始めてみましょう。", style = MaterialTheme.typography.bodyMedium, color = c.mutedForeground)
                }
            } else {
                items(history.take(10), key = { "h-${it.id}" }) { row -> HistoryRow(row) }
            }
        }
    }
}

@Composable
private fun QuickStart(nav: Navigator, weakIds: List<String>) {
    val app = LocalApp.current
    val latestYear = app.content.officialQuestions.mapNotNull { it.source.year }.maxOrNull()
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Row(Modifier.height(IntrinsicSize.Min), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            QuickCard(
                Icons.Outlined.TrackChanges, "弱点を演習",
                if (weakIds.isNotEmpty()) "正答率の低い分野から10問" else "解答履歴がたまると弱点から出題",
                Modifier.weight(1f),
            ) {
                nav.startQuiz(QuizConfig(preferWeak = weakIds, count = 10, mode = "weak", title = "弱点演習"))
            }
            QuickCard(Icons.Outlined.Shuffle, "ランダム10問", "全範囲からランダムに出題", Modifier.weight(1f)) {
                nav.startQuiz(QuizConfig(count = 10, mode = "custom", title = "ランダム10問"))
            }
        }
        Row(Modifier.height(IntrinsicSize.Min), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            QuickCard(Icons.AutoMirrored.Outlined.Article, "科目B 事例 5問", "シナリオ形式の問題に慣れる", Modifier.weight(1f)) {
                nav.startQuiz(QuizConfig(part = "B", count = 5, mode = "custom", title = "科目B 事例"))
            }
            if (latestYear != null) {
                QuickCard(Icons.Outlined.WorkspacePremium, "公式問題 $latestYear", "IPA公開問題を通しで解く", Modifier.weight(1f)) {
                    nav.startQuiz(QuizConfig(officialYear = latestYear, count = 60, mode = "official", title = "IPA公開問題 $latestYear"))
                }
            } else Spacer(Modifier.weight(1f))
        }
    }
}

@Composable
private fun QuickCard(icon: ImageVector, title: String, sub: String, modifier: Modifier, onClick: () -> Unit) {
    SgCard(modifier.fillMaxHeight(), onClick = onClick, contentPadding = 14.dp) {
        Icon(icon, null, tint = Sg.colors.infoForeground)
        Spacer(Modifier.height(6.dp))
        Text(title, style = MaterialTheme.typography.titleSmall)
        Text(sub, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
    }
}

@Composable
private fun EntryRow(icon: ImageVector, title: String, sub: String, onClick: () -> Unit) {
    SgCard(onClick = onClick, contentPadding = 14.dp) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Icon(icon, null, tint = Sg.colors.infoForeground, modifier = Modifier.size(26.dp))
            Column(Modifier.weight(1f)) {
                Text(title, style = MaterialTheme.typography.titleSmall)
                Text(sub, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
            }
            Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, null, tint = Sg.colors.mutedForeground)
        }
    }
}

@Composable
private fun HistoryRow(row: QuizHistoryRow) {
    val app = LocalApp.current
    val c = Sg.colors
    SgCard(contentPadding = 14.dp) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                Text(
                    (MODE_LABEL[row.mode] ?: row.mode) + (row.topicId?.let { " · ${app.content.topicName(it)}" } ?: ""),
                    style = MaterialTheme.typography.titleSmall,
                )
                Text(formatDateTime(row.startedAt), style = MaterialTheme.typography.bodySmall, color = c.mutedForeground)
            }
            if (row.completedAt == null) Badge("途中", Tone.Warning)
            Column(horizontalAlignment = Alignment.End) {
                Text(
                    "${row.correct} / ${row.total}",
                    style = MaterialTheme.typography.labelLarge.copy(fontFamily = FontFamily.Monospace),
                )
                Text(pctLabel(row.correct, row.answered), style = MaterialTheme.typography.bodySmall, color = c.mutedForeground)
            }
        }
    }
}

// ---------------------------------------------------------------- custom quiz

private val COUNTS = listOf(5, 10, 15, 20, 30)

@OptIn(ExperimentalLayoutApi::class, ExperimentalMaterial3Api::class)
@Composable
private fun CustomQuizCard(nav: Navigator) {
    val app = LocalApp.current
    val content = app.content
    val c = Sg.colors
    var topicIds by rememberSaveable { mutableStateOf(listOf<String>()) }
    var count by rememberSaveable { mutableIntStateOf(10) }
    var part by rememberSaveable { mutableStateOf("both") }
    var difficulty by rememberSaveable { mutableStateOf("mixed") }
    var includeOfficial by rememberSaveable { mutableStateOf(true) }
    var instant by rememberSaveable { mutableStateOf(true) }
    var picker by rememberSaveable { mutableStateOf(false) }

    val available = remember(topicIds, part, difficulty, includeOfficial) {
        selectQuizQuestions(
            content.questions,
            QuizConfig(topicIds = topicIds, part = part, difficulty = difficulty, includeOfficial = includeOfficial, count = Int.MAX_VALUE),
        ).questions.size
    }

    SgCard {
        Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
            LabeledField("出題範囲") {
                SecondaryButton(
                    when {
                        topicIds.isEmpty() -> "全範囲"
                        topicIds.size == 1 -> content.topicName(topicIds.first())
                        else -> "${topicIds.size} 分野を選択中"
                    },
                    { picker = true }, Modifier.fillMaxWidth(),
                )
            }
            LabeledField("科目") {
                Chips(listOf("both" to "A + B", "A" to "科目A", "B" to "科目B"), part) { part = it }
            }
            LabeledField("難易度") {
                Chips(listOf("mixed" to "混合", "easy" to "基礎", "medium" to "標準", "hard" to "応用"), difficulty) { difficulty = it }
            }
            LabeledField("問題数") {
                Chips(COUNTS.map { it.toString() to "${it}問" }, count.toString()) { count = it.toInt() }
            }
            LabeledField("答え合わせ") {
                Chips(listOf("instant" to "1問ごと", "end" to "最後にまとめて"), if (instant) "instant" else "end") { instant = it == "instant" }
            }
            Row(Modifier.fillMaxWidth().heightIn(min = 48.dp), verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    Text("IPA公開問題を含める", style = MaterialTheme.typography.bodyMedium)
                    Text("オフにすると独自問題のみ出題します", style = MaterialTheme.typography.bodySmall, color = c.mutedForeground)
                }
                Switch(includeOfficial, { includeOfficial = it })
            }
            PrimaryButton(
                if (available == 0) "該当する問題がありません" else "演習を開始（${minOf(count, available)}問）",
                {
                    nav.startQuiz(
                        QuizConfig(
                            topicIds = topicIds, part = part, difficulty = difficulty, count = minOf(count, available),
                            includeOfficial = includeOfficial, instantFeedback = instant,
                            mode = if (topicIds.size == 1) "topic" else "custom",
                            title = if (topicIds.size == 1) content.topicName(topicIds.first()) else "カスタム演習",
                        ),
                    )
                },
                Modifier.fillMaxWidth(), enabled = available > 0,
            )
            Text(
                "条件に合う問題: ${available}問。正答率と誤答履歴は端末に保存され、誤答は間隔反復の復習キューへ自動登録されます。",
                style = MaterialTheme.typography.bodySmall, color = c.mutedForeground,
            )
        }
    }

    if (picker) {
        TopicPicker(topicIds, onChange = { topicIds = it }, onDismiss = { picker = false })
    }
}

@Composable
private fun LabeledField(label: String, content: @Composable () -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Text(label, style = MaterialTheme.typography.labelLarge, color = Sg.colors.mutedForeground)
        content()
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun Chips(options: List<Pair<String, String>>, selected: String, onSelect: (String) -> Unit) {
    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
        options.forEach { (value, label) -> ChoiceChip(label, selected == value, { onSelect(value) }) }
    }
}

/** Bottom sheet to choose any number of syllabus topics, grouped by area. Empty selection = whole range. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun TopicPicker(selected: List<String>, onChange: (List<String>) -> Unit, onDismiss: () -> Unit) {
    val content = LocalApp.current.content
    val c = Sg.colors
    ModalBottomSheet(onDismissRequest = onDismiss, containerColor = c.background) {
        LazyColumn(Modifier.fillMaxWidth(), contentPadding = PaddingValues(start = ScreenPadding, end = ScreenPadding, bottom = 24.dp)) {
            item("head") {
                Row(Modifier.fillMaxWidth().padding(bottom = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                    Text("出題範囲", Modifier.weight(1f), style = MaterialTheme.typography.titleLarge)
                    TextButton(onClick = { onChange(emptyList()) }, enabled = selected.isNotEmpty()) { Text("全範囲に戻す") }
                    TextButton(onClick = onDismiss) { Text("完了") }
                }
            }
            for (area in content.areas) {
                val topics = content.topicsOfArea(area.id).filter { content.questionsForTopic(it.id).isNotEmpty() }
                if (topics.isEmpty()) continue
                val ids = topics.map { it.id }
                val allOn = ids.all { it in selected }
                item("a-${area.id}") {
                    Row(
                        Modifier.fillMaxWidth().heightIn(min = 48.dp).clickable {
                            onChange(if (allOn) selected - ids.toSet() else (selected + ids).distinct())
                        },
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Checkbox(allOn, null, Modifier.padding(end = 8.dp))
                        Text(area.title, Modifier.weight(1f), style = MaterialTheme.typography.titleSmall)
                    }
                }
                items(topics, key = { "t-${it.id}" }) { topic ->
                    val on = topic.id in selected
                    Row(
                        Modifier.fillMaxWidth().heightIn(min = 48.dp).clickable {
                            onChange(if (on) selected - topic.id else selected + topic.id)
                        }.padding(start = 32.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Checkbox(on, null, Modifier.padding(end = 8.dp))
                        Text(topic.title, Modifier.weight(1f), style = MaterialTheme.typography.bodyMedium)
                        Text("${content.questionsForTopic(topic.id).size}問", style = MaterialTheme.typography.bodySmall, color = c.mutedForeground)
                    }
                }
            }
        }
    }
}
