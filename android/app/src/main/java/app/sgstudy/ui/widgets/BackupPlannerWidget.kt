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
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import app.sgstudy.logic.formatDuration
import app.sgstudy.ui.components.SgCard
import app.sgstudy.ui.components.SgProgressBar
import app.sgstudy.ui.components.Tone
import app.sgstudy.ui.components.color
import app.sgstudy.ui.components.container
import app.sgstudy.ui.theme.Sg
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import java.math.BigDecimal
import kotlin.math.roundToInt

// ---------------------------------------------------------------------------
// Logic (port of src/components/widgets/backup-planner.tsx)
// ---------------------------------------------------------------------------

private val BpDayLabels = listOf("日", "月", "火", "水", "木", "金", "土")

private val BpChecklist = listOf(
    "コピーを3つ持つ（本番 + バックアップ2つ）",
    "2種類以上の媒体・保存先を使う",
    "1つは事業所外（オフサイト）に保管する",
    "1つはオフラインまたはイミュータブルにする",
    "リストア手順を定期的に訓練し、記録する",
)

private const val BpWeekMinutes = 7 * 24 * 60

private class BpSchedule(val counts: List<Int>, val total: Int)

/** Incrementals run every [intervalHours] after the full backup start, repeating on a 7-day cycle. */
private fun bpBuildWeekSchedule(startMinute: Int, intervalHours: Int): BpSchedule {
    val counts = IntArray(7)
    val interval = intervalHours * 60
    var total = 0
    var offset = interval
    while (offset < BpWeekMinutes) {
        val minute = (startMinute + offset) % BpWeekMinutes
        counts[minute / 1440] += 1
        total += 1
        offset += interval
    }
    return BpSchedule(counts.toList(), total)
}

private val BpIntRegex = Regex("^\\d+$")
private val BpDecimalRegex = Regex("^\\d+(\\.\\d+)?$")

private fun bpParseInteger(raw: String, min: Int, max: Int): Int? {
    val s = raw.trim()
    if (!BpIntRegex.matches(s)) return null
    val v = s.toBigInteger()
    return if (v >= min.toBigInteger() && v <= max.toBigInteger()) v.toInt() else null
}

private fun bpParseDecimal(raw: String, min: Double, max: Double): Double? {
    val s = raw.trim()
    if (!BpDecimalRegex.matches(s)) return null
    val v = s.toDoubleOrNull() ?: return null
    return if (v.isFinite() && v >= min && v <= max) v else null
}

private fun bpTwoDigits(n: Int) = n.toString().padStart(2, '0')

/** JS-like number text: 500.0 -> "500", 0.5 -> "0.5" (never scientific notation). */
private fun bpNum(value: Double): String = BigDecimal.valueOf(value).stripTrailingZeros().toPlainString()

private fun JsonObject?.bpNumber(key: String, fallback: Double): Double {
    val primitive = this?.get(key) as? JsonPrimitive ?: return fallback
    val value = primitive.content.trim().toDoubleOrNull()
    return if (value != null && value.isFinite()) value else fallback
}

private fun JsonObject?.bpString(key: String, fallback: String): String {
    val primitive = this?.get(key) as? JsonPrimitive ?: return fallback
    return if (primitive.isString && primitive.content.isNotBlank()) primitive.content else fallback
}

private class BpResult(
    val interval: Int,
    val retention: Int,
    val rate: Double,
    val size: Double,
    val schedule: BpSchedule,
    val restoreSeconds: Double,
    val fullGenerations: Int,
)

// ---------------------------------------------------------------------------
// UI
// ---------------------------------------------------------------------------

