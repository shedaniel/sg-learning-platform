package app.sgstudy.ui.learn

import android.content.Intent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.automirrored.outlined.OpenInNew
import androidx.compose.material.icons.automirrored.outlined.ListAlt
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.outlined.CheckCircle
import androidx.compose.material.icons.outlined.WarningAmber
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.core.net.toUri
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import app.sgstudy.LocalApp
import app.sgstudy.data.model.Block
import app.sgstudy.data.model.GlossaryTerm
import app.sgstudy.data.model.Lesson
import app.sgstudy.data.model.LessonSection
import app.sgstudy.logic.QuizConfig
import app.sgstudy.rememberProgress
import app.sgstudy.ui.components.*
import app.sgstudy.ui.lesson.BlockItem
import app.sgstudy.ui.lesson.BlockSpacing
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.theme.Sg
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import kotlin.math.roundToInt

/** Outlives the screen so study minutes are still recorded when the user navigates away. */
private val sessionScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

/** Accumulates foreground time on the lesson (paused while the app is in the background). */
private class StudyTimer {
    private var running = false
    private var startedAt = 0L
    private var accumulated = 0L
    fun resume() { if (!running) { running = true; startedAt = System.currentTimeMillis() } }
    fun pause() { if (running) { running = false; accumulated += System.currentTimeMillis() - startedAt } }
    fun minutes(): Int = (accumulated / 60_000.0).roundToInt()
}

