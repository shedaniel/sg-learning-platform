package app.sgstudy.ui.learn

import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.outlined.RadioButtonChecked
import androidx.compose.material.icons.outlined.RadioButtonUnchecked
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import app.sgstudy.data.model.DIFFICULTY_LABEL
import app.sgstudy.ui.components.Badge
import app.sgstudy.ui.components.Tone
import app.sgstudy.ui.theme.Sg

/** Status icon for a lesson: "completed" | "started" | "new". */
@Composable
fun LessonStatusIcon(status: String, size: Dp = 22.dp, modifier: Modifier = Modifier) {
    when (status) {
        "completed" -> Icon(Icons.Filled.CheckCircle, "読了済み", modifier.size(size), tint = Sg.colors.successForeground)
        "started" -> Icon(Icons.Outlined.RadioButtonChecked, "学習中", modifier.size(size), tint = Sg.colors.infoForeground)
        else -> Icon(Icons.Outlined.RadioButtonUnchecked, "未着手", modifier.size(size), tint = Sg.colors.mutedForeground)
    }
}

@Composable
fun DifficultyBadge(difficulty: String) {
    Badge(
        DIFFICULTY_LABEL[difficulty] ?: difficulty,
        when (difficulty) { "easy" -> Tone.Success; "hard" -> Tone.Warning; else -> Tone.Neutral },
    )
}

fun statusLabel(status: String) = when (status) { "completed" -> "読了済み"; "started" -> "学習中"; else -> "未着手" }