@Composable
fun BackupPlannerWidget(props: JsonObject?) {
    val initialDay = props.bpNumber("day", 0.0).roundToInt().coerceIn(0, 6)
    val timeProp = props.bpString("time", "02:00")
    val timeMatch = Regex("^([01]\\d|2[0-3]):([0-5]\\d)$").matchEntire(timeProp)
    val initialHour = timeMatch?.groupValues?.get(1)?.toInt() ?: 2
    val initialMinute = timeMatch?.groupValues?.get(2)?.toInt() ?: 0
    val initialInterval = props.bpNumber("interval", 4.0).roundToInt().coerceIn(1, 24).toString()
    val initialRetention = props.bpNumber("retention", 30.0).roundToInt().coerceIn(1, 365).toString()
    val initialRate = bpNum(props.bpNumber("rate", 100.0).coerceIn(1.0, 100000.0))
    val initialSize = bpNum(props.bpNumber("size", 500.0).coerceIn(0.1, 1000000.0))

    var fullDay by rememberSaveable { mutableIntStateOf(initialDay) }
    var hourInput by rememberSaveable { mutableStateOf(bpTwoDigits(initialHour)) }
    var minuteInput by rememberSaveable { mutableStateOf(bpTwoDigits(initialMinute)) }
    var intervalInput by rememberSaveable { mutableStateOf(initialInterval) }
    var retentionInput by rememberSaveable { mutableStateOf(initialRetention) }
    var rateInput by rememberSaveable { mutableStateOf(initialRate) }
    var sizeInput by rememberSaveable { mutableStateOf(initialSize) }
    var checkedRaw by rememberSaveable { mutableStateOf("") }
    val checked: Set<Int> = if (checkedRaw.isEmpty()) emptySet() else checkedRaw.split(",").map { it.toInt() }.toSet()
    fun setChecked(next: Set<Int>) { checkedRaw = next.sorted().joinToString(",") }

    val hour = bpParseInteger(hourInput, 0, 23)
    val minute = bpParseInteger(minuteInput, 0, 59)
    val interval = bpParseInteger(intervalInput, 1, 24)
    val retention = bpParseInteger(retentionInput, 1, 365)
    val rate = bpParseDecimal(rateInput, 1.0, 100000.0)
    val size = bpParseDecimal(sizeInput, 0.1, 1000000.0)

    val timeError = if (hour == null || minute == null) "時刻を入力してください（時 0〜23、分 0〜59）" else null
    val intervalError = if (interval == null) "1〜24 の整数で入力してください" else null
    val retentionError = if (retention == null) "1〜365 の整数で入力してください" else null
    val rateError = if (rate == null) "1〜100,000 MB/s の数値で入力してください" else null
    val sizeError = if (size == null) "0.1〜1,000,000 GB の数値で入力してください" else null

    val computed: BpResult? =
        if (interval != null && retention != null && rate != null && size != null && hour != null && minute != null) {
            BpResult(
                interval, retention, rate, size,
                schedule = bpBuildWeekSchedule(fullDay * 1440 + hour * 60 + minute, interval),
                restoreSeconds = size * 1024 / rate,
                fullGenerations = maxOf(1, retention / 7),
            )
        } else null

    SgCard {
        CompositionLocalProvider(LocalContentColor provides Sg.colors.foreground) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                "バックアップ計画から RPO と復旧時間を試算する",
                style = MaterialTheme.typography.titleSmall,
                modifier = Modifier.weight(1f),
            )
            TextButton(
                onClick = {
                    fullDay = initialDay
                    hourInput = bpTwoDigits(initialHour)
                    minuteInput = bpTwoDigits(initialMinute)
                    intervalInput = initialInterval
                    retentionInput = initialRetention
                    rateInput = initialRate
                    sizeInput = initialSize
                    setChecked(emptySet())
                },
                modifier = Modifier.heightIn(min = 48.dp),
            ) {
                Icon(Icons.Filled.Refresh, null, Modifier.size(18.dp), tint = Sg.colors.mutedForeground)
                Spacer(Modifier.width(4.dp))
                Text("リセット", style = MaterialTheme.typography.labelMedium, color = Sg.colors.mutedForeground)
            }
        }

        Column(Modifier.padding(top = 8.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
            // Full-backup weekday: seven equal toggles.
            BpLabeled("フルバックアップの曜日") {
                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    BpDayLabels.forEachIndexed { index, label ->
                        BpDayButton(label, selected = index == fullDay, modifier = Modifier.weight(1f)) { fullDay = index }
                    }
                }
            }

            BpLabeled("フルバックアップの開始時刻", error = timeError) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    BpTextField(hourInput, { hourInput = it.take(2) }, KeyboardType.Number, invalid = hour == null, modifier = Modifier.weight(1f), suffix = "時")
                    BpTextField(minuteInput, { minuteInput = it.take(2) }, KeyboardType.Number, invalid = minute == null, modifier = Modifier.weight(1f), suffix = "分")
                }
            }

            BpLabeled("増分バックアップの間隔（時間）", error = intervalError) {
                BpTextField(intervalInput, { intervalInput = it }, KeyboardType.Number, invalid = interval == null, suffix = "時間")
            }
            BpLabeled("保持期間（日）", error = retentionError) {
                BpTextField(retentionInput, { retentionInput = it }, KeyboardType.Number, invalid = retention == null, suffix = "日")
            }
            BpLabeled("リストア速度（MB/s）", error = rateError) {
                BpTextField(rateInput, { rateInput = it }, KeyboardType.Decimal, invalid = rate == null, suffix = "MB/s")
            }
            BpLabeled("復元するデータ量（GB）", error = sizeError) {
                BpTextField(sizeInput, { sizeInput = it }, KeyboardType.Decimal, invalid = size == null, suffix = "GB")
            }
        }

        if (computed != null) {
            val timeText = "${bpTwoDigits(hour ?: 0)}:${bpTwoDigits(minute ?: 0)}"
            Column(Modifier.padding(top = 16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    BpMetric(
                        "RPO（最大データ損失）", "${computed.interval} 時間",
                        "復旧できるのは最大 ${computed.interval} 時間前の時点（時間幅で表示）", Tone.Info, Modifier.fillMaxWidth(),
                    )
                    BpMetric(
                        "リストア時間（転送のみ）", formatDuration(computed.restoreSeconds.roundToInt()),
                        "${bpNum(computed.size)} GB ÷ ${bpNum(computed.rate)} MB/s（フル1回分、1 GB = 1,024 MB）", Tone.Warning, Modifier.fillMaxWidth(),
                    )
                    BpMetric(
                        "増分の回数", "${computed.schedule.total} 回 / 週",
                        "${computed.interval} 時間ごと。フルは週1回", Tone.Neutral, Modifier.fillMaxWidth(),
                    )
                    BpMetric(
                        "フルバックアップの世代数", "${computed.fullGenerations} 世代",
                        "保持 ${computed.retention} 日 ÷ 7 日の目安", Tone.Neutral, Modifier.fillMaxWidth(),
                    )

                // Weekly timeline.
                Column {
                    Text("週間タイムライン", style = MaterialTheme.typography.labelLarge)
                    Text(
                        "フル: 毎週${BpDayLabels[fullDay]}曜 $timeText",
                        style = MaterialTheme.typography.labelMedium,
                        color = Sg.colors.infoForeground,
                        modifier = Modifier.padding(top = 2.dp, bottom = 8.dp),
                    )
                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        BpDayLabels.indices.forEach { day ->
                            BpTimelineCell(day, isFull = day == fullDay, increments = computed.schedule.counts[day], time = timeText, modifier = Modifier.weight(1f))
                        }
                    }
                    Text(
                        "F = フルバックアップ、I = 増分バックアップ。曜日は日曜始まり。増分はフル開始の${computed.interval}時間後から${computed.interval}時間ごとに走り、7日周期で繰り返す。",
                        style = MaterialTheme.typography.bodySmall,
                        color = Sg.colors.mutedForeground,
                        modifier = Modifier.padding(top = 8.dp),
                    )
                }

                if (computed.retention < 8) {
                    BpNote(Tone.Warning) {
                        Text(
                            "保持期間が7日以下の場合、週1回のフルバックアップより古い増分が復元できなくなる可能性がある。フルと増分の依存関係を確認し、保持期間を延ばすかフル間隔を短くする。",
                            style = MaterialTheme.typography.bodyMedium,
                        )
                    }
                }

                BpNote(Tone.Neutral) {
                    Text(
                        buildAnnotatedString {
                            withStyle(SpanStyle(fontWeight = FontWeight.SemiBold)) { append("RPO は増分の間隔で決まる。") }
                            append(
                                " RPO は本来「復旧すべき時点」を指し、ここでは現在からその時点までの最大時間幅として表示している。フルバックアップを毎日取得しても、増分が 24 時間間隔なら最大 24 時間分の更新が失われ得る。増分が失敗した場合はさらに前の成功時点まで戻るため、失敗の監視と再実行が必要である。リストア時間は転送のみの試算であり、実際の RTO には増分の適用、整合性の検証、業務の切戻し時間が加わる。取得時間やネットワーク帯域の競合は考慮していない。",
                            )
                        },
                        style = MaterialTheme.typography.bodyMedium,
                    )
                }
            }
        } else {
            BpNote(Tone.Warning, Modifier.padding(top = 16.dp)) {
                Text("入力値を確認すると、RPO・復旧時間・タイムラインが表示される。", style = MaterialTheme.typography.bodyMedium)
            }
        }

        // 3-2-1 checklist.
        Column(Modifier.padding(top = 16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("3-2-1 チェックリスト", style = MaterialTheme.typography.labelLarge, modifier = Modifier.weight(1f))
                Text(
                    "${checked.size} / ${BpChecklist.size}",
                    style = MaterialTheme.typography.labelMedium.copy(fontFamily = FontFamily.Monospace),
                    color = Sg.colors.mutedForeground,
                )
            }
            SgProgressBar(
                checked.size.toFloat() / BpChecklist.size,
                Modifier.padding(top = 6.dp, bottom = 4.dp),
                color = if (checked.size == BpChecklist.size) Sg.colors.success else Sg.colors.info,
            )
            BpChecklist.forEachIndexed { index, item ->
                val isChecked = index in checked
                Row(
                    Modifier.fillMaxWidth().heightIn(min = 48.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .clickable(role = Role.Checkbox) { setChecked(if (isChecked) checked - index else checked + index) }
                        .padding(vertical = 2.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Checkbox(
                        checked = isChecked, onCheckedChange = null,
                        colors = CheckboxDefaults.colors(
                            checkedColor = Sg.colors.chart[1], uncheckedColor = Sg.colors.mutedForeground, checkmarkColor = Sg.colors.card,
                        ),
                        modifier = Modifier.padding(horizontal = 12.dp),
                    )
                    Text(
                        item, style = MaterialTheme.typography.bodyMedium, modifier = Modifier.weight(1f),
                        color = if (isChecked) Sg.colors.successForeground else Sg.colors.foreground,
                    )
                }
            }
            Text(
                "3-2-1 は最低線であり、暗号化・イミュータブル保存・復元訓練まで含めて初めて実効性が上がる。",
                style = MaterialTheme.typography.bodySmall,
                color = Sg.colors.mutedForeground,
                modifier = Modifier.padding(top = 6.dp),
            )
        }
        }
    }
}