/** Flat description of everything the lesson list shows, so each part is its own lazy item. */
private sealed interface Entry {
    data object Header : Entry
    data object Objectives : Entry
    class SectionTitle(val index: Int, val section: LessonSection) : Entry
    class BlockEntry(val block: Block) : Entry
    data object Footer : Entry
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LessonScreen(lessonId: String, nav: Navigator) {
    val app = LocalApp.current
    val content = app.content
    val lesson = content.lessonById[lessonId]
    if (lesson == null) {
        ScreenFrame("レッスン", onBack = nav::back) { p -> Box(Modifier.padding(p)) { EmptyState("このレッスンは見つかりません") } }
        return
    }
    val store = app.store
    val scope = rememberCoroutineScope()
    val snapshot = rememberProgress().value
    val completed = snapshot?.lessonStatus(lesson.id) == "completed"

    // Mark as started when opened.
    LaunchedEffect(lesson.id) { store.touchLesson(lesson.id) }

    // Record study minutes (>= 1) when leaving; time in the background doesn't count.
    val lifecycle = LocalLifecycleOwner.current.lifecycle
    DisposableEffect(lesson.id, lifecycle) {
        val timer = StudyTimer().also { it.resume() }
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_STOP) timer.pause() else if (event == Lifecycle.Event.ON_START) timer.resume()
        }
        lifecycle.addObserver(observer)
        onDispose {
            lifecycle.removeObserver(observer)
            timer.pause()
            val minutes = timer.minutes()
            if (minutes >= 1) sessionScope.launch { store.recordStudySession(minOf(60, minutes), "lesson") }
        }
    }

    val entries = remember(lesson) {
        buildList {
            add(Entry.Header); add(Entry.Objectives)
            lesson.sections.forEachIndexed { i, s ->
                add(Entry.SectionTitle(i, s))
                s.blocks.forEach { add(Entry.BlockEntry(it)) }
            }
            add(Entry.Footer)
        }
    }
    val sectionStarts = remember(entries) { entries.withIndex().filter { it.value is Entry.SectionTitle }.map { it.index } }
    val listState = rememberLazyListState()
    // Section currently at the top of the screen (null while still in the header).
    val currentSection by remember(sectionStarts) {
        derivedStateOf {
            val first = listState.firstVisibleItemIndex
            sectionStarts.indexOfLast { it <= first }.takeIf { it >= 0 }
        }
    }
    // TEMPHACK start
    val hackAct = LocalContext.current as android.app.Activity
    LaunchedEffect(Unit) {
        val i = hackAct.intent.getIntExtra("item", -1)
        if (i >= 0) listState.scrollToItem(minOf(i, entries.lastIndex))
        if (hackAct.intent.getBooleanExtra("outline", false)) kotlinx.coroutines.delay(500)
    }
    // TEMPHACK end
    var outlineOpen by rememberSaveable { mutableStateOf(false) }

    ScreenFrame(
        content.areaById[lesson.areaId]?.shortTitle ?: "レッスン",
        onBack = nav::back,
        actions = {
            IconButton(onClick = { outlineOpen = true }) { Icon(Icons.AutoMirrored.Outlined.ListAlt, contentDescription = "目次") }
            BookmarkButton("lesson", lesson.id)
        },
    ) { padding ->
        Column(Modifier.padding(padding).fillMaxSize()) {
            AnimatedVisibility(visible = currentSection != null) {
                val idx = currentSection ?: 0
                Row(
                    Modifier.fillMaxWidth().background(Sg.colors.muted).clickable { outlineOpen = true }
                        .heightIn(min = 44.dp).padding(horizontal = ScreenPadding),
                    verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Text(
                        "${idx + 1}/${lesson.sections.size}",
                        style = MaterialTheme.typography.labelMedium.copy(fontFamily = FontFamily.Monospace), color = Sg.colors.mutedForeground,
                    )
                    Text(
                        lesson.sections.getOrNull(idx)?.title.orEmpty(), style = MaterialTheme.typography.labelLarge,
                        maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.weight(1f),
                    )
                    Icon(Icons.Filled.ExpandMore, "目次を開く", Modifier.size(20.dp), tint = Sg.colors.mutedForeground)
                }
            }
            LazyColumn(
                Modifier.fillMaxSize(), state = listState,
                contentPadding = PaddingValues(start = ScreenPadding, end = ScreenPadding, top = 4.dp, bottom = 40.dp),
                verticalArrangement = Arrangement.spacedBy(BlockSpacing),
            ) {
                itemsIndexed(entries) { _, entry ->
                    when (entry) {
                        Entry.Header -> LessonHeader(lesson, completed, snapshot != null, nav, onToggle = {
                            scope.launch { store.setLessonCompleted(lesson.id, !completed) }
                        })
                        Entry.Objectives -> if (lesson.objectives.isNotEmpty()) ObjectivesCard(lesson)
                        is Entry.SectionTitle -> Text(
                            entry.section.title,
                            style = MaterialTheme.typography.headlineSmall,
                            modifier = Modifier.padding(top = if (entry.index == 0) 8.dp else 26.dp),
                        )
                        is Entry.BlockEntry -> BlockItem(entry.block, nav)
                        Entry.Footer -> LessonFooter(lesson, completed, nav, onToggle = {
                            scope.launch { store.setLessonCompleted(lesson.id, !completed) }
                        })
                    }
                }
            }
        }
    }

    if (outlineOpen) {
        ModalBottomSheet(onDismissRequest = { outlineOpen = false }, containerColor = Sg.colors.background) {
            Text("目次", style = MaterialTheme.typography.titleLarge, modifier = Modifier.padding(horizontal = ScreenPadding, vertical = 4.dp))
            Column(Modifier.padding(bottom = 24.dp)) {
                lesson.sections.forEachIndexed { i, s ->
                    val active = currentSection == i
                    Row(
                        Modifier.fillMaxWidth().clickable {
                            outlineOpen = false
                            scope.launch { listState.animateScrollToItem(sectionStarts[i]) }
                        }.heightIn(min = 52.dp).padding(horizontal = ScreenPadding, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp),
                    ) {
                        Text(
                            "${i + 1}", style = MaterialTheme.typography.labelLarge.copy(fontFamily = FontFamily.Monospace),
                            color = if (active) Sg.colors.infoForeground else Sg.colors.mutedForeground, modifier = Modifier.width(20.dp),
                        )
                        Text(
                            s.title, style = MaterialTheme.typography.bodyLarge,
                            color = if (active) Sg.colors.infoForeground else Sg.colors.foreground,
                        )
                    }
                }
            }
        }
    }
}

// ---------------------------------------------------------------- header / footer

@Composable
private fun CompletionButton(completed: Boolean, enabled: Boolean, onToggle: () -> Unit, modifier: Modifier = Modifier) {
    SecondaryButton(
        if (completed) "完了を取り消す" else "完了にする", onToggle, modifier, enabled = enabled,
        icon = if (completed) Icons.Filled.CheckCircle else Icons.Outlined.CheckCircle,
    )
}

