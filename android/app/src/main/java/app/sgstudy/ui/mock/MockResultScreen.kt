package app.sgstudy.ui.mock

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Flag
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Replay
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.material3.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import app.sgstudy.LocalApp
import app.sgstudy.data.MockRow
import app.sgstudy.data.model.DIFFICULTY_LABEL
import app.sgstudy.data.model.PART_LABEL
import app.sgstudy.data.model.optionLabel
import app.sgstudy.logic.*
import app.sgstudy.ui.components.*
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.theme.Sg
import kotlinx.coroutines.launch

private enum class ReviewFilter(val label: String) { All("すべて"), Wrong("誤答のみ"), Unanswered("未解答") }

private sealed interface ResultLoad {
    data object Loading : ResultLoad
    data object Missing : ResultLoad
    data class NotSubmitted(val id: String) : ResultLoad
    data class Ready(val row: MockRow, val result: MockResult) : ResultLoad
}

/** 結果: raw score, breakdowns, weak topics, revision suggestions and a per-question review list. */
@Composable
fun MockResultScreen(mockId: String, nav: Navigator) {
    val app = LocalApp.current
    val load by produceState<ResultLoad>(ResultLoad.Loading, mockId) {
        val row = app.store.mock(mockId)
        value = when {
            row == null -> ResultLoad.Missing
            row.submittedAt == null -> ResultLoad.NotSubmitted(row.id)
            row.result == null -> ResultLoad.Missing
            else -> ResultLoad.Ready(row, row.result)
        }
    }
    when (val l = load) {
        ResultLoad.Loading -> ScreenFrame("模擬試験の結果", nav::back) { p ->
            Box(Modifier.padding(p).fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = Sg.colors.mutedForeground)
            }
        }
        ResultLoad.Missing -> ScreenFrame("模擬試験の結果", nav::back) { p ->
            EmptyState("結果が見つかりません", "この模擬試験の記録が存在しません。", Modifier.padding(p))
        }
        is ResultLoad.NotSubmitted -> ScreenFrame("模擬試験の結果", nav::back) { p ->
            EmptyState("この模擬試験はまだ提出されていません", "提出すると結果が表示されます。", Modifier.padding(p)) {
                PrimaryButton("試験を再開", { nav.openMockRun(l.id) })
            }
        }
        is ResultLoad.Ready -> ResultContent(l.row, l.result, nav)
    }
}