@Composable
private fun BpLabeled(label: String, error: String? = null, content: @Composable () -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Text(label, style = MaterialTheme.typography.labelLarge)
        content()
        if (error != null) {
            Text(error, style = MaterialTheme.typography.bodySmall, color = Sg.colors.destructiveForeground, fontWeight = FontWeight.Medium)
        }
    }
}

@Composable
private fun BpTextField(
    value: String,
    onChange: (String) -> Unit,
    keyboardType: KeyboardType,
    invalid: Boolean,
    modifier: Modifier = Modifier,
    suffix: String? = null,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onChange,
        modifier = modifier.fillMaxWidth().heightIn(min = 52.dp),
        isError = invalid,
        singleLine = true,
        keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
        textStyle = MaterialTheme.typography.bodyLarge.copy(fontFamily = FontFamily.Monospace),
        suffix = if (suffix != null) { { Text(suffix, color = Sg.colors.mutedForeground) } } else null,
        shape = RoundedCornerShape(10.dp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedTextColor = Sg.colors.foreground, unfocusedTextColor = Sg.colors.foreground,
            focusedBorderColor = Sg.colors.info, unfocusedBorderColor = Sg.colors.input,
            errorBorderColor = Sg.colors.destructiveForeground, errorTextColor = Sg.colors.foreground,
            cursorColor = Sg.colors.info, errorCursorColor = Sg.colors.destructiveForeground,
            focusedContainerColor = Sg.colors.card, unfocusedContainerColor = Sg.colors.card, errorContainerColor = Sg.colors.card,
        ),
    )
}

