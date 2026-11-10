package app.sgstudy.ui.widgets

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.ButtonDefaults
import androidx.compose.runtime.Composable
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import app.sgstudy.ui.components.PrimaryButton
import app.sgstudy.ui.components.SgCard
import app.sgstudy.ui.components.Tone
import app.sgstudy.ui.components.color
import app.sgstudy.ui.components.container
import app.sgstudy.ui.theme.Sg
import kotlinx.serialization.json.JsonObject

// ---------------------------------------------------------------------------
// Content (mirrors src/components/widgets/incident-triage.tsx)
// ---------------------------------------------------------------------------

private val IncidentSeverities = listOf("低", "中", "高", "重大")

private class IncidentAction(val id: String, val label: String)

private class IncidentScenario(
    val title: String,
    val text: String,
    val correctSeverity: String,
    val correctActionId: String,
    val actions: List<IncidentAction>,
    val explanation: String,
) {
    val correctSeverityIndex get() = IncidentSeverities.indexOf(correctSeverity)
    val correctActionIndex get() = actions.indexOfFirst { it.id == correctActionId }
}

private val IncidentScenarios = listOf(
    IncidentScenario(
        title = "第1問 不審な添付ファイル",
        text = "営業部員のPCで、取引先を装うメールの添付ファイルを開いた直後、EDRが外部の不審なドメインへの通信を検知した。情報漏えいはまだ確認されていない。",
        correctSeverity = "高",
        correctActionId = "i",
        actions = listOf(
            IncidentAction("a", "端末を初期化して予備機と交換し、同じ利用者にすぐ再配布する"),
            IncidentAction("i", "端末をネットワークから切り離し、メモリと関連ログを保全して被害範囲を確認する"),
            IncidentAction("u", "全社のメール送受信を停止し、経営会議の判断を待つ"),
            IncidentAction("e", "添付ファイルを削除し、本人へ口頭で注意して終了する"),
        ),
        explanation = "感染の疑いがある段階では、封じ込め（隔離）と証拠保全を同時に行う。初期化は調査に必要な証拠を失わせ、全社メール停止は影響が過大である。通信先・実行ファイル・横展開の有無を確認し、漏えいが確認されれば重大へ引き上げる。",
    ),
    IncidentScenario(
        title = "第2問 退職者のアカウント",
        text = "退職した社員のアカウントが3か月間無効化されずに残っていた。アクセスログを確認したところ、退職後のログインは検出されていない。",
        correctSeverity = "中",
        correctActionId = "u",
        actions = listOf(
            IncidentAction("a", "退職者本人に電話して、退職後にログインしていないか確認する"),
            IncidentAction("i", "全システムのパスワードを一斉に変更する"),
            IncidentAction("u", "アカウントを直ちに無効化し、アクセスログと残存権限を確認する"),
            IncidentAction("e", "アカウントを削除し、関連するログも一緒に削除する"),
        ),
        explanation = "悪用の証拠はないが、認証情報が残っているだけで不正アクセスの入口になる。無効化はログインを止めつつ証拠を保全できる。アカウントの削除は設定やログの追跡を難しくするため、調査前に消さない。退職時の自動失効と定期的な棚卸しが再発防止になる。",
    ),
    IncidentScenario(
        title = "第3問 顧客情報の露出疑い",
        text = "顧客向けWebサイトでSQLエラーが発生し、外部の研究者から「顧客情報が取得できる状態だ」と連絡があった。実際に第三者へ渡ったかは未確認である。",
        correctSeverity = "重大",
        correctActionId = "e",
        actions = listOf(
            IncidentAction("a", "WAFのブロック件数を確認し、増えていなければ様子を見る"),
            IncidentAction("i", "サーバを再起動してエラーログを消し、サービス復旧を優先する"),
            IncidentAction("u", "研究者に連絡し、公開しないよう口頭で依頼する"),
            IncidentAction("e", "該当機能を停止して証拠を保全し、法務・個人情報保護担当と報告要否を判断する"),
        ),
        explanation = "個人情報の漏えい疑いでは、被害の確定を待たずに封じ込めと証拠保全を行い、個人情報保護法上の報告・本人通知の要否を組織として判断する。ログの消去や再起動は証拠を損なう。研究者への口頭依頼は記録に残らず、対応の中心にはならない。",
    ),
    IncidentScenario(
        title = "第4問 私物USBへのコピー",
        text = "従業員が私物のUSBメモリに業務資料をコピーしようとしたところ、DLPが検知してブロックした。外部への持出しは確認されていない。",
        correctSeverity = "低",
        correctActionId = "a",
        actions = listOf(
            IncidentAction("a", "事実関係と意図を確認し、規程に基づく注意喚起と再発防止策を実施する"),
            IncidentAction("i", "警察に窃盗として届け出る"),
            IncidentAction("u", "全社でUSBメモリの使用を恒久的に禁止する"),
            IncidentAction("e", "記録を残さず、口頭で注意するだけで終える"),
        ),
        explanation = "実害が出ていないため重大度は低いが、意図的な持出しや繰り返しなら懲戒・重大事案に発展する。DLPの検知ログを残し、本人の意図、過去の履歴、扱った情報の種類を確認する。教育と媒体管理の見直しにつなげる。",
    ),
)

