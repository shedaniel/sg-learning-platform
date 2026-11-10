package app.sgstudy.ui.practice

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.automirrored.filled.OpenInNew
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import app.sgstudy.LocalApp
import app.sgstudy.data.model.DIFFICULTY_LABEL
import app.sgstudy.data.model.PART_LABEL
import app.sgstudy.data.model.Question
import app.sgstudy.data.model.optionLabel
import app.sgstudy.logic.percent
import app.sgstudy.ui.components.Badge
import app.sgstudy.ui.components.RichText
import app.sgstudy.ui.components.Tone
import app.sgstudy.ui.components.color
import app.sgstudy.ui.components.container
import app.sgstudy.ui.lesson.BlockList
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.theme.Sg

/** Visual state of one answer option. */
enum class OptionState { Idle, Selected, Correct, Wrong, Dimmed }

/** "IPA公開問題 2026 問13" / "独自問題". */
fun sourceLabel(q: Question): String =
    if (q.isOfficial) buildString {
        append("IPA公開問題")
        q.source.year?.let { append(" $it") }
        q.source.questionNo?.let { append(" 問$it") }
    } else "独自問題"

/** Small metadata row: 科目 · 難易度 · 出典. */
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun QuestionMetaChips(question: Question, modifier: Modifier = Modifier) {
    FlowRow(modifier, horizontalArrangement = Arrangement.spacedBy(6.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Badge(PART_LABEL[question.part] ?: question.part, Tone.Info)
        Badge(DIFFICULTY_LABEL[question.difficulty] ?: question.difficulty)
        Badge(if (question.type == "scenario") "事例" else "知識")
        Badge(sourceLabel(question), if (question.isOfficial) Tone.Warning else Tone.Neutral)
    }
}

/**
 * Stem + presentation blocks + selectable options. [stateOf] decides how each option is painted;
 * [onSelect] is null when the options are locked.
 */
@Composable
fun QuestionBody(
    question: Question,
    nav: Navigator,
    stateOf: (optionId: String) -> OptionState,
    onSelect: ((String) -> Unit)?,
    modifier: Modifier = Modifier,
) {
    Column(modifier, verticalArrangement = Arrangement.spacedBy(14.dp)) {
        RichText(question.stem, nav, style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Medium, lineHeight = 30.sp))
        question.presentation?.takeIf { it.isNotEmpty() }?.let { BlockList(it, nav) }
        Column(Modifier.padding(top = 2.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            question.options.forEach { option ->
                OptionRow(
                    id = option.id, text = option.text, nav = nav, state = stateOf(option.id),
                    onClick = onSelect?.let { f -> { f(option.id) } },
                )
            }
        }
    }
}

@Composable
fun OptionRow(id: String, text: String, nav: Navigator, state: OptionState, onClick: (() -> Unit)?) {
    val c = Sg.colors
    val shape = RoundedCornerShape(12.dp)
    val borderColor = when (state) {
        OptionState.Idle, OptionState.Dimmed -> c.border
        OptionState.Selected -> c.info
        OptionState.Correct -> c.success.copy(alpha = 0.7f)
        OptionState.Wrong -> c.destructive.copy(alpha = 0.7f)
    }
    val bg = when (state) {
        OptionState.Selected -> c.info.copy(alpha = 0.08f)
        OptionState.Correct -> c.success.copy(alpha = 0.10f)
        OptionState.Wrong -> c.destructive.copy(alpha = 0.10f)
        else -> c.card
    }
    val markerFill = when (state) {
        OptionState.Selected -> c.info
        OptionState.Correct -> c.success
        OptionState.Wrong -> c.destructive
        else -> Color.Transparent
    }
    val markerBorder = if (state == OptionState.Idle || state == OptionState.Dimmed) c.input else markerFill
    val borderWidth = if (state == OptionState.Selected) 2.dp else 1.dp
    Row(
        Modifier.fillMaxWidth().heightIn(min = 56.dp)
            .alpha(if (state == OptionState.Dimmed) 0.65f else 1f)
            .clip(shape).background(bg, shape).border(BorderStroke(borderWidth, borderColor), shape)
            .then(if (onClick != null) Modifier.selectable(selected = state == OptionState.Selected, onClick = onClick, role = Role.RadioButton) else Modifier)
            .padding(horizontal = 12.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Box(
            Modifier.size(32.dp).clip(CircleShape).background(markerFill, CircleShape).border(1.dp, markerBorder, CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            when (state) {
                OptionState.Correct -> Icon(Icons.Filled.Check, null, Modifier.size(18.dp), tint = Color.White)
                OptionState.Wrong -> Icon(Icons.Filled.Close, null, Modifier.size(18.dp), tint = Color.White)
                else -> Text(
                    optionLabel(id), style = MaterialTheme.typography.labelLarge,
                    color = if (state == OptionState.Selected) Color.White else c.mutedForeground,
                )
            }
        }
        // For correct/wrong the marker shows a tick/cross, so keep the katakana label as a text prefix.
        Column(Modifier.weight(1f)) {
            if (state == OptionState.Correct || state == OptionState.Wrong) {
                Text(optionLabel(id), style = MaterialTheme.typography.labelMedium, color = if (state == OptionState.Correct) c.successForeground else c.destructiveForeground)
            }
            RichText(text, nav, style = MaterialTheme.typography.bodyLarge.copy(lineHeight = 26.sp))
        }
    }
}

/**
 * Everything shown after answering: verdict + correct summary, "why" list, a note for every option,
 * English translation (setting), related terms, lesson link and source.
 * [selected] is null when the learner did not answer (results of an unanswered question).
 */
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ExplanationPanel(
    question: Question,
    nav: Navigator,
    selected: String?,
    modifier: Modifier = Modifier,
    showLessonLink: Boolean = true,
    showSource: Boolean = true,
) {
    val app = LocalApp.current
    val c = Sg.colors
    val e = question.explanation
    val correct = selected == question.correctOptionId
    val tone = when {
        selected == null -> Tone.Neutral
        correct -> Tone.Success
        else -> Tone.Danger
    }
    Column(modifier, verticalArrangement = Arrangement.spacedBy(12.dp)) {
        // verdict
        Column(
            Modifier.fillMaxWidth().clip(RoundedCornerShape(12.dp)).background(tone.container())
                .border(1.dp, tone.color().copy(alpha = 0.3f), RoundedCornerShape(12.dp)).padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp),
        ) {
            Text(
                when {
                    selected == null -> "未回答 · 正答は ${optionLabel(question.correctOptionId)}"
                    correct -> "正解 · 正答は ${optionLabel(question.correctOptionId)}"
                    else -> "不正解 · あなたの答えは ${optionLabel(selected)} · 正答は ${optionLabel(question.correctOptionId)}"
                },
                style = MaterialTheme.typography.titleSmall, color = tone.color(),
            )
            RichText(e.correct, nav, style = MaterialTheme.typography.bodyMedium)
        }

        if (e.why.isNotEmpty()) {
            Column(Modifier.fillMaxWidth().clip(RoundedCornerShape(12.dp)).background(c.muted).padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text("なぜそうなるか", style = MaterialTheme.typography.labelLarge, color = c.mutedForeground)
                e.why.forEach { item ->
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Box(Modifier.padding(top = 11.dp).size(5.dp).clip(CircleShape).background(c.primary))
                        RichText(item, nav, Modifier.weight(1f), style = MaterialTheme.typography.bodyMedium)
                    }
                }
            }
        }

        // a note for every option
        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text("選択肢ごとの解説", style = MaterialTheme.typography.labelLarge, color = c.mutedForeground)
            question.options.forEach { option ->
                val isCorrect = option.id == question.correctOptionId
                val isYours = option.id == selected
                val border = when {
                    isCorrect -> c.success.copy(alpha = 0.5f)
                    isYours -> c.destructive.copy(alpha = 0.5f)
                    else -> c.border
                }
                Row(
                    Modifier.fillMaxWidth().clip(RoundedCornerShape(10.dp)).border(1.dp, border, RoundedCornerShape(10.dp)).padding(10.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    Text(
                        optionLabel(option.id),
                        style = MaterialTheme.typography.labelLarge.copy(fontFamily = FontFamily.Monospace),
                        color = if (isCorrect) c.successForeground else if (isYours) c.destructiveForeground else c.foreground,
                        modifier = Modifier.width(22.dp),
                    )
                    Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                        if (isCorrect || isYours) {
                            Text(
                                if (isCorrect) "正解の選択肢" else "あなたの選択",
                                style = MaterialTheme.typography.labelSmall,
                                color = if (isCorrect) c.successForeground else c.destructiveForeground,
                            )
                        }
                        RichText(
                            e.optionNotes[option.id] ?: option.text, nav,
                            style = MaterialTheme.typography.bodyMedium, color = if (isCorrect || isYours) c.foreground else c.mutedForeground,
                        )
                    }
                }
            }
        }

        if (app.showEnglish && !e.english.isNullOrBlank()) {
            Column(Modifier.fillMaxWidth().clip(RoundedCornerShape(12.dp)).border(1.dp, c.border, RoundedCornerShape(12.dp)).padding(14.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text("English", style = MaterialTheme.typography.labelLarge, color = c.mutedForeground)
                Text(e.english, style = MaterialTheme.typography.bodyMedium, color = c.foreground)
            }
        }

        val terms = e.termIds.mapNotNull { app.content.termById[it] }
        if (terms.isNotEmpty()) {
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text("関連用語", style = MaterialTheme.typography.labelLarge, color = c.mutedForeground)
                FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    terms.forEach { term ->
                        Text(
                            term.ja,
                            Modifier.heightIn(min = 40.dp).clip(RoundedCornerShape(10.dp)).border(1.dp, c.input, RoundedCornerShape(10.dp))
                                .clickable { nav.openTerm(term.id) }.padding(horizontal = 12.dp, vertical = 8.dp),
                            style = MaterialTheme.typography.labelLarge, color = c.infoForeground,
                        )
                    }
                }
            }
        }

        if (showLessonLink) {
            question.lessonIds.firstNotNullOfOrNull { app.content.lessonById[it] }?.let { lesson ->
                Text(
                    "関連レッスンを読み直す: ${lesson.title} →",
                    Modifier.fillMaxWidth().heightIn(min = 48.dp).clickable { nav.openLesson(lesson.id) }.padding(vertical = 12.dp),
                    style = MaterialTheme.typography.labelLarge, color = c.infoForeground,
                )
            }
        }

        if (showSource) SourceNote(question)
    }
}

