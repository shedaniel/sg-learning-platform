package app.sgstudy.ui.widgets

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
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
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.sgstudy.ui.components.ChoiceChip
import app.sgstudy.ui.components.SgCard
import app.sgstudy.ui.components.Tone
import app.sgstudy.ui.components.color
import app.sgstudy.ui.components.container
import app.sgstudy.ui.theme.Sg
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive

// ---------------------------------------------------------------------------
// IPv4 / CIDR maths (port of src/components/widgets/subnet-calculator.tsx).
// Addresses are held in a Long (0..2^32-1) so shifts/complements never go negative.
// ---------------------------------------------------------------------------

private const val SubnetAllOnes = 0xFFFFFFFFL

private class SubnetIp(val octets: List<Int>, val value: Long)
private class SubnetMask(val prefix: Int, val value: Long)

private class SubnetResult(
    val network: Long,
    val broadcast: Long,
    val wildcard: Long,
    val total: Long,
    val usable: Long,
    val firstHost: Long,
    val lastHost: Long,
    val networkBitsInLastOctet: Int,
)

private val SubnetOctetRegex = Regex("^\\d{1,3}$")
private val SubnetPrefixRegex = Regex("^\\d{1,2}$")

private fun subnetParseIpv4(raw: String): SubnetIp? {
    val parts = raw.trim().split(".")
    if (parts.size != 4) return null
    val octets = ArrayList<Int>(4)
    for (part in parts) {
        if (!SubnetOctetRegex.matches(part)) return null
        val v = part.toInt()
        if (v !in 0..255) return null
        octets += v
    }
    val value = (octets[0].toLong() shl 24) or (octets[1].toLong() shl 16) or (octets[2].toLong() shl 8) or octets[3].toLong()
    return SubnetIp(octets, value)
}

private fun subnetPrefixToMask(prefix: Int): Long = when {
    prefix <= 0 -> 0L
    prefix >= 32 -> SubnetAllOnes
    else -> (SubnetAllOnes shl (32 - prefix)) and SubnetAllOnes
}

/** Returns the prefix length when [mask] is a contiguous run of leading 1s, otherwise null. */
private fun subnetMaskToPrefix(mask: Long): Int? {
    var prefix = 0
    for (bit in 31 downTo 0) {
        if (((mask shr bit) and 1L) == 0L) break
        prefix++
    }
    return if (subnetPrefixToMask(prefix) == (mask and SubnetAllOnes)) prefix else null
}

/** Accepts "24", "/24", or a dotted mask such as "255.255.255.0". */
private fun subnetParseMask(raw: String): SubnetMask? {
    val value = raw.trim().removePrefix("/")
    if (SubnetPrefixRegex.matches(value)) {
        val prefix = value.toInt()
        return if (prefix <= 32) SubnetMask(prefix, subnetPrefixToMask(prefix)) else null
    }
    val ip = subnetParseIpv4(value) ?: return null
    val prefix = subnetMaskToPrefix(ip.value) ?: return null
    return SubnetMask(prefix, ip.value)
}

private fun subnetIntToIp(value: Long): String =
    listOf(24, 16, 8, 0).joinToString(".") { ((value shr it) and 255L).toString() }

private fun subnetFormatInt(value: Long): String = "%,d".format(java.util.Locale.US, value)

private fun subnetCompute(ip: SubnetIp, mask: SubnetMask): SubnetResult {
    val p = mask.prefix
    val network = ip.value and mask.value
    val wildcard = mask.value.inv() and SubnetAllOnes
    val broadcast = network or wildcard
    val total = 1L shl (32 - p)
    // /31 (RFC 3021) uses both addresses, /32 is a single host, otherwise minus network + broadcast.
    val usable = if (p <= 30) total - 2 else if (p == 31) 2L else 1L
    val first = if (p <= 30) network + 1 else network
    val last = if (p <= 30) broadcast - 1 else if (p == 31) broadcast else network
    return SubnetResult(network, broadcast, wildcard, total, usable, first, last, (p - 24).coerceIn(0, 8))
}

/** 32-bit address as dotted binary, e.g. 11000000.10101000.00000001.10000010 */
private fun subnetDottedBinary(value: Long): String =
    listOf(24, 16, 8, 0).joinToString(".") { (((value shr it) and 255L).toInt()).toString(2).padStart(8, '0') }

