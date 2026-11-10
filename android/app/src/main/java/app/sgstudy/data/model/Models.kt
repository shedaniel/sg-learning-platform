package app.sgstudy.data.model

import kotlinx.serialization.DeserializationStrategy
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonContentPolymorphicSerializer
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.jsonPrimitive

/** Mirrors src/lib/content/types.ts. Option ids are "a","i","u","e","o","ka","ki","ku","ke","ko" (ア〜コ). */

@Serializable
data class Area(
    val id: String,
    val order: Int,
    val title: String,
    val titleEn: String,
    val shortTitle: String,
    val description: String,
    /** CSS token name from the web app, e.g. "var(--c1)". Use [AreaColors] to resolve. */
    val color: String,
    val lessonIds: List<String>,
)

@Serializable
data class SyllabusTopic(
    val id: String,
    val areaId: String,
    val title: String,
    val titleEn: String,
    val reference: String,
    val summary: String,
    /** "A", "B" or "both" */
    val examPart: String,
)

@Serializable
data class SourceRef(val label: String, val url: String, val note: String? = null)

@Serializable
data class LessonSection(val id: String, val title: String, val blocks: List<Block>)

@Serializable
data class Lesson(
    val id: String,
    val areaId: String,
    val topicIds: List<String>,
    val title: String,
    val titleEn: String,
    val summary: String,
    val readingMinutes: Int,
    /** "easy" | "medium" | "hard" */
    val difficulty: String,
    val prerequisites: List<String> = emptyList(),
    val objectives: List<String> = emptyList(),
    val sections: List<LessonSection>,
    val keyPoints: List<String> = emptyList(),
    val examTraps: List<String> = emptyList(),
    val relatedLessonIds: List<String> = emptyList(),
    val termIds: List<String> = emptyList(),
    val sources: List<SourceRef> = emptyList(),
)

@Serializable
data class GlossaryTerm(
    val id: String,
    val ja: String,
    val reading: String? = null,
    val en: String,
    val abbr: String? = null,
    val shortJa: String,
    val shortEn: String,
    val explanationJa: String,
    val explanationEn: String,
    val examUsage: String? = null,
    val lessonIds: List<String> = emptyList(),
    val relatedTermIds: List<String> = emptyList(),
    val tags: List<String> = emptyList(),
)

@Serializable
data class QuestionOption(val id: String, val text: String)

@Serializable
data class QuestionExplanation(
    val correct: String,
    val why: List<String> = emptyList(),
    val optionNotes: Map<String, String> = emptyMap(),
    val english: String? = null,
    val termIds: List<String> = emptyList(),
)

@Serializable
data class QuestionSource(
    /** "original" | "official" */
    val kind: String,
    val attribution: String,
    val url: String? = null,
    val year: Int? = null,
    val questionNo: Int? = null,
    val note: String? = null,
)

@Serializable
data class Question(
    val id: String,
    /** "A" | "B" */
    val part: String,
    val topicIds: List<String>,
    val lessonIds: List<String> = emptyList(),
    /** "easy" | "medium" | "hard" */
    val difficulty: String,
    /** "knowledge" | "scenario" */
    val type: String,
    val stem: String,
    /** Extra material shown above the stem (tables, lists, paragraphs). */
    val presentation: List<Block>? = null,
    val options: List<QuestionOption>,
    val correctOptionId: String,
    val explanation: QuestionExplanation,
    val source: QuestionSource,
    val tags: List<String> = emptyList(),
) {
    val isOfficial get() = source.kind == "official"
}

@Serializable
data class OfficialPaper(
    val year: Int,
    val reiwa: Int,
    val label: String,
    val publishedAt: String,
    val pageUrl: String,
    val bookletUrl: String,
    val answerUrl: String,
    val questionNumbers: List<Int>,
    val publishedCount: Int,
    val actualCount: Int,
    val note: String,
    val questionIds: List<String>,
)

@Serializable
data class HistoricalPaperFile(val booklet: String, val answers: String)

