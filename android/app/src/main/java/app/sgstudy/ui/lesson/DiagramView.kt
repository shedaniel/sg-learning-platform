package app.sgstudy.ui.lesson

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.util.LruCache
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.gestures.detectTransformGestures
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.outlined.ImageNotSupported
import androidx.compose.material.icons.outlined.ZoomIn
import androidx.compose.material.icons.outlined.ZoomOut
import androidx.compose.material.icons.outlined.ZoomOutMap
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import app.sgstudy.data.model.DiagramBlock
import app.sgstudy.ui.theme.Sg
import com.caverock.androidsvg.SVG
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlin.math.roundToInt

/** Result of rendering one diagram at one width. */
private class RenderedDiagram(val bitmap: Bitmap, val aspect: Float, val title: String?, val description: String?)

/**
 * Parses diagram SVGs from `assets/content/diagrams/<id>-<light|dark>.svg` once and keeps rendered bitmaps in a
 * small byte-bounded LRU. All entry points are safe to call from a background thread.
 */
private object DiagramRenderer {
    private val svgs = LruCache<String, SVG>(24)
    private val failed = HashSet<String>()
    private val bitmaps = object : LruCache<String, RenderedDiagram>(40 * 1024 * 1024) {
        override fun sizeOf(key: String, value: RenderedDiagram) = value.bitmap.byteCount
    }

    private fun parse(context: Context, id: String, dark: Boolean): SVG? {
        val key = "$id-${if (dark) "dark" else "light"}"
        synchronized(this) {
            svgs.get(key)?.let { return it }
            if (key in failed) return null
        }
        return try {
            val svg = context.assets.open("content/diagrams/$key.svg").use { SVG.getFromInputStream(it) }
            synchronized(this) { svgs.put(key, svg) }
            svg
        } catch (e: Exception) {
            synchronized(this) { failed.add(key) }
            null
        }
    }

    /** Renders to a bitmap [widthPx] wide, preserving the viewBox aspect ratio. Null if missing/invalid. */
    fun render(context: Context, id: String, dark: Boolean, widthPx: Int): RenderedDiagram? {
        if (widthPx <= 0) return null
        val key = "$id-${if (dark) "dark" else "light"}-$widthPx"
        synchronized(this) { bitmaps.get(key)?.let { return it } }
        val svg = parse(context, id, dark) ?: return null
        return try {
            val aspect = svg.documentAspectRatio.takeIf { it > 0f } ?: (760f / 400f)
            val h = (widthPx / aspect).roundToInt().coerceAtLeast(1)
            val bmp = Bitmap.createBitmap(widthPx, h, Bitmap.Config.ARGB_8888)
            synchronized(svg) {
                svg.setDocumentWidth(widthPx.toFloat())
                svg.setDocumentHeight(h.toFloat())
                svg.renderToCanvas(Canvas(bmp))
            }
            val out = RenderedDiagram(bmp, aspect, svg.documentTitle?.takeIf { it.isNotBlank() }, svg.documentDescription?.takeIf { it.isNotBlank() })
            synchronized(this) { bitmaps.put(key, out) }
            out
        } catch (e: Throwable) {
            null
        }
    }
}

private val MinInlineWidth = 560.dp

private sealed interface DiagramState {
    data object Loading : DiagramState
    data object Failed : DiagramState
    class Ready(val diagram: RenderedDiagram) : DiagramState
}

@Composable
private fun rememberDiagram(id: String, widthPx: Int): DiagramState {
    val context = LocalContext.current.applicationContext
    val dark = Sg.colors.isDark
    val state by produceState<DiagramState>(DiagramState.Loading, id, dark, widthPx) {
        value = withContext(Dispatchers.Default) { DiagramRenderer.render(context, id, dark, widthPx) }
            ?.let { DiagramState.Ready(it) } ?: DiagramState.Failed
    }
    return state
}

/**
 * Inline diagram: SVG fitted to the available width in a bordered card, caption underneath.
 * Tapping opens a full-screen viewer with pinch-zoom and pan (the diagrams are wide, so small text needs it).
 */
