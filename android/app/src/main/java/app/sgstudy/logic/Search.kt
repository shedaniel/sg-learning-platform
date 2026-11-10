package app.sgstudy.logic

import app.sgstudy.data.ContentRepository
import app.sgstudy.data.model.*

/** Port of src/lib/search.ts: global scoring search over lessons, terms, questions and syllabus topics. */

enum class SearchKind { Lesson, Term, Question, Topic }

data class SearchResult(
    val kind: SearchKind,
    val id: String,
    val title: String,
    val subtitle: String,
    val snippet: String,
    val meta: String,
    val score: Double,
)

private fun blocksText(blocks: List<Block>): String {
    val parts = ArrayList<String>()
    for (b in blocks) when (b) {
        is LeadBlock -> parts += b.text
        is ParagraphBlock -> parts += b.text
        is CalloutBlock -> { parts += b.title; parts += b.text }
        is ListBlock -> parts += b.items
        is TableBlock -> { parts += b.headers; b.rows.forEach { parts += it } }
        is ComparisonBlock -> { parts += b.left.items; parts += b.right.items }
        is StepsBlock -> b.items.forEach { parts += it.title; parts += it.text }
        else -> Unit
    }
    return parts.joinToString(" ")
}

private fun lessonText(l: Lesson): String = buildList {
    add(l.title); add(l.titleEn); add(l.summary)
    l.sections.forEach { add(it.title); add(blocksText(it.blocks)) }
    addAll(l.keyPoints); addAll(l.examTraps)
}.joinToString(" ")

private fun scoreField(normalized: String?, query: String, weight: Double): Double {
    if (normalized.isNullOrEmpty()) return 0.0
    return when {
        normalized == query -> 100 * weight
        normalized.startsWith(query) -> 70 * weight
        normalized.contains(query) -> 45 * weight
        else -> 0.0
    }
}

private fun snippet(text: String, query: String, length: Int = 96): String {
    val index = normalizeJapanese(text).indexOf(query)
    if (index == -1) return text.take(length) + if (text.length > length) "…" else ""
    val start = maxOf(0, index - 28)
    val end = minOf(text.length, start + length)
    if (start >= text.length) return text.take(length)
    return (if (start > 0) "…" else "") + text.substring(start, end) + if (text.length > start + length) "…" else ""
}

/**
 * Pre-normalised copy of all searchable text. Building takes a few ms-tens of ms, so build it once off the main
 * thread (see SearchScreen) and reuse it for every keystroke.
 */
class SearchIndex(private val content: ContentRepository) {
    private class T(val t: GlossaryTerm) {
        val ja = normalizeJapanese(t.ja); val reading = t.reading?.let(::normalizeJapanese)
        val en = normalizeJapanese(t.en); val abbr = t.abbr?.let(::normalizeJapanese)
        val shortJa = normalizeJapanese(t.shortJa); val explanation = normalizeJapanese(t.explanationJa)
    }
    private class L(val l: Lesson, val areaTitle: String) {
        val title = normalizeJapanese(l.title); val titleEn = normalizeJapanese(l.titleEn)
        val summary = normalizeJapanese(l.summary); val text = normalizeJapanese(lessonText(l))
    }
    private class Q(val q: Question) {
        val stem = normalizeJapanese(q.stem)
        val options = normalizeJapanese(q.options.joinToString(" ") { it.text })
        val tags = normalizeJapanese(q.tags.joinToString(" "))
        val correct = normalizeJapanese(q.explanation.correct)
    }
    private class P(val t: SyllabusTopic) {
        val title = normalizeJapanese(t.title); val titleEn = normalizeJapanese(t.titleEn); val summary = normalizeJapanese(t.summary)
    }

    private val terms = content.terms.map(::T)
    private val lessons = content.lessons.map { L(it, content.areaById[it.areaId]?.title ?: it.areaId) }
    private val questions = content.questions.map(::Q)
    private val topics = content.topics.map(::P)

    fun search(rawQuery: String, limit: Int = 40): List<SearchResult> {
        val query = normalizeJapanese(rawQuery)
        if (query.isEmpty()) return emptyList()
        val tokens = query.split(" ").filter { it.isNotEmpty() }
        val first = tokens.firstOrNull() ?: query
        val out = ArrayList<SearchResult>()

        for (e in terms) {
            var score = 0.0
            for (tk in tokens) {
                score += scoreField(e.ja, tk, 4.0); score += scoreField(e.reading, tk, 2.4)
                score += scoreField(e.en, tk, 3.2); score += scoreField(e.abbr, tk, 3.4)
                score += scoreField(e.shortJa, tk, 1.2); score += scoreField(e.explanation, tk, 0.4)
            }
            if (score == 0.0) continue
            val t = e.t
            out += SearchResult(
                SearchKind.Term, t.id,
                t.ja + (t.reading?.let { "（$it）" } ?: ""),
                (t.abbr?.let { "$it · " } ?: "") + t.en,
                snippet(t.shortJa.ifEmpty { t.explanationJa }, first),
                t.tags.take(2).joinToString(" · "),
                score + if (t.en.lowercase() == query) 20 else 0,
            )
        }
        for (e in lessons) {
            var score = 0.0
            for (tk in tokens) {
                score += scoreField(e.title, tk, 4.0); score += scoreField(e.titleEn, tk, 3.0)
                score += scoreField(e.summary, tk, 1.2); score += scoreField(e.text, tk, 0.35)
            }
            if (score == 0.0) continue
            val l = e.l
            out += SearchResult(
                SearchKind.Lesson, l.id, l.title, "${e.areaTitle} · ${l.titleEn}",
                snippet(l.summary, first), "${l.readingMinutes}分", score,
            )
        }
        for (e in questions) {
            var score = 0.0
            for (tk in tokens) {
                score += scoreField(e.stem, tk, 1.6); score += scoreField(e.options, tk, 0.5)
                score += scoreField(e.tags, tk, 1.4); score += scoreField(e.correct, tk, 0.3)
            }
            if (score == 0.0) continue
            val q = e.q
            out += SearchResult(
                SearchKind.Question, q.id,
                q.stem.take(54) + if (q.stem.length > 54) "…" else "",
                if (q.isOfficial) "IPA 公開問題 ${q.source.year ?: ""} 問${q.source.questionNo ?: ""}"
                else "独自問題 · ${PART_LABEL[q.part] ?: q.part}",
                snippet(q.stem, first),
                "${PART_LABEL[q.part] ?: q.part} · ${DIFFICULTY_LABEL[q.difficulty] ?: q.difficulty}", score,
            )
        }
        for (e in topics) {
            var score = 0.0
            for (tk in tokens) {
                score += scoreField(e.title, tk, 3.4); score += scoreField(e.titleEn, tk, 2.5); score += scoreField(e.summary, tk, 0.9)
            }
            if (score == 0.0) continue
            val t = e.t
            out += SearchResult(SearchKind.Topic, t.id, t.title, t.titleEn, snippet(t.summary, first), t.reference, score)
        }
        return out.sortedByDescending { it.score }.take(limit)
    }
}
