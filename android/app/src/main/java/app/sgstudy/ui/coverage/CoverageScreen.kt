package app.sgstudy.ui.coverage

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.OpenInNew
import androidx.compose.material.icons.filled.ErrorOutline
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import app.sgstudy.LocalApp
import app.sgstudy.data.CoverageStatus
import app.sgstudy.data.TopicCoverage
import app.sgstudy.ui.components.*
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.theme.Sg
import app.sgstudy.ui.theme.areaColor

// Ported from src/app/coverage/page.tsx (the web keeps this list in the page, not in the content files).
private val PROPOSED_CHANGES = listOf(
    "AI を悪用した攻撃 / AI システムへの攻撃" to "プロンプトインジェクション（直接・間接）、ジェイルブレイク、データポイズニング、ディープフェイク、マルウェア亜種の自動生成など。",
    "ゼロトラストとサプライチェーン" to "内部ネットワークも信頼しない前提、ソフトウェアサプライチェーン攻撃、SBOM と供給者管理の強化。",
    "AI 倫理・AI ガバナンス" to "説明可能な AI、ヒューマン・イン・ザ・ループ、AI 利用ポリシー、シャドーAI、ハルシネーション、AI 基本法。",
    "クラウド・データ・新法" to "ソブリンクラウド、JC-STAR、重要経済安保情報保護法、サイバー対処能力強化法（能動的サイバー防御）など。",
)

private sealed interface Entry {
    data object Summary : Entry
    data class AreaHeader(val areaId: String) : Entry
    data class Topic(val cov: TopicCoverage) : Entry
    data object Proposed : Entry
    data object Sources : Entry
}

private fun statusTone(s: CoverageStatus) = when (s) { CoverageStatus.Complete -> Tone.Success; CoverageStatus.Partial -> Tone.Warning; CoverageStatus.Missing -> Tone.Danger }
private fun statusLabel(s: CoverageStatus) = when (s) { CoverageStatus.Complete -> "対応済み"; CoverageStatus.Partial -> "一部対応"; CoverageStatus.Missing -> "未対応" }

private fun open(context: android.content.Context, url: String) {
    runCatching { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) }
}

/** シラバス対応: every syllabus topic (Ver.4.1) with lesson / question counts, grouped by area. */
@Composable
fun CoverageScreen(nav: Navigator) {
    val content = LocalApp.current.content
    val rows = remember(content) {
        val cov = content.topicCoverage()
        buildList {
            add(Entry.Summary)
            content.areas.forEach { a ->
                val inArea = cov.filter { it.topic.areaId == a.id }
                if (inArea.isNotEmpty()) { add(Entry.AreaHeader(a.id)); inArea.forEach { add(Entry.Topic(it)) } }
            }
            add(Entry.Proposed); add(Entry.Sources)
        }
    }
    val coverage = remember(content) { content.topicCoverage() }

    ScreenFrame("シラバス対応", onBack = nav::back) { padding ->
        LazyColumn(
            Modifier.padding(padding).fillMaxSize(),
            contentPadding = PaddingValues(start = ScreenPadding, end = ScreenPadding, top = 4.dp, bottom = 32.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            items(rows, key = { r ->
                when (r) { Entry.Summary -> "sum"; is Entry.AreaHeader -> "a-${r.areaId}"; is Entry.Topic -> "t-${r.cov.topic.id}"; Entry.Proposed -> "prop"; Entry.Sources -> "src" }
            }) { r ->
                when (r) {
                    Entry.Summary -> SummaryCard(coverage)
                    is Entry.AreaHeader -> AreaHeader(r.areaId, nav)
                    is Entry.Topic -> TopicCard(r.cov, nav)
                    Entry.Proposed -> ProposedCard()
                    Entry.Sources -> SourcesCard()
                }
            }
        }
    }
}

@Composable
private fun SummaryCard(coverage: List<TopicCoverage>) {
    val s = LocalApp.current.content.syllabus
    val complete = coverage.count { it.status == CoverageStatus.Complete }
    val partial = coverage.count { it.status == CoverageStatus.Partial }
    val missing = coverage.count { it.status == CoverageStatus.Missing }
    SgCard {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Badge("現行 ${s.current}", Tone.Info)
            Text("公表 ${s.currentPublished} · 確認 ${s.verifiedAt}", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
        }
        Spacer(Modifier.height(10.dp))
        Text(
            "現在有効な IPA SG シラバス ${s.current} の全トピックに対する教材・問題の対応状況です。トピック単位で、対応レッスンが1本以上・演習問題が4問以上ある場合を「対応済み」としています。不足を隠さないために表示しており、レッスン数や問題数は公式の出題頻度を保証するものではありません。",
            style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground,
        )
        Spacer(Modifier.height(14.dp))
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly) {
            Count(complete, "対応済み", Tone.Success); Count(partial, "一部対応", Tone.Warning); Count(missing, "未対応", Tone.Danger)
        }
        Spacer(Modifier.height(12.dp))
        SgProgressBar(complete / coverage.size.coerceAtLeast(1).toFloat(), color = Sg.colors.success, height = 8.dp)
        Spacer(Modifier.height(4.dp))
        Text("$complete / ${coverage.size} トピックが対応済み", style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
    }
}

@Composable
private fun Count(n: Int, label: String, tone: Tone) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text("$n", style = MaterialTheme.typography.headlineSmall.copy(fontFamily = FontFamily.Monospace), color = tone.color())
        Text(label, style = MaterialTheme.typography.labelMedium, color = Sg.colors.mutedForeground)
    }
}

