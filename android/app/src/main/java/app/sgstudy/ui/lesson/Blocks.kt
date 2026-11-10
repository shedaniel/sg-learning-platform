package app.sgstudy.ui.lesson

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Description
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material.icons.outlined.Lightbulb
import androidx.compose.material.icons.outlined.WarningAmber
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.sgstudy.LocalApp
import app.sgstudy.data.model.*
import app.sgstudy.ui.components.RichText
import app.sgstudy.ui.components.Tone
import app.sgstudy.ui.components.color
import app.sgstudy.ui.components.container
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.theme.Sg
import app.sgstudy.ui.widgets.WidgetHost

/** Vertical gap between consecutive blocks. [BlockItem]s are laid out with this spacing by [BlockList]. */
val BlockSpacing = 14.dp

/**
 * Renders lesson/question content blocks as a plain (non-lazy) column. Lesson screens that want
 * lazy rendering can call [BlockItem] per block from their own LazyColumn instead.
 */
@Composable
fun BlockList(blocks: List<Block>, nav: Navigator, modifier: Modifier = Modifier) {
    Column(modifier, verticalArrangement = Arrangement.spacedBy(BlockSpacing)) {
        blocks.forEach { BlockItem(it, nav) }
    }
}

/** Renders one block. */
@Composable
fun BlockItem(block: Block, nav: Navigator, modifier: Modifier = Modifier) {
    when (block) {
        is LeadBlock -> RichText(
            block.text, nav, modifier,
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Medium, lineHeight = 29.sp),
        )
        is ParagraphBlock -> RichText(block.text, nav, modifier)
        is ListBlock -> ListBlockView(block, nav, modifier)
        is TableBlock -> TableView(block, nav, modifier)
        is CalloutBlock -> CalloutView(block, nav, modifier)
        is TermsBlock -> TermsView(block, nav, modifier)
        is DiagramBlock -> DiagramView(block, modifier)
        is InteractiveBlock -> InteractiveView(block, modifier)
        is ComparisonBlock -> ComparisonView(block, nav, modifier)
        is StepsBlock -> StepsView(block, nav, modifier)
    }
}

// ---------------------------------------------------------------- list

@Composable
private fun ListBlockView(block: ListBlock, nav: Navigator, modifier: Modifier) {
    Column(modifier, verticalArrangement = Arrangement.spacedBy(8.dp)) {
        block.items.forEachIndexed { i, item ->
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                if (block.ordered) {
                    Text(
                        "${i + 1}.",
                        style = MaterialTheme.typography.bodyLarge.copy(fontFamily = FontFamily.Monospace),
                        color = Sg.colors.mutedForeground,
                        modifier = Modifier.widthIn(min = 22.dp),
                    )
                } else {
                    Box(Modifier.padding(top = 11.dp, start = 4.dp).size(6.dp).clip(CircleShape).background(Sg.colors.mutedForeground))
                }
                RichText(item, nav, Modifier.weight(1f))
            }
        }
    }
}

// ---------------------------------------------------------------- table

private val MARKUP_TERM = Regex("\\{\\{term:([^}|]+)(?:\\|([^}]+))?\\}\\}")

/** Approximate visible width of a cell in "em" units (CJK = 1, latin = 0.55), longest line wins. */
private fun visualLength(raw: String): Float {
    val text = raw.replace(MARKUP_TERM) { it.groupValues[2].ifEmpty { it.groupValues[1] } }.replace("**", "").replace("`", "")
    return text.sumOf { c -> if (c.code > 0x2E7F) 1.0 else 0.55 }.toFloat()
}

/**
 * Wide tables scroll horizontally; narrow ones fill the width. Column widths come from content length
 * (capped so long cells wrap), then scale to fill the available width when the table is nearly that wide.
 */
