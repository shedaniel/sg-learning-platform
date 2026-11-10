package app.sgstudy.ui.mock

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import android.os.SystemClock
import android.view.WindowManager
import androidx.activity.compose.BackHandler
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Flag
import androidx.compose.material.icons.filled.GridView
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material.icons.outlined.Flag
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import app.sgstudy.LocalApp
import app.sgstudy.data.MockRow
import app.sgstudy.data.model.DIFFICULTY_LABEL
import app.sgstudy.data.model.PART_LABEL
import app.sgstudy.data.model.Question
import app.sgstudy.data.model.optionLabel
import app.sgstudy.logic.MockAnswer
import app.sgstudy.logic.formatClock
import app.sgstudy.ui.components.*
import app.sgstudy.ui.lesson.BlockList
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.theme.Sg
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock

private sealed interface RunLoad {
    data object Loading : RunLoad
    data object Missing : RunLoad
    data object Broken : RunLoad
    data object AlreadySubmitted : RunLoad
    data class Ready(val row: MockRow, val questions: List<Question>) : RunLoad
}

/**
 * The exam runner. The countdown is derived from the persisted `expiresAt`, so it keeps "running" while the app
 * is closed; state (answers, flags, position) is autosaved so the exam can be resumed after the process dies.
 */
@Composable
fun MockRunScreen(mockId: String, nav: Navigator) {
    val app = LocalApp.current
    val load by produceState<RunLoad>(RunLoad.Loading, mockId) {
        val row = app.store.mock(mockId)
        value = when {
            row == null -> RunLoad.Missing
            row.submittedAt != null -> RunLoad.AlreadySubmitted
            else -> {
                val qs = row.questionIds.mapNotNull { app.content.questionById[it] }
                if (qs.size != row.questionIds.size || qs.isEmpty()) RunLoad.Broken else RunLoad.Ready(row, qs)
            }
        }
    }
    when (val l = load) {
        RunLoad.Loading -> ScreenFrame("模擬試験", nav::back) { p ->
            Box(Modifier.padding(p).fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = Sg.colors.mutedForeground)
            }
        }
        RunLoad.Missing -> ScreenFrame("模擬試験", nav::back) { p ->
            EmptyState("模擬試験が見つかりません", "削除されたか、まだ作成されていません。", Modifier.padding(p))
        }
        RunLoad.Broken -> ScreenFrame("模擬試験", nav::back) { p ->
            EmptyState("問題データを読み込めません", "模擬試験をやり直してください。", Modifier.padding(p))
        }
        RunLoad.AlreadySubmitted -> ScreenFrame("模擬試験", nav::back) { p ->
            EmptyState("この模擬試験は提出済みです", "結果を確認できます。", Modifier.padding(p)) {
                PrimaryButton("結果を見る", { nav.openMockResult(mockId) })
            }
        }
        is RunLoad.Ready -> MockRunner(l.row, l.questions, nav)
    }
}

/** All mutable exam state, plus the per-question time bookkeeping. Touched on the main thread only. */
@Stable
private class RunState(row: MockRow, val questions: List<Question>) {
    /** questionId -> selected option id (only answered questions). */
    val answers = mutableStateMapOf<String, String>().also { m ->
        row.answers.forEach { (id, a) -> if (a.selected.isNotEmpty()) m[id] = a.selected }
    }
    var flags by mutableStateOf(row.flags.toSet())
    var index by mutableIntStateOf(row.currentIndex.coerceIn(0, questions.lastIndex))

    /** questionId -> accumulated time on the question in ms (includes time before it was answered). */
    private val spent = HashMap<String, Long>().also { m -> row.answers.forEach { (id, a) -> m[id] = a.elapsedMs } }
    /** elapsedRealtime when the current question was last (re)started; -1 while the screen is paused. */
    private var segmentStart = SystemClock.elapsedRealtime()

    val current get() = questions[index]
    val answeredCount get() = answers.size