@Composable
private fun AreaHeader(areaId: String, nav: Navigator) {
    val area = LocalApp.current.content.areaById[areaId] ?: return
    Row(Modifier.fillMaxWidth().padding(top = 12.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        Box(Modifier.size(10.dp).clip(CircleShape).background(areaColor(area.color)))
        Column(Modifier.weight(1f)) {
            Text(area.title, style = MaterialTheme.typography.titleMedium)
            Text(area.titleEn, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
        }
        Text(
            "学習する →", style = MaterialTheme.typography.labelLarge, color = Sg.colors.infoForeground,
            modifier = Modifier.clip(MaterialTheme.shapes.small).clickable { nav.openArea(areaId) }.padding(horizontal = 8.dp, vertical = 12.dp),
        )
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun TopicCard(c: TopicCoverage, nav: Navigator) {
    SgCard(contentPadding = 14.dp) {
        Row(verticalAlignment = Alignment.Top, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Column(Modifier.weight(1f)) {
                Text(c.topic.title, style = MaterialTheme.typography.titleSmall)
                Text(c.topic.titleEn, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
            }
            Badge(statusLabel(c.status), statusTone(c.status))
        }
        Spacer(Modifier.height(6.dp))
        Text(c.topic.summary, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)
        Spacer(Modifier.height(6.dp))
        Text(
            "${c.topic.reference} · ${c.lessons.size}レッスン · ${c.questionCount}問",
            style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
        )
        if (c.lessons.isNotEmpty()) {
            Spacer(Modifier.height(8.dp))
            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                c.lessons.forEach { l ->
                    Text(
                        l.title, style = MaterialTheme.typography.labelMedium, color = Sg.colors.infoForeground,
                        modifier = Modifier.heightIn(min = 36.dp).clip(RoundedCornerShape(8.dp)).background(Sg.colors.muted)
                            .clickable { nav.openLesson(l.id) }.padding(horizontal = 10.dp, vertical = 8.dp),
                    )
                }
            }
        }
    }
}

@Composable
private fun ProposedCard() {
    val s = LocalApp.current.content.syllabus
    val context = LocalContext.current
    SgCard(container = Tone.Warning.container(), borderColor = Sg.colors.warning.copy(alpha = 0.4f)) {
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Filled.ErrorOutline, null, tint = Sg.colors.warningForeground)
            Text("2027年度 新試験制度のシラバス案", style = MaterialTheme.typography.titleSmall, modifier = Modifier.weight(1f))
        }
        Spacer(Modifier.height(8.dp))
        Badge("現行の出題範囲ではありません（案）", Tone.Warning)
        Spacer(Modifier.height(8.dp))
        Text(
            "現在の教材は有効な ${s.current} を基準にしています。IPA は ${s.proposedPublished} に2027年度開始予定の新試験制度のシラバス案（${s.proposed}）を公表しました。これは案であり、現行試験の出題範囲ではありません。案の主な追加・強化点は次のとおりです。",
            style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground,
        )
        Spacer(Modifier.height(10.dp))
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            PROPOSED_CHANGES.forEach { (title, detail) ->
                Column(Modifier.fillMaxWidth().clip(RoundedCornerShape(10.dp)).background(Sg.colors.card).padding(12.dp)) {
                    Text(title, style = MaterialTheme.typography.titleSmall)
                    Text(detail, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
                }
            }
        }
        val src = s.sources.firstOrNull { "案" in it.label }
        if (src != null) {
            Spacer(Modifier.height(10.dp))
            LinkRow("新試験制度のシラバス案（IPA）") { open(context, src.url) }
        }
    }
}

@Composable
private fun SourcesCard() {
    val s = LocalApp.current.content.syllabus
    val context = LocalContext.current
    SgCard {
        Text("出典と検証日", style = MaterialTheme.typography.titleSmall)
        Spacer(Modifier.height(4.dp))
        s.sources.forEach { src -> LinkRow(src.label) { open(context, src.url) } }
        Spacer(Modifier.height(6.dp))
        Text(
            "検証日: ${s.verifiedAt}。試験時間・出題数は公式 SG ページ（${s.examStructure.questions}問 / ${s.examStructure.minutes}分、科目A ${s.examStructure.partA}問・科目B ${s.examStructure.partB}問）に基づきます。",
            style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground,
        )
    }
}

@Composable
private fun LinkRow(label: String, onClick: () -> Unit) {
    Row(
        Modifier.fillMaxWidth().heightIn(min = 44.dp).clickable(onClick = onClick),
        verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Text(label, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.infoForeground, modifier = Modifier.weight(1f))
        Icon(Icons.AutoMirrored.Filled.OpenInNew, "外部リンク", tint = Sg.colors.infoForeground, modifier = Modifier.size(18.dp))
    }
}
