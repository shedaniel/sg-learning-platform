package app.sgstudy.ui.mock

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import app.sgstudy.AppContainer
import app.sgstudy.data.MockRow
import app.sgstudy.logic.ExamFacts
import app.sgstudy.logic.MockResult
import app.sgstudy.logic.composeMockExam
import app.sgstudy.ui.components.ScreenFrame
import app.sgstudy.ui.components.ScreenPadding
import app.sgstudy.ui.theme.Sg
import java.time.Instant

/** Exam length in seconds (the real CBT: 120 minutes). */
internal const val MOCK_DURATION_SEC = ExamFacts.MINUTES * 60

/** Honest wording about what the score is (ported from the web's mock pages). */
internal const val MOCK_SCORE_DISCLAIMER =
    "IPA は IRT（項目応答理論）で評価点を算出します。本アプリの素点・正答率は公式スコアではなく、" +
        "合格判定を再現するものではありません。出題は本アプリの独自問題と IPA 公開問題を混在させた学習用の抽出で、" +
        "実際の CBT の出題順・難易度とは異なります。"

internal fun isoMillis(iso: String): Long = runCatching { Instant.parse(iso).toEpochMilli() }.getOrDefault(0L)

/** Whole seconds left until [expiresAtMs], never negative. */
internal fun remainingSeconds(expiresAtMs: Long, nowMs: Long = System.currentTimeMillis()): Int =
    Math.ceil((expiresAtMs - nowMs) / 1000.0).toInt().coerceAtLeast(0)

/** Composes 48 科目A + 12 科目B and persists a new mock attempt. Returns its id, or null if the bank is too small. */
internal suspend fun startNewMock(app: AppContainer): String? {
    val questions = composeMockExam(app.content.questions)
    if (questions.size < ExamFacts.QUESTIONS) return null
    return app.store.createMock(questions.map { it.id }, MOCK_DURATION_SEC)
}

/** Scores an unsubmitted mock from its last persisted state (used for an expired exam found on the home screen). */
internal suspend fun submitSavedMock(app: AppContainer, row: MockRow): MockResult =
    app.store.submitMock(row.id, row.answers, row.flags, row.currentIndex, row.questionIds, app.content.questionById)

/** Red / amber / green by accuracy (thresholds as on the web results page). */
@Composable
internal fun accuracyColor(percent: Int): Color = when {
    percent < 60 -> Sg.colors.destructive
    percent < 80 -> Sg.colors.warning
    else -> Sg.colors.success
}

/** [ScreenFrame] + scrolling column that also clears the system navigation bar. */
@Composable
internal fun MockScrollScreen(title: String, onBack: (() -> Unit)?, content: @Composable ColumnScope.() -> Unit) {
    ScreenFrame(title, onBack) { padding ->
        Column(
            Modifier.padding(padding).fillMaxSize().verticalScroll(rememberScrollState())
                .padding(horizontal = ScreenPadding).padding(top = 4.dp, bottom = 24.dp).navigationBarsPadding(),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            content = content,
        )
    }
}