    private fun commitTime() {
        if (segmentStart < 0) return
        val now = SystemClock.elapsedRealtime()
        spent[current.id] = (spent[current.id] ?: 0L) + (now - segmentStart)
        segmentStart = now
    }

    fun pause() { commitTime(); segmentStart = -1 }
    fun resume() { if (segmentStart < 0) segmentStart = SystemClock.elapsedRealtime() }

    fun goTo(next: Int) {
        if (next !in questions.indices || next == index) return
        commitTime(); index = next
    }

    fun select(optionId: String) { commitTime(); answers[current.id] = optionId }
    fun clearAnswer() { answers.remove(current.id) }
    fun toggleFlag() { flags = if (current.id in flags) flags - current.id else flags + current.id }

    /** Persistable view of the answers; settles the running question timer first. */
    fun snapshot(): Map<String, MockAnswer> {
        commitTime()
        return answers.mapValues { (id, sel) -> MockAnswer(sel, spent[id] ?: 0L) }
    }

    fun firstUnanswered(): Int = questions.indexOfFirst { it.id !in answers }
}

private tailrec fun Context.findActivity(): Activity? = when (this) {
    is Activity -> this
    is ContextWrapper -> baseContext.findActivity()
    else -> null
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun MockRunner(row: MockRow, questions: List<Question>, nav: Navigator) {
    val app = LocalApp.current
    val scope = rememberCoroutineScope()
    val state = remember(row.id) { RunState(row, questions) }
    val saveMutex = remember { Mutex() }
    var closed by remember { mutableStateOf(false) }
    var submitting by remember { mutableStateOf(false) }
    var timeUp by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var showNavigator by remember { mutableStateOf(false) }
    var showSubmit by remember { mutableStateOf(false) }
    var showExit by remember { mutableStateOf(false) }

    val expiresMs = remember(row.expiresAt) { isoMillis(row.expiresAt) }
    val remaining = remember { mutableIntStateOf(remainingSeconds(expiresMs)) }

    // The snapshot is taken inside the lock so a later save can never be overwritten by an older one.
    fun requestSave() {
        scope.launch {
            saveMutex.withLock {
                if (!closed) app.store.saveMockState(row.id, state.snapshot(), state.flags.toList(), state.index)
            }
        }
    }

    fun submit(auto: Boolean) {
        if (submitting) return
        submitting = true; error = null; showSubmit = false; showNavigator = false
        if (auto) timeUp = true
        scope.launch {
            saveMutex.withLock {
                try {
                    app.store.submitMock(
                        row.id, state.snapshot(), state.flags.toList(), state.index,
                        row.questionIds, app.content.questionById,
                    )
                    closed = true
                    nav.openMockResult(row.id, replaceCurrent = true)
                } catch (e: CancellationException) {
                    throw e
                } catch (e: Exception) {
                    submitting = false; timeUp = false
                    error = "提出に失敗しました。もう一度お試しください。"
                }
            }
        }
    }

    fun leave() {
        scope.launch {
            saveMutex.withLock { state.snapshot().let { app.store.saveMockState(row.id, it, state.flags.toList(), state.index) } }
            closed = true
            nav.back()
        }
    }

    // Countdown from the persisted deadline; auto-submits at zero (also when found expired on re-entry).
    LaunchedEffect(expiresMs) {
        while (true) {
            val left = remainingSeconds(expiresMs)
            remaining.intValue = left
            if (left <= 0) { submit(auto = true); break }
            delay(1000)
        }
    }
    // Periodic autosave.
    LaunchedEffect(Unit) { while (true) { delay(15_000); if (!submitting) requestSave() } }

    // Flush on pause/stop, pause the question timer while the app is not in the foreground.
    val lifecycleOwner = LocalLifecycleOwner.current
    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            when (event) {
                Lifecycle.Event.ON_PAUSE -> { state.pause(); if (!submitting) requestSave() }
                Lifecycle.Event.ON_STOP -> if (!submitting) requestSave()
                Lifecycle.Event.ON_RESUME -> state.resume()
                else -> {}
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose { lifecycleOwner.lifecycle.removeObserver(observer) }
    }

    // Keep the screen on for the duration of the exam.
    val context = LocalContext.current
    DisposableEffect(Unit) {
        val window = context.findActivity()?.window
        window?.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        onDispose { window?.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON) }
    }

    BackHandler(enabled = !submitting) { showExit = true }

    val question = state.current
    val scroll = rememberScrollState()
    LaunchedEffect(state.index) { scroll.scrollTo(0) }

    Scaffold(
        containerColor = Sg.colors.background,
        contentWindowInsets = WindowInsets(0),
        topBar = {
            RunTopBar(
                index = state.index, total = questions.size, question = question, remaining = remaining,
                answered = state.answeredCount,
                onClose = { showExit = true }, onOpenNavigator = { showNavigator = true },
            )
        },
        bottomBar = {
            RunBottomBar(
                canPrev = state.index > 0, isLast = state.index == questions.lastIndex,
                answered = state.answeredCount, total = questions.size,
                onPrev = { state.goTo(state.index - 1); requestSave() },
                onNext = { if (state.index == questions.lastIndex) showSubmit = true else { state.goTo(state.index + 1); requestSave() } },
                onOpenNavigator = { showNavigator = true },
            )
        },
    ) { padding ->
        Column(
            Modifier.padding(padding).fillMaxSize().verticalScroll(scroll)
                .padding(horizontal = ScreenPadding).padding(top = 12.dp, bottom = 24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                Badge(PART_LABEL[question.part] ?: question.part, Tone.Info)
                Badge(DIFFICULTY_LABEL[question.difficulty] ?: question.difficulty)
                Spacer(Modifier.weight(1f))
                FlagToggle(flagged = question.id in state.flags, onClick = { state.toggleFlag(); requestSave() })
            }

            RichText(question.stem, nav = null, style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Medium, lineHeight = 30.sp))
            question.presentation?.takeIf { it.isNotEmpty() }?.let { BlockList(it, nav) }

            val selected = state.answers[question.id]
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                question.options.forEach { option ->
                    OptionCard(
                        label = optionLabel(option.id), text = option.text, selected = selected == option.id,
                        onClick = { state.select(option.id); requestSave() },
                    )
                }
            }
            if (selected != null) {
                TextButton(onClick = { state.clearAnswer(); requestSave() }, modifier = Modifier.heightIn(min = 48.dp)) {
                    Text("解答を消す", color = Sg.colors.mutedForeground)
                }
            }
            error?.let { Text(it, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.destructiveForeground) }
        }
    }

    if (showNavigator) {
        ModalBottomSheet(
            onDismissRequest = { showNavigator = false },
            sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true),
            containerColor = Sg.colors.background,
        ) {
            NavigatorSheet(
                state = state,
                onPick = { state.goTo(it); requestSave(); showNavigator = false },
                onJumpUnanswered = { val i = state.firstUnanswered(); if (i >= 0) { state.goTo(i); requestSave() }; showNavigator = false },
                onSubmit = { showNavigator = false; showSubmit = true },
            )
        }
    }

    if (showSubmit) {
        val unanswered = questions.size - state.answeredCount
        val flagged = state.flags.count { id -> questions.any { it.id == id } }
        AlertDialog(
            onDismissRequest = { showSubmit = false },
            containerColor = Sg.colors.card,
            title = { Text("解答を提出しますか？") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text("解答済み ${state.answeredCount} / ${questions.size} 問。提出後は変更できません。")
                    if (unanswered > 0) Text("未解答が $unanswered 問あります（不正解として採点されます）。", color = Sg.colors.warningForeground)
                    if (flagged > 0) Text("「後で見直す」のフラグが $flagged 問に残っています。", color = Sg.colors.warningForeground)
                    Text("残り時間 ${formatClock(remaining.intValue)}", color = Sg.colors.mutedForeground)
                }
            },
            confirmButton = { TextButton(onClick = { submit(auto = false) }) { Text("提出する") } },
            dismissButton = { TextButton(onClick = { showSubmit = false }) { Text("試験に戻る") } },
        )
    }

    if (showExit) {
        AlertDialog(
            onDismissRequest = { showExit = false },
            containerColor = Sg.colors.card,
            title = { Text("試験を中断しますか？") },
            text = { Text("タイマーは止まりません。いまの解答は保存され、残り時間のあいだは模擬試験のホームから再開できます。") },
            confirmButton = { TextButton(onClick = { showExit = false; leave() }) { Text("中断して戻る") } },
            dismissButton = { TextButton(onClick = { showExit = false }) { Text("続ける") } },
        )
    }

    if (timeUp) {
        Box(Modifier.fillMaxSize().background(Sg.colors.background.copy(alpha = 0.94f)).clickable(enabled = false) {}, contentAlignment = Alignment.Center) {
            SgCard(Modifier.padding(32.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    CircularProgressIndicator(Modifier.size(24.dp), strokeWidth = 2.5.dp, color = Sg.colors.infoForeground)
                    Text("時間終了。自動採点しています…", style = MaterialTheme.typography.bodyLarge)
                }
            }
        }
    }
}