@Composable
private fun ResultContent(row: MockRow, result: MockResult, nav: Navigator) {
    val app = LocalApp.current
    val content = app.content
    val scope = rememberCoroutineScope()
    var filter by rememberSaveable { mutableStateOf(ReviewFilter.All) }
    var showAllTopics by rememberSaveable { mutableStateOf(false) }
    var starting by remember { mutableStateOf(false) }
    val flagged = remember(row.flags) { row.flags.toSet() }
    val position = remember(result) { result.questions.withIndex().associate { it.value.questionId to it.index + 1 } }

    val weakTopics = result.weakTopicIds
    val revisionLessons = remember(result) {
        weakTopics.flatMap { content.lessonsForTopic(it).take(1) }.distinctBy { it.id }.take(4)
    }
    val slowest = remember(result) { result.questions.filter { it.elapsedMs > 0 }.sortedByDescending { it.elapsedMs }.take(5) }
    val reviewList = remember(result, filter) {
        result.questions.withIndex().filter { (_, q) ->
            when (filter) {
                ReviewFilter.All -> true
                ReviewFilter.Wrong -> q.selected != null && !q.correct
                ReviewFilter.Unanswered -> q.selected == null
            }
        }
    }
    val wrongCount = result.questions.count { it.selected != null && !it.correct }

    ScreenFrame("模擬試験の結果", nav::back) { padding ->
        LazyColumn(
            Modifier.padding(padding).fillMaxSize().padding(horizontal = ScreenPadding),
            contentPadding = PaddingValues(top = 4.dp, bottom = 24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            item("score") { ScoreCard(row, result) }
            item("note") { HonestNote() }
            item("parts") {
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    PartCard("科目A", result.partA, Modifier.weight(1f))
                    PartCard("科目B", result.partB, Modifier.weight(1f))
                }
            }
            item("difficulty") {
                SgCard {
                    Text("難易度別", style = MaterialTheme.typography.titleMedium)
                    Spacer(Modifier.height(8.dp))
                    result.byDifficulty.forEach { d ->
                        Column(Modifier.padding(vertical = 5.dp)) {
                            Row {
                                Text(DIFFICULTY_LABEL[d.difficulty] ?: d.difficulty, Modifier.weight(1f), style = MaterialTheme.typography.bodyMedium)
                                Text("${d.correct}/${d.total}問 · ${d.accuracy}%", style = MaterialTheme.typography.bodyMedium.copy(fontFamily = FontFamily.Monospace), color = Sg.colors.mutedForeground)
                            }
                            SgProgressBar(d.accuracy / 100f, Modifier.padding(top = 4.dp), color = accuracyColor(d.accuracy), height = 5.dp)
                        }
                    }
                }
            }
            item("topics") {
                SgCard {
                    Text("分野別", style = MaterialTheme.typography.titleMedium)
                    Text("正答率の低い順。70%未満は弱点として扱います。", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
                    Spacer(Modifier.height(8.dp))
                    val rows = if (showAllTopics) result.byTopic else result.byTopic.take(8)
                    rows.forEach { t ->
                        val weak = t.topicId in weakTopics
                        Column(Modifier.padding(vertical = 6.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Text(content.topicName(t.topicId), Modifier.weight(1f), style = MaterialTheme.typography.bodyMedium, fontWeight = if (weak) FontWeight.SemiBold else null)
                                if (weak) Badge("弱点", Tone.Warning)
                                Text("${t.correct}/${t.total} · ${t.accuracy}%", style = MaterialTheme.typography.bodySmall.copy(fontFamily = FontFamily.Monospace), color = Sg.colors.mutedForeground)
                            }
                            SgProgressBar(t.accuracy / 100f, Modifier.padding(top = 4.dp), color = accuracyColor(t.accuracy), height = 5.dp)
                        }
                    }
                    if (result.byTopic.size > 8) {
                        TextButton(onClick = { showAllTopics = !showAllTopics }, modifier = Modifier.heightIn(min = 48.dp)) {
                            Text(if (showAllTopics) "上位のみ表示" else "すべての分野を表示（${result.byTopic.size}）")
                        }
                    }
                }
            }
            item("time") {
                SgCard {
                    Text("時間", style = MaterialTheme.typography.titleMedium)
                    Spacer(Modifier.height(8.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        MiniStat("解答に要した時間", formatDuration((result.totalElapsedMs / 1000).toInt()), Modifier.weight(1f))
                        MiniStat("1問平均", "${Math.round(result.averageElapsedMs / 1000f)}秒", Modifier.weight(1f))
                    }
                    if (slowest.isNotEmpty()) {
                        Spacer(Modifier.height(12.dp))
                        Text("時間のかかった問題", style = MaterialTheme.typography.titleSmall)
                        slowest.forEach { q ->
                            val question = content.questionById[q.questionId] ?: return@forEach
                            Row(
                                Modifier.fillMaxWidth().clickable { nav.openQuestion(q.questionId) }.heightIn(min = 48.dp),
                                verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp),
                            ) {
                                Text("問${position[q.questionId]}", style = MaterialTheme.typography.labelLarge.copy(fontFamily = FontFamily.Monospace), modifier = Modifier.width(44.dp))
                                Text(question.stem.replace("\n", " "), Modifier.weight(1f), maxLines = 1, overflow = TextOverflow.Ellipsis, style = MaterialTheme.typography.bodySmall)
                                Text(formatDuration((q.elapsedMs / 1000).toInt()), style = MaterialTheme.typography.bodySmall.copy(fontFamily = FontFamily.Monospace), color = Sg.colors.mutedForeground)
                            }
                        }
                    }
                }
            }
            item("revision") {
                SgCard {
                    Text("復習の提案", style = MaterialTheme.typography.titleMedium)
                    Text("誤答は自動的に復習キューへ登録されました。", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
                    Spacer(Modifier.height(12.dp))
                    if (weakTopics.isNotEmpty()) {
                        Text("優先して復習する分野", style = MaterialTheme.typography.titleSmall)
                        Spacer(Modifier.height(6.dp))
                        @OptIn(ExperimentalLayoutApi::class)
                        FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            weakTopics.forEach { Badge(content.topicName(it), Tone.Warning) }
                        }
                        Spacer(Modifier.height(12.dp))
                        PrimaryButton(
                            "弱点を演習（10問）",
                            onClick = {
                                nav.startQuiz(
                                    QuizConfig(
                                        topicIds = weakTopics, mode = "weak", count = 10, preferWeak = weakTopics,
                                        title = "模擬試験の弱点演習",
                                    ),
                                )
                            },
                            modifier = Modifier.fillMaxWidth(),
                        )
                    } else {
                        Text("70%未満の分野はありませんでした。引き続き復習キューで定着を確認しましょう。", style = MaterialTheme.typography.bodyMedium)
                    }
                    if (revisionLessons.isNotEmpty()) {
                        Spacer(Modifier.height(16.dp))
                        Text("おすすめの読み直し", style = MaterialTheme.typography.titleSmall)
                        revisionLessons.forEach { lesson ->
                            ListRow(
                                title = lesson.title, onClick = { nav.openLesson(lesson.id) },
                                trailing = { Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, null, tint = Sg.colors.mutedForeground) },
                            )
                        }
                    }
                    Spacer(Modifier.height(12.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        SecondaryButton("復習を始める", nav::openReview, Modifier.weight(1f))
                        SecondaryButton(
                            "再挑戦", enabled = !starting, modifier = Modifier.weight(1f), icon = Icons.Filled.Replay,
                            onClick = {
                                starting = true
                                scope.launch {
                                    val id = runCatching { startNewMock(app) }.getOrNull()
                                    starting = false
                                    if (id != null) nav.openMockRun(id)
                                }
                            },
                        )
                    }
                }
            }
            item("review-title") {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    SectionTitle("問題別レビュー")
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        ReviewFilter.entries.forEach { f ->
                            val label = when (f) {
                                ReviewFilter.All -> "${f.label} ${result.questions.size}"
                                ReviewFilter.Wrong -> "${f.label} $wrongCount"
                                ReviewFilter.Unanswered -> "${f.label} ${result.unanswered}"
                            }
                            ChoiceChip(label, filter == f, { filter = f })
                        }
                    }
                }
            }
            if (reviewList.isEmpty()) {
                item("review-empty") { EmptyState("該当する問題はありません") }
            }
            items(reviewList, key = { it.value.questionId }) { (i, q) ->
                val question = content.questionById[q.questionId]
                if (question != null) {
                    ReviewRowCard(
                        number = i + 1, q = q, stem = question.stem, flagged = q.questionId in flagged,
                        source = if (question.isOfficial) "IPA ${question.source.year} 問${question.source.questionNo}" else "独自問題",
                        onClick = { nav.openQuestion(q.questionId) },
                    )
                }
            }
        }
    }
}