/** Props the same way the web does: `address`, `mask` (string) or `prefix` (number / numeric string). */
private fun subnetStringProp(props: JsonObject?, key: String, fallback: String): String {
    val p = props?.get(key) as? JsonPrimitive ?: return fallback
    return if (p.isString && p.content.isNotBlank()) p.content else fallback
}

private fun subnetNumberProp(props: JsonObject?, key: String, fallback: Double): Double {
    val p = props?.get(key) as? JsonPrimitive ?: return fallback
    val parsed = p.content.trim().takeIf { it.isNotEmpty() }?.toDoubleOrNull()
    return if (parsed != null && parsed.isFinite()) parsed else fallback
}

// ---------------------------------------------------------------------------
// Widget
// ---------------------------------------------------------------------------

private val SubnetQuickPrefixes = listOf(8, 16, 24, 26, 28, 30, 31, 32)

@Composable
fun SubnetCalculatorWidget(props: JsonObject?) {
    val initialAddress = subnetStringProp(props, "address", "192.168.10.37")
    val initialMask = subnetStringProp(
        props, "mask",
        Math.round(subnetNumberProp(props, "prefix", 24.0)).toInt().coerceIn(0, 32).toString(),
    )
    var addressInput by rememberSaveable(initialAddress) { mutableStateOf(initialAddress) }
    var maskInput by rememberSaveable(initialMask) { mutableStateOf(initialMask) }

    val ip = subnetParseIpv4(addressInput)
    val mask = subnetParseMask(maskInput)
    val addressError = if (ip == null) "0〜255 の数値を4つ、ドットで区切って入力してください" else null
    val maskError = if (mask == null) "0〜32 のプレフィックス長、または 255.255.255.0 のような連続したマスクを入力してください" else null
    val result = if (ip != null && mask != null) subnetCompute(ip, mask) else null

    // Text without an explicit colour must follow the theme (dark mode), not Material's default black.
    CompositionLocalProvider(LocalContentColor provides Sg.colors.foreground) {
    SgCard {
        Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
            Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                Text("IPv4 のネットワークを計算する", style = MaterialTheme.typography.titleSmall, modifier = Modifier.weight(1f))
                TextButton(
                    onClick = { addressInput = initialAddress; maskInput = initialMask },
                    modifier = Modifier.heightIn(min = 48.dp),
                    colors = ButtonDefaults.textButtonColors(contentColor = Sg.colors.mutedForeground),
                ) {
                    Icon(Icons.Filled.Refresh, null, Modifier.size(18.dp))
                    Text("  リセット", style = MaterialTheme.typography.labelLarge)
                }
            }

            SubnetField(
                label = "IPv4 アドレス",
                value = addressInput,
                onChange = { addressInput = it },
                placeholder = "192.168.10.37",
                error = addressError,
                keyboardType = KeyboardType.Decimal,
            )
            SubnetField(
                label = "プレフィックス長 / サブネットマスク",
                value = maskInput,
                onChange = { maskInput = it },
                placeholder = "24 または 255.255.255.0",
                error = maskError,
                keyboardType = KeyboardType.Uri, // digits, '.' and '/' without autocorrect
            )
            // One-tap common prefixes
            Row(Modifier.fillMaxWidth().horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                SubnetQuickPrefixes.forEach { p ->
                    ChoiceChip("/$p", selected = mask?.prefix == p && maskInput.trim().removePrefix("/") == p.toString(), onClick = { maskInput = p.toString() })
                }
            }

            if (ip == null || mask == null || result == null) {
                SubnetNote("アドレスとマスクを正しく入力すると、計算結果を表示する。", Tone.Warning)
            } else {
                val p = mask.prefix
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    SubnetMetric("ネットワークアドレス", "${subnetIntToIp(result.network)} / $p", "サブネットの先頭アドレス", Tone.Info)
                    SubnetMetric(
                        "ブロードキャスト", subnetIntToIp(result.broadcast),
                        if (p <= 30) "サブネット内の最終アドレス" else if (p == 31) "／31 ではブロードキャストを使用しない" else "／32 は単一ホストを表す",
                    )
                    SubnetMetric("サブネットマスク", subnetIntToIp(mask.value), "プレフィックス /$p")
                    SubnetMetric("ワイルドカードマスク", subnetIntToIp(result.wildcard), "マスクのビット反転（ACL などで使用）")
                    SubnetMetric(
                        "利用可能ホスト数", "${subnetFormatInt(result.usable)} 台",
                        if (p <= 30) "総アドレス数 − 2（ネットワーク・ブロードキャスト）" else if (p == 31) "RFC 3021 のポイントツーポイント" else "単一ホスト",
                        Tone.Success,
                    )
                    SubnetMetric("総アドレス数", "${subnetFormatInt(result.total)} 個", "2^${32 - p}")
                    SubnetMetric(
                        "利用可能なアドレス範囲",
                        if (result.firstHost == result.lastHost) subnetIntToIp(result.firstHost)
                        else "${subnetIntToIp(result.firstHost)} 〜 ${subnetIntToIp(result.lastHost)}",
                        if (p <= 30) "先頭と末尾を除いた範囲" else if (p == 31) "2 アドレスとも利用可能" else "単一アドレス",
                    )
                }

                SubnetBinaryCard(ip, mask, result)

                Text(
                    "${subnetIntToIp(ip.value)} を /$p で分割すると、ネットワークアドレスは ${subnetIntToIp(result.network)}、利用可能ホストは ${subnetFormatInt(result.usable)} 台である。",
                    style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground,
                )
            }

            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                if (mask?.prefix == 31) {
                    SubnetNote("／31 は RFC 3021 により、ルータ間のポイントツーポイント接続で 2 アドレスをそのまま利用できる。一般的な「総数 − 2」の公式とは扱いが異なる。", Tone.Neutral)
                }
                if (mask?.prefix == 32) {
                    SubnetNote("／32 は 1 台のホストを表す。ネットワークアドレスとブロードキャストの区別はなく、表示上のアドレスは同一である。", Tone.Neutral)
                }
                SubnetNote(
                    "サブネットマスクは、アドレスのうちネットワーク部とホスト部の境界を示す。マスクのビットは先頭から連続して 1 でなければならない（例: 255.255.255.0）。一般的な /30 以下では、ネットワークアドレスとブロードキャストにはホストを割り当てない。",
                    Tone.Neutral,
                )
            }
        }
    }
    }
}