// --------------------------------------------------------------------------------------------- pieces

@Composable
private fun RunTopBar(
    index: Int, total: Int, question: Question, remaining: State<Int>, answered: Int,
    onClose: () -> Unit, onOpenNavigator: () -> Unit,
) {
    Column(Modifier.fillMaxWidth().background(Sg.colors.background)) {
        Row(Modifier.fillMaxWidth().height(60.dp).padding(end = 12.dp), verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onClose, modifier = Modifier.size(52.dp)) {
                Icon(Icons.Filled.Close, contentDescription = "試験を中断")
            }
            Column(Modifier.weight(1f)) {
                Text("問 ${index + 1} / $total", style = MaterialTheme.typography.titleMedium)
                Text("解答済み $answered/$total", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
            }
            TimerChip(remaining)
            Spacer(Modifier.width(4.dp))
            IconButton(onClick = onOpenNavigator, modifier = Modifier.size(48.dp)) {
                Icon(Icons.Filled.GridView, contentDescription = "問題一覧")
            }
        }
        SgProgressBar(answered / total.toFloat(), Modifier.fillMaxWidth(), height = 3.dp)
        Divider()
    }
}

/** Countdown pill: neutral, amber at ≤10 min, red at ≤5 min. Reads the State so only this node ticks. */
@Composable
private fun TimerChip(remaining: State<Int>) {
    val sec = remaining.value
    val tone = when {
        sec <= 300 -> Tone.Danger
        sec <= 600 -> Tone.Warning
        else -> Tone.Neutral
    }
    val fg = if (tone == Tone.Neutral) Sg.colors.foreground else tone.color()
    val bg = if (tone == Tone.Neutral) Sg.colors.card else tone.container()
    val border = when (tone) {
        Tone.Danger -> Sg.colors.destructive.copy(alpha = 0.5f)
        Tone.Warning -> Sg.colors.warning.copy(alpha = 0.5f)
        else -> Sg.colors.border
    }
    Row(
        Modifier.clip(RoundedCornerShape(50)).background(bg).border(BorderStroke(1.dp, border), RoundedCornerShape(50))
            .padding(horizontal = 12.dp, vertical = 7.dp)
            .semantics { contentDescription = "残り時間 ${sec / 60}分${sec % 60}秒" },
        verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        Icon(Icons.Filled.Timer, null, Modifier.size(16.dp), tint = fg)
        Text(formatClock(sec), style = MaterialTheme.typography.titleSmall.copy(fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold), color = fg)
    }
}