@Composable
private fun ScoreCard(row: MockRow, result: MockResult) {
    SgCard {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(18.dp)) {
            ScoreRing(result.accuracy)
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                Row(verticalAlignment = Alignment.Bottom) {
                    Text(
                        "${result.correct}", style = MaterialTheme.typography.displaySmall.copy(fontFamily = FontFamily.Monospace),
                    )
                    Text(" / ${result.total}問", style = MaterialTheme.typography.titleMedium, color = Sg.colors.mutedForeground, modifier = Modifier.padding(bottom = 4.dp))
                }
                Text("解答 ${result.answered}問 · 未解答 ${result.unanswered}問", style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)
                Text("素点正答率 ${result.accuracy}%", style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)
                row.submittedAt?.let { Text(formatDateTime(it) + " 提出", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground) }
            }
        }
    }
}

@Composable
private fun ScoreRing(value: Int) {
    val track = Sg.colors.muted
    val color = accuracyColor(value)
    Box(Modifier.size(112.dp), contentAlignment = Alignment.Center) {
        Canvas(Modifier.fillMaxSize()) {
            val stroke = 11.dp.toPx()
            val inset = stroke / 2
            val arcSize = Size(size.width - stroke, size.height - stroke)
            drawArc(track, 0f, 360f, false, Offset(inset, inset), arcSize, style = Stroke(stroke))
            drawArc(color, -90f, 360f * value.coerceIn(0, 100) / 100f, false, Offset(inset, inset), arcSize, style = Stroke(stroke, cap = StrokeCap.Round))
        }
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text("$value%", style = MaterialTheme.typography.titleLarge.copy(fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold))
            Text("素点", style = MaterialTheme.typography.labelSmall, color = Sg.colors.mutedForeground)
        }
    }
}

