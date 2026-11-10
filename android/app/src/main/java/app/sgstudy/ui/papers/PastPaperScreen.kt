package app.sgstudy.ui.papers

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.shape.RoundedCornerShape
import app.sgstudy.LocalApp
import app.sgstudy.data.model.DIFFICULTY_LABEL
import app.sgstudy.data.model.PART_LABEL
import app.sgstudy.logic.QuizConfig
import app.sgstudy.rememberProgress
import app.sgstudy.ui.components.*
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.theme.Sg

/** One year's public questions: paper info + attribution, the question list with your last result, start-quiz buttons. */
@Composable
fun PastPaperScreen(year: Int, nav: Navigator) {
    val content = LocalApp.current.content
    val progress = rememberProgress().value
    val paper = content.papers.firstOrNull { it.year == year }

    if (paper == null) {
        ScreenFrame("過去問", nav::back) { p -> EmptyState("この年度の公開問題はありません", "年度を確認してください。", Modifier.padding(p)) }
        return
    }
    val qs = content.paperQuestions(paper)
    val attempted = qs.count { (progress?.questionProgress?.get(it.id)?.attempts ?: 0) > 0 }

    PaperScrollScreen("${paper.year}年度 公開問題", nav::back) {
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(paper.label, style = MaterialTheme.typography.titleLarge)
            @OptIn(ExperimentalLayoutApi::class)
            FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Badge("科目A ${qs.count { it.part == "A" }}問", Tone.Info)
                Badge("科目B ${qs.count { it.part == "B" }}問", Tone.Info)
                Badge("公開 ${paper.publishedCount}/${paper.actualCount}問・一部のみ", Tone.Warning)
                Badge("公開日 ${formatPublished(paper.publishedAt)}")
            }
        }

        if (qs.isNotEmpty()) {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                PrimaryButton(
                    text = "この年の問題を解く（${qs.size}問）", modifier = Modifier.fillMaxWidth(), icon = Icons.Filled.PlayArrow,
                    onClick = {
                        nav.startQuiz(
                            QuizConfig(
                                officialYear = year, mode = "official", count = qs.size, instantFeedback = true,
                                title = paper.label, difficulty = "mixed", part = "both",
                            ),
                        )
                    },
                )
                SecondaryButton(
                    text = "通しで解く（最後に採点）", modifier = Modifier.fillMaxWidth(),
                    onClick = {
                        nav.startQuiz(
                            QuizConfig(
                                officialYear = year, mode = "official", count = qs.size, instantFeedback = false,
                                title = paper.label,
                            ),
                        )
                    },
                )
                if (progress != null && attempted > 0) {
                    Text("解答済み $attempted/${qs.size}問", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
                }
            }
        }

        Text(paper.note, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)

        SectionTitle("収録問題")
        if (qs.isEmpty()) {
            EmptyState("この年度の問題は未収録です", "公式 PDF を参照してください。")
        } else {
            qs.forEach { q ->
                val qp = progress?.questionProgress?.get(q.id)
                PaperQuestionRow(
                    number = q.source.questionNo ?: 0,
                    meta = "${PART_LABEL[q.part] ?: q.part} · ${DIFFICULTY_LABEL[q.difficulty] ?: q.difficulty}",
                    topic = q.topicIds.firstOrNull()?.let(content::topicName),
                    stem = q.stem,
                    result = when {
                        qp == null || qp.attempts == 0 -> null
                        else -> qp.lastCorrect
                    },
                    attempted = (qp?.attempts ?: 0) > 0,
                    onClick = { nav.openQuestion(q.id) },
                )
            }
        }

        SgCard(container = Sg.colors.muted) {
            Text(
                "出典：IPA 情報セキュリティマネジメント試験 ${paper.label}。問題文・選択肢は公式 PDF に基づき、図表は等価な表・箇条書きとして再構成しています。" +
                    "解説は本アプリ独自のもので、IPA の見解ではありません。",
                style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
            )
            Spacer(Modifier.height(4.dp))
            LinkRow {
                LinkButton("問題冊子（PDF）", paper.bookletUrl)
                LinkButton("解答例（PDF）", paper.answerUrl)
                LinkButton("公式ページ", paper.pageUrl)
            }
        }
    }
}

@Composable
private fun PaperQuestionRow(
    number: Int, meta: String, topic: String?, stem: String, result: Boolean?, attempted: Boolean, onClick: () -> Unit,
) {
    SgCard(onClick = onClick, contentPadding = 12.dp) {
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Box(
                Modifier.size(34.dp).clip(RoundedCornerShape(8.dp)).background(Sg.colors.muted)
                    .border(BorderStroke(1.dp, Sg.colors.border), RoundedCornerShape(8.dp)),
                contentAlignment = Alignment.Center,
            ) {
                Text("$number", style = MaterialTheme.typography.labelLarge.copy(fontFamily = FontFamily.Monospace))
            }
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(3.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(meta, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
                    when {
                        !attempted -> Unit
                        result == true -> Badge("前回 正解", Tone.Success)
                        result == false -> Badge("前回 不正解", Tone.Danger)
                        else -> Badge("解答済み", Tone.Neutral)
                    }
                }
                Text(stem.replace("\n", " "), maxLines = 2, overflow = TextOverflow.Ellipsis, style = MaterialTheme.typography.bodyMedium)
                if (topic != null) Text(topic, style = MaterialTheme.typography.bodySmall, color = Sg.colors.infoForeground, maxLines = 1, overflow = TextOverflow.Ellipsis)
            }
            Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, null, Modifier.align(Alignment.CenterVertically), tint = Sg.colors.mutedForeground)
        }
    }
}
