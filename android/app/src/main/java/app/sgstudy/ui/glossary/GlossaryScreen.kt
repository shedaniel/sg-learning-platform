package app.sgstudy.ui.glossary

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import app.sgstudy.LocalApp
import app.sgstudy.data.model.GlossaryTerm
import app.sgstudy.logic.normalizeJapanese
import app.sgstudy.ui.components.*
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.search.SgSearchField
import app.sgstudy.ui.theme.Sg
import app.sgstudy.ui.theme.areaColor

private enum class StatusFilter(val label: String) { All("すべて"), Learned("覚えた"), NotLearned("未学習"), Bookmarked("ブックマーク") }

/** 用語集: all terms in one lazy list, with search (ja / reading / en / abbr), area + status filters and a fast scroller. */
@Composable
fun GlossaryScreen(nav: Navigator) {
    val app = LocalApp.current
    val content = app.content
    val version by app.store.version.collectAsState()
    val learned by produceState(emptySet<String>(), version) { value = app.store.learnedTermIds().toSet() }
    val bookmarked by produceState(emptySet<String>(), version) { value = app.store.bookmarks("term").map { it.itemId }.toSet() }

    var query by rememberSaveable { mutableStateOf("") }
    var areaId by rememberSaveable { mutableStateOf<String?>(null) }
    var status by rememberSaveable { mutableStateOf(StatusFilter.All) }

    // Pre-normalised search text and area per term (computed once).
    val haystack = remember(content) {
        content.terms.associate { t ->
            t.id to normalizeJapanese(listOf(t.ja, t.reading ?: "", t.en, t.abbr ?: "", t.shortJa, t.tags.joinToString(" ")).joinToString(" "))
        }
    }
    val termAreas = remember(content) {
        content.terms.associate { t -> t.id to t.lessonIds.mapNotNull { content.lessonById[it]?.areaId }.toSet() }
    }
    val areaCounts = remember(content) { content.areas.associate { a -> a.id to content.terms.count { a.id in (termAreas[it.id] ?: emptySet()) } } }

    val filtered = remember(query, areaId, status, learned, bookmarked, content) {
        val q = normalizeJapanese(query)
        content.terms.filter { t ->
            (areaId == null || areaId in (termAreas[t.id] ?: emptySet())) &&
                (q.isEmpty() || haystack[t.id]!!.contains(q)) &&
                when (status) {
                    StatusFilter.All -> true
                    StatusFilter.Learned -> t.id in learned
                    StatusFilter.NotLearned -> t.id !in learned
                    StatusFilter.Bookmarked -> t.id in bookmarked
                }
        }
    }

    val listState = rememberLazyListState()
    // Jump back to the top whenever the filter changes.
    LaunchedEffect(query, areaId, status) { listState.scrollToItem(0) }

    ScreenFrame("用語集", onBack = nav::back) { padding ->
        Column(Modifier.padding(padding).fillMaxSize()) {
            Column(Modifier.padding(horizontal = ScreenPadding).padding(top = 4.dp, bottom = 8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                SgSearchField(query, { query = it }, "用語・英語・略語で検索")
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("覚えた ${learned.size}/${content.terms.size}", style = MaterialTheme.typography.labelMedium, color = Sg.colors.mutedForeground, modifier = Modifier.weight(1f))
                    Text("${filtered.size}語を表示", style = MaterialTheme.typography.labelMedium, color = Sg.colors.mutedForeground)
                }
                SgProgressBar(learned.size / content.terms.size.coerceAtLeast(1).toFloat(), height = 4.dp, color = Sg.colors.success)
            }
            LazyRow(contentPadding = PaddingValues(horizontal = ScreenPadding), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(StatusFilter.entries.toList()) { f -> ChoiceChip(f.label, status == f, { status = f }) }
            }
            LazyRow(
                contentPadding = PaddingValues(horizontal = ScreenPadding, vertical = 4.dp), horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                item { ChoiceChip("全分野", areaId == null, { areaId = null }) }
                items(content.areas, key = { it.id }) { a -> ChoiceChip("${a.shortTitle}（${areaCounts[a.id] ?: 0}）", areaId == a.id, { areaId = if (areaId == a.id) null else a.id }) }
            }
            Divider()
            if (filtered.isEmpty()) {
                EmptyState("該当する用語がありません", "検索語やフィルターを変えてみてください。")
            } else {
                Box(Modifier.weight(1f).fillMaxWidth()) {
                    LazyColumn(Modifier.fillMaxSize(), state = listState, contentPadding = PaddingValues(start = ScreenPadding, end = ScreenPadding + 8.dp, bottom = 24.dp)) {
                        items(filtered, key = { it.id }) { t ->
                            TermRow(t, t.id in learned, content.areaById[termAreas[t.id]?.firstOrNull()]?.let { it.shortTitle to it.color }, onClick = { nav.openTerm(t.id) })
                            Divider()
                        }
                    }
                    FastScrollbar(listState) { i -> filtered.getOrNull(i)?.let { "${i + 1}/${filtered.size}" } ?: "" }
                }
            }
        }
    }
}

@Composable
private fun TermRow(t: GlossaryTerm, learned: Boolean, area: Pair<String, String>?, onClick: () -> Unit) {
    Row(Modifier.fillMaxWidth().clickable(onClick = onClick).padding(vertical = 12.dp), verticalAlignment = Alignment.Top, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
        Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
            Text(
                buildString { append(t.ja); if (t.reading != null) append("（${t.reading}）") },
                style = MaterialTheme.typography.titleSmall, maxLines = 2, overflow = TextOverflow.Ellipsis,
            )
            Text((t.abbr?.let { "$it · " } ?: "") + t.en, style = MaterialTheme.typography.bodySmall, color = Sg.colors.infoForeground, maxLines = 1, overflow = TextOverflow.Ellipsis)
            Text(t.shortJa, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground, maxLines = 2, overflow = TextOverflow.Ellipsis)
            if (area != null) {
                Spacer(Modifier.height(2.dp))
                Text(area.first, style = MaterialTheme.typography.labelSmall, color = Sg.colors.mutedForeground)
            }
        }
        if (learned) Icon(Icons.Filled.Check, "覚えた", tint = Sg.colors.successForeground, modifier = Modifier.padding(top = 2.dp).size(22.dp))
    }
}