// ---------------------------------------------------------------------------
// Widget
// ---------------------------------------------------------------------------

@Composable
fun IncidentTriageWidget(props: JsonObject?) {
    val count = IncidentScenarios.size
    // -1 = unanswered. IntArray is Bundle-saveable, so state survives rotation / process death.
    var severities by rememberSaveable { mutableStateOf(IntArray(count) { -1 }) }
    var actions by rememberSaveable { mutableStateOf(IntArray(count) { -1 }) }
    var graded by rememberSaveable { mutableStateOf(false) }
    var openAction by rememberSaveable { mutableStateOf(-1) }
    var legendOpen by rememberSaveable { mutableStateOf(false) }

    val severityScore = IncidentScenarios.indices.count { severities[it] == IncidentScenarios[it].correctSeverityIndex }
    val actionScore = IncidentScenarios.indices.count { actions[it] == IncidentScenarios[it].correctActionIndex }
    val score = severityScore + actionScore
    val max = count * 2

    // Text without an explicit colour must follow the theme (dark mode), not Material's default black.
    CompositionLocalProvider(LocalContentColor provides Sg.colors.foreground) {
    SgCard {
        Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
            Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                Text("重大度と初動を判断する", style = MaterialTheme.typography.titleSmall, modifier = Modifier.weight(1f))
                TextButton(
                    onClick = {
                        severities = IntArray(count) { -1 }
                        actions = IntArray(count) { -1 }
                        graded = false
                        openAction = -1
                    },
                    modifier = Modifier.heightIn(min = 48.dp),
                    colors = ButtonDefaults.textButtonColors(contentColor = Sg.colors.mutedForeground),
                ) {
                    Icon(Icons.Filled.Refresh, null, Modifier.size(18.dp))
                    Text("  リセット", style = MaterialTheme.typography.labelLarge)
                }
            }

            IncidentNote(
                "重大度は「確定した被害」ではなく、機密性・完全性・可用性への影響と拡大可能性から暫定判断する。調査で新たな事実が判明したら見直す。",
                Tone.Neutral,
            )

            IncidentScenarios.forEachIndexed { index, scenario ->
                val severityCorrect = severities[index] == scenario.correctSeverityIndex
                val actionCorrect = actions[index] == scenario.correctActionIndex
                Column(
                    Modifier.fillMaxWidth().clip(RoundedCornerShape(12.dp)).background(Sg.colors.muted)
                        .border(BorderStroke(1.dp, Sg.colors.border), RoundedCornerShape(12.dp)).padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    Text(scenario.title, style = MaterialTheme.typography.titleSmall)
                    Text(scenario.text, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)

                    // Severity: 4 equal-width segments
                    Text("重大度", style = MaterialTheme.typography.labelMedium)
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        IncidentSeverities.forEachIndexed { sIdx, label ->
                            val selected = severities[index] == sIdx
                            val tone = when {
                                !graded -> if (selected) Tone.Info else null
                                sIdx == scenario.correctSeverityIndex -> Tone.Success
                                selected -> Tone.Danger
                                else -> null
                            }
                            IncidentSegment(
                                label, selected, tone, enabled = !graded,
                                modifier = Modifier.weight(1f),
                            ) {
                                severities = severities.copyOf().also { it[index] = sIdx }
                            }
                        }
                    }

                    // Action: collapsible list of long options
                    Text("最初の対応", style = MaterialTheme.typography.labelMedium)
                    IncidentSelect(
                        placeholder = "選択してください",
                        options = scenario.actions.map { it.label },
                        selected = actions[index],
                        expanded = openAction == index && !graded,
                        enabled = !graded,
                        verdict = if (graded) actionCorrect else null,
                        onToggle = { openAction = if (openAction == index) -1 else index },
                        onSelect = { opt ->
                            actions = actions.copyOf().also { it[index] = opt }
                            openAction = -1
                        },
                    )

                    if (graded) {
                        IncidentVerdict(
                            severityCorrect,
                            "重大度: " + if (severityCorrect) "正解" else "不正解（正解は「${scenario.correctSeverity}」）",
                        )
                        IncidentVerdict(
                            actionCorrect,
                            "初動: " + if (actionCorrect) "正解"
                            else "不正解（正解は「${scenario.actions[scenario.correctActionIndex].label}」）",
                        )
                        Text(scenario.explanation, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)
                    }
                }
            }

            if (graded) {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    IncidentMetric("合計", "$score / $max 点", "重大度4点 + 初動4点", if (score >= 6) Tone.Success else Tone.Warning, Modifier.weight(1f))
                    IncidentMetric("内訳", "$severityScore + $actionScore", "重大度 $severityScore/4、初動 $actionScore/4", Tone.Neutral, Modifier.weight(1f))
                }
                IncidentNote(
                    when {
                        score == max -> "全問正解である。判断の根拠まで説明できるか確認する。"
                        score >= 6 -> "概ね妥当である。誤答した場面について、なぜその初動が優先されるかを振り返る。"
                        else -> "重大度と初動の対応関係を再確認する。被害の確定を待たず、封じ込めと証拠保全を優先する場面が多い。"
                    },
                    if (score >= 6) Tone.Success else Tone.Warning,
                )
            }

            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                PrimaryButton(
                    if (graded) "採点済み" else "採点する",
                    onClick = { graded = true; openAction = -1 },
                    enabled = !graded,
                    modifier = Modifier.fillMaxWidth(),
                )
                Text("未回答は不正解として扱われる", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
            }

            // Collapsible severity guide
            Column(
                Modifier.fillMaxWidth().clip(RoundedCornerShape(12.dp))
                    .border(BorderStroke(1.dp, Sg.colors.border), RoundedCornerShape(12.dp)),
            ) {
                Row(
                    Modifier.fillMaxWidth().heightIn(min = 48.dp).clickable { legendOpen = !legendOpen }.padding(horizontal = 12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text("重大度の目安", style = MaterialTheme.typography.titleSmall, modifier = Modifier.weight(1f))
                    Icon(
                        if (legendOpen) Icons.Filled.ExpandLess else Icons.Filled.ExpandMore, null,
                        tint = Sg.colors.mutedForeground,
                    )
                }
                if (legendOpen) {
                    Column(Modifier.padding(start = 12.dp, end = 12.dp, bottom = 12.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        listOf(
                            "重大" to "個人情報の漏えい、重要システムの長期停止など、経営判断・対外報告が必要。",
                            "高" to "侵害の疑いが強く、封じ込めと全社調整が必要。",
                            "中" to "統制の不備はあるが、悪用の証拠はまだ確認されていない。",
                            "低" to "実害がなく、局所的な確認と再発防止で足りる。",
                        ).forEach { (label, desc) ->
                            Text(
                                buildAnnotatedString {
                                    withStyle(SpanStyle(fontWeight = FontWeight.Bold, color = Sg.colors.foreground)) { append("$label: ") }
                                    append(desc)
                                },
                                style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground,
                            )
                        }
                    }
                }
            }
        }
    }
    }
}

