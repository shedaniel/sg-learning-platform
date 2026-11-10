package app.sgstudy.ui.papers

import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import app.sgstudy.ui.components.ScreenFrame
import app.sgstudy.ui.components.ScreenPadding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.OpenInNew
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import app.sgstudy.ui.theme.Sg
import java.time.LocalDate

/** Opens [url] in the user's browser / PDF viewer; shows a toast when nothing can handle it. */
internal fun openUrl(context: Context, url: String) {
    try {
        context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
    } catch (_: ActivityNotFoundException) {
        Toast.makeText(context, "開けるアプリがありません", Toast.LENGTH_SHORT).show()
    }
}

/** "2026-07-01" -> "2026年7月1日". */
internal fun formatPublished(iso: String): String =
    runCatching { LocalDate.parse(iso).let { "${it.year}年${it.monthValue}月${it.dayOfMonth}日" } }.getOrDefault(iso)

/** Accent text button with an "open externally" icon; min 48dp tall. */
@Composable
internal fun LinkButton(label: String, url: String, modifier: Modifier = Modifier) {
    val context = LocalContext.current
    TextButton(onClick = { openUrl(context, url) }, modifier = modifier.heightIn(min = 48.dp)) {
        Text(label, style = MaterialTheme.typography.labelLarge, color = Sg.colors.infoForeground)
        Icon(Icons.AutoMirrored.Filled.OpenInNew, null, Modifier.size(16.dp), tint = Sg.colors.infoForeground)
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
internal fun LinkRow(content: @Composable () -> Unit) {
    FlowRow(horizontalArrangement = Arrangement.spacedBy(4.dp)) { content() }
}

/** [ScreenFrame] + scrolling column that also clears the system navigation bar. */
@Composable
internal fun PaperScrollScreen(title: String, onBack: () -> Unit, content: @Composable ColumnScope.() -> Unit) {
    ScreenFrame(title, onBack) { padding ->
        Column(
            Modifier.padding(padding).fillMaxSize().verticalScroll(rememberScrollState())
                .padding(horizontal = ScreenPadding).padding(top = 4.dp, bottom = 24.dp).navigationBarsPadding(),
            verticalArrangement = Arrangement.spacedBy(16.dp), content = content,
        )
    }
}
