package app.sgstudy

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.runtime.State
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.collectAsState
import app.sgstudy.data.ContentRepository
import app.sgstudy.data.ProgressStore
import app.sgstudy.data.db.SgDatabase
import app.sgstudy.logic.ProgressSnapshot
import app.sgstudy.logic.QuizConfig
import app.sgstudy.logic.computeSnapshot
import app.sgstudy.ui.theme.ThemeMode

/** Process-wide singletons. Reach them in composables through [LocalApp]. */
class AppContainer(context: Context, val content: ContentRepository) {
    val store = ProgressStore(SgDatabase(context.applicationContext))
    private val prefs = context.applicationContext.getSharedPreferences("sg-settings", Context.MODE_PRIVATE)

    /** Config handed from whoever starts a quiz to QuizScreen (see Navigator.startQuiz). */
    var pendingQuiz: QuizConfig? = null

    private val themeState = mutableStateOf(
        runCatching { ThemeMode.valueOf(prefs.getString("theme", "System")!!) }.getOrDefault(ThemeMode.System),
    )

    /** Observable: reading it in composition recomposes when it changes. */
    var themeMode: ThemeMode
        get() = themeState.value
        set(value) { themeState.value = value; prefs.edit().putString("theme", value.name).apply() }

    /** Whether to show English translations next to Japanese explanations. */
    private val englishState = mutableStateOf(prefs.getBoolean("show_english", true))
    var showEnglish: Boolean
        get() = englishState.value
        set(value) { englishState.value = value; prefs.edit().putBoolean("show_english", value).apply() }
}

val LocalApp = compositionLocalOf<AppContainer> { error("AppContainer not provided") }

/**
 * Progress snapshot (lessons done, accuracy per topic, due reviews, history...) that is recomputed
 * whenever anything is written to the progress store. null while the first computation runs.
 */
@Composable
fun rememberProgress(): State<ProgressSnapshot?> {
    val app = LocalApp.current
    val version by app.store.version.collectAsState()
    return produceState<ProgressSnapshot?>(initialValue = null, version) {
        value = computeSnapshot(app.content, app.store)
    }
}
