package app.sgstudy.ui.widgets

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.sgstudy.ui.components.SgCard
import app.sgstudy.ui.theme.Sg
import kotlinx.serialization.json.JsonObject
import java.math.BigDecimal
import java.security.MessageDigest

// ---------------------------------------------------------------------------
// Logic (port of src/components/widgets/hash-demo.tsx; SHA-256 via java.security)
// ---------------------------------------------------------------------------

private const val HdMaxLength = 120

/** Replaces the last code point with あ (or い if it already is あ), exactly like the web `mutateOneChar`. */
private fun hdMutateOneChar(value: String): String {
    if (value.isEmpty()) return ""
    val codePoints = value.codePoints().toArray()
    val last = codePoints.last()
    codePoints[codePoints.lastIndex] = if (last == 'あ'.code) 'い'.code else 'あ'.code
    return String(codePoints, 0, codePoints.size)
}

private fun hdSha256(value: String): ByteArray =
    MessageDigest.getInstance("SHA-256").digest(value.toByteArray(Charsets.UTF_8))

private fun hdHex(bytes: ByteArray): String = buildString(bytes.size * 2) {
    bytes.forEach { b -> append("%02x".format(b.toInt() and 0xff)) }
}

private fun hdBitIsSet(bytes: ByteArray, bitIndex: Int): Boolean =
    (bytes[bitIndex / 8].toInt() shr (7 - bitIndex % 8)) and 1 == 1

private fun hdCountDifferingBits(a: ByteArray, b: ByteArray): Int =
    a.indices.sumOf { Integer.bitCount((a[it].toInt() xor b[it].toInt()) and 0xff) }

private class HdCompare(val text: String, val hash: ByteArray, val hex: String, val bitDiff: Int)
private class HdState(val baseBytes: ByteArray, val baseHex: String, val compare: HdCompare?)

private fun hdCompute(text: String): HdState {
    val baseBytes = hdSha256(text)
    val changed = hdMutateOneChar(text)
    val compare = if (changed.isEmpty()) null else {
        val bytes = hdSha256(changed)
        HdCompare(changed, bytes, hdHex(bytes), hdCountDifferingBits(baseBytes, bytes))
    }
    return HdState(baseBytes, hdHex(baseBytes), compare)
}

/** JS-like number text (50.0 -> "50"). */
private fun hdNum(value: Double): String = BigDecimal.valueOf(value).stripTrailingZeros().toPlainString()

// ---------------------------------------------------------------------------
// UI
// ---------------------------------------------------------------------------

@Composable
fun HashDemoWidget(props: JsonObject?) {
    var text by rememberSaveable { mutableStateOf("情報セキュリティ") }
    // SHA-256 of ≤120 chars is microseconds; compute synchronously per edit.
    val state = remember(text) { hdCompute(text) }
    val byteLength = remember(text) { text.toByteArray(Charsets.UTF_8).size }

    SgCard {
        CompositionLocalProvider(LocalContentColor provides Sg.colors.foreground) {
        Text("1文字の変更でハッシュはどう変わるか", style = MaterialTheme.typography.titleSmall)

        Row(Modifier.padding(top = 12.dp, bottom = 6.dp), verticalAlignment = Alignment.Bottom) {
            Text("テキスト", style = MaterialTheme.typography.labelLarge, modifier = Modifier.weight(1f))
            Text("$byteLength バイト（UTF-8）", style = MaterialTheme.typography.labelMedium, color = Sg.colors.mutedForeground)
        }
        OutlinedTextField(
            value = text,
            onValueChange = { if (it.length <= HdMaxLength) text = it },
            modifier = Modifier.fillMaxWidth().heightIn(min = 52.dp),
            placeholder = { Text("例: 情報セキュリティ", color = Sg.colors.mutedForeground) },
            textStyle = MaterialTheme.typography.bodyLarge,
            keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.None, autoCorrectEnabled = false),
            shape = RoundedCornerShape(10.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedTextColor = Sg.colors.foreground, unfocusedTextColor = Sg.colors.foreground,
                focusedBorderColor = Sg.colors.info, unfocusedBorderColor = Sg.colors.input,
                cursorColor = Sg.colors.info,
                focusedContainerColor = Sg.colors.card, unfocusedContainerColor = Sg.colors.card,
            ),
        )

        Column(Modifier.padding(top = 12.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            HdBox {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        "入力テキストのハッシュ", style = MaterialTheme.typography.labelMedium,
                        color = Sg.colors.mutedForeground, modifier = Modifier.weight(1f),
                    )
                    HdChip("256 bit / 64 hex")
                }
                HdHashHex(state.baseHex, state.compare?.hex, Modifier.padding(top = 6.dp))
            }

            val compare = state.compare
            if (compare != null) {
                HdBox {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            "末尾の1文字だけ変更したテキスト", style = MaterialTheme.typography.labelMedium,
                            color = Sg.colors.mutedForeground, modifier = Modifier.weight(1f),
                        )
                        HdChip("比較用")
                    }
                    Text(
                        "「${compare.text}」", style = MaterialTheme.typography.bodyMedium,
                        color = Sg.colors.mutedForeground, modifier = Modifier.padding(top = 4.dp),
                    )
                    HdHashHex(compare.hex, state.baseHex, Modifier.padding(top = 6.dp))
                }

                // Avalanche summary + 256-bit map.
                val percent = Math.round(compare.bitDiff / 256.0 * 1000) / 10.0
                val shape = RoundedCornerShape(10.dp)
                Column(
                    Modifier.fillMaxWidth().clip(shape).background(Sg.colors.muted)
                        .border(BorderStroke(1.dp, Sg.colors.info.copy(alpha = 0.45f)), shape).padding(12.dp),
                ) {
                    Text(
                        buildAnnotatedString {
                            append("雪崩効果: 256 ビット中 ")
                            withStyle(SpanStyle(fontFamily = FontFamily.Monospace, color = Sg.colors.infoForeground, fontSize = 18.sp)) {
                                append("${compare.bitDiff}")
                            }
                            append(" ビットが変化（${hdNum(percent)}%）")
                        },
                        style = MaterialTheme.typography.titleSmall,
                    )
                    HdBitMap(state.baseBytes, compare.hash, Modifier.padding(top = 10.dp))
                    Text(
                        "256 ビットを 32×8 のマスで表示。赤が2つの出力で異なるビット。",
                        style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
                        modifier = Modifier.padding(top = 6.dp),
                    )
                    Text(
                        "入力の1文字を変えただけで、出力はほぼ別物になる。理想的なハッシュでは約半数（128 ビット前後）が変化する。赤字は2つの出力で異なる16進文字を示す。",
                        style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground,
                        modifier = Modifier.padding(top = 6.dp),
                    )
                }
            } else {
                HdBox {
                    Text("1文字以上入力すると、末尾を1文字だけ変えた場合との比較を表示する。", style = MaterialTheme.typography.bodyMedium)
                }
            }
        }

        HdBox(Modifier.padding(top = 12.dp)) {
            Text(
                "SHA-256 は任意長の入力を 256 ビットの固定長に圧縮する一方向ハッシュである。同じ入力からは常に同じ値が得られ、少しでも入力が変われば出力は大きく変わる。改ざん検知やデジタル署名の基礎になるが、パスワードの保存にはソルト付きの専用関数（Argon2 など）を使う。",
                style = MaterialTheme.typography.bodyMedium,
            )
        }
        Text(
            "入力はこの端末の中だけで処理され、外部へ送信されない。表示しているハッシュは、この端末の SHA-256 実装（java.security.MessageDigest）が計算した値である。",
            style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
            modifier = Modifier.padding(top = 12.dp),
        )
        }
    }
}

