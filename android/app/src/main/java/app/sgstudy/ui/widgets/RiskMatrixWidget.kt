package app.sgstudy.ui.widgets

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.setValue
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.compositeOver
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.sgstudy.ui.components.SgCard
import app.sgstudy.ui.theme.Sg
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlin.math.roundToInt

// ---------------------------------------------------------------------------
// Logic (port of src/components/widgets/risk-matrix.tsx)
// ---------------------------------------------------------------------------

private val RmProbabilityLabels = listOf("まれ", "低い", "中程度", "高い", "非常に高い")
private val RmImpactLabels = listOf("軽微", "小", "中", "大", "重大")

private enum class RmTone { Success, Info, Warning, Danger }

private class RmZone(
    val id: String,
    val label: String,
    val min: Int,
    val max: Int,
    val tone: RmTone,
    val summary: String,
    val description: String,
    val points: List<String>,
)

// リスク評価レッスンの例（低1–7 / 中8–14 / 高15–25）に合わせ、
// 高領域を「低減（15–19）」と「回避（20–25）」に分ける。
private val RmZones = listOf(
    RmZone(
        "accept", "受容", 1, 7, RmTone.Success,
        "リスクを許容し、監視を続ける",
        "対応コストが低減効果を上回る場合に選ぶ。許容したまま放置せず、責任者・見直し時期・再評価の条件を記録する。",
        listOf("残余リスクを文書化する", "基準を超えたら対応を見直す"),
    ),
    RmZone(
        "transfer", "移転", 8, 14, RmTone.Info,
        "保険・契約で金銭的損失を移す",
        "サイバー保険などで損失の金銭的負担を第三者に移す。外部委託は委託先が止まれば自社業務も止まるため、移転ではなく共有・低減として整理する。低減策と組み合わせて残余リスクを下げる。",
        listOf("移転後も事故対応と説明責任は残る", "保険の免責・支払限度を確認する"),
    ),
    RmZone(
        "reduce", "低減", 15, 19, RmTone.Warning,
        "管理策で確率または影響を下げる",
        "技術的・組織的な管理策を組み合わせ、発生確率か影響のどちらかを下げる。対策後の残余リスクを再評価し、受容基準と比較する。",
        listOf("予防策と検知策を組み合わせる", "対策の効果を測定する"),
    ),
    RmZone(
        "avoid", "回避", 20, 25, RmTone.Danger,
        "活動自体を停止・変更する",
        "リスクが許容水準を大きく超えるため、その活動を止めるか設計を根本から変える。代替案に新たなリスクがないかも評価する。",
        listOf("活動停止の影響も評価する", "代替案のリスクを比較する"),
    ),
)

private fun rmZoneFor(score: Int): RmZone = RmZones.firstOrNull { score in it.min..it.max } ?: RmZones.first()

@Composable
private fun RmTone.color(): Color = when (this) {
    RmTone.Success -> Sg.colors.successForeground
    RmTone.Info -> Sg.colors.infoForeground
    RmTone.Warning -> Sg.colors.warningForeground
    RmTone.Danger -> Sg.colors.destructiveForeground
}

/** Reads a numeric prop without trusting its shape (web `numberProp`). */
private fun JsonObject?.rmNumber(key: String, fallback: Double): Double {
    val primitive = this?.get(key) as? JsonPrimitive ?: return fallback
    val value = primitive.content.trim().toDoubleOrNull()
    return if (value != null && value.isFinite()) value else fallback
}