@Composable
private fun BpDayButton(label: String, selected: Boolean, modifier: Modifier, onClick: () -> Unit) {
    val shape = RoundedCornerShape(10.dp)
    Box(
        modifier
            .heightIn(min = 48.dp)
            .clip(shape)
            .background(if (selected) Sg.colors.info.copy(alpha = 0.14f) else Sg.colors.card)
            .border(BorderStroke(if (selected) 2.dp else 1.dp, if (selected) Sg.colors.info else Sg.colors.input), shape)
            .semantics { contentDescription = "${label}曜日" }
            .clickable(role = Role.RadioButton, onClick = onClick),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            label, style = MaterialTheme.typography.labelLarge,
            color = if (selected) Sg.colors.infoForeground else Sg.colors.foreground,
            fontWeight = if (selected) FontWeight.Bold else FontWeight.Medium,
        )
    }
}

@Composable
private fun BpMetric(label: String, value: String, sub: String, tone: Tone, modifier: Modifier) {
    Column(
        modifier.clip(RoundedCornerShape(10.dp)).background(Sg.colors.muted)
            .border(BorderStroke(1.dp, Sg.colors.border), RoundedCornerShape(10.dp)).padding(horizontal = 12.dp, vertical = 10.dp),
    ) {
        Text(label, style = MaterialTheme.typography.labelMedium, color = Sg.colors.mutedForeground)
        Text(
            value,
            style = MaterialTheme.typography.titleMedium.copy(fontFamily = FontFamily.Monospace),
            color = if (tone == Tone.Neutral) Sg.colors.foreground else tone.color(),
            modifier = Modifier.padding(top = 2.dp),
        )
        Text(sub, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground, modifier = Modifier.padding(top = 2.dp))
    }
}

