package app.sgstudy.data

import android.content.Context
import app.sgstudy.data.model.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json
import kotlinx.serialization.builtins.ListSerializer

val ContentJson = Json {
    ignoreUnknownKeys = true
    coerceInputValues = true
    isLenient = true
}

enum class CoverageStatus { Complete, Partial, Missing }

data class TopicCoverage(
    val topic: SyllabusTopic,
    val lessons: List<Lesson>,
    val questionCount: Int,
    val status: CoverageStatus,
)

/** All bundled study content, loaded once at startup from assets/content. */
class ContentRepository private constructor(
    val meta: ContentMeta,
    val lessons: List<Lesson>,
    val terms: List<GlossaryTerm>,
    val questions: List<Question>,
) {
    val areas: List<Area> = meta.areas.sortedBy { it.order }
    val topics: List<SyllabusTopic> = meta.topics
    val papers: List<OfficialPaper> = meta.papers.sortedByDescending { it.year }
    val historicalPapers: List<HistoricalPaper> = meta.historicalPapers
    val syllabus: SyllabusVersion = meta.syllabus

    val lessonById = lessons.associateBy { it.id }
    val termById = terms.associateBy { it.id }
    val questionById = questions.associateBy { it.id }
    val areaById = areas.associateBy { it.id }
    val topicById = topics.associateBy { it.id }

    val officialQuestions: List<Question> = questions.filter { it.isOfficial }
    val originalQuestions: List<Question> = questions.filter { !it.isOfficial }

    fun lessonsOfArea(areaId: String): List<Lesson> =
        areaById[areaId]?.lessonIds?.mapNotNull { lessonById[it] } ?: emptyList()

    fun topicsOfArea(areaId: String): List<SyllabusTopic> = topics.filter { it.areaId == areaId }
    fun lessonsForTopic(topicId: String) = lessons.filter { topicId in it.topicIds }
    fun questionsForTopic(topicId: String) = questions.filter { topicId in it.topicIds }
    fun questionsForLesson(lessonId: String) = questions.filter { lessonId in it.lessonIds }
    fun termsForLesson(lessonId: String) = terms.filter { lessonId in it.lessonIds }
    fun paperQuestions(paper: OfficialPaper) = paper.questionIds.mapNotNull { questionById[it] }

    fun topicName(topicId: String) = topicById[topicId]?.title ?: topicId
    fun lessonName(lessonId: String) = lessonById[lessonId]?.title ?: lessonId

    fun topicCoverage(): List<TopicCoverage> = topics.map { topic ->
        val l = lessonsForTopic(topic.id)
        val q = questionsForTopic(topic.id).size
        val status = when {
            l.isNotEmpty() && q >= 4 -> CoverageStatus.Complete
            l.isNotEmpty() || q > 0 -> CoverageStatus.Partial
            else -> CoverageStatus.Missing
        }
        TopicCoverage(topic, l, q, status)
    }

    companion object {
        suspend fun load(context: Context): ContentRepository = withContext(Dispatchers.IO) {
            val assets = context.assets
            fun text(path: String) = assets.open(path).bufferedReader().use { it.readText() }
            val meta = ContentJson.decodeFromString(ContentMeta.serializer(), text("content/meta.json"))
            val terms = ContentJson.decodeFromString(ListSerializer(GlossaryTerm.serializer()), text("content/terms.json"))
            val questions = ContentJson.decodeFromString(ListSerializer(Question.serializer()), text("content/questions.json"))
            val lessons = meta.areas.sortedBy { it.order }.flatMap { it.lessonIds }.map { id ->
                ContentJson.decodeFromString(
                    Lesson.serializer(),
                    text("content/lessons/${id.replace("/", "__")}.json"),
                )
            }
            ContentRepository(meta, lessons, terms, questions)
        }
    }
}