/** Attribution text with a link to the IPA page for official questions. */
@Composable
fun SourceNote(question: Question, modifier: Modifier = Modifier) {
    val c = Sg.colors
    val uri = LocalUriHandler.current
    val s = question.source
    Column(modifier, verticalArrangement = Arrangement.spacedBy(2.dp)) {
        Text(s.attribution, style = MaterialTheme.typography.bodySmall, color = c.mutedForeground)
        s.url?.let { url ->
            Row(
                Modifier.heightIn(min = 40.dp).clickable { runCatching { uri.openUri(url) } },
                verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp),
            ) {
                Text("公式PDF・出題年度ページ", style = MaterialTheme.typography.bodySmall, color = c.infoForeground)
                Icon(Icons.AutoMirrored.Filled.OpenInNew, null, Modifier.size(14.dp), tint = c.infoForeground)
            }
        }
        s.note?.let { Text(it, style = MaterialTheme.typography.bodySmall, color = c.mutedForeground) }
    }
}

/** Circular percentage gauge for the quiz result. */
@Composable
fun ScoreRing(value: Int, modifier: Modifier = Modifier, size: androidx.compose.ui.unit.Dp = 136.dp) {
    val track = Sg.colors.border
    val arc = if (value >= 70) Sg.colors.success else if (value >= 50) Sg.colors.warning else Sg.colors.destructive
    Box(modifier.size(size), contentAlignment = Alignment.Center) {
        Canvas(Modifier.fillMaxSize()) {
            val stroke = 12.dp.toPx()
            val inset = stroke / 2
            val d = Size(this.size.width - stroke, this.size.height - stroke)
            drawArc(track, 0f, 360f, false, Offset(inset, inset), d, style = Stroke(stroke))
            drawArc(arc, -90f, 360f * value.coerceIn(0, 100) / 100f, false, Offset(inset, inset), d, style = Stroke(stroke, cap = StrokeCap.Round))
        }
        Text(
            "$value%", style = MaterialTheme.typography.headlineMedium.copy(fontFamily = FontFamily.Monospace),
            color = Sg.colors.foreground, textAlign = TextAlign.Center,
        )
    }
}

/** Percent for a correct/total pair, "—" when nothing was answered. */
fun pctLabel(correct: Int, total: Int) = if (total > 0) "${percent(correct, total)}%" else "—"
