package app.sgstudy.ui.papers

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import app.sgstudy.LocalApp
import app.sgstudy.logic.QuizConfig
import app.sgstudy.rememberProgress
import app.sgstudy.ui.components.*
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.theme.Sg

private const val IPA_PUBLIC_PAGE = "https://www.ipa.go.jp/shiken/mondai-kaiotu/sg_fe/koukai/index.html"

/** 過去問: the four official public-question sets (in-app) plus the archived written exams (links only). */
@Composable
fun PastPapersScreen(nav: Navigator) {
    val content = LocalApp.current.content
    val progress = rememberProgress().value
    val papers = content.papers

    // Topics that recur across the public questions (≥ 2 questions), as on the web page.
    val recurring = remember(content) {
        content.officialQuestions.flatMap { q -> q.topicIds.map { it to q } }
            .groupBy({ it.first }, { it.second })
            .map { (topicId, qs) -> Triple(topicId, qs.size, qs.mapNotNull { it.source.year }.distinct().sorted()) }
            .filter { it.second >= 2 }.sortedByDescending { it.second }.take(9)
    }
    val historicalByYear = remember(content) { content.historicalPapers.groupBy { it.year }.toSortedMap(compareByDescending { it }) }

    PaperScrollScreen("過去問", nav::back) {
        Text(
            "IPA が公開している SG の CBT 公開問題を収録しています。各年度15問のみが公開されており、60問の完全な過去問ではありません。",
            style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground,
        )
        LinkRow { LinkButton("IPA 公式ページ", IPA_PUBLIC_PAGE) }

        SectionTitle("公開問題（2023–2026）")
        if (papers.isEmpty()) {
            EmptyState("年度別の公開問題データを準備しています", "IPA の公式ページから原本を確認できます。")
        }
        papers.forEach { paper ->
            val qs = content.paperQuestions(paper)
            val attempted = qs.count { (progress?.questionProgress?.get(it.id)?.attempts ?: 0) > 0 }
            SgCard(contentPadding = 0.dp) {
                Row(
                    Modifier.fillMaxWidth().clickable { nav.openPastPaper(paper.year) }.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(14.dp),
                ) {
                    Text(
                        "${paper.year}", style = MaterialTheme.typography.headlineSmall.copy(fontFamily = FontFamily.Monospace, fontWeight = FontWeight.SemiBold),
                    )
                    Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                        Text(paper.label, style = MaterialTheme.typography.titleSmall)
                        Text(
                            "公開問題 ${paper.publishedCount}/${paper.actualCount}問・一部のみ",
                            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Medium), color = Sg.colors.warningForeground,
                        )
                        Text(
                            "科目A ${qs.count { it.part == "A" }} · 科目B ${qs.count { it.part == "B" }} · 公開日 ${formatPublished(paper.publishedAt)}",
                            style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
                        )
                        if (progress != null) Text(
                            "解答済み $attempted/${qs.size}問",
                            style = MaterialTheme.typography.bodySmall, color = if (attempted > 0) Sg.colors.successForeground else Sg.colors.mutedForeground,
                        )
                    }
                    Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, null, tint = Sg.colors.mutedForeground)
                }
                Divider()
                LinkRow {
                    Spacer(Modifier.width(4.dp))
                    LinkButton("問題冊子", paper.bookletUrl)
                    LinkButton("解答例", paper.answerUrl)
                    LinkButton("公式ページ", paper.pageUrl)
                }
            }
        }
        Text(
            "出典：独立行政法人情報処理推進機構（IPA）情報セキュリティマネジメント試験 公開問題。IPA の公表資料は、法令の特別な定めがある場合を除き、" +
                "許諾や使用料なく利用できます。問題文・選択肢は原文を維持し、図表はテキストや表として再構成しています。原本は各年度の IPA PDF を確認してください。" +
                "解説は本アプリ独自のものです。",
            style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
        )

        if (recurring.isNotEmpty()) {
            SectionTitle("年度をまたぐ頻出テーマ")
            Text(
                "2023〜2026年度の公開問題をトピック別に集計したものです。公開された一部の問題に基づく傾向であり、出題頻度の公式統計ではありません。タップでそのテーマを演習します。",
                style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
            )
            SgCard(contentPadding = 4.dp) {
                recurring.forEachIndexed { i, (topicId, count, years) ->
                    if (i > 0) Divider(Modifier.padding(horizontal = 12.dp))
                    ListRow(
                        title = content.topicName(topicId), subtitle = years.joinToString(" / ") + " 年度",
                        modifier = Modifier.padding(horizontal = 12.dp),
                        onClick = { nav.startQuiz(QuizConfig(topicIds = listOf(topicId), mode = "topic", count = 10)) },
                        trailing = { Text("${count}問", style = MaterialTheme.typography.titleSmall.copy(fontFamily = FontFamily.Monospace)) },
                    )
                }
            }
        }

        SectionTitle("筆記試験の過去問（リンクのみ）")
        Row(verticalAlignment = Alignment.CenterVertically) { Badge("アプリ内では出題しません", Tone.Neutral) }
        Text(
            "2016〜2019年度は午前50問・午後3問の筆記試験でした。原本は画像ベースの PDF でテキスト層がないため、アプリ内では出題せず、" +
                "IPA の問題冊子と解答例へ直接リンクしています。",
            style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
        )
        historicalByYear.forEach { (year, list) ->
            SgCard {
                Text("$year 年度", style = MaterialTheme.typography.titleMedium.copy(fontFamily = FontFamily.Monospace))
                list.forEachIndexed { i, paper ->
                    if (i > 0) Divider(Modifier.padding(vertical = 4.dp))
                    Text(paper.label, style = MaterialTheme.typography.titleSmall, modifier = Modifier.padding(top = 8.dp))
                    LinkRow {
                        LinkButton("午前 問題", paper.morning.booklet)
                        LinkButton("午前 解答例", paper.morning.answers)
                        LinkButton("午後 問題", paper.afternoon.booklet)
                        LinkButton("午後 解答例", paper.afternoon.answers)
                    }
                }
            }
        }
        Text(
            "2020〜2022年度の CBT 問題は非公開のため掲載されていません。アプリ内で出題できるのは2023年度以降の公開問題のみです。",
            style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
        )
    }
}