@Composable
fun DiagramView(block: DiagramBlock, modifier: Modifier = Modifier) {
    var zoomed by rememberSaveable(block.diagram) { mutableStateOf(false) }
    val shape = RoundedCornerShape(12.dp)
    val density = LocalDensity.current
    var hintScroll by remember { mutableStateOf(false) }
    Column(modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(6.dp)) {
        BoxWithConstraints(Modifier.fillMaxWidth()) {
            // Wide diagrams have small text: on narrow screens render at least MinInlineWidth and let the card scroll sideways.
            val innerWidth = maxOf(maxWidth - 24.dp, MinInlineWidth)
            val widthPx = with(density) { innerWidth.toPx() }.roundToInt()
            val state = rememberDiagram(block.diagram, widthPx)
            val scrolls = innerWidth > maxWidth - 24.dp
            SideEffect { hintScroll = scrolls }
            val hScroll = rememberScrollState()
            // Diagrams are laid out around their centre, so open scrolled to the middle rather than the (often empty) left edge.
            LaunchedEffect(hScroll.maxValue) { if (hScroll.value == 0 && hScroll.maxValue > 0) hScroll.scrollTo(hScroll.maxValue / 2) }
            Box(
                Modifier.fillMaxWidth().clip(shape).border(1.dp, Sg.colors.border, shape).background(Sg.colors.card)
                    .then(if (state is DiagramState.Ready) Modifier.clickable { zoomed = true } else Modifier),
            ) {
                when (state) {
                    is DiagramState.Ready -> {
                        val d = state.diagram
                        Image(
                            bitmap = d.bitmap.asImageBitmap(),
                            contentDescription = listOfNotNull(d.title, d.description, block.caption).joinToString("。").ifBlank { block.diagram },
                            contentScale = ContentScale.FillWidth,
                            modifier = Modifier.then(if (scrolls) Modifier.horizontalScroll(hScroll) else Modifier)
                                .padding(12.dp).width(innerWidth).aspectRatio(d.aspect),
                        )
                        Icon(
                            Icons.Outlined.ZoomOutMap, contentDescription = "拡大して見る",
                            tint = Sg.colors.mutedForeground,
                            modifier = Modifier.align(Alignment.TopEnd).padding(6.dp)
                                .background(Sg.colors.card.copy(alpha = 0.85f), androidx.compose.foundation.shape.CircleShape).padding(3.dp).size(18.dp),
                        )
                    }
                    DiagramState.Loading -> Box(Modifier.fillMaxWidth().padding(12.dp).aspectRatio(760f / 400f))
                    DiagramState.Failed -> Row(
                        Modifier.fillMaxWidth().padding(12.dp).padding(vertical = 12.dp),
                        verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp),
                    ) {
                        Icon(Icons.Outlined.ImageNotSupported, null, tint = Sg.colors.mutedForeground)
                        Text("図を表示できませんでした（${block.diagram}）", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
                    }
                }
            }
        }
        if (hintScroll) {
            Text(
                "← 横にスクロール ／ タップで拡大 →", style = MaterialTheme.typography.labelSmall, color = Sg.colors.mutedForeground,
                textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth(),
            )
        }
        if (block.caption != null) {
            Text(
                block.caption, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
                textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth().padding(horizontal = 4.dp),
            )
        }
        if (zoomed) DiagramZoomDialog(block) { zoomed = false }
    }
}