@Composable
private fun TableView(block: TableBlock, nav: Navigator, modifier: Modifier) {
    val shape = RoundedCornerShape(12.dp)
    Column(modifier, verticalArrangement = Arrangement.spacedBy(6.dp)) {
        BoxWithConstraints(Modifier.fillMaxWidth()) {
            val available = maxWidth
            val colWidths = remember(block, available) { columnWidths(block, available - 2.dp) }
            val total = colWidths.fold(0.dp) { a, b -> a + b }
            val scrolls = total > available - 1.dp
            Column(Modifier.fillMaxWidth().clip(shape).border(BorderStroke(1.dp, Sg.colors.border), shape).background(Sg.colors.card)) {
                if (block.caption != null) {
                    Text(
                        block.caption,
                        style = MaterialTheme.typography.labelMedium,
                        color = Sg.colors.mutedForeground,
                        modifier = Modifier.fillMaxWidth().background(Sg.colors.muted).padding(horizontal = 12.dp, vertical = 9.dp),
                    )
                }
                Column(Modifier.horizontalScroll(rememberScrollState())) {
                    TableRow(block.headers, colWidths, nav, header = true)
                    block.rows.forEachIndexed { r, row ->
                        Box(Modifier.width(total).height(1.dp).background(Sg.colors.border))
                        TableRow(row, colWidths, nav, header = false, zebra = r % 2 == 1)
                    }
                }
                if (scrolls) {
                    // Affordance so readers know there is more to the right (kept out of the cells' way).
                    Text(
                        "横にスクロールできます →",
                        style = MaterialTheme.typography.labelSmall,
                        color = Sg.colors.mutedForeground,
                        textAlign = androidx.compose.ui.text.style.TextAlign.End,
                        modifier = Modifier.fillMaxWidth().background(Sg.colors.muted).padding(horizontal = 12.dp, vertical = 5.dp),
                    )
                }
            }
        }
        if (block.note != null) {
            RichText(block.note, nav, Modifier.padding(horizontal = 4.dp), style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
        }
    }
}

private fun columnWidths(block: TableBlock, available: Dp): List<Dp> {
    val cols = maxOf(block.headers.size, block.rows.maxOfOrNull { it.size } ?: 0)
    val raw = (0 until cols).map { c ->
        val longest = (listOf(block.headers.getOrNull(c)) + block.rows.map { it.getOrNull(c) })
            .filterNotNull().maxOfOrNull { visualLength(it) } ?: 0f
        (longest * 14f + 28f).coerceIn(84f, 230f)
    }
    val sum = raw.sum()
    val avail = available.value
    // Fit the width when that keeps every column readable (long cells simply wrap); otherwise scroll sideways.
    val scale = avail / sum
    return if (scale >= 1f || raw.minOf { it * scale } >= 120f) raw.map { (it * scale).dp } else raw.map { it.dp }
}

@Composable
private fun TableRow(cells: List<String>, widths: List<Dp>, nav: Navigator, header: Boolean, zebra: Boolean = false) {
    val bg = when {
        header -> Sg.colors.muted
        zebra -> Sg.colors.muted.copy(alpha = 0.4f)
        else -> Sg.colors.card
    }
    Row(Modifier.height(IntrinsicSize.Min).background(bg)) {
        widths.forEachIndexed { c, w ->
            Box(Modifier.width(w).fillMaxHeight().padding(horizontal = 12.dp, vertical = if (header) 9.dp else 11.dp)) {
                val text = cells.getOrNull(c).orEmpty()
                if (header) {
                    Text(text, style = MaterialTheme.typography.labelMedium, color = Sg.colors.mutedForeground)
                } else {
                    RichText(
                        text, nav,
                        style = MaterialTheme.typography.bodyMedium.copy(
                            fontSize = 14.sp, lineHeight = 22.sp,
                            fontWeight = if (c == 0) FontWeight.Medium else FontWeight.Normal,
                        ),
                    )
                }
            }
        }
    }
}

// ---------------------------------------------------------------- callout

private data class CalloutStyle(val tone: Tone, val icon: ImageVector, val label: String)

private fun calloutStyle(tone: String) = when (tone) {
    "tip" -> CalloutStyle(Tone.Info, Icons.Outlined.Lightbulb, "試験のヒント")
    "trap" -> CalloutStyle(Tone.Warning, Icons.Outlined.WarningAmber, "ひっかけ注意")
    "example" -> CalloutStyle(Tone.Neutral, Icons.Outlined.Description, "事例")
    else -> CalloutStyle(Tone.Neutral, Icons.Outlined.Info, "補足")
}

@Composable
private fun CalloutView(block: CalloutBlock, nav: Navigator, modifier: Modifier) {
    val style = calloutStyle(block.tone)
    val shape = RoundedCornerShape(12.dp)
    val accent = style.tone.color()
    Column(
        modifier.fillMaxWidth().clip(shape).background(style.tone.container(), shape)
            .border(BorderStroke(1.dp, if (style.tone == Tone.Neutral) Sg.colors.border else accent.copy(alpha = 0.3f)), shape)
            .padding(14.dp),
        verticalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        Row(verticalAlignment = Alignment.Top, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Icon(
                style.icon, contentDescription = style.label, tint = accent,
                modifier = Modifier.padding(top = 2.dp).size(20.dp),
            )
            Text(block.title, style = MaterialTheme.typography.titleSmall.copy(fontSize = 16.sp, lineHeight = 24.sp), color = Sg.colors.foreground)
        }
        RichText(block.text, nav, style = MaterialTheme.typography.bodyMedium.copy(fontSize = 15.sp, lineHeight = 26.sp))
    }
}

// ---------------------------------------------------------------- terms

@Composable
private fun TermsView(block: TermsBlock, nav: Navigator, modifier: Modifier) {
    val content = LocalApp.current.content
    val terms = remember(block) { block.termIds.mapNotNull { content.termById[it] } }
    if (terms.isEmpty()) return
    Column(modifier, verticalArrangement = Arrangement.spacedBy(8.dp)) {
        terms.forEach { term ->
            val shape = RoundedCornerShape(12.dp)
            Column(
                Modifier.fillMaxWidth().clip(shape).background(Sg.colors.muted, shape)
                    .clickable { nav.openTerm(term.id) }.padding(horizontal = 14.dp, vertical = 12.dp),
                verticalArrangement = Arrangement.spacedBy(3.dp),
            ) {
                FlowLine {
                    Text(term.ja, style = MaterialTheme.typography.titleSmall.copy(fontSize = 16.sp), color = Sg.colors.foreground)
                    if (!term.reading.isNullOrBlank()) {
                        Text("（${term.reading}）", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
                    }
                    Text(term.en, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
                }
                Text(term.shortJa, style = MaterialTheme.typography.bodyMedium.copy(fontSize = 14.sp, lineHeight = 22.sp), color = Sg.colors.mutedForeground)
            }
        }
    }
}

/** Inline row that wraps its children onto further lines. */
@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun FlowLine(content: @Composable () -> Unit) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(6.dp), verticalArrangement = Arrangement.spacedBy(0.dp),
        itemVerticalAlignment = Alignment.Bottom,
    ) { content() }
}

// ---------------------------------------------------------------- interactive

@Composable
private fun InteractiveView(block: InteractiveBlock, modifier: Modifier) {
    val shape = RoundedCornerShape(12.dp)
    Column(modifier.fillMaxWidth().clip(shape).border(BorderStroke(1.dp, Sg.colors.border), shape).background(Sg.colors.card)) {
        Row(
            Modifier.fillMaxWidth().background(Sg.colors.muted).padding(horizontal = 14.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Box(Modifier.size(7.dp).clip(CircleShape).background(Sg.colors.infoForeground))
            Text(
                block.title ?: "インタラクティブ",
                style = MaterialTheme.typography.labelLarge, color = Sg.colors.infoForeground,
                modifier = Modifier.weight(1f),
            )
            Text("操作できます", style = MaterialTheme.typography.labelSmall, color = Sg.colors.mutedForeground)
        }
        Box(Modifier.padding(14.dp)) { WidgetHost(block) }
    }
}

// ---------------------------------------------------------------- comparison

@Composable
private fun ComparisonView(block: ComparisonBlock, nav: Navigator, modifier: Modifier) {
    BoxWithConstraints(modifier.fillMaxWidth()) {
        if (maxWidth >= 560.dp) {
            Row(Modifier.height(IntrinsicSize.Max), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                ComparisonSideCard(block.left, nav, Modifier.weight(1f).fillMaxHeight())
                ComparisonSideCard(block.right, nav, Modifier.weight(1f).fillMaxHeight())
            }
        } else {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                ComparisonSideCard(block.left, nav, Modifier.fillMaxWidth())
                ComparisonSideCard(block.right, nav, Modifier.fillMaxWidth())
            }
        }
    }
}

@Composable
private fun ComparisonSideCard(side: ComparisonSide, nav: Navigator, modifier: Modifier) {
    val shape = RoundedCornerShape(12.dp)
    Column(modifier.clip(shape).background(Sg.colors.muted, shape).padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(side.title, style = MaterialTheme.typography.titleSmall.copy(fontSize = 16.sp), color = Sg.colors.foreground)
        side.items.forEach { item ->
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Box(Modifier.padding(top = 10.dp).size(5.dp).clip(CircleShape).background(Sg.colors.mutedForeground))
                RichText(
                    item, nav, Modifier.weight(1f),
                    style = MaterialTheme.typography.bodyMedium.copy(fontSize = 15.sp, lineHeight = 24.sp),
                    color = Sg.colors.foreground.copy(alpha = 0.9f),
                )
            }
        }
    }
}