// ---------------------------------------------------------------------------
// UI
// ---------------------------------------------------------------------------

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun RiskMatrixWidget(props: JsonObject?) {
    val initialProbability = props.rmNumber("probability", 3.0).roundToInt().coerceIn(1, 5)
    val initialImpact = props.rmNumber("impact", 3.0).roundToInt().coerceIn(1, 5)
    var probability by rememberSaveable { mutableIntStateOf(initialProbability) }
    var impact by rememberSaveable { mutableIntStateOf(initialImpact) }

    val score = probability * impact
    val zone = rmZoneFor(score)

    SgCard {
        CompositionLocalProvider(LocalContentColor provides Sg.colors.foreground) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                "発生確率 × 影響度でリスクを評価する",
                style = MaterialTheme.typography.titleSmall,
                modifier = Modifier.weight(1f),
            )
            TextButton(
                onClick = { probability = initialProbability; impact = initialImpact },
                modifier = Modifier.heightIn(min = 48.dp),
            ) {
                Icon(Icons.Filled.Refresh, null, Modifier.size(18.dp), tint = Sg.colors.mutedForeground)
                Spacer(Modifier.width(4.dp))
                Text("リセット", style = MaterialTheme.typography.labelMedium, color = Sg.colors.mutedForeground)
            }
        }

        Spacer(Modifier.size(4.dp))
        RmSliderField("発生確率", probability, RmProbabilityLabels[probability - 1]) { probability = it }
        Spacer(Modifier.size(8.dp))
        RmSliderField("影響度", impact, RmImpactLabels[impact - 1]) { impact = it }

        Spacer(Modifier.size(16.dp))
        RmGrid(probability, impact) { p, i -> probability = p; impact = i }
        Text(
            "横軸: 発生確率（1→5）／縦軸: 影響度（1→5）。セルを押すと両方の値が変わります。",
            style = MaterialTheme.typography.bodySmall,
            color = Sg.colors.mutedForeground,
            modifier = Modifier.padding(top = 8.dp),
        )

        // Result: score + recommended response.
        Spacer(Modifier.size(16.dp))
        Row(verticalAlignment = Alignment.Bottom) {
            Column(Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.Bottom) {
                    Text(
                        "$score",
                        style = MaterialTheme.typography.displaySmall.copy(fontFamily = FontFamily.Monospace, fontWeight = FontWeight.SemiBold),
                    )
                    Text(
                        " / 25",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Sg.colors.mutedForeground,
                        modifier = Modifier.padding(bottom = 6.dp),
                    )
                }
                Text(
                    "確率 $probability × 影響度 $impact",
                    style = MaterialTheme.typography.bodySmall,
                    color = Sg.colors.mutedForeground,
                )
            }
            RmChip(zone.label, zone.tone.color(), emphasized = true, large = true)
        }

        Column(
            Modifier.padding(top = 12.dp).fillMaxWidth()
                .clip(RoundedCornerShape(10.dp)).background(Sg.colors.muted)
                .border(BorderStroke(1.dp, Sg.colors.border), RoundedCornerShape(10.dp))
                .padding(12.dp),
        ) {
            Text("${zone.summary}（${zone.label}）", style = MaterialTheme.typography.titleSmall)
            Text(
                zone.description,
                style = MaterialTheme.typography.bodyMedium,
                color = Sg.colors.mutedForeground,
                modifier = Modifier.padding(top = 4.dp),
            )
            Column(Modifier.padding(top = 6.dp), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                zone.points.forEach { point ->
                    Row(verticalAlignment = Alignment.Top) {
                        Box(Modifier.padding(top = 10.dp, end = 8.dp).size(5.dp).clip(CircleShape).background(Sg.colors.info))
                        Text(point, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)
                    }
                }
            }
        }

        FlowRow(
            Modifier.padding(top = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            RmZones.forEach { entry ->
                val current = entry.id == zone.id
                RmChip("${entry.label} ${entry.min}–${entry.max}", entry.tone.color(), emphasized = current)
            }
        }

        Text(
            "スコア帯は学習用の目安である。実際の対応は、リスク基準・法的義務・対応コストを踏まえて決める。低減と移転を組み合わせることも多い。",
            style = MaterialTheme.typography.bodySmall,
            color = Sg.colors.mutedForeground,
            modifier = Modifier.padding(top = 12.dp),
        )
        }
    }
}

