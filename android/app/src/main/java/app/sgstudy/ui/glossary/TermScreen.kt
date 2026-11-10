package app.sgstudy.ui.glossary

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Replay
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import app.sgstudy.LocalApp
import app.sgstudy.logic.QuizConfig
import app.sgstudy.ui.components.*
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.theme.Sg
import kotlinx.coroutines.launch

/** One glossary term: readings, explanations (Japanese + optional English), exam usage, and links to related content. */
@Composable
fun TermScreen(termId: String, nav: Navigator) {
    val app = LocalApp.current
    val content = app.content
    val term = content.termById[termId]
    if (term == null) {
        ScrollScreen("用語", onBack = nav::back) { EmptyState("用語が見つかりません", "この用語は用語集にありません。") }
        return
    }
    val scope = rememberCoroutineScope()
    val version by app.store.version.collectAsState()
    val learned by produceState(false, termId, version) { value = termId in app.store.learnedTermIds() }
    var addedToReview by rememberSaveable(termId) { mutableStateOf(false) }

    val related = remember(termId) { term.relatedTermIds.mapNotNull { content.termById[it] } }
    val lessons = remember(termId) { term.lessonIds.mapNotNull { content.lessonById[it] } }
    // Questions that cite the term in their explanation, then a few from the lessons that cover it (as on the web).
    val questions = remember(termId) {
        (content.questions.filter { termId in it.explanation.termIds } + lessons.flatMap { content.questionsForLesson(it.id).take(3) })
            .distinctBy { it.id }.take(6)
    }

    ScrollScreen("用語", onBack = nav::back, actions = { BookmarkButton("term", termId) }) {
        // --- header
        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            if (term.tags.isNotEmpty()) Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) { term.tags.take(4).forEach { Badge(it) } }
            Text(term.ja, style = MaterialTheme.typography.headlineMedium)
            if (term.reading != null) Text("読み: ${term.reading}", style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)
            Text(
                (term.abbr?.let { "$it — " } ?: "") + term.en,
                style = MaterialTheme.typography.titleSmall, color = Sg.colors.infoForeground,
            )
        }

        // --- actions
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
            val toggle: () -> Unit = { scope.launch { app.store.markTermLearned(termId, !learned) } }
            if (learned) SecondaryButton("覚えた", toggle, Modifier.weight(1f), icon = Icons.Filled.Check)
            else PrimaryButton("覚えたことにする", toggle, Modifier.weight(1f), icon = Icons.Filled.Check)
            SecondaryButton(
                if (addedToReview) "復習に追加済み" else "復習に追加",
                { scope.launch { app.store.scheduleReview("term", termId, 2); addedToReview = true } },
                Modifier.weight(1f), enabled = !addedToReview, icon = Icons.Filled.Replay,
            )
        }
        if (addedToReview) Text("復習タブで確認できます。", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)

        // --- summary
        SgCard {
            Text(term.shortJa, style = MaterialTheme.typography.bodyLarge)
            if (app.showEnglish && term.shortEn.isNotBlank()) {
                Spacer(Modifier.height(6.dp))
                Text(term.shortEn, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)
            }
        }

        // --- full explanations
        SgCard {
            Text("日本語の説明", style = MaterialTheme.typography.titleSmall, color = Sg.colors.infoForeground)
            Spacer(Modifier.height(6.dp))
            Text(term.explanationJa, style = MaterialTheme.typography.bodyLarge)
        }
        if (app.showEnglish && term.explanationEn.isNotBlank()) {
            SgCard {
                Text("English support", style = MaterialTheme.typography.titleSmall, color = Sg.colors.infoForeground)
                Spacer(Modifier.height(6.dp))
                Text(term.explanationEn, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)
            }
        }
        if (term.examUsage != null) {
            SgCard(container = Sg.colors.muted) {
                Text("試験での使われ方", style = MaterialTheme.typography.titleSmall, color = Sg.colors.infoForeground)
                Spacer(Modifier.height(6.dp))
                Text(term.examUsage, style = MaterialTheme.typography.bodyLarge)
            }
        }

        // --- related
        if (related.isNotEmpty()) {
            SectionTitle("関連用語")
            SgCard(contentPadding = 4.dp) {
                related.forEachIndexed { i, t ->
                    if (i > 0) Divider(Modifier.padding(horizontal = 12.dp))
                    ListRow(t.ja, Modifier.padding(horizontal = 12.dp), subtitle = t.en, onClick = { nav.openTerm(t.id) }, trailing = { Chevron() })
                }
            }
        }
        if (lessons.isNotEmpty()) {
            SectionTitle("この用語を扱うレッスン")
            SgCard(contentPadding = 4.dp) {
                lessons.forEachIndexed { i, l ->
                    if (i > 0) Divider(Modifier.padding(horizontal = 12.dp))
                    ListRow(l.title, Modifier.padding(horizontal = 12.dp), subtitle = content.areaById[l.areaId]?.title, onClick = { nav.openLesson(l.id) }, trailing = { Chevron() })
                }
            }
        }
        if (questions.isNotEmpty()) {
            SectionTitle("関連する演習問題")
            SgCard(contentPadding = 4.dp) {
                questions.forEachIndexed { i, q ->
                    if (i > 0) Divider(Modifier.padding(horizontal = 12.dp))
                    ListRow(
                        q.stem, Modifier.padding(horizontal = 12.dp), onClick = { nav.openQuestion(q.id) },
                        subtitle = if (q.isOfficial) "IPA ${q.source.year ?: ""} 問${q.source.questionNo ?: ""}" else "独自問題",
                        trailing = { Chevron() },
                    )
                }
            }
            SecondaryButton("関連問題をまとめて解く（${questions.size}問）", {
                nav.startQuiz(QuizConfig(questionIds = questions.map { it.id }, count = questions.size, mode = "custom", title = term.ja))
            }, Modifier.fillMaxWidth())
        }

        Text(
            "用語の定義は本アプリ独自の学習用要約です。公式規格・法令の原文を確認してください。",
            style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
        )
    }
}

@Composable
private fun Chevron() = Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, null, tint = Sg.colors.mutedForeground)