// ---------------------------------------------------------------- steps

@Composable
private fun StepsView(block: StepsBlock, nav: Navigator, modifier: Modifier) {
    Column(modifier.fillMaxWidth()) {
        block.items.forEachIndexed { i, item ->
            val last = i == block.items.lastIndex
            Row(Modifier.height(IntrinsicSize.Min), horizontalArrangement = Arrangement.spacedBy(14.dp)) {
                Column(Modifier.width(32.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Box(
                        Modifier.size(32.dp).clip(CircleShape).background(Sg.colors.info.copy(alpha = 0.12f))
                            .border(BorderStroke(1.dp, Sg.colors.info.copy(alpha = 0.35f)), CircleShape),
                        contentAlignment = Alignment.Center,
                    ) {
                        Text(
                            "${i + 1}",
                            style = MaterialTheme.typography.labelLarge.copy(fontFamily = FontFamily.Monospace),
                            color = Sg.colors.infoForeground,
                        )
                    }
                    if (!last) Box(Modifier.weight(1f).width(1.dp).background(Sg.colors.border))
                }
                Column(Modifier.weight(1f).padding(bottom = if (last) 0.dp else 18.dp), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                    Text(item.title, style = MaterialTheme.typography.titleSmall.copy(fontSize = 16.sp), color = Sg.colors.foreground, modifier = Modifier.padding(top = 4.dp))
                    RichText(
                        item.text, nav,
                        style = MaterialTheme.typography.bodyMedium.copy(fontSize = 15.sp, lineHeight = 25.sp),
                        color = Sg.colors.mutedForeground,
                    )
                }
            }
        }
    }
}