@Composable
private fun BpTimelineCell(day: Int, isFull: Boolean, increments: Int, time: String, modifier: Modifier) {
    val shape = RoundedCornerShape(8.dp)
    Column(
        modifier
            .clip(shape)
            .background(if (isFull) Sg.colors.info.copy(alpha = 0.12f) else Sg.colors.muted)
            .border(BorderStroke(if (isFull) 2.dp else 1.dp, if (isFull) Sg.colors.info else Sg.colors.border), shape)
            .semantics(mergeDescendants = true) {
                contentDescription = "${BpDayLabels[day]}曜日: ${if (isFull) "フルバックアップ $time、" else ""}増分 $increments 回"
            }
            .padding(vertical = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(BpDayLabels[day], style = MaterialTheme.typography.labelMedium, color = Sg.colors.mutedForeground)
        Text(
            if (isFull) "F" else "—",
            style = MaterialTheme.typography.titleSmall.copy(fontFamily = FontFamily.Monospace),
            color = if (isFull) Sg.colors.infoForeground else Sg.colors.mutedForeground,
        )
        Text(
            "I×$increments",
            style = MaterialTheme.typography.labelSmall.copy(fontFamily = FontFamily.Monospace),
            color = Sg.colors.mutedForeground,
            textAlign = TextAlign.Center,
        )
    }
}

@Composable
private fun BpNote(tone: Tone, modifier: Modifier = Modifier, content: @Composable () -> Unit) {
    val shape = RoundedCornerShape(10.dp)
    val border: Color = if (tone == Tone.Neutral) Sg.colors.border else tone.color().copy(alpha = 0.35f)
    Box(
        modifier.fillMaxWidth().clip(shape).background(tone.container()).border(BorderStroke(1.dp, border), shape).padding(12.dp),
    ) { content() }
}
