package app.sgstudy.ui.widgets

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import app.sgstudy.ui.components.ChoiceChip
import app.sgstudy.ui.components.SgCard
import app.sgstudy.ui.components.Badge
import app.sgstudy.ui.theme.Sg
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive

// ---------------------------------------------------------------------------
// Content (mirrors src/components/widgets/cia-impact.tsx)
// ---------------------------------------------------------------------------

private val CiaLevelLabels = listOf("なし", "小", "中", "大")

/** Impact levels are 0..3 for confidentiality / integrity / availability. */
private class CiaImpact(val c: Int, val i: Int, val a: Int, val note: String)

private class CiaSystem(val id: String, val label: String, val short: String)

private class CiaIncident(val id: String, val label: String, val description: String, val impacts: Map<String, CiaImpact>)

private val CiaSystems = listOf(
    CiaSystem("customer", "顧客向けWeb（EC・会員）", "顧客Web"),
    CiaSystem("accounting", "会計・経理システム", "会計"),
    CiaSystem("hr", "人事・給与システム", "人事"),
    CiaSystem("dev", "開発・CI 環境", "開発"),
)

private val CiaIncidents = listOf(
    CiaIncident(
        "leak", "情報漏えい（顧客DBの露出）",
        "顧客DBの設定不備により、外部から氏名・連絡先・購入履歴を取得できる状態だった。",
        mapOf(
            "customer" to CiaImpact(3, 0, 0, "顧客の氏名・連絡先・購入履歴が外部から取得可能になった。Web機能は稼働しており、改ざんや停止は生じていない。"),
            "accounting" to CiaImpact(3, 0, 0, "取引先の請求情報や口座情報が漏れると、振込先のすり替えや信用低下に直結する。データの正確性自体は保たれている。"),
            "hr" to CiaImpact(3, 0, 0, "従業員の氏名・連絡先・給与情報は機密性が高い。人事情報の漏えいは採用や労務対応にも影響する。"),
            "dev" to CiaImpact(2, 0, 0, "ソースコードや設計書の漏えいは知的財産の喪失であり、脆弱性の探索に再利用される二次リスクがある。"),
        ),
    ),
    CiaIncident(
        "tamper", "データ改ざん（Web・DB）",
        "入力検証の不備を突かれ、商品説明と注文データの一部が書き換えられた。",
        mapOf(
            "customer" to CiaImpact(0, 3, 2, "商品説明や注文データが書き換えられ、誤った情報の表示や注文処理が発生した。復旧のため一部機能を止める可能性がある。"),
            "accounting" to CiaImpact(0, 3, 1, "仕訳や請求金額の改ざんは決算・税務申告の信頼性を損なう。正しい金額の再計算に時間を要する。"),
            "hr" to CiaImpact(0, 3, 1, "勤怠や給与計算の基礎データが変わると支給額に影響する。改ざん範囲の特定と再計算が必要になる。"),
            "dev" to CiaImpact(0, 3, 2, "ソースコードやビルド成果物の改ざんはサプライチェーン攻撃に発展する。リリースを止めて整合性を確認する必要がある。"),
        ),
    ),
    CiaIncident(
        "ddos", "DDoS（サービス停止）",
        "大量の偽リクエストで公開サービスが応答不能になった。",
        mapOf(
            "customer" to CiaImpact(0, 0, 3, "大量の偽リクエストでWebが応答不能になり、購入や問い合わせができない。データの漏えいや改ざんは生じていない。"),
            "accounting" to CiaImpact(0, 0, 2, "会計システムが外部公開されている場合、締め処理や請求書発行が遅延する。業務は手作業で一部継続できる。"),
            "hr" to CiaImpact(0, 0, 2, "給与振込や勤怠締めの処理が遅延し、従業員への支払に影響する。データ自体は保持されている。"),
            "dev" to CiaImpact(0, 0, 2, "CI/CDやパッケージレジストリが停止すると、開発とリリースが止まる。ソースの完全性は保たれる。"),
        ),
    ),
    CiaIncident(
        "misdelivery", "メール誤送信",
        "担当者が添付ファイルの宛先を誤り、社外の第三者にメールを送信した。",
        mapOf(
            "customer" to CiaImpact(2, 0, 0, "キャンペーン資料や顧客リストを誤った宛先に送ると、個人情報の漏えいになる。宛先への削除依頼と報告判断が必要である。"),
            "accounting" to CiaImpact(3, 0, 0, "請求書や口座情報の誤送信は、振込先のすり替えに悪用され得る。金額や取引内容の正確性は変わらない。"),
            "hr" to CiaImpact(3, 0, 0, "給与明細や人事評価の誤送信は機密性の侵害である。本人への説明と再発防止が求められる。"),
            "dev" to CiaImpact(2, 0, 0, "設計書やAPIキーの誤送信は不正アクセスの入口になる。漏えいした認証情報の無効化・再発行が必要である。"),
        ),
    ),
    CiaIncident(
        "ransomware", "ランサムウェア（暗号化）",
        "端末経由でランサムウェアに感染し、共有ファイルが暗号化された。",
        mapOf(
            "customer" to CiaImpact(2, 2, 3, "Webサーバ上のファイルが暗号化されてサービスが停止する。窃取データの公開を脅迫された場合は機密性も損なわれる。"),
            "accounting" to CiaImpact(2, 3, 3, "帳簿や請求データが暗号化され、復旧まで決算・入金確認が止まる。バックアップの完全性も確認が必要である。"),
            "hr" to CiaImpact(2, 3, 3, "給与データが暗号化され、支払いや社会保険手続に支障が出る。復旧後にデータの正確性を検証する必要がある。"),
            "dev" to CiaImpact(2, 3, 3, "ソースコードとビルド環境が暗号化され、復旧まで開発・リリースが停止する。バックアップからの復元と改ざん確認が必要である。"),
        ),
    ),
)