@Composable
private fun RunBottomBar(
    canPrev: Boolean, isLast: Boolean, answered: Int, total: Int,
    onPrev: () -> Unit, onNext: () -> Unit, onOpenNavigator: () -> Unit,
) {
    Column(Modifier.fillMaxWidth().background(Sg.colors.background)) {
        Divider()
        Row(
            Modifier.fillMaxWidth().navigationBarsPadding().padding(horizontal = 12.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically,
        ) {
            SecondaryButton("前へ", onPrev, Modifier.weight(1f), enabled = canPrev, icon = Icons.AutoMirrored.Filled.ArrowBack)
            SecondaryButton("一覧 $answered/$total", onOpenNavigator, Modifier.weight(1.25f), icon = Icons.Filled.GridView)
            if (isLast) PrimaryButton("提出へ", onNext, Modifier.weight(1f), icon = Icons.AutoMirrored.Filled.Send)
            else PrimaryButton("次へ", onNext, Modifier.weight(1f), icon = Icons.AutoMirrored.Filled.ArrowForward)
        }
    }
}

@Composable
private fun FlagToggle(flagged: Boolean, onClick: () -> Unit) {
    val shape = RoundedCornerShape(10.dp)
    val fg = if (flagged) Sg.colors.warningForeground else Sg.colors.mutedForeground
    Row(
        Modifier.heightIn(min = 48.dp).clip(shape)
            .background(if (flagged) Tone.Warning.container() else Sg.colors.background)
            .border(BorderStroke(1.dp, if (flagged) Sg.colors.warning.copy(alpha = 0.5f) else Sg.colors.input), shape)
            .clickable(onClick = onClick).padding(horizontal = 12.dp),
        verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        Icon(if (flagged) Icons.Filled.Flag else Icons.Outlined.Flag, null, Modifier.size(18.dp), tint = fg)
        Text(if (flagged) "見直しフラグ解除" else "後で見直す", style = MaterialTheme.typography.labelLarge, color = fg)
    }
}

@Composable
private fun OptionCard(label: String, text: String, selected: Boolean, onClick: () -> Unit) {
    val shape = RoundedCornerShape(12.dp)
    Row(
        Modifier.fillMaxWidth().heightIn(min = 56.dp).clip(shape)
            .background(if (selected) Sg.colors.info.copy(alpha = 0.10f) else Sg.colors.card)
            .border(BorderStroke(if (selected) 2.dp else 1.dp, if (selected) Sg.colors.info else Sg.colors.border), shape)
            .clickable(onClick = onClick).padding(horizontal = 14.dp, vertical = 12.dp)
            .semantics { contentDescription = "$label ${if (selected) "選択中 " else ""}$text" },
        verticalAlignment = Alignment.Top, horizontalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Box(
            Modifier.size(30.dp).clip(CircleShape)
                .background(if (selected) Sg.colors.info else Sg.colors.background)
                .border(BorderStroke(1.dp, if (selected) Sg.colors.info else Sg.colors.input), CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            Text(label, style = MaterialTheme.typography.labelLarge, color = if (selected) androidx.compose.ui.graphics.Color.White else Sg.colors.mutedForeground)
        }
        RichText(text, nav = null, modifier = Modifier.weight(1f).padding(top = 1.dp), style = MaterialTheme.typography.bodyLarge.copy(lineHeight = 26.sp))
    }
}

/** 解答状況: question grid grouped by 科目A / 科目B (numbers are exam positions), plus quick actions. */
@Composable
private fun NavigatorSheet(state: RunState, onPick: (Int) -> Unit, onJumpUnanswered: () -> Unit, onSubmit: () -> Unit) {
    val questions = state.questions
    val flaggedCount = questions.count { it.id in state.flags }
    val unanswered = questions.size - state.answeredCount
    Column(
        Modifier.fillMaxWidth().verticalScroll(rememberScrollState()).padding(horizontal = ScreenPadding).padding(bottom = 16.dp).navigationBarsPadding(),
        verticalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        Text("解答状況", style = MaterialTheme.typography.titleLarge)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Badge("解答済み ${state.answeredCount}", Tone.Info)
            Badge("未解答 $unanswered", if (unanswered > 0) Tone.Warning else Tone.Neutral)
            Badge("フラグ $flaggedCount", if (flaggedCount > 0) Tone.Warning else Tone.Neutral)
        }
        listOf("A", "B").forEach { part ->
            val indices = questions.indices.filter { questions[it].part == part }
            if (indices.isEmpty()) return@forEach
            val answeredInPart = indices.count { questions[it].id in state.answers }
            Text(
                "${PART_LABEL[part]}  ${answeredInPart}/${indices.size}問",
                style = MaterialTheme.typography.titleSmall, color = Sg.colors.mutedForeground,
            )
            BoxWithConstraints(Modifier.fillMaxWidth()) {
                val cols = 6
                val gap = 8.dp
                val cell = (maxWidth - gap * (cols - 1)) / cols
                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(gap), verticalArrangement = Arrangement.spacedBy(gap),
                    maxItemsInEachRow = cols,
                ) {
                    indices.forEach { i ->
                        val q = questions[i]
                        QuestionCell(
                            number = i + 1, size = cell, current = i == state.index,
                            answered = q.id in state.answers, flagged = q.id in state.flags, onClick = { onPick(i) },
                        )
                    }
                }
            }
        }
        Row(horizontalArrangement = Arrangement.spacedBy(14.dp), verticalAlignment = Alignment.CenterVertically) {
            Legend(Sg.colors.primary, "現在")
            Legend(Sg.colors.info.copy(alpha = 0.3f), "解答済み")
            Legend(Sg.colors.card, "未解答", bordered = true)
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                Icon(Icons.Filled.Flag, null, Modifier.size(14.dp), tint = Sg.colors.warning)
                Text("フラグ", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
            }
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            if (unanswered > 0) SecondaryButton("未解答へ移動", onJumpUnanswered, Modifier.weight(1f))
            PrimaryButton("提出する", onSubmit, Modifier.weight(1f), icon = Icons.AutoMirrored.Filled.Send)
        }
    }
}

