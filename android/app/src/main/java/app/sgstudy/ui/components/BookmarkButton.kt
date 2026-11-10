package app.sgstudy.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.outlined.BookmarkBorder
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.runtime.*
import app.sgstudy.LocalApp
import app.sgstudy.ui.theme.Sg
import kotlinx.coroutines.launch

/** Toggle bookmark for a question / term / lesson. [itemType] is "question", "term" or "lesson". */
@Composable
fun BookmarkButton(itemType: String, itemId: String) {
    val app = LocalApp.current
    val scope = rememberCoroutineScope()
    val version by app.store.version.collectAsState()
    val bookmarked by produceState(false, itemType, itemId, version) { value = app.store.isBookmarked(itemType, itemId) }
    IconButton(onClick = { scope.launch { app.store.toggleBookmark(itemType, itemId) } }) {
        Icon(
            if (bookmarked) Icons.Filled.Bookmark else Icons.Outlined.BookmarkBorder,
            contentDescription = if (bookmarked) "ブックマークを外す" else "ブックマーク",
            tint = if (bookmarked) Sg.colors.infoForeground else Sg.colors.mutedForeground,
        )
    }
}