@Serializable
data class HistoricalPaper(
    val id: String,
    val year: Int,
    val label: String,
    val season: String,
    val pageUrl: String,
    val morning: HistoricalPaperFile,
    val afternoon: HistoricalPaperFile,
    val note: String,
)

@Serializable
data class ExamStructure(val minutes: Int, val questions: Int, val partA: Int, val partB: Int, val format: String)

@Serializable
data class SyllabusSource(val label: String, val url: String)

@Serializable
data class SyllabusVersion(
    val current: String,
    val currentPublished: String,
    val proposed: String,
    val proposedPublished: String,
    val verifiedAt: String,
    val examStructure: ExamStructure,
    val sources: List<SyllabusSource>,
)

@Serializable
data class ContentMeta(
    val syllabus: SyllabusVersion,
    val areas: List<Area>,
    val topics: List<SyllabusTopic>,
    val papers: List<OfficialPaper>,
    val historicalPapers: List<HistoricalPaper>,
)

// ---------------------------------------------------------------- lesson blocks

@Serializable
data class ComparisonSide(val title: String, val items: List<String>)

@Serializable
data class StepItem(val title: String, val text: String)

@Serializable(with = BlockSerializer::class)
sealed interface Block

@Serializable
data class LeadBlock(val text: String) : Block

@Serializable
data class ParagraphBlock(val text: String) : Block

@Serializable
data class ListBlock(val ordered: Boolean = false, val items: List<String>) : Block

@Serializable
data class TableBlock(
    val caption: String? = null,
    val headers: List<String>,
    val rows: List<List<String>>,
    val note: String? = null,
) : Block

@Serializable
data class CalloutBlock(
    /** "tip" | "trap" | "info" | "example" */
    val tone: String,
    val title: String,
    val text: String,
) : Block

@Serializable
data class TermsBlock(val termIds: List<String>) : Block

@Serializable
data class DiagramBlock(
    /** DiagramId, e.g. "cia-triad"; file assets/content/diagrams/<id>-light|dark.svg */
    val diagram: String,
    val caption: String? = null,
    val props: JsonObject? = null,
) : Block

@Serializable
data class InteractiveBlock(
    /** WidgetId, e.g. "risk-matrix" */
    val widget: String,
    val title: String? = null,
    val props: JsonObject? = null,
) : Block

@Serializable
data class ComparisonBlock(val left: ComparisonSide, val right: ComparisonSide) : Block

@Serializable
data class StepsBlock(val items: List<StepItem>) : Block

object BlockSerializer : JsonContentPolymorphicSerializer<Block>(Block::class) {
    override fun selectDeserializer(element: JsonElement): DeserializationStrategy<Block> =
        when (val type = element.asObject()["type"]?.jsonPrimitive?.content) {
            "lead" -> LeadBlock.serializer()
            "p" -> ParagraphBlock.serializer()
            "list" -> ListBlock.serializer()
            "table" -> TableBlock.serializer()
            "callout" -> CalloutBlock.serializer()
            "terms" -> TermsBlock.serializer()
            "diagram" -> DiagramBlock.serializer()
            "interactive" -> InteractiveBlock.serializer()
            "comparison" -> ComparisonBlock.serializer()
            "steps" -> StepsBlock.serializer()
            else -> error("Unknown block type: $type")
        }

    private fun JsonElement.asObject(): JsonObject = this as JsonObject
}

// ---------------------------------------------------------------- labels

val OPTION_LABEL = mapOf(
    "a" to "ア", "i" to "イ", "u" to "ウ", "e" to "エ", "o" to "オ",
    "ka" to "カ", "ki" to "キ", "ku" to "ク", "ke" to "ケ", "ko" to "コ",
)

fun optionLabel(id: String): String = OPTION_LABEL[id] ?: id

val DIFFICULTY_LABEL = mapOf("easy" to "基礎", "medium" to "標準", "hard" to "応用")
val PART_LABEL = mapOf("A" to "科目A", "B" to "科目B")