// ---------------------------------------------------------------------------
// Private building blocks
// ---------------------------------------------------------------------------

/** One segment of the severity picker. [tone] == null means neutral/unselected. */
@Composable
private fun IncidentSegment(
    label: String,
    selected: Boolean,
    tone: Tone?,
    enabled: Boolean,
    modifier: Modifier = Modifier,
    onClick: () -> Unit,
) {
    val shape = RoundedCornerShape(10.dp)
    val border = when (tone) {
        null -> Sg.colors.input
        Tone.Info -> Sg.colors.info.copy(alpha = 0.6f)
        else -> tone.color().copy(alpha = 0.6f)
    }
    Box(
        modifier.heightIn(min = 48.dp).clip(shape)
            .background(tone?.container() ?: Sg.colors.card, shape)
            .border(BorderStroke(if (selected) 2.dp else 1.dp, border), shape)
            .selectable(selected = selected, enabled = enabled, role = Role.RadioButton, onClick = onClick),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            label, style = MaterialTheme.typography.labelLarge,
            color = if (tone == null) Sg.colors.foreground else tone.color(),
        )
    }
}

/** Header field that expands inline into a radio list (long Japanese options read better than a popup menu). */
@Composable
private fun IncidentSelect(
    placeholder: String,
    options: List<String>,
    selected: Int,
    expanded: Boolean,
    enabled: Boolean,
    verdict: Boolean?,
    onToggle: () -> Unit,
    onSelect: (Int) -> Unit,
) {
    val shape = RoundedCornerShape(10.dp)
    val tone = when (verdict) { true -> Tone.Success; false -> Tone.Danger; null -> null }
    val borderColor = tone?.color()?.copy(alpha = 0.6f) ?: if (expanded) Sg.colors.info.copy(alpha = 0.6f) else Sg.colors.input
    Column(
        Modifier.fillMaxWidth().clip(shape).background(tone?.container() ?: Sg.colors.card, shape)
            .border(BorderStroke(1.dp, borderColor), shape),
    ) {
        Row(
            Modifier.fillMaxWidth().heightIn(min = 48.dp).clickable(enabled = enabled, onClick = onToggle)
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                if (selected >= 0) options[selected] else placeholder,
                style = MaterialTheme.typography.bodyMedium,
                color = if (selected >= 0) Sg.colors.foreground else Sg.colors.mutedForeground,
                modifier = Modifier.weight(1f),
            )
            if (enabled) Icon(
                if (expanded) Icons.Filled.ExpandLess else Icons.Filled.ExpandMore, null,
                tint = Sg.colors.mutedForeground,
            )
        }
        if (expanded) {
            options.forEachIndexed { i, label ->
                Row(
                    Modifier.fillMaxWidth().heightIn(min = 48.dp)
                        .selectable(selected = selected == i, role = Role.RadioButton) { onSelect(i) }
                        .padding(horizontal = 4.dp, vertical = 2.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    RadioButton(
                        selected = selected == i, onClick = null, modifier = Modifier.padding(8.dp),
                        colors = RadioButtonDefaults.colors(selectedColor = Sg.colors.infoForeground, unselectedColor = Sg.colors.mutedForeground),
                    )
                    Text(label, style = MaterialTheme.typography.bodyMedium, modifier = Modifier.padding(end = 8.dp))
                }
            }
        }
    }
}

