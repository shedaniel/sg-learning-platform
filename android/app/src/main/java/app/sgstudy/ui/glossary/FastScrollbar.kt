package app.sgstudy.ui.glossary

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import app.sgstudy.ui.theme.Sg
import kotlinx.coroutines.launch
import kotlin.math.roundToInt

/**
 * Draggable scroll thumb for long lists: appears while scrolling / dragging, and dragging it jumps through the list.
 * [label] (optional) is shown in a bubble next to the thumb for the item currently at the top.
 */
@Composable
fun BoxScope.FastScrollbar(state: LazyListState, label: (Int) -> String = { "" }) {
    val scope = rememberCoroutineScope()
    var dragging by remember { mutableStateOf(false) }
    val total = state.layoutInfo.totalItemsCount
    if (total < 20) return
    val active = dragging || state.isScrollInProgress
    val alpha by animateFloatAsState(if (active) 1f else 0f, label = "fastscroll")
    val thumbH = 52.dp
    BoxWithConstraints(Modifier.align(Alignment.CenterEnd).fillMaxHeight().width(36.dp)) {
        val trackPx = with(LocalDensity.current) { (maxHeight - thumbH).toPx() }.coerceAtLeast(1f)
        val first = state.firstVisibleItemIndex
        val fraction = (first.toFloat() / (total - 1).coerceAtLeast(1)).coerceIn(0f, 1f)
        Box(
            Modifier.fillMaxSize().pointerInput(total) {
                detectDragGestures(
                    onDragStart = { dragging = true },
                    onDragEnd = { dragging = false }, onDragCancel = { dragging = false },
                ) { change, _ ->
                    change.consume()
                    val f = ((change.position.y - with(density) { thumbH.toPx() } / 2) / trackPx).coerceIn(0f, 1f)
                    scope.launch { state.scrollToItem((f * (total - 1)).roundToInt()) }
                }
            },
        )
        Box(
            Modifier.offset { IntOffset(0, (fraction * trackPx).roundToInt()) }.align(Alignment.TopEnd).alpha(alpha)
                .padding(end = 4.dp).width(6.dp).height(thumbH)
                .clip(RoundedCornerShape(3.dp)).background(Sg.colors.mutedForeground.copy(alpha = 0.6f)),
        )
        if (dragging) {
            val text = label(first)
            if (text.isNotEmpty()) Box(
                Modifier.offset { IntOffset(-with(density) { 44.dp.toPx() }.roundToInt(), (fraction * trackPx).roundToInt()) }
                    .align(Alignment.TopEnd).height(thumbH)
                    .clip(RoundedCornerShape(10.dp)).background(Sg.colors.primary).padding(horizontal = 14.dp),
                contentAlignment = Alignment.Center,
            ) { Text(text, style = MaterialTheme.typography.titleMedium, color = Sg.colors.onPrimary, maxLines = 1, softWrap = false) }
        }
    }
}