// ---------------------------------------------------------------------------
// Private building blocks
// ---------------------------------------------------------------------------

@Composable
private fun SubnetField(
    label: String,
    value: String,
    onChange: (String) -> Unit,
    placeholder: String,
    error: String?,
    keyboardType: KeyboardType,
) {
    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Text(label, style = MaterialTheme.typography.labelMedium)
        OutlinedTextField(
            value = value,
            onValueChange = { onChange(it) },
            modifier = Modifier.fillMaxWidth().heightIn(min = 52.dp),
            singleLine = true,
            isError = error != null,
            textStyle = TextStyle(fontFamily = FontFamily.Monospace, fontSize = 16.sp, color = Sg.colors.foreground),
            placeholder = { Text(placeholder, style = TextStyle(fontFamily = FontFamily.Monospace, fontSize = 16.sp), color = Sg.colors.mutedForeground) },
            keyboardOptions = KeyboardOptions(keyboardType = keyboardType, autoCorrectEnabled = false),
            shape = RoundedCornerShape(10.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = Sg.colors.info,
                unfocusedBorderColor = Sg.colors.input,
                errorBorderColor = Sg.colors.destructive,
                cursorColor = Sg.colors.infoForeground,
                focusedContainerColor = Sg.colors.card,
                unfocusedContainerColor = Sg.colors.card,
                errorContainerColor = Sg.colors.card,
            ),
        )
        if (error != null) {
            Text(error, style = MaterialTheme.typography.bodySmall, color = Sg.colors.destructiveForeground)
        }
    }
}

