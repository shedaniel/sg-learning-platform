package app.sgstudy.ui.settings

import android.content.Intent
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.clickable
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.OpenInNew
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Upload
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import app.sgstudy.LocalApp
import app.sgstudy.ui.components.*
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.theme.Sg
import app.sgstudy.ui.theme.ThemeMode
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.time.LocalDate

/** Result line shown under the backup buttons. */
private data class Notice(val text: String, val tone: Tone)

private const val MAX_BACKUP_BYTES = 50 * 1024 * 1024

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun SettingsScreen(nav: Navigator) {
    val app = LocalApp.current
    val content = app.content
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    var notice by remember { mutableStateOf<Notice?>(null) }
    var busy by remember { mutableStateOf(false) }
    /** Backup text read from a picked file, waiting for the user's confirmation. */
    var pendingImport by remember { mutableStateOf<String?>(null) }
    var resetStep by rememberSaveable { mutableIntStateOf(0) } // 0 none, 1 first dialog, 2 second dialog

    val exportLauncher = rememberLauncherForActivityResult(ActivityResultContracts.CreateDocument("application/json")) { uri: Uri? ->
        if (uri == null) return@rememberLauncherForActivityResult
        scope.launch {
            busy = true
            notice = runCatching {
                val json = app.store.exportJson()
                withContext(Dispatchers.IO) {
                    context.contentResolver.openOutputStream(uri, "wt")?.use { it.write(json.toByteArray(Charsets.UTF_8)) }
                        ?: error("ファイルを開けませんでした")
                }
                Notice("バックアップを書き出しました（${json.length / 1024 + 1} KB）。", Tone.Success)
            }.getOrElse { Notice("書き出しに失敗しました: ${it.message ?: "不明なエラー"}", Tone.Danger) }
            busy = false
        }
    }
    val importLauncher = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri: Uri? ->
        if (uri == null) return@rememberLauncherForActivityResult
        scope.launch {
            busy = true
            runCatching {
                val text = withContext(Dispatchers.IO) {
                    val stream = context.contentResolver.openInputStream(uri) ?: error("ファイルを開けませんでした")
                    stream.use { s ->
                        val bytes = s.readNBytes(MAX_BACKUP_BYTES + 1)
                        require(bytes.size <= MAX_BACKUP_BYTES) { "ファイルが大きすぎます" }
                        bytes.toString(Charsets.UTF_8)
                    }
                }
                // Cheap sanity check before asking for confirmation; importJson re-validates inside a transaction.
                require(text.trimStart().startsWith("{") && "\"sg-study\"" in text) { "SG学習のバックアップファイルではありません" }
                pendingImport = text
            }.onFailure { notice = Notice("読み込めませんでした: ${it.message ?: "不明なエラー"}", Tone.Danger) }
            busy = false
        }
    }

    ScrollScreen("設定", onBack = nav::back) {
        // --- display
        SectionTitle("表示")
        SgCard {
            Text("テーマ", style = MaterialTheme.typography.titleSmall)
            Spacer(Modifier.height(10.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                ChoiceChip("システム", app.themeMode == ThemeMode.System, { app.themeMode = ThemeMode.System })
                ChoiceChip("ライト", app.themeMode == ThemeMode.Light, { app.themeMode = ThemeMode.Light })
                ChoiceChip("ダーク", app.themeMode == ThemeMode.Dark, { app.themeMode = ThemeMode.Dark })
            }
            Spacer(Modifier.height(8.dp))
            Divider()
            Row(
                Modifier.fillMaxWidth().heightIn(min = 56.dp).clickable { app.showEnglish = !app.showEnglish }.padding(top = 8.dp),
                verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                Column(Modifier.weight(1f)) {
                    Text("英語の補足を表示", style = MaterialTheme.typography.titleSmall)
                    Text("用語・問題の解説に英語訳を併記します。", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
                }
                Switch(
                    checked = app.showEnglish, onCheckedChange = { app.showEnglish = it },
                    colors = SwitchDefaults.colors(checkedTrackColor = Sg.colors.info, checkedThumbColor = androidx.compose.ui.graphics.Color.White),
                )
            }
        }

        // --- backup
        SectionTitle("バックアップ")
        SgCard {
            Text(
                "学習記録（レッスン・用語・解答履歴・復習・模擬試験・ブックマーク）はこの端末内にだけ保存されます。機種変更や消去に備えて、JSONファイルに書き出せます。",
                style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground,
            )
            Spacer(Modifier.height(14.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                PrimaryButton("書き出す", { notice = null; exportLauncher.launch("sg-study-backup-${LocalDate.now()}.json") }, Modifier.weight(1f), enabled = !busy, icon = Icons.Filled.Upload)
                SecondaryButton("読み込む", { notice = null; importLauncher.launch(arrayOf("application/json", "text/plain", "application/octet-stream", "*/*")) }, Modifier.weight(1f), enabled = !busy, icon = Icons.Filled.Download)
            }
            notice?.let {
                Spacer(Modifier.height(12.dp))
                Text(
                    it.text,
                    modifier = Modifier.fillMaxWidth().background(it.tone.container(), MaterialTheme.shapes.small).padding(12.dp),
                    style = MaterialTheme.typography.bodyMedium, color = it.tone.color(),
                )
            }
        }

        // --- reset
        SectionTitle("学習記録のリセット")
        SgCard {
            Text(
                "すべての学習記録を削除し、初期状態に戻します。この操作は取り消せません。必要なら先にバックアップを書き出してください。",
                style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground,
            )
            Spacer(Modifier.height(14.dp))
            DangerButton("すべての進捗をリセット", { resetStep = 1 })
        }

        // --- about
        SectionTitle("このアプリについて")
        AboutSection()
    }

    // --- dialogs
    pendingImport?.let { text ->
        AlertDialog(
            onDismissRequest = { pendingImport = null },
            title = { Text("バックアップを復元しますか？") },
            text = { Text("現在の学習記録はすべて、このファイルの内容に置き換えられます。この操作は取り消せません。") },
            confirmButton = {
                TextButton(onClick = {
                    pendingImport = null
                    scope.launch {
                        busy = true
                        notice = runCatching { app.store.importJson(text); Notice("バックアップを復元しました。", Tone.Success) }
                            .getOrElse { Notice("復元に失敗しました（現在の記録は変更されていません）: ${it.message ?: "不明なエラー"}", Tone.Danger) }
                        busy = false
                    }
                }) { Text("復元する", color = Sg.colors.destructiveForeground) }
            },
            dismissButton = { TextButton(onClick = { pendingImport = null }) { Text("キャンセル") } },
            containerColor = Sg.colors.card,
        )
    }
    if (resetStep == 1) {
        AlertDialog(
            onDismissRequest = { resetStep = 0 },
            title = { Text("すべての進捗を削除しますか？") },
            text = { Text("レッスンの完了、覚えた用語、解答履歴、復習予定、模擬試験の結果、ブックマークがすべて消えます。") },
            confirmButton = { TextButton(onClick = { resetStep = 2 }) { Text("次へ", color = Sg.colors.destructiveForeground) } },
            dismissButton = { TextButton(onClick = { resetStep = 0 }) { Text("キャンセル") } },
            containerColor = Sg.colors.card,
        )
    }
    if (resetStep == 2) {
        AlertDialog(
            onDismissRequest = { resetStep = 0 },
            title = { Text("本当にリセットしますか？") },
            text = { Text("この操作は取り消せません。バックアップがない場合、記録は元に戻せません。") },
            confirmButton = {
                TextButton(onClick = {
                    resetStep = 0
                    scope.launch {
                        notice = runCatching { app.store.reset(); Notice("学習記録をリセットしました。", Tone.Success) }
                            .getOrElse { Notice("リセットに失敗しました: ${it.message ?: "不明なエラー"}", Tone.Danger) }
                    }
                }) { Text("完全に削除する", color = Sg.colors.destructiveForeground) }
            },
            dismissButton = { TextButton(onClick = { resetStep = 0 }) { Text("やめる") } },
            containerColor = Sg.colors.card,
        )
    }
}

@Composable
private fun DangerButton(text: String, onClick: () -> Unit) {
    androidx.compose.material3.OutlinedButton(
        onClick = onClick, modifier = Modifier.fillMaxWidth().heightIn(min = 48.dp), shape = MaterialTheme.shapes.medium,
        border = androidx.compose.foundation.BorderStroke(1.dp, Sg.colors.destructive.copy(alpha = 0.6f)),
        colors = androidx.compose.material3.ButtonDefaults.outlinedButtonColors(contentColor = Sg.colors.destructiveForeground),
    ) { Text(text, style = MaterialTheme.typography.labelLarge) }
}

@Composable
private fun AboutSection() {
    val content = LocalApp.current.content
    val s = content.syllabus
    val context = LocalContext.current
    SgCard {
        Text("SG 学習プラットフォーム", style = MaterialTheme.typography.titleMedium)
        Spacer(Modifier.height(6.dp))
        Text(
            "情報セキュリティマネジメント試験（SG）の日本語教材・演習・公式公開問題・模擬試験をまとめた、非公式の個人用学習アプリです。IPA（情報処理推進機構）とは無関係で、IPAの公式アプリではありません。試験の名称は説明目的で使用しています。",
            style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground,
        )
        Spacer(Modifier.height(12.dp))
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            CountTile("${content.lessons.size}", "レッスン", Modifier.weight(1f))
            CountTile("${content.terms.size}", "用語", Modifier.weight(1f))
            CountTile("${content.questions.size}", "問題", Modifier.weight(1f))
            CountTile("${content.officialQuestions.size}", "公式問題", Modifier.weight(1f))
        }
    }
    SgCard {
        Text("試験の公式情報", style = MaterialTheme.typography.titleSmall)
        Spacer(Modifier.height(6.dp))
        listOf(
            "${s.examStructure.questions}問・${s.examStructure.minutes}分",
            "科目A：四肢択一 ${s.examStructure.partA}問 ／ 科目B：多肢選択式 ${s.examStructure.partB}問",
            "IPAはIRT（項目応答理論）による評価点で判定します（総合600点/1000点）。本アプリは素点の正答率のみを表示し、合否は予測しません。",
        ).forEach { Text("・$it", style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground) }
        Spacer(Modifier.height(10.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            Badge("現行 ${s.current}", Tone.Info)
            Badge("確認 ${s.verifiedAt}")
        }
        Spacer(Modifier.height(6.dp))
        Text(
            "シラバス ${s.current}（${s.currentPublished}公表）が現行の出題範囲です。2027年度の新試験制度のシラバス案（${s.proposed}、${s.proposedPublished}公表）は案であり、現行試験の出題範囲としては扱っていません。制度は変更される可能性があるため、受験前に必ず公式ページを確認してください。",
            style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
        )
        Spacer(Modifier.height(6.dp))
        s.sources.forEach { src ->
            Row(
                Modifier.fillMaxWidth().heightIn(min = 44.dp).clickable {
                    runCatching { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(src.url)).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) }
                },
                verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                Text(src.label, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.infoForeground, modifier = Modifier.weight(1f))
                Icon(Icons.AutoMirrored.Filled.OpenInNew, "外部リンク", tint = Sg.colors.infoForeground, modifier = Modifier.size(18.dp))
            }
        }
    }
    SgCard {
        Text("公式過去問の扱い", style = MaterialTheme.typography.titleSmall)
        Spacer(Modifier.height(6.dp))
        Text(
            "IPAが公開しているSGのCBT公開問題（2023〜2026年度、各15問）を収録しています。実際の試験は60問ですが、公開されているのは一部のみで、本アプリは15問を「完全な過去問」として提示しません。問題文・選択肢は原文に基づき、図表は等価な表・箇条書きとして再構成しています。解説は本アプリ独自のものです。2016〜2019年度の筆記試験は完全な問題冊子・解答例へのリンクのみを掲載し、アプリ内出題はしていません。",
            style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground,
        )
        Spacer(Modifier.height(6.dp))
        Text(
            "IPAの公表資料は、法令の特別な定めがある場合を除き、許諾や使用料なく利用できます。出典・年度・問題番号・PDFのURLを各問に表示しています。",
            style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
        )
    }
    SgCard {
        Text("スコアと合否について", style = MaterialTheme.typography.titleSmall)
        Spacer(Modifier.height(6.dp))
        Text(
            "「暫定準備度」は、レッスン完了率・直近正答率・分野の広がり・模擬試験の独自加重による指標です。公式の採点モデルを持たないため、合格可能性や評価点を再現・断定しません。模擬試験は素点と分野別の傾向のみを表示します。",
            style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground,
        )
    }
    SgCard {
        Text("データとプライバシー", style = MaterialTheme.typography.titleSmall)
        Spacer(Modifier.height(6.dp))
        listOf(
            "学習記録はこの端末内のデータベースにだけ保存され、外部には送信されません。",
            "アカウント登録・通信は不要で、完全にオフラインで動作します。解析サービスや広告は使用していません。",
            "教材と問題はアプリに同梱されており、その場でAI生成されるものではありません。",
        ).forEach { Text("・$it", style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground) }
    }
}

@Composable
private fun CountTile(value: String, label: String, modifier: Modifier = Modifier) {
    Column(
        modifier.background(Sg.colors.muted, MaterialTheme.shapes.small).padding(vertical = 10.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(value, style = MaterialTheme.typography.titleMedium.copy(fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace))
        Text(label, style = MaterialTheme.typography.labelSmall, color = Sg.colors.mutedForeground)
    }
}
