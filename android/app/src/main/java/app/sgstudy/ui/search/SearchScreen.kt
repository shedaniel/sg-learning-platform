package app.sgstudy.ui.search

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.horizontalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import app.sgstudy.LocalApp
import app.sgstudy.logic.SearchIndex
import app.sgstudy.logic.SearchKind
import app.sgstudy.logic.SearchResult
import app.sgstudy.ui.components.*
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.theme.Sg
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext

private val SUGGESTIONS = listOf("CIA", "phishing", "ふぃっしんぐ", "BCP", "暗号", "ランサムウェア", "リスク", "個人情報")

private fun SearchKind.label() = when (this) {
    SearchKind.Lesson -> "レッスン"; SearchKind.Term -> "用語"; SearchKind.Question -> "問題"; SearchKind.Topic -> "シラバス"
}

private fun SearchKind.tone() = when (this) {
    SearchKind.Lesson -> Tone.Info; SearchKind.Term -> Tone.Success; SearchKind.Question -> Tone.Warning; SearchKind.Topic -> Tone.Neutral
}

/** Global search over lessons, terms, questions and syllabus topics (kana- and case-insensitive, abbreviations/English included). */
@Composable
fun SearchScreen(nav: Navigator) {
    val content = LocalApp.current.content
    var query by rememberSaveable { mutableStateOf("") }
    val focus = remember { FocusRequester() }
    LaunchedEffect(Unit) { runCatching { focus.requestFocus() } }

    // The index (normalised copy of all text) is built once, off the main thread.
    val index by produceState<SearchIndex?>(null, content) { value = withContext(Dispatchers.Default) { SearchIndex(content) } }

    // Debounced search off the main thread; produceState cancels the previous run when the query changes.
    val results by produceState<List<SearchResult>?>(emptyList(), query, index) {
        val idx = index
        if (query.isBlank() || idx == null) { value = emptyList(); return@produceState }
        delay(200)
        value = null // searching
        value = withContext(Dispatchers.Default) { idx.search(query, 60) }
    }

    ScreenFrame("検索", onBack = nav::back) { padding ->
        Column(Modifier.padding(padding).fillMaxSize()) {
            Box(Modifier.padding(horizontal = ScreenPadding, vertical = 8.dp)) {
                SgSearchField(query, { query = it }, "レッスン・用語・問題を検索", focusRequester = focus)
            }
            val r = results
            when {
                query.isBlank() -> Column(Modifier.padding(horizontal = ScreenPadding, vertical = 12.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text(
                        "日本語・ひらがな/カタカナ・英語・略語で、レッスン・用語・問題・シラバス項目を横断検索します。",
                        style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground,
                    )
                    Text("例", style = MaterialTheme.typography.labelMedium, color = Sg.colors.mutedForeground)
                    Row(Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        SUGGESTIONS.forEach { s -> ChoiceChip(s, false, { query = s }) }
                    }
                }
                r == null || (index == null) -> Box(Modifier.fillMaxWidth().padding(32.dp), contentAlignment = Alignment.TopCenter) {
                    CircularProgressIndicator(color = Sg.colors.mutedForeground, modifier = Modifier.size(28.dp))
                }
                r.isEmpty() -> EmptyState("「${query.trim()}」に一致する項目がありません", "別の言葉や略語、英語でも試してみてください。")
                else -> ResultList(r, nav)
            }
        }
    }
}

@Composable
private fun ResultList(results: List<SearchResult>, nav: Navigator) {
    // Group by kind, keeping each group's score order; groups ordered by their best result.
    val groups = remember(results) {
        results.groupBy { it.kind }.entries.sortedByDescending { e -> e.value.maxOf { it.score } }
    }
    LazyColumn(Modifier.fillMaxSize(), contentPadding = PaddingValues(horizontal = ScreenPadding, vertical = 8.dp)) {
        groups.forEach { (kind, list) ->
            item(key = "h-$kind") {
                Text("${kind.label()}（${list.size}）", style = MaterialTheme.typography.titleMedium, modifier = Modifier.padding(top = 12.dp, bottom = 4.dp))
            }
            items(list, key = { "${it.kind}-${it.id}" }) { r ->
                Column(
                    Modifier.fillMaxWidth().clickable {
                        when (r.kind) {
                            SearchKind.Lesson -> nav.openLesson(r.id)
                            SearchKind.Term -> nav.openTerm(r.id)
                            SearchKind.Question -> nav.openQuestion(r.id)
                            SearchKind.Topic -> nav.openCoverage()
                        }
                    }.padding(vertical = 12.dp),
                    verticalArrangement = Arrangement.spacedBy(3.dp),
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Badge(r.kind.label(), r.kind.tone())
                        Text(r.title, style = MaterialTheme.typography.titleSmall, modifier = Modifier.weight(1f), maxLines = 2, overflow = TextOverflow.Ellipsis)
                    }
                    Text(r.subtitle, style = MaterialTheme.typography.bodySmall, color = Sg.colors.infoForeground, maxLines = 1, overflow = TextOverflow.Ellipsis)
                    if (r.snippet.isNotBlank()) Text(r.snippet, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground, maxLines = 2, overflow = TextOverflow.Ellipsis)
                }
                Divider()
            }
        }
    }
}