@Composable
private fun SubnetMetric(label: String, value: String, sub: String, tone: Tone = Tone.Neutral) {
    Column(
        Modifier.fillMaxWidth().clip(RoundedCornerShape(10.dp)).background(Sg.colors.muted)
            .border(BorderStroke(1.dp, Sg.colors.border), RoundedCornerShape(10.dp)).padding(horizontal = 12.dp, vertical = 10.dp),
    ) {
        Text(label, style = MaterialTheme.typography.labelMedium, color = Sg.colors.mutedForeground)
        Text(
            value,
            style = MaterialTheme.typography.titleMedium.copy(fontFamily = FontFamily.Monospace),
            color = if (tone == Tone.Neutral) Sg.colors.foreground else tone.color(),
        )
        Text(sub, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
    }
}

@Composable
private fun SubnetNote(text: String, tone: Tone) {
    val shape = RoundedCornerShape(10.dp)
    val border = if (tone == Tone.Neutral) Sg.colors.border else tone.color().copy(alpha = 0.3f)
    Text(
        text, style = MaterialTheme.typography.bodyMedium,
        modifier = Modifier.fillMaxWidth().clip(shape).background(tone.container(), shape)
            .border(BorderStroke(1.dp, border), shape).padding(horizontal = 12.dp, vertical = 10.dp),
    )
}

/** Binary view: full 32-bit rows (network part highlighted) and the 4th-octet bit boxes from the web widget. */
@Composable
private fun SubnetBinaryCard(ip: SubnetIp, mask: SubnetMask, result: SubnetResult) {
    Column(
        Modifier.fillMaxWidth().clip(RoundedCornerShape(12.dp)).background(Sg.colors.muted)
            .border(BorderStroke(1.dp, Sg.colors.border), RoundedCornerShape(12.dp)).padding(12.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        Text("2進数表示（32ビット）", style = MaterialTheme.typography.titleSmall)
        Text(
            "先頭 ${mask.prefix} ビットがネットワーク部（アクセント色）",
            style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
        )
        // Dotted binary can exceed a narrow phone, so scroll sideways instead of clipping.
        Column(Modifier.fillMaxWidth().horizontalScroll(rememberScrollState()), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            listOf(
                "アドレス" to ip.value,
                "マスク" to mask.value,
                "ネットワーク" to result.network,
                "ブロードキャスト" to result.broadcast,
            ).forEach { (label, value) ->
                Column {
                    Text(label, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
                    SubnetBinaryLine(value, mask.prefix)
                }
            }
        }

        Box(Modifier.fillMaxWidth().padding(top = 2.dp).heightIn(min = 1.dp).background(Sg.colors.border))

        Text("第4オクテットの2進数", style = MaterialTheme.typography.titleSmall)
        Text(
            "左から ${result.networkBitsInLastOctet} ビットがネットワーク部",
            style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
        )
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            SubnetBitRow("入力アドレス", ip.octets[3], result.networkBitsInLastOctet)
            SubnetBitRow("ネットワーク", (result.network and 255L).toInt(), result.networkBitsInLastOctet)
            SubnetBitRow("ブロードキャスト", (result.broadcast and 255L).toInt(), result.networkBitsInLastOctet)
        }
    }
}

/** Dotted 32-bit binary with the first [prefix] bits tinted and bold. */
@Composable
private fun SubnetBinaryLine(value: Long, prefix: Int) {
    val bits = subnetDottedBinary(value)
    val netColor = Sg.colors.infoForeground
    val text = buildAnnotatedString {
        var seen = 0
        for (ch in bits) {
            if (ch == '.') { append(ch); continue }
            if (seen < prefix) withStyle(SpanStyle(color = netColor, fontWeight = FontWeight.Bold)) { append(ch) } else append(ch)
            seen++
        }
    }
    Text(text, style = TextStyle(fontFamily = FontFamily.Monospace, fontSize = 15.sp, color = Sg.colors.mutedForeground), softWrap = false)
}

@Composable
private fun SubnetBitRow(label: String, octet: Int, networkBits: Int) {
    val bits = octet.toString(2).padStart(8, '0')
    Column(verticalArrangement = Arrangement.spacedBy(3.dp)) {
        Text(label, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
        Row(horizontalArrangement = Arrangement.spacedBy(3.dp)) {
            bits.forEachIndexed { i, bit ->
                val network = i < networkBits
                Box(
                    Modifier.width(30.dp).heightIn(min = 32.dp).clip(RoundedCornerShape(4.dp))
                        .background(if (network) Sg.colors.info.copy(alpha = 0.15f) else Sg.colors.card)
                        .border(BorderStroke(1.dp, if (network) Sg.colors.info.copy(alpha = 0.4f) else Sg.colors.border), RoundedCornerShape(4.dp)),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        bit.toString(),
                        style = TextStyle(fontFamily = FontFamily.Monospace, fontSize = 15.sp, fontWeight = if (network) FontWeight.Bold else FontWeight.Normal),
                        color = if (network) Sg.colors.infoForeground else Sg.colors.mutedForeground,
                    )
                }
            }
        }
    }
}
