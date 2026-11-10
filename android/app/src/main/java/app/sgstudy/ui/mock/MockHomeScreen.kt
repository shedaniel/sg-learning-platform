package app.sgstudy.ui.mock

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import app.sgstudy.LocalApp
import app.sgstudy.data.MockHistoryRow
import app.sgstudy.data.MockRow
import app.sgstudy.logic.*
import app.sgstudy.ui.components.*
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.theme.Sg
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

private data class HomeData(val unfinished: MockRow?, val history: List<MockHistoryRow>)

/** 模擬試験: exam facts, start / resume, score history. Reached from その他. */
@Composable
fun MockHomeScreen(nav: Navigator) {
    val app = LocalApp.current
    val scope = rememberCoroutineScope()
    val version by app.store.version.collectAsState()
    val data by produceState<HomeData?>(null, version) {
        value = HomeData(app.store.unfinishedMock(), app.store.mockHistory())
    }
    var busy by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var confirmDiscard by remember { mutableStateOf(false) }
    val enoughQuestions = app.content.questions.size >= ExamFacts.QUESTIONS
    val unfinished = data?.unfinished

    MockScrollScreen("模擬試験", nav::back) {
        Text(
            "本番と同じ科目A 48問 + 科目B 12問、60問・120分。フラグ、未解答表示、自動保存、時間切れの自動提出まで、本番に近い操作で練習します。",
            style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground,
        )

        if (unfinished != null) {
            ResumeBanner(
                row = unfinished, busy = busy,
                onResume = { nav.openMockRun(unfinished.id) },
                onSubmitExpired = {
                    if (!busy) {
                        busy = true
                        scope.launch {
                            runCatching { submitSavedMock(app, unfinished) }
                                .onSuccess { nav.openMockResult(unfinished.id) }
                                .onFailure { error = "提出に失敗しました"; busy = false }
                        }
                    }
                },
                onDiscard = { confirmDiscard = true },
            )
        }

        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            StatTile("制限時間", "120分", Modifier.weight(1f))
            StatTile("科目A", "48問", Modifier.weight(1f))
            StatTile("科目B", "12問", Modifier.weight(1f))
        }

        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            PrimaryButton(
                text = "120分の模擬試験を開始",
                icon = Icons.Filled.PlayArrow,
                enabled = enoughQuestions && unfinished == null && !busy && data != null,
                modifier = Modifier.fillMaxWidth(),
                onClick = {
                    busy = true; error = null
                    scope.launch {
                        val id = runCatching { startNewMock(app) }.getOrNull()
                        busy = false
                        if (id != null) nav.openMockRun(id) else error = "模擬試験を開始できませんでした"
                    }
                },
            )
            when {
                !enoughQuestions -> Hint("問題バンクが60問未満のため開始できません。")
                unfinished != null -> Hint("進行中の模擬試験を再開するか、破棄してから新しく始めてください。")
                else -> Hint("開始するとタイマーが動きます。途中で閉じても残り時間は進み、続きから再開できます。", Icons.Filled.Timer)
            }
            error?.let { Text(it, style = MaterialTheme.typography.bodySmall, color = Sg.colors.destructiveForeground) }
            SecondaryButton("公式過去問を見る", nav::openPastPapers, Modifier.fillMaxWidth(), icon = Icons.Filled.Description)
        }

        SgCard {
            Text("構成と注意点", style = MaterialTheme.typography.titleMedium)
            Spacer(Modifier.height(8.dp))
            listOf(
                "本番と同じ選択式（ア〜エ など）。科目Bは事例・組合せ問題を含みます。",
                "問題一覧で、解答済み・未解答・見直しフラグを確認できます。",
                "15秒ごとと操作のたびに自動保存。アプリを閉じても続きから再開できます。",
                "残り10分でタイマーが黄色、5分で赤になり、0秒で自動提出されます。",
                "試験中は正誤や解説は表示されません。提出後にまとめて確認します。",
            ).forEach { Bullet(it) }
        }

        val history = data?.history.orEmpty()
        if (history.isNotEmpty()) {
            SectionTitle("履歴")
            if (history.size >= 2) TrendCard(history)
            SgCard(contentPadding = 4.dp) {
                history.forEachIndexed { i, h ->
                    if (i > 0) Divider(Modifier.padding(horizontal = 12.dp))
                    HistoryRow(h, onClick = { nav.openMockResult(h.id) })
                }
            }
        }

        SgCard {
            Text("時間配分の目安", style = MaterialTheme.typography.titleMedium)
            Spacer(Modifier.height(4.dp))
            listOf("科目A 48問" to "約50分", "科目B 12問" to "約60分", "見直し" to "残り10分").forEach { (a, b) ->
                Row(Modifier.fillMaxWidth().padding(vertical = 6.dp)) {
                    Text(a, Modifier.weight(1f), style = MaterialTheme.typography.bodyMedium)
                    Text(b, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)
                }
            }
            Text(
                "科目Bは問題文が長く、組合せ選択肢もあります。Aで時間を作り、Bに60分残すのが現実的です。",
                style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
            )
        }

        Text(MOCK_SCORE_DISCLAIMER, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
    }

    if (confirmDiscard && unfinished != null) {
        AlertDialog(
            onDismissRequest = { confirmDiscard = false },
            containerColor = Sg.colors.card,
            title = { Text("進行中の模擬試験を破棄しますか？") },
            text = { Text("解答は採点されず、記録も残りません。この操作は取り消せません。") },
            confirmButton = {
                TextButton(onClick = {
                    confirmDiscard = false
                    scope.launch { app.store.deleteMock(unfinished.id) }
                }) { Text("破棄する", color = Sg.colors.destructiveForeground) }
            },
            dismissButton = { TextButton(onClick = { confirmDiscard = false }) { Text("キャンセル") } },
        )
    }
}