@Composable
private fun IncidentVerdict(ok: Boolean, text: String) {
    val tone = if (ok) Tone.Success else Tone.Danger
    Row(
        Modifier.fillMaxWidth().clip(RoundedCornerShape(8.dp)).background(tone.container()).padding(horizontal = 10.dp, vertical = 8.dp),
        verticalAlignment = Alignment.Top, horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        Icon(if (ok) Icons.Filled.Check else Icons.Filled.Close, null, Modifier.padding(top = 3.dp).size(16.dp), tint = tone.color())
        Text(text, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold), color = tone.color())
    }
}

@Composable
private fun IncidentNote(text: String, tone: Tone) {
    val shape = RoundedCornerShape(10.dp)
    val border = if (tone == Tone.Neutral) Sg.colors.border else tone.color().copy(alpha = 0.3f)
    Text(
        text, style = MaterialTheme.typography.bodyMedium,
        modifier = Modifier.fillMaxWidth().clip(shape).background(tone.container(), shape)
            .border(BorderStroke(1.dp, border), shape).padding(horizontal = 12.dp, vertical = 10.dp),
    )
}

@Composable
private fun IncidentMetric(label: String, value: String, sub: String, tone: Tone, modifier: Modifier = Modifier) {
    Column(
        modifier.clip(RoundedCornerShape(10.dp)).background(Sg.colors.muted).border(BorderStroke(1.dp, Sg.colors.border), RoundedCornerShape(10.dp))
            .padding(horizontal = 12.dp, vertical = 10.dp),
    ) {
        Text(label, style = MaterialTheme.typography.labelMedium, color = Sg.colors.mutedForeground)
        Text(
            value, style = MaterialTheme.typography.titleMedium.copy(fontFamily = FontFamily.Monospace),
            color = if (tone == Tone.Neutral) Sg.colors.foreground else tone.color(),
        )
        Text(sub, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
    }
}