/** Full-screen viewer: pinch to zoom (1x–6x), drag to pan, double-tap to toggle 2.5x. */
@Composable
private fun DiagramZoomDialog(block: DiagramBlock, onDismiss: () -> Unit) {
    var viewSize by remember { mutableStateOf(IntSize.Zero) }
    var scale by remember { mutableFloatStateOf(1f) }
    var offset by remember { mutableStateOf(Offset.Zero) }
    // Wide diagrams are unreadable when fitted to a portrait screen, so open magnified (showing the left edge).
    val readableScale = 1.8f
    var applied by remember { mutableStateOf(false) }
    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false, decorFitsSystemWindows = false),
    ) {
        Column(Modifier.fillMaxSize().background(Sg.colors.background).statusBarsPadding().navigationBarsPadding()) {
            Row(Modifier.fillMaxWidth().padding(start = 16.dp), verticalAlignment = Alignment.CenterVertically) {
                Text(
                    block.caption ?: "図", style = MaterialTheme.typography.titleSmall, color = Sg.colors.foreground,
                    maxLines = 2, modifier = Modifier.weight(1f),
                )
                IconButton(onClick = {
                    if (scale > 1.05f) { scale = 1f; offset = Offset.Zero } else { scale = readableScale; offset = Offset(1e6f, 0f) }
                    applied = true
                }) {
                    Icon(
                        if (scale > 1.05f) Icons.Outlined.ZoomOut else Icons.Outlined.ZoomIn,
                        contentDescription = if (scale > 1.05f) "全体を表示" else "拡大", tint = Sg.colors.foreground,
                    )
                }
                IconButton(onClick = onDismiss) { Icon(Icons.Filled.Close, contentDescription = "閉じる", tint = Sg.colors.foreground) }
            }
            BoxWithConstraints(Modifier.fillMaxWidth().weight(1f)) {
                val density = LocalDensity.current
                // Render big (up to 3x the screen width) so pinch-zoom stays crisp.
                val widthPx = with(density) { (maxWidth * 3).toPx() }.roundToInt().coerceAtMost(3200)
                val state = rememberDiagram(block.diagram, widthPx)

                fun clamp(o: Offset, s: Float, aspect: Float): Offset {
                    val vw = viewSize.width.toFloat(); val vh = viewSize.height.toFloat()
                    val imgH = vw / aspect
                    val maxX = vw * (s - 1f) / 2f
                    val maxY = maxOf(0f, (imgH * s - vh) / 2f)
                    return Offset(o.x.coerceIn(-maxX, maxX), o.y.coerceIn(-maxY, maxY))
                }

                val aspect = (state as? DiagramState.Ready)?.diagram?.aspect ?: 1.9f
                LaunchedEffect(state is DiagramState.Ready, viewSize) {
                    if (!applied && state is DiagramState.Ready && viewSize.width > 0 && aspect > 1.2f && viewSize.width < viewSize.height) {
                        scale = readableScale
                        offset = clamp(Offset(1e6f, 0f), readableScale, aspect)
                        applied = true
                    }
                }
                Box(
                    Modifier.fillMaxSize().onSizeChanged { viewSize = it }
                        .pointerInput(aspect) {
                            detectTransformGestures { centroid, pan, zoom, _ ->
                                val newScale = (scale * zoom).coerceIn(1f, 6f)
                                // Keep the point under the fingers fixed while zooming.
                                val q = centroid - Offset(size.width / 2f, size.height / 2f)
                                val raw = q - (q - offset) * (newScale / scale) + pan
                                scale = newScale
                                offset = clamp(raw, newScale, aspect)
                            }
                        }
                        .pointerInput(aspect) {
                            detectTapGestures(onDoubleTap = { tap ->
                                if (scale > 1.05f) { scale = 1f; offset = Offset.Zero } else {
                                    val s = 2.5f
                                    val q = tap - Offset(size.width / 2f, size.height / 2f)
                                    scale = s
                                    offset = clamp(q - q * s, s, aspect)
                                }
                            })
                        },
                    contentAlignment = Alignment.Center,
                ) {
                    when (state) {
                        is DiagramState.Ready -> Image(
                            bitmap = state.diagram.bitmap.asImageBitmap(), contentDescription = block.caption ?: block.diagram,
                            contentScale = ContentScale.FillWidth,
                            modifier = Modifier.fillMaxWidth().aspectRatio(aspect).graphicsLayer {
                                scaleX = scale; scaleY = scale
                                val o = clamp(offset, scale, aspect) // also tames the "jump to left edge" sentinel offset
                                translationX = o.x; translationY = o.y
                            },
                        )
                        DiagramState.Loading -> Unit
                        DiagramState.Failed -> Text("図を表示できませんでした", color = Sg.colors.mutedForeground)
                    }
                }
            }
            Text(
                "ピンチで拡大・ドラッグで移動・ダブルタップで拡大／戻す",
                style = MaterialTheme.typography.labelSmall, color = Sg.colors.mutedForeground,
                textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth().padding(8.dp),
            )
        }
    }
}