@Composable
private fun HonestNote() {
    Row(
        Modifier.fillMaxWidth().clip(RoundedCornerShape(12.dp)).background(Tone.Warning.container())
            .border(BorderStroke(1.dp, Sg.colors.warning.copy(alpha = 0.35f)), RoundedCornerShape(12.dp)).padding(12.dp),
        horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        Icon(Icons.Filled.Info, null, Modifier.padding(top = 2.dp).size(18.dp), tint = Sg.colors.warningForeground)
        Text(
            "この結果は学習用の素点です。IPAのIRT評価点（総合600点/1000点で判定）ではなく、合否や合格可能性は予測しません。" +
                "本アプリは公式の採点モデルを持たないため、分野別の傾向を復習の手がかりとして使ってください。",
            style = MaterialTheme.typography.bodySmall,
        )
    }
}

@Composable
private fun PartCard(title: String, score: PartScore, modifier: Modifier = Modifier) {
    SgCard(modifier, contentPadding = 14.dp) {
        Text(title, style = MaterialTheme.typography.labelMedium, color = Sg.colors.mutedForeground)
        Text("${score.accuracy}%", style = MaterialTheme.typography.headlineSmall.copy(fontFamily = FontFamily.Monospace, fontWeight = FontWeight.SemiBold))
        SgProgressBar(score.accuracy / 100f, Modifier.padding(vertical = 6.dp), color = accuracyColor(score.accuracy))
        Text("${score.correct}/${score.total}問", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
    }
}

@Composable
private fun MiniStat(label: String, value: String, modifier: Modifier = Modifier) {
    Column(modifier.clip(RoundedCornerShape(10.dp)).background(Sg.colors.muted).padding(12.dp)) {
        Text(label, style = MaterialTheme.typography.labelMedium, color = Sg.colors.mutedForeground)
        Text(value, style = MaterialTheme.typography.titleMedium.copy(fontFamily = FontFamily.Monospace))
    }
}

@Composable
private fun ReviewRowCard(number: Int, q: MockQuestionResult, stem: String, flagged: Boolean, source: String, onClick: () -> Unit) {
    val unanswered = q.selected == null
    val markColor = when { unanswered -> Sg.colors.mutedForeground; q.correct -> Sg.colors.success; else -> Sg.colors.destructive }
    SgCard(onClick = onClick, contentPadding = 12.dp) {
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Box(Modifier.size(26.dp).clip(CircleShape).background(markColor), contentAlignment = Alignment.Center) {
                when {
                    unanswered -> Text("–", color = androidx.compose.ui.graphics.Color.White, style = MaterialTheme.typography.labelLarge)
                    q.correct -> Icon(Icons.Filled.Check, "正解", Modifier.size(16.dp), tint = androidx.compose.ui.graphics.Color.White)
                    else -> Icon(Icons.Filled.Close, "不正解", Modifier.size(16.dp), tint = androidx.compose.ui.graphics.Color.White)
                }
            }
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(3.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(
                        "問$number · ${PART_LABEL[q.part] ?: q.part} · $source · ${formatDuration((q.elapsedMs / 1000).toInt())}",
                        Modifier.weight(1f, fill = false), style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
                        maxLines = 1, overflow = TextOverflow.Ellipsis,
                    )
                    if (flagged) Icon(Icons.Filled.Flag, "見直しフラグ", Modifier.size(14.dp), tint = Sg.colors.warning)
                }
                Text(stem, maxLines = 2, overflow = TextOverflow.Ellipsis, style = MaterialTheme.typography.bodyMedium)
                Text(
                    "あなた: ${q.selected?.let(::optionLabel) ?: "未解答"}  /  正解: ${optionLabel(q.correctOptionId)}",
                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Medium),
                    color = if (q.correct) Sg.colors.successForeground else if (unanswered) Sg.colors.mutedForeground else Sg.colors.destructiveForeground,
                )
            }
            Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, null, Modifier.align(Alignment.CenterVertically), tint = Sg.colors.mutedForeground)
        }
    }
}
