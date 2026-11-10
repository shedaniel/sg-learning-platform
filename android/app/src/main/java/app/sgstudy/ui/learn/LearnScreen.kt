package app.sgstudy.ui.learn

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.automirrored.outlined.ArrowForwardIos
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import app.sgstudy.LocalApp
import app.sgstudy.data.model.Area
import app.sgstudy.data.model.Lesson
import app.sgstudy.logic.AreaProgress
import app.sgstudy.logic.Mastery
import app.sgstudy.logic.ProgressSnapshot
import app.sgstudy.logic.QuizConfig
import app.sgstudy.ui.components.*
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.theme.Sg
import app.sgstudy.ui.theme.areaColor
import app.sgstudy.rememberProgress

/** Learn tab: the 8 areas with progress, plus a "read this next" suggestion. */
@Composable
fun LearnScreen(nav: Navigator) {
    val app = LocalApp.current
    val content = app.content
    val snapshot = rememberProgress().value

    ScrollScreen("学習") {
        Text(
            "IPA SG シラバス ${content.syllabus.current} の全${content.topics.size}トピックを、${content.areas.size}つの分野・${content.lessons.size}レッスンで扱います。どの順番で読んでも構いません。",
            style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground,
        )

        val next = snapshot?.nextLessons?.firstOrNull() ?: content.lessons.firstOrNull()
        if (next != null) {
            val hasActivity = snapshot != null && (snapshot.completedLessons > 0 || snapshot.attemptCount > 0)
            NextLessonCard(next, if (hasActivity) "次のレッスン" else "最初のレッスン", nav)
        }

        content.areas.forEach { area ->
            AreaCard(area, snapshot, nav)
        }

        SecondaryButton("シラバス対応表を見る", onClick = nav::openCoverage, modifier = Modifier.fillMaxWidth())
    }
}

@Composable
private fun NextLessonCard(lesson: Lesson, label: String, nav: Navigator) {
    val content = LocalApp.current.content
    val questions = content.questionsForLesson(lesson.id).size
    SgCard(onClick = { nav.openLesson(lesson.id) }, container = Sg.colors.muted.copy(alpha = 0.6f)) {
        Text(label, style = MaterialTheme.typography.labelMedium, color = Sg.colors.infoForeground)
        Spacer(Modifier.height(4.dp))
        Text(lesson.title, style = MaterialTheme.typography.titleLarge)
        Spacer(Modifier.height(4.dp))
        Text(lesson.summary, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground, maxLines = 3, overflow = TextOverflow.Ellipsis)
        Spacer(Modifier.height(6.dp))
        Text("${lesson.readingMinutes}分 · ${lesson.sections.size}セクション", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
        Spacer(Modifier.height(12.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            PrimaryButton("読み始める", { nav.openLesson(lesson.id) }, Modifier.weight(1f), icon = Icons.AutoMirrored.Filled.ArrowForward)
            if (questions > 0) SecondaryButton(
                "先に問題を解く",
                {
                    nav.startQuiz(
                        QuizConfig(lessonIds = listOf(lesson.id), count = minOf(10, questions), mode = "lesson", title = lesson.title, instantFeedback = true),
                    )
                },
                Modifier.weight(1f),
            )
        }
    }
}

@Composable
private fun AreaCard(area: Area, snapshot: ProgressSnapshot?, nav: Navigator) {
    val content = LocalApp.current.content
    val color = areaColor(area.color)
    val progress: AreaProgress? = snapshot?.areaProgress?.firstOrNull { it.areaId == area.id }
    val lessons = content.lessonsOfArea(area.id)
    val topicRows = snapshot?.topics?.filter { it.topic.areaId == area.id }.orEmpty()
    val mastered = topicRows.count { it.mastery == Mastery.Mastered }
    // The lesson to continue: first one already started but not done, else first unread.
    val resume = snapshot?.let { s ->
        lessons.firstOrNull { s.lessonStatus(it.id) == "started" } ?: lessons.firstOrNull { s.lessonStatus(it.id) == "new" }
    } ?: lessons.firstOrNull()

    SgCard(onClick = { nav.openArea(area.id) }, contentPadding = 0.dp) {
        Row(Modifier.height(IntrinsicSize.Min)) {
            Box(Modifier.fillMaxHeight().width(5.dp).background(color))
            Column(Modifier.weight(1f).padding(16.dp)) {
                Row(verticalAlignment = Alignment.Top) {
                    Column(Modifier.weight(1f)) {
                        Text(area.title, style = MaterialTheme.typography.titleLarge)
                        Text(area.titleEn, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
                    }
                    Icon(Icons.AutoMirrored.Outlined.ArrowForwardIos, null, Modifier.padding(top = 6.dp).size(14.dp), tint = Sg.colors.mutedForeground)
                }
                Spacer(Modifier.height(8.dp))
                Text(area.description, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)
                Spacer(Modifier.height(12.dp))
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    SgProgressBar((progress?.percent ?: 0) / 100f, Modifier.weight(1f), color = color, height = 8.dp)
                    Text(
                        "${progress?.completedLessons ?: 0}/${progress?.totalLessons ?: lessons.size}",
                        style = MaterialTheme.typography.labelLarge.copy(fontFamily = FontFamily.Monospace), color = Sg.colors.mutedForeground,
                    )
                }
                Spacer(Modifier.height(6.dp))
                Text(
                    "習得 $mastered/${topicRows.size.takeIf { it > 0 } ?: progress?.topicCount ?: content.topicsOfArea(area.id).size} トピック" +
                        if (progress != null && progress.attempts > 0) " · 正答率 ${progress.accuracy}%" else " · 未演習",
                    style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
                )
                if (resume != null && (progress == null || progress.completedLessons < progress.totalLessons)) {
                    Spacer(Modifier.height(10.dp))
                    val status = snapshot?.lessonStatus(resume.id) ?: "new"
                    Row(
                        Modifier.fillMaxWidth().clip(RoundedCornerShape(10.dp)).background(Sg.colors.muted)
                            .clickable { nav.openLesson(resume.id) }.heightIn(min = 48.dp).padding(horizontal = 12.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp),
                    ) {
                        LessonStatusIcon(status, 20.dp)
                        Column(Modifier.weight(1f)) {
                            Text(if (status == "started") "続きから" else "次のレッスン", style = MaterialTheme.typography.labelSmall, color = Sg.colors.mutedForeground)
                            Text(resume.title, style = MaterialTheme.typography.titleSmall, maxLines = 2, overflow = TextOverflow.Ellipsis)
                        }
                        Text("${resume.readingMinutes}分", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
                    }
                }
            }
        }
    }
}