/** Starts the lesson quiz (max 8 questions); disabled when the lesson has no linked questions. */
@Composable
private fun QuizButton(lesson: Lesson, nav: Navigator, modifier: Modifier = Modifier) {
    val available = LocalApp.current.content.questionsForLesson(lesson.id).size
    PrimaryButton(
        "確認問題に挑戦", modifier = modifier, enabled = available > 0, icon = Icons.Filled.PlayArrow,
        onClick = {
            nav.startQuiz(
                QuizConfig(lessonIds = listOf(lesson.id), count = minOf(8, available), mode = "lesson", title = lesson.title, instantFeedback = true),
            )
        },
    )
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun LessonHeader(lesson: Lesson, completed: Boolean, loaded: Boolean, nav: Navigator, onToggle: () -> Unit) {
    val content = LocalApp.current.content
    Column(Modifier.padding(bottom = 4.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Badge("${lesson.readingMinutes}分")
            DifficultyBadge(lesson.difficulty)
            Badge("${lesson.sections.size}セクション")
            if (completed) Badge("読了済み", Tone.Success)
        }
        Text(lesson.title, style = MaterialTheme.typography.headlineMedium)
        Text(lesson.titleEn, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
        Text(lesson.summary, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)
        val questions = content.questionsForLesson(lesson.id).size
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(top = 4.dp)) {
            CompletionButton(completed, loaded, onToggle, Modifier.weight(1f))
            QuizButton(lesson, nav, Modifier.weight(1f))
        }
        if (questions == 0) Text("このレッスンに紐づく確認問題はまだありません。", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
        if (lesson.topicIds.isNotEmpty()) {
            Text(
                lesson.topicIds.joinToString("　") { "#" + content.topicName(it) },
                style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
            )
        }
        Divider(Modifier.padding(top = 6.dp))
    }
}

@Composable
private fun ObjectivesCard(lesson: Lesson) {
    SgCard(container = Sg.colors.muted.copy(alpha = 0.7f), borderColor = Sg.colors.muted) {
        Text("このレッスンの到達点", style = MaterialTheme.typography.titleSmall)
        Spacer(Modifier.height(8.dp))
        lesson.objectives.forEachIndexed { i, o ->
            Row(Modifier.padding(vertical = 3.dp), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("${i + 1}", style = MaterialTheme.typography.bodyMedium.copy(fontFamily = FontFamily.Monospace), color = Sg.colors.mutedForeground, modifier = Modifier.width(16.dp))
                Text(o, style = MaterialTheme.typography.bodyMedium)
            }
        }
    }
}

@Composable
private fun LessonFooter(lesson: Lesson, completed: Boolean, nav: Navigator, onToggle: () -> Unit) {
    val content = LocalApp.current.content
    val context = LocalContext.current
    val index = content.lessons.indexOfFirst { it.id == lesson.id }
    val prev = content.lessons.getOrNull(index - 1)
    val next = content.lessons.getOrNull(index + 1)
    val terms: List<GlossaryTerm> = remember(lesson) { lesson.termIds.mapNotNull { content.termById[it] } }
    val related = remember(lesson) { (lesson.prerequisites + lesson.relatedLessonIds).distinct().mapNotNull { content.lessonById[it] } }

    Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
        if (lesson.keyPoints.isNotEmpty()) {
            SgCard(container = Sg.colors.success.copy(alpha = 0.06f), borderColor = Sg.colors.success.copy(alpha = 0.3f)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(Icons.Outlined.CheckCircle, null, Modifier.size(20.dp), tint = Sg.colors.successForeground)
                    Text("このレッスンの要点", style = MaterialTheme.typography.titleMedium)
                }
                Spacer(Modifier.height(8.dp))
                lesson.keyPoints.forEach { p ->
                    Row(Modifier.padding(vertical = 4.dp), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Box(Modifier.padding(top = 10.dp).size(6.dp).clip(CircleShape).background(Sg.colors.success))
                        Text(p, style = MaterialTheme.typography.bodyMedium, modifier = Modifier.weight(1f))
                    }
                }
            }
        }
        if (lesson.examTraps.isNotEmpty()) {
            SgCard(container = Sg.colors.warning.copy(alpha = 0.07f), borderColor = Sg.colors.warning.copy(alpha = 0.3f)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(Icons.Outlined.WarningAmber, null, Modifier.size(20.dp), tint = Sg.colors.warningForeground)
                    Text("試験のひっかけ", style = MaterialTheme.typography.titleMedium)
                }
                Spacer(Modifier.height(8.dp))
                lesson.examTraps.forEachIndexed { i, t ->
                    Row(Modifier.padding(vertical = 4.dp), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text("${i + 1}", style = MaterialTheme.typography.bodyMedium.copy(fontFamily = FontFamily.Monospace), color = Sg.colors.warningForeground, modifier = Modifier.width(16.dp))
                        Text(t, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground, modifier = Modifier.weight(1f))
                    }
                }
            }
        }
        if (terms.isNotEmpty()) {
            SgCard {
                Text("このレッスンの用語", style = MaterialTheme.typography.titleMedium)
                Spacer(Modifier.height(6.dp))
                terms.forEachIndexed { i, term ->
                    if (i > 0) Divider()
                    Column(
                        Modifier.fillMaxWidth().clickable { nav.openTerm(term.id) }.heightIn(min = 48.dp).padding(vertical = 8.dp),
                        verticalArrangement = Arrangement.Center,
                    ) {
                        Text(
                            term.ja + if (!term.reading.isNullOrBlank()) "（${term.reading}）" else "",
                            style = MaterialTheme.typography.titleSmall,
                        )
                        Text(term.en, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
                    }
                }
            }
        }
        if (related.isNotEmpty()) {
            SgCard {
                Text("関連レッスン", style = MaterialTheme.typography.titleMedium)
                related.forEachIndexed { i, l ->
                    if (i > 0) Divider()
                    ListRow(l.title, subtitle = "${l.readingMinutes}分", onClick = { nav.openLesson(l.id) }, trailing = {
                        Icon(Icons.AutoMirrored.Filled.ArrowForward, null, Modifier.size(16.dp), tint = Sg.colors.mutedForeground)
                    })
                }
            }
        }

        Column(verticalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(top = 6.dp)) {
            QuizButton(lesson, nav, Modifier.fillMaxWidth())
            CompletionButton(completed, true, onToggle, Modifier.fillMaxWidth())
            Text(
                "誤答は自動で復習キューに入ります。読了だけでは習得扱いになりません。",
                style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
            )
        }

        if (prev != null || next != null) {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                if (prev != null) NeighbourCard("前のレッスン", prev, nav, Modifier.weight(1f), isNext = false) else Spacer(Modifier.weight(1f))
                if (next != null) NeighbourCard("次のレッスン", next, nav, Modifier.weight(1f), isNext = true) else Spacer(Modifier.weight(1f))
            }
        }

        if (lesson.sources.isNotEmpty()) {
            Column(Modifier.padding(top = 8.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text("出典・参考文献", style = MaterialTheme.typography.titleSmall)
                lesson.sources.forEach { src ->
                    Row(
                        Modifier.fillMaxWidth().clickable {
                            runCatching { context.startActivity(Intent(Intent.ACTION_VIEW, src.url.toUri())) }
                        }.heightIn(min = 44.dp).padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        Column(Modifier.weight(1f)) {
                            Text(src.label, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.infoForeground)
                            if (src.note != null) Text(src.note, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
                        }
                        Icon(Icons.AutoMirrored.Outlined.OpenInNew, "ブラウザで開く", Modifier.size(16.dp), tint = Sg.colors.mutedForeground)
                    }
                }
                Text(
                    "本文は学習用に独自執筆したものです。公式見解ではありません。試験制度・出題範囲は IPA の最新情報を確認してください。",
                    style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground, modifier = Modifier.padding(top = 6.dp),
                )
            }
        }
    }
}

@Composable
private fun NeighbourCard(label: String, lesson: Lesson, nav: Navigator, modifier: Modifier, isNext: Boolean) {
    SgCard(modifier, onClick = { nav.openLesson(lesson.id) }, contentPadding = 14.dp) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
            if (!isNext) Icon(Icons.AutoMirrored.Filled.ArrowBack, null, Modifier.size(14.dp), tint = Sg.colors.mutedForeground)
            Text(label, style = MaterialTheme.typography.labelMedium, color = Sg.colors.mutedForeground)
            if (isNext) Icon(Icons.AutoMirrored.Filled.ArrowForward, null, Modifier.size(14.dp), tint = Sg.colors.mutedForeground)
        }
        Spacer(Modifier.height(4.dp))
        Text(lesson.title, style = MaterialTheme.typography.titleSmall, maxLines = 3, overflow = TextOverflow.Ellipsis)
    }
}
