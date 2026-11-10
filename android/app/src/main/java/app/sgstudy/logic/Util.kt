package app.sgstudy.logic

import java.text.Normalizer
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale

fun percent(correct: Int, total: Int): Int =
    if (total > 0) Math.round(correct.toDouble() / total * 100).toInt() else 0

/** Deterministic PRNG identical to the web app's mulberry32. */
class Mulberry32(seed: Long) {
    private var a: Int = seed.toInt()
    fun next(): Double {
        a += 0x6d2b79f5
        var t = a
        t = (t xor (t ushr 15)) * (t or 1)
        t = t xor (t + (t xor (t ushr 7)) * (t or 61))
        return ((t xor (t ushr 14)).toUInt().toDouble()) / 4294967296.0
    }
}

fun newRng(seed: Long? = null) = Mulberry32(seed ?: (Math.random() * Int.MAX_VALUE).toLong())

fun <T> shuffled(items: Collection<T>, rng: Mulberry32): MutableList<T> {
    val copy = items.toMutableList()
    for (i in copy.size - 1 downTo 1) {
        val j = Math.floor(rng.next() * (i + 1)).toInt()
        val tmp = copy[i]; copy[i] = copy[j]; copy[j] = tmp
    }
    return copy
}

fun nowIso(): String = Instant.now().toString()

fun parseIso(value: String): Instant = Instant.parse(value)

fun todayKey(zone: ZoneId = ZoneId.systemDefault()): String = LocalDate.now(zone).toString()

/** "2026-11-02T07:00:00Z" -> "11月2日 16:00" in local time. */
fun formatDateTime(iso: String): String = runCatching {
    DateTimeFormatter.ofPattern("M月d日 HH:mm", Locale.JAPAN).withZone(ZoneId.systemDefault()).format(Instant.parse(iso))
}.getOrDefault("—")

fun formatDate(iso: String): String = runCatching {
    DateTimeFormatter.ofPattern("yyyy年M月d日", Locale.JAPAN).withZone(ZoneId.systemDefault()).format(Instant.parse(iso))
}.getOrDefault("—")

fun formatDuration(seconds: Int): String {
    val s = seconds.coerceAtLeast(0)
    val h = s / 3600; val m = (s % 3600) / 60; val sec = s % 60
    return if (h > 0) "${h}時間%02d分".format(m) else "${m}分%02d秒".format(sec)
}

fun formatClock(seconds: Int): String {
    val s = seconds.coerceAtLeast(0)
    return "%02d:%02d".format(s / 60, s % 60)
}

/** For search: NFKC, lowercase, hiragana -> katakana, collapsed whitespace. */
fun normalizeJapanese(input: String): String =
    Normalizer.normalize(input, Normalizer.Form.NFKC).lowercase()
        .map { if (it in 'ぁ'..'ん') (it.code + 0x60).toChar() else it }
        .joinToString("")
        .replace(Regex("\\s+"), " ")
        .trim()