/** 64 hex characters in groups of 8; characters that differ from [compareHex] are highlighted. */
@Composable
private fun HdHashHex(hex: String, compareHex: String?, modifier: Modifier = Modifier) {
    val diffBg = Sg.colors.destructive.copy(alpha = 0.22f)
    val diffFg = Sg.colors.destructiveForeground
    val text: AnnotatedString = remember(hex, compareHex, diffBg, diffFg) {
        buildAnnotatedString {
            hex.forEachIndexed { index, ch ->
                if (index > 0 && index % 8 == 0) append(' ')
                val differs = compareHex != null && compareHex.getOrNull(index) != ch
                if (differs) {
                    withStyle(SpanStyle(background = diffBg, color = diffFg, fontWeight = FontWeight.Bold)) { append(ch) }
                } else append(ch)
            }
        }
    }
    Text(
        text,
        modifier = modifier,
        style = MaterialTheme.typography.bodyMedium.copy(fontFamily = FontFamily.Monospace, fontSize = 15.sp, lineHeight = 28.sp),
    )
}

/** 256 bits drawn as a 32×8 grid; differing bits are red. */
@Composable
private fun HdBitMap(a: ByteArray, b: ByteArray, modifier: Modifier = Modifier) {
    val same = Sg.colors.border
    val sameSet = Sg.colors.mutedForeground.copy(alpha = 0.35f)
    val diff = Sg.colors.destructive
    Canvas(modifier.fillMaxWidth().aspectRatio(32f / 8f)) {
        val cell = size.width / 32f
        val gap = cell * 0.14f
        for (bit in 0 until 256) {
            val x = (bit % 32) * cell
            val y = (bit / 32) * cell
            val changed = hdBitIsSet(a, bit) != hdBitIsSet(b, bit)
            drawRoundRect(
                color = if (changed) diff else if (hdBitIsSet(a, bit)) sameSet else same,
                topLeft = Offset(x + gap / 2, y + gap / 2),
                size = Size(cell - gap, cell - gap),
                cornerRadius = CornerRadius(cell * 0.2f),
            )
        }
    }
}

@Composable
private fun HdBox(modifier: Modifier = Modifier, content: @Composable () -> Unit) {
    val shape = RoundedCornerShape(10.dp)
    Column(
        modifier.fillMaxWidth().clip(shape).background(Sg.colors.muted)
            .border(BorderStroke(1.dp, Sg.colors.border), shape).padding(12.dp),
    ) { content() }
}

@Composable
private fun HdChip(text: String) {
    val shape = RoundedCornerShape(8.dp)
    Text(
        text,
        modifier = Modifier.clip(shape).border(BorderStroke(1.dp, Sg.colors.border), shape).padding(horizontal = 8.dp, vertical = 2.dp),
        style = MaterialTheme.typography.labelSmall, color = Sg.colors.mutedForeground,
    )
}
