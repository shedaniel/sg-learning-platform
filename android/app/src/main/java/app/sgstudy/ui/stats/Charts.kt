package app.sgstudy.ui.stats

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.layout.layout
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.dp
import kotlin.math.roundToInt
import app.sgstudy.ui.theme.Sg

/** One bar: [value] drawn against the chart max, [label] shown under it (empty = no label). */
data class BarPoint(val label: String, val value: Float, val highlight: Boolean = false)

/**
 * Small vertical bar chart (e.g. minutes per day). Bars scale to max(values, [minMax]) so an all-zero chart
 * still draws a baseline. Labels are drawn as Text below the canvas so they respect font scaling.
 */
@Composable
fun BarChart(
    points: List<BarPoint>,
    modifier: Modifier = Modifier,
    barColor: Color = Sg.colors.info,
    height: androidx.compose.ui.unit.Dp = 96.dp,
    minMax: Float = 1f,
    description: String = "棒グラフ",
) {
    val track = Sg.colors.muted
    val max = maxOf(minMax, points.maxOfOrNull { it.value } ?: 0f)
    Column(modifier.semantics { contentDescription = description }) {
        Canvas(Modifier.fillMaxWidth().height(height)) {
            if (points.isEmpty()) return@Canvas
            val slot = size.width / points.size
            val barW = slot * 0.62f
            val radius = CornerRadius(barW.coerceAtMost(8.dp.toPx()) / 2f)
            points.forEachIndexed { i, p ->
                val x = i * slot + (slot - barW) / 2f
                // faint track so empty days are still visible
                drawRoundRect(track, Offset(x, 0f), Size(barW, size.height), radius)
                if (p.value > 0f) {
                    val h = (p.value / max * size.height).coerceAtLeast(4.dp.toPx())
                    drawRoundRect(
                        if (p.highlight) barColor else barColor.copy(alpha = 0.7f),
                        Offset(x, size.height - h), Size(barW, h), radius,
                    )
                }
            }
        }
        Spacer(Modifier.height(4.dp))
        Row(Modifier.fillMaxWidth()) {
            points.forEachIndexed { i, p ->
                // Labels may be wider than their slot: measure unbounded, then place centred on the slot, except
                // the first/last which hug the card edge (and overflow inward) instead of being clipped.
                val frac = when (i) { 0 -> 0f; points.lastIndex -> 1f; else -> 0.5f }
                if (p.label.isEmpty()) Spacer(Modifier.weight(1f)) else Text(
                    p.label,
                    Modifier.weight(1f).layout { m, c ->
                        val pl = m.measure(c.copy(minWidth = 0, maxWidth = Constraints.Infinity))
                        layout(c.maxWidth, pl.height) { pl.place(((c.maxWidth - pl.width) * frac).roundToInt(), 0) }
                    },
                    style = MaterialTheme.typography.labelSmall, color = Sg.colors.mutedForeground, maxLines = 1, softWrap = false,
                )
            }
        }
    }
}

/** A point on the trend line: [value] is a percentage 0..100, null = gap (no data in that bucket). */
data class TrendPoint(val label: String, val value: Int?, val count: Int)

/**
 * Line chart for percentages (0–100) with gridlines at 0/50/100 and dots; gaps (null) break the line.
 * Axis labels are drawn with Text, not Canvas, to follow the theme typography.
 */
@Composable
fun TrendChart(
    points: List<TrendPoint>,
    modifier: Modifier = Modifier,
    lineColor: Color = Sg.colors.info,
    height: androidx.compose.ui.unit.Dp = 140.dp,
    description: String = "正答率の推移",
) {
    val grid = Sg.colors.border
    val dotFill = Sg.colors.card
    Column(modifier.semantics { contentDescription = description }) {
        Row(Modifier.fillMaxWidth().height(height)) {
            Column(Modifier.fillMaxHeight().padding(end = 6.dp), verticalArrangement = Arrangement.SpaceBetween) {
                listOf("100", "50", "0").forEach {
                    Text(it, style = MaterialTheme.typography.labelSmall, color = Sg.colors.mutedForeground)
                }
            }
            Canvas(Modifier.weight(1f).fillMaxHeight()) {
                val pad = 6.dp.toPx()
                val h = size.height - pad * 2
                listOf(0f, 0.5f, 1f).forEach { f ->
                    val y = pad + h * f
                    drawLine(grid, Offset(0f, y), Offset(size.width, y), strokeWidth = 1.dp.toPx())
                }
                if (points.isEmpty()) return@Canvas
                val step = if (points.size > 1) (size.width - pad * 2) / (points.size - 1) else 0f
                fun pos(i: Int, v: Int) = Offset(pad + step * i, pad + h * (1f - v / 100f))
                val stroke = Stroke(2.5.dp.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round)
                var path = Path(); var open = false
                points.forEachIndexed { i, p ->
                    val v = p.value
                    if (v == null) {
                        if (open) { drawPath(path, lineColor, style = stroke); path = Path(); open = false }
                    } else {
                        val o = pos(i, v)
                        if (!open) { path.moveTo(o.x, o.y); open = true } else path.lineTo(o.x, o.y)
                    }
                }
                if (open) drawPath(path, lineColor, style = stroke)
                points.forEachIndexed { i, p ->
                    val v = p.value ?: return@forEachIndexed
                    val o = pos(i, v)
                    drawCircle(dotFill, 4.5.dp.toPx(), o)
                    drawCircle(lineColor, 4.5.dp.toPx(), o, style = Stroke(2.dp.toPx()))
                }
            }
        }
        if (points.size > 1) {
            Row(Modifier.fillMaxWidth().padding(start = 28.dp, top = 4.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                Text(points.first().label, style = MaterialTheme.typography.labelSmall, color = Sg.colors.mutedForeground)
                Text(points.last().label, style = MaterialTheme.typography.labelSmall, color = Sg.colors.mutedForeground)
            }
        }
    }
}