@Composable
private fun QuestionCell(number: Int, size: androidx.compose.ui.unit.Dp, current: Boolean, answered: Boolean, flagged: Boolean, onClick: () -> Unit) {
    val shape = RoundedCornerShape(10.dp)
    val bg = when { current -> Sg.colors.primary; answered -> Sg.colors.info.copy(alpha = 0.14f); else -> Sg.colors.card }
    val border = when { current -> Sg.colors.primary; answered -> Sg.colors.info.copy(alpha = 0.5f); else -> Sg.colors.border }
    val fg = when { current -> Sg.colors.onPrimary; answered -> Sg.colors.infoForeground; else -> Sg.colors.mutedForeground }
    Box(
        Modifier.size(size, 46.dp).clip(shape).background(bg).border(BorderStroke(1.dp, border), shape).clickable(onClick = onClick)
            .semantics { contentDescription = "問$number ${if (answered) "解答済み" else "未解答"}${if (flagged) " フラグあり" else ""}" },
        contentAlignment = Alignment.Center,
    ) {
        Text("$number", style = MaterialTheme.typography.labelLarge.copy(fontFamily = FontFamily.Monospace), color = fg, textAlign = TextAlign.Center)
        if (flagged) Icon(Icons.Filled.Flag, null, Modifier.align(Alignment.TopEnd).padding(2.dp).size(13.dp), tint = Sg.colors.warning)
    }
}

@Composable
private fun Legend(color: androidx.compose.ui.graphics.Color, label: String, bordered: Boolean = false) {
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
        Box(
            Modifier.size(12.dp).clip(RoundedCornerShape(3.dp)).background(color)
                .then(if (bordered) Modifier.border(BorderStroke(1.dp, Sg.colors.border), RoundedCornerShape(3.dp)) else Modifier),
        )
        Text(label, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
    }
}