private class CiaTrait(val label: String, val short: String, val hint: String, val colorIndex: Int, val level: (CiaImpact) -> Int)

private val CiaTraits = listOf(
    CiaTrait("機密性", "C", "許可された人だけが見られる", 0) { it.c },
    CiaTrait("完全性", "I", "正確で改ざんされていない", 1) { it.i },
    CiaTrait("可用性", "A", "必要なときに使える", 2) { it.a },
)

/** Same lenient prop reader as the web's stringProp(): only non-blank strings count. */
private fun ciaStringProp(props: JsonObject?, key: String, fallback: String): String {
    val p = props?.get(key) as? JsonPrimitive ?: return fallback
    return if (p.isString && p.content.isNotBlank()) p.content else fallback
}

// ---------------------------------------------------------------------------
// Widget
// ---------------------------------------------------------------------------

@Composable
fun CiaImpactWidget(props: JsonObject?) {
    val initialIncident = ciaStringProp(props, "incident", "leak").let { c -> CiaIncidents.firstOrNull { it.id == c }?.id ?: "leak" }
    val initialSystem = ciaStringProp(props, "system", "customer").let { c -> CiaSystems.firstOrNull { it.id == c }?.id ?: "customer" }
    var incidentId by rememberSaveable { mutableStateOf(initialIncident) }
    var systemId by rememberSaveable { mutableStateOf(initialSystem) }

    val incident = CiaIncidents.firstOrNull { it.id == incidentId } ?: CiaIncidents[0]
    val system = CiaSystems.firstOrNull { it.id == systemId } ?: CiaSystems[0]
    val impact = incident.impacts.getValue(system.id)
    val levels = CiaTraits.map { it.level(impact) }
    val maxLevel = levels.max()
    val leaders = CiaTraits.filterIndexed { i, _ -> levels[i] == maxLevel }.map { it.label }

    // Text without an explicit colour must follow the theme (dark mode), not Material's default black.
    CompositionLocalProvider(LocalContentColor provides Sg.colors.foreground) {
    SgCard {
        Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
            Text("同じ事故でも、システムで影響は変わる", style = MaterialTheme.typography.titleSmall)

            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text("発生したインシデント", style = MaterialTheme.typography.labelMedium)
                FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    CiaIncidents.forEach { entry ->
                        ChoiceChip(entry.label, selected = entry.id == incident.id, onClick = { incidentId = entry.id })
                    }
                }
            }
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text("影響を受けるシステム", style = MaterialTheme.typography.labelMedium)
                FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    CiaSystems.forEach { entry ->
                        ChoiceChip(entry.short, selected = entry.id == system.id, onClick = { systemId = entry.id })
                    }
                }
            }

            Text(incident.description, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground)

            Column(
                Modifier.fillMaxWidth().clip(RoundedCornerShape(12.dp)).background(Sg.colors.muted)
                    .border(BorderStroke(1.dp, Sg.colors.border), RoundedCornerShape(12.dp)).padding(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                Text(system.label, style = MaterialTheme.typography.titleSmall)
                Badge(incident.label)

                CiaTraits.forEachIndexed { i, trait ->
                    CiaImpactBar(trait, levels[i])
                }

                Text(
                    buildAnnotatedString {
                        withStyle(SpanStyle(fontWeight = FontWeight.Bold)) {
                            append(
                                if (maxLevel == 0) "CIA への影響は想定されない。"
                                else "最も影響が大きいのは${leaders.joinToString("・")}（${CiaLevelLabels[maxLevel]}）。",
                            )
                        }
                        append(impact.note)
                    },
                    style = MaterialTheme.typography.bodyMedium,
                    modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(8.dp)).background(Sg.colors.card).padding(horizontal = 10.dp, vertical = 8.dp),
                )
            }

            Text(
                "数値は学習用の整理であり、実際の影響は情報資産の分類・規模・代替手段・法的義務で変わる。同じ「漏えい」でも、顧客データを扱うWebと開発環境では重みが異なる。",
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(10.dp)).background(Sg.colors.muted)
                    .border(BorderStroke(1.dp, Sg.colors.border), RoundedCornerShape(10.dp)).padding(horizontal = 12.dp, vertical = 10.dp),
            )
        }
    }
    }
}

// ---------------------------------------------------------------------------
// Private building blocks
// ---------------------------------------------------------------------------

@Composable
private fun CiaImpactBar(trait: CiaTrait, level: Int) {
    val color: Color = Sg.colors.chart[trait.colorIndex]
    val fraction by animateFloatAsState(level / 3f, label = "ciaBar")
    val summary = "${CiaLevelLabels[level]}（$level/3）"
    Column(Modifier.semantics { contentDescription = "${trait.label}への影響: $summary" }) {
        Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.Top) {
            Text(
                buildAnnotatedString {
                    withStyle(SpanStyle(fontFamily = FontFamily.Monospace, color = Sg.colors.mutedForeground)) { append("${trait.short} ") }
                    withStyle(SpanStyle(fontWeight = FontWeight.SemiBold)) { append(trait.label) }
                },
                style = MaterialTheme.typography.bodyMedium, modifier = Modifier.weight(1f),
            )
            Text(summary, style = MaterialTheme.typography.bodyMedium.copy(fontFamily = FontFamily.Monospace), color = Sg.colors.mutedForeground)
        }
        Text(trait.hint, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
        Box(Modifier.padding(top = 6.dp).fillMaxWidth().height(10.dp).clip(RoundedCornerShape(5.dp)).background(Sg.colors.border)) {
            Box(Modifier.fillMaxHeight().fillMaxWidth(fraction).clip(RoundedCornerShape(5.dp)).background(color))
        }
    }
}
