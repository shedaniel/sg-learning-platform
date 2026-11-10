package app.sgstudy.ui.learn

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import app.sgstudy.LocalApp
import app.sgstudy.data.model.Lesson
import app.sgstudy.logic.Mastery
import app.sgstudy.logic.QuizConfig
import app.sgstudy.logic.percent
import app.sgstudy.rememberProgress
import app.sgstudy.ui.components.*
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.theme.Sg
import app.sgstudy.ui.theme.areaColor

/** One area: header with progress, its lessons, and the syllabus topics it covers. */
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun AreaScreen(areaId: String, nav: Navigator) {
    val content = LocalApp.current.content
    val area = content.areaById[areaId]
    if (area == null) {
        ScreenFrame("分野", onBack = nav::back) { p -> Box(Modifier.padding(p)) { EmptyState("この分野は見つかりません") } }
        return
    }
    val snapshot = rememberProgress().value
    val color = areaColor(area.color)
    val lessons = content.lessonsOfArea(area.id)
    val topics = content.topicsOfArea(area.id)
    val topicRows = snapshot?.topics?.filter { it.topic.areaId == area.id }.orEmpty()
    val completed = lessons.count { snapshot?.lessonStatus(it.id) == "completed" }
    val questionCount = topics.sumOf { content.questionsForTopic(it.id).size }
    val attempts = topicRows.sumOf { it.attempts }
    val correct = topicRows.sumOf { it.correct }

    ScreenFrame(area.shortTitle, onBack = nav::back) { padding ->
        LazyColumn(
            Modifier.padding(padding).fillMaxSize(),
            contentPadding = PaddingValues(start = ScreenPadding, end = ScreenPadding, top = 4.dp, bottom = 32.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            item {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(
                        "Area ${area.order.toString().padStart(2, '0')} · ${area.titleEn}",
                        style = MaterialTheme.typography.labelMedium, color = color,
                    )
                    Text(area.title, style = MaterialTheme.typography.headlineSmall)
                    Text(area.description, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)
                }
            }
            item {
                SgCard {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("エリア進捗", style = MaterialTheme.typography.labelLarge, modifier = Modifier.weight(1f))
                        Text(
                            "$completed/${lessons.size} レッスン · ${percent(completed, lessons.size)}%",
                            style = MaterialTheme.typography.labelMedium.copy(fontFamily = FontFamily.Monospace), color = Sg.colors.mutedForeground,
                        )
                    }
                    Spacer(Modifier.height(8.dp))
                    SgProgressBar(percent(completed, lessons.size) / 100f, color = color, height = 8.dp)
                    Spacer(Modifier.height(12.dp))
                    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Badge("${topics.size} トピック")
                        Badge("$questionCount 問")
                        Badge("演習正答率 " + if (attempts > 0) "${percent(correct, attempts)}%" else "—")
                        Badge("習得 ${topicRows.count { it.mastery == Mastery.Mastered }}/${topics.size}")
                    }
                    if (topics.isNotEmpty()) {
                        Spacer(Modifier.height(14.dp))
                        PrimaryButton(
                            "この分野を演習", icon = Icons.Filled.PlayArrow, modifier = Modifier.fillMaxWidth(),
                            onClick = {
                                nav.startQuiz(QuizConfig(topicIds = topics.map { it.id }, count = 10, mode = "topic", title = area.title, instantFeedback = true))
                            },
                        )
                    }
                }
            }

            item { SectionTitle("レッスン") }
            if (lessons.isEmpty()) item { EmptyState("コンテンツを準備中です。") }
            itemsIndexed(lessons, key = { _, l -> l.id }) { index, lesson ->
                LessonCard(index, lesson, snapshot?.lessonStatus(lesson.id) ?: "new", nav)
            }

            if (topics.isNotEmpty()) {
                item { SectionTitle("対応するシラバストピック") }
                item {
                    SgCard(contentPadding = 0.dp) {
                        topics.forEachIndexed { i, topic ->
                            val stat = topicRows.firstOrNull { it.topic.id == topic.id }
                            if (i > 0) Divider()
                            Row(
                                Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 12.dp),
                                verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp),
                            ) {
                                Column(Modifier.weight(1f)) {
                                    Text(topic.title, style = MaterialTheme.typography.titleSmall)
                                    Text(topic.reference.replace("Ver.4.1 ", ""), style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
                                }
                                Text(
                                    if (stat != null && stat.attempts > 0) "${stat.accuracy}%" else "未演習",
                                    style = MaterialTheme.typography.labelMedium.copy(fontFamily = FontFamily.Monospace), color = Sg.colors.mutedForeground,
                                )
                            }
                        }
                    }
                }
            }
            item {
                val minutes = lessons.sumOf { it.readingMinutes }
                Text(
                    "学習の目安: 読解 $minutes 分 + 演習 約 ${lessons.size * 10} 分。1日1〜2レッスンが無理のないペースです。",
                    style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground, modifier = Modifier.padding(top = 4.dp),
                )
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun LessonCard(index: Int, lesson: Lesson, status: String, nav: Navigator) {
    val content = LocalApp.current.content
    val questions = content.questionsForLesson(lesson.id).size
    SgCard(onClick = { nav.openLesson(lesson.id) }) {
        Row(horizontalArrangement = Arrangement.spacedBy(14.dp)) {
            val (border, bg) = when (status) {
                "completed" -> Sg.colors.success.copy(alpha = 0.4f) to Sg.colors.success.copy(alpha = 0.10f)
                "started" -> Sg.colors.info.copy(alpha = 0.4f) to Sg.colors.info.copy(alpha = 0.10f)
                else -> Sg.colors.border to Color.Transparent
            }
            Box(
                Modifier.size(36.dp).clip(CircleShape).background(bg).border(BorderStroke(1.dp, border), CircleShape),
                contentAlignment = Alignment.Center,
            ) {
                if (status == "completed") Icon(Icons.Filled.CheckCircle, "読了済み", Modifier.size(20.dp), tint = Sg.colors.successForeground)
                else Text(
                    (index + 1).toString().padStart(2, '0'),
                    style = MaterialTheme.typography.labelMedium.copy(fontFamily = FontFamily.Monospace),
                    color = if (status == "started") Sg.colors.infoForeground else Sg.colors.mutedForeground,
                )
            }
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(lesson.title, style = MaterialTheme.typography.titleMedium)
                Text(lesson.titleEn, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
                Text(lesson.summary, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)
                FlowRow(
                    Modifier.padding(top = 4.dp),
                    horizontalArrangement = Arrangement.spacedBy(6.dp), verticalArrangement = Arrangement.spacedBy(6.dp),
                ) {
                    Badge("${lesson.readingMinutes}分")
                    DifficultyBadge(lesson.difficulty)
                    if (questions > 0) Badge("${questions}問")
                    when (status) {
                        "completed" -> Badge("読了済み", Tone.Success)
                        "started" -> Badge("学習中", Tone.Info)
                        else -> Badge("未着手")
                    }
                }
            }
        }
    }
}