/** Label + value hint + stepped slider (1..5) + level name. */
@Composable
private fun RmSliderField(label: String, value: Int, levelName: String, onChange: (Int) -> Unit) {
    Column {
        Row(verticalAlignment = Alignment.Bottom) {
            Text(label, style = MaterialTheme.typography.labelLarge, modifier = Modifier.weight(1f))
            Text(
                "$value / 5　$levelName",
                style = MaterialTheme.typography.labelMedium,
                color = Sg.colors.mutedForeground,
            )
        }
        Slider(
            value = value.toFloat(),
            onValueChange = { onChange(it.roundToInt().coerceIn(1, 5)) },
            valueRange = 1f..5f,
            steps = 3,
            modifier = Modifier.heightIn(min = 48.dp),
            colors = SliderDefaults.colors(
                thumbColor = Sg.colors.chart[1],
                activeTrackColor = Sg.colors.chart[1],
                inactiveTrackColor = Sg.colors.muted,
                activeTickColor = Sg.colors.card,
                inactiveTickColor = Sg.colors.mutedForeground,
            ),
        )
    }
}

/** The 5×5 matrix: probability on the x axis (1→5), impact on the y axis (5 at the top). */
@Composable
private fun RmGrid(probability: Int, impact: Int, onSelect: (Int, Int) -> Unit) {
    val gap = 4.dp
    Column(verticalArrangement = Arrangement.spacedBy(gap)) {
        Row(horizontalArrangement = Arrangement.spacedBy(gap)) {
            Box(Modifier.width(22.dp))
            (1..5).forEach { p ->
                Text(
                    "$p",
                    modifier = Modifier.weight(1f),
                    textAlign = TextAlign.Center,
                    style = MaterialTheme.typography.labelMedium,
                    color = Sg.colors.mutedForeground,
                )
            }
        }
        (5 downTo 1).forEach { i ->
            Row(horizontalArrangement = Arrangement.spacedBy(gap), verticalAlignment = Alignment.CenterVertically) {
                Text(
                    "$i",
                    modifier = Modifier.width(22.dp),
                    textAlign = TextAlign.Center,
                    style = MaterialTheme.typography.labelMedium,
                    color = Sg.colors.mutedForeground,
                )
                (1..5).forEach { p ->
                    RmCell(p, i, selected = p == probability && i == impact, modifier = Modifier.weight(1f), onClick = { onSelect(p, i) })
                }
            }
        }
    }
}

@Composable
private fun RmCell(p: Int, i: Int, selected: Boolean, modifier: Modifier, onClick: () -> Unit) {
    val cellScore = p * i
    val zone = rmZoneFor(cellScore)
    val tint = zone.tone.color()
    val shape = RoundedCornerShape(8.dp)
    val fill = tint.copy(alpha = if (selected) 0.36f else 0.16f).compositeOver(Sg.colors.card)
    Box(
        modifier
            .heightIn(min = 44.dp)
            .aspectRatio(1f)
            .clip(shape)
            .background(fill)
            .border(if (selected) BorderStroke(2.5.dp, Sg.colors.info) else BorderStroke(1.dp, tint.copy(alpha = 0.25f)), shape)
            .semantics(mergeDescendants = true) {
                contentDescription = "確率${p}、影響度${i}、スコア${cellScore}、対応${zone.label}"
                this.selected = selected
            }
            .clickable(role = Role.Button, onClick = onClick),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            "$cellScore",
            style = MaterialTheme.typography.labelLarge.copy(fontSize = 16.sp, fontWeight = if (selected) FontWeight.Bold else FontWeight.SemiBold),
            color = Sg.colors.foreground,
        )
    }
}

@Composable
private fun RmChip(text: String, color: Color, emphasized: Boolean, large: Boolean = false) {
    val shape = RoundedCornerShape(8.dp)
    Text(
        text,
        modifier = Modifier
            .clip(shape)
            .border(BorderStroke(1.dp, if (emphasized) color else Sg.colors.border), shape)
            .padding(horizontal = if (large) 14.dp else 10.dp, vertical = if (large) 6.dp else 4.dp),
        style = if (large) MaterialTheme.typography.titleMedium else MaterialTheme.typography.labelMedium,
        fontWeight = if (emphasized) FontWeight.Bold else FontWeight.Medium,
        color = if (emphasized) color else Sg.colors.mutedForeground,
    )
}
