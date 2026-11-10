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
// Content (mirrors src/components/widgets/control-matcher.tsx)
// ---------------------------------------------------------------------------

private class ControlDef(val id: String, val label: String, val rationale: String)

private class ControlThreat(val label: String, val detail: String, val correctControlId: String)

private val ControlDefs = listOf(
    ControlDef(
        "backup", "オフライン／イミュータブルなバックアップ + 復元訓練",
        "オフラインまたはイミュータブルなコピーは暗号化の影響を受けず、復旧の最後の手段になる。復元訓練で実際に戻せることと所要時間（RTO）を確認する。",
    ),
    ControlDef(
        "query", "パラメータ化クエリ + 入力値検証",
        "SQL文と入力を分離し、入力がSQL構文として解釈されないようにする。WAFやエスケープは補助であり、根本対策はパラメータ化クエリである。",
    ),
    ControlDef(
        "encryption", "全ディスク暗号化 + 遠隔消去",
        "紛失・盗難時の主なリスクは媒体の読み取りである。全ディスク暗号化でデータを保護し、遠隔消去は端末がオンラインになった場合の補助として使う。",
    ),
    ControlDef(
        "authenticate", "多要素認証 + 不審メールの訓練・フィルタ",
        "認証情報が盗まれても、パスワード単独ではログインできない。メールフィルタと訓練でクリック率を下げる。ただし中間者（AiTM）型フィッシングではMFAも突破され得るため、FIDO2などの耐フィッシング認証を併用する。",
    ),
    ControlDef(
        "separation", "職務分離 + 最小権限 + 操作ログの監査",
        "単独では完結できない権限設計にし、操作ログで検知可能性を高める。最小権限は不正の機会だけでなく、実行された場合の被害範囲も狭める。",
    ),
)

private val ControlThreats = listOf(
    ControlThreat("フィッシング", "偽のログイン画面にID・パスワードを入力させる。", "authenticate"),
    ControlThreat("ランサムウェア", "共有ファイルを暗号化し、復旧と引き換えに金銭を要求する。", "backup"),
    ControlThreat("SQLインジェクション", "入力欄からDBのデータを不正に取得・改ざんする。", "query"),
    ControlThreat("内部不正", "権限を持つ担当者が顧客情報を外部へ持ち出す。", "separation"),
    ControlThreat("ノートPCの紛失", "電車内に置き忘れ、端末が第三者に渡る。", "encryption"),
)

// ---------------------------------------------------------------------------
// Widget
// ---------------------------------------------------------------------------

@Composable
fun ControlMatcherWidget(props: JsonObject?) {
    val count = ControlThreats.size
    // index into ControlDefs per threat, -1 = unanswered (IntArray is Bundle-saveable)
    var answers by rememberSaveable { mutableStateOf(IntArray(count) { -1 }) }
    var graded by rememberSaveable { mutableStateOf(false) }
    var open by rememberSaveable { mutableStateOf(-1) }

    fun correctIndex(t: ControlThreat) = ControlDefs.indexOfFirst { it.id == t.correctControlId }
    val score = ControlThreats.indices.count { answers[it] == correctIndex(ControlThreats[it]) }
    val allAnswered = answers.all { it >= 0 }

    // Text without an explicit colour must follow the theme (dark mode), not Material's default black.
    CompositionLocalProvider(LocalContentColor provides Sg.colors.foreground) {
    SgCard {
        Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
            Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                Text("脅威に効く管理策を選ぶ", style = MaterialTheme.typography.titleSmall, modifier = Modifier.weight(1f))
                TextButton(
                    onClick = { answers = IntArray(count) { -1 }; graded = false; open = -1 },
                    modifier = Modifier.heightIn(min = 48.dp),
                    colors = ButtonDefaults.textButtonColors(contentColor = Sg.colors.mutedForeground),
                ) {
                    Icon(Icons.Filled.Refresh, null, Modifier.size(18.dp))
                    Text("  リセット", style = MaterialTheme.typography.labelLarge)
                }
            }

            Text(
                "5つの脅威それぞれに、最も直接的に効く管理策を1つ選ぶ。同じ管理策を複数の脅威に割り当ててもよい。",
                style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground,
            )

            ControlThreats.forEachIndexed { index, threat ->
                val ci = correctIndex(threat)
                val control = ControlDefs[ci]
                val correct = answers[index] == ci
                Column(
                    Modifier.fillMaxWidth().clip(RoundedCornerShape(12.dp)).background(Sg.colors.muted)
                        .border(BorderStroke(1.dp, Sg.colors.border), RoundedCornerShape(12.dp)).padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                        Text("${index + 1}. ${threat.label}", style = MaterialTheme.typography.titleSmall, modifier = Modifier.weight(1f))
                        Text("脅威", style = MaterialTheme.typography.labelMedium, color = Sg.colors.mutedForeground)
                    }
                    Text(threat.detail, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)
                    Text("${threat.label}への対策", style = MaterialTheme.typography.labelMedium)
                    ControlSelect(
                        placeholder = "管理策を選択",
                        options = ControlDefs.map { it.label },
                        selected = answers[index],
                        expanded = open == index && !graded,
                        enabled = !graded,
                        verdict = if (graded) correct else null,
                        onToggle = { open = if (open == index) -1 else index },
                        onSelect = { opt ->
                            answers = answers.copyOf().also { it[index] = opt }
                            open = -1
                        },
                    )
                    if (graded) {
                        ControlVerdict(correct, if (correct) "正解" else "不正解（正解は「${control.label}」）")
                        Text(control.rationale, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)
                    }
                }
            }

            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                PrimaryButton(
                    if (graded) "採点済み" else "答え合わせ",
                    onClick = { graded = true; open = -1 },
                    enabled = !graded,
                    modifier = Modifier.fillMaxWidth(),
                )
                if (!allAnswered) {
                    Text("未選択の脅威は不正解として採点される", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
                }
            }

            if (graded) {
                ControlMetric(
                    "スコア", "$score / 5 問",
                    if (score == 5) "全問正解" else "${5 - score} 問を復習する",
                    if (score == 5) Tone.Success else Tone.Info,
                )
            }

            ControlNote(
                "管理策は1つで完全にはならない。フィッシング対策はMFAだけでなく訓練・メールフィルタ・認証の強化を重ね、ランサムウェア対策はバックアップと検知・侵害前提の設計を組み合わせる。",
                Tone.Neutral,
            )
        }
    }
    }
}

// ---------------------------------------------------------------------------
// Private building blocks
// ---------------------------------------------------------------------------

/** Header field that expands inline into a radio list (long Japanese options read better than a popup menu). */
@Composable
private fun ControlSelect(
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
private fun ControlVerdict(ok: Boolean, text: String) {
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
private fun ControlNote(text: String, tone: Tone) {
    val shape = RoundedCornerShape(10.dp)
    val border = if (tone == Tone.Neutral) Sg.colors.border else tone.color().copy(alpha = 0.3f)
    Text(
        text, style = MaterialTheme.typography.bodyMedium,
        modifier = Modifier.fillMaxWidth().clip(shape).background(tone.container(), shape)
            .border(BorderStroke(1.dp, border), shape).padding(horizontal = 12.dp, vertical = 10.dp),
    )
}

@Composable
private fun ControlMetric(label: String, value: String, sub: String, tone: Tone, modifier: Modifier = Modifier) {
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