@Composable
private fun Hint(text: String, icon: androidx.compose.ui.graphics.vector.ImageVector? = null) {
    Row(verticalAlignment = Alignment.Top, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
        if (icon != null) Icon(icon, null, Modifier.padding(top = 3.dp).size(16.dp), tint = Sg.colors.mutedForeground)
        Text(text, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
    }
}

@Composable
private fun Bullet(text: String) {
    Row(Modifier.padding(vertical = 3.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Text("・", style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)
        Text(text, style = MaterialTheme.typography.bodyMedium)
    }
}

@Composable
private fun ResumeBanner(row: MockRow, busy: Boolean, onResume: () -> Unit, onSubmitExpired: () -> Unit, onDiscard: () -> Unit) {
    val expiresMs = remember(row.expiresAt) { isoMillis(row.expiresAt) }
    val remaining by produceState(remainingSeconds(expiresMs), expiresMs) {
        while (true) { value = remainingSeconds(expiresMs); delay(1000) }
    }
    val expired = remaining <= 0
    val answered = row.answers.count { it.value.selected.isNotEmpty() }
    SgCard(container = Tone.Warning.container(), borderColor = Sg.colors.warning.copy(alpha = 0.4f)) {
        Text("進行中の模擬試験があります", style = MaterialTheme.typography.titleMedium)
        Spacer(Modifier.height(4.dp))
        if (expired) {
            Text("制限時間が終了しています。提出すると、保存済みの解答で採点されます。", style = MaterialTheme.typography.bodyMedium)
        } else {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                Text("残り", style = MaterialTheme.typography.bodyMedium)
                Text(
                    formatClock(remaining), style = MaterialTheme.typography.titleLarge.copy(fontFamily = FontFamily.Monospace),
                    color = if (remaining <= 300) Sg.colors.destructiveForeground else Sg.colors.foreground,
                )
            }
        }
        Text(
            "${formatDateTime(row.startedAt)} 開始 · 解答 $answered/${row.total}問",
            style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
        )
        Spacer(Modifier.height(12.dp))
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            if (expired) PrimaryButton("提出して採点", onSubmitExpired, Modifier.weight(1f), enabled = !busy)
            else PrimaryButton("再開する", onResume, Modifier.weight(1f))
            TextButton(onClick = onDiscard, modifier = Modifier.heightIn(min = 48.dp)) {
                Text("破棄", color = Sg.colors.destructiveForeground)
            }
        }
    }
}

/** Accuracy of the last attempts as a small bar chart, oldest on the left. */
@Composable
private fun TrendCard(history: List<MockHistoryRow>) {
    val points = history.take(10).reversed()
    SgCard {
        Text("正答率の推移", style = MaterialTheme.typography.titleMedium)
        Text("素点正答率（直近${points.size}回）", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
        Spacer(Modifier.height(12.dp))
        Row(Modifier.fillMaxWidth().height(110.dp), horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.Bottom) {
            points.forEach { h ->
                val p = percent(h.correct, h.total)
                Column(Modifier.weight(1f).fillMaxHeight(), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Bottom) {
                    Text("$p", style = MaterialTheme.typography.labelSmall.copy(fontFamily = FontFamily.Monospace), color = Sg.colors.mutedForeground)
                    Spacer(Modifier.height(2.dp))
                    Box(
                        Modifier.fillMaxWidth().fillMaxHeight((p / 100f * 0.8f).coerceAtLeast(0.02f))
                            .clip(RoundedCornerShape(topStart = 4.dp, topEnd = 4.dp)).background(accuracyColor(p)),
                    )
                }
            }
        }
    }
}

@Composable
private fun HistoryRow(h: MockHistoryRow, onClick: () -> Unit) {
    val p = percent(h.correct, h.total)
    Row(
        Modifier.fillMaxWidth().clickable(onClick = onClick).padding(horizontal = 12.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text(
            "$p%", Modifier.width(64.dp), textAlign = TextAlign.Start,
            style = MaterialTheme.typography.titleLarge.copy(fontFamily = FontFamily.Monospace, fontWeight = FontWeight.SemiBold),
        )
        Column(Modifier.weight(1f)) {
            Text(formatDateTime(h.startedAt), style = MaterialTheme.typography.titleSmall)
            Text(
                "${h.correct}/${h.total}問 · ${Math.round(h.durationSec / 60f)}分",
                style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
            )
        }
        Text("結果", style = MaterialTheme.typography.labelLarge, color = Sg.colors.infoForeground)
        Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, null, tint = Sg.colors.mutedForeground)
    }
}
