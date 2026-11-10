package app.sgstudy.ui.widgets

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import app.sgstudy.ui.components.SgCard
import app.sgstudy.ui.components.Tone
import app.sgstudy.ui.components.color
import app.sgstudy.ui.components.container
import app.sgstudy.ui.theme.Sg
import kotlinx.serialization.json.JsonObject

// ---------------------------------------------------------------------------
// Logic (port of src/components/widgets/access-matrix.tsx)
// ---------------------------------------------------------------------------

private class AmRole(val id: String, val label: String, val note: String)
private class AmResource(val id: String, val label: String, val note: String)

// 指定された5つの主体（営業・人事・経理・管理者・委託先）を役割、
// 保護対象の3区分を資源として扱う。委託先×顧客データの違反を検出できる。
private val AmRoles = listOf(
    AmRole("sales", "営業", "顧客対応・提案"),
    AmRole("hr", "人事", "採用・評価・給与"),
    AmRole("finance", "経理", "請求・支払・決算"),
    AmRole("admin", "システム管理者", "アカウント・端末管理"),
    AmRole("contractor", "外部委託先", "業務範囲は契約で限定"),
)

private val AmResources = listOf(
    AmResource("customer", "顧客データ", "氏名・連絡先・購買履歴"),
    AmResource("employee", "人事・給与", "評価・給与・勤怠"),
    AmResource("finance", "財務・請求", "口座・請求・支払"),
)

private val AmAllowed: Map<String, List<String>> = mapOf(
    "sales" to listOf("customer"),
    "hr" to listOf("employee"),
    "finance" to listOf("finance"),
    "admin" to emptyList(),
    "contractor" to emptyList(),
)

private class AmViolation(val role: AmRole, val resource: AmResource, val severityHigh: Boolean, val reason: String) {
    val severity: String get() = if (severityHigh) "高" else "中"
}

private fun amViolationFor(role: AmRole, resource: AmResource): AmViolation? {
    if (AmAllowed.getValue(role.id).contains(resource.id)) return null

    if (role.id == "contractor") {
        val scope = if (resource.id == "customer") {
            "顧客データは特に、委託先の作業に必要なレコード・項目だけに限定し、多要素認証と操作ログを必須にする。"
        } else {
            "必要なレコード・期間だけに限定し、多要素認証と操作ログを必須にする。"
        }
        return AmViolation(
            role, resource, true,
            "${resource.label}を外部委託先に付与している。委託契約の作業範囲を超える権限は最小権限違反である。$scope",
        )
    }

    if (role.id == "admin") {
        return AmViolation(
            role, resource, false,
            "システム管理者が${resource.label}を常時閲覧できる。システム管理権限と業務データの閲覧を分離しないと、特権の悪用や誤操作を検知しにくい。保守時は都度承認と記録を行う。",
        )
    }

    val reason = when {
        role.id == "finance" && resource.id == "employee" ->
            "経理が人事・給与データを閲覧できる。給与計算と支払の職務分離が崩れ、支給額の改ざん余地が生まれる。"
        role.id == "sales" && resource.id == "employee" ->
            "営業が人事・給与データを閲覧できる。評価・給与情報は業務上の必要がなく、職務分掌違反となる。"
        role.id == "sales" && resource.id == "finance" ->
            "営業が財務・請求データを閲覧できる。与信・請求情報は営業の成果と分離し、必要項目だけを参照させる。"
        role.id == "hr" && resource.id == "customer" ->
            "人事が顧客データを閲覧できる。採用・評価の業務に顧客の個人情報は通常不要であり、必要性を説明できない。"
        role.id == "hr" && resource.id == "finance" ->
            "人事が財務データを閲覧できる。給与振込や経費の処理に人事が関与すると、不正の機会が広がる。"
        role.id == "finance" && resource.id == "customer" ->
            "経理が顧客データ全体を閲覧できる。請求に必要な項目だけに限定し、購買履歴や連絡先まで見せない。"
        else -> "この役割に${resource.label}の閲覧権限を与える業務上の必要性が確認できない。"
    }
    return AmViolation(role, resource, false, reason)
}

private fun amKey(roleId: String, resourceId: String) = "$roleId:$resourceId"

// ---------------------------------------------------------------------------
// UI
// ---------------------------------------------------------------------------

// Table geometry: role column + three resource columns. Total ≈ 340dp so it fits most
// phones; narrower screens scroll horizontally.
private val AmRoleColWidth = 92.dp
private val AmResourceColWidth = 84.dp
private val AmCellHeight = 52.dp

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun AccessMatrixWidget(props: JsonObject?) {
    // Selected "role:resource" keys.
    var selectedRaw by rememberSaveable { mutableStateOf("") }
    val selected: Set<String> = if (selectedRaw.isEmpty()) emptySet() else selectedRaw.split(",").toSet()
    fun setSelected(next: Set<String>) { selectedRaw = next.joinToString(",") }

    // Grants ordered by role then resource, as in the web UI.
    val grants = AmRoles.flatMap { role -> AmResources.map { role to it } }.filter { (r, c) -> amKey(r.id, c.id) in selected }
    val violations = grants.mapNotNull { (role, resource) -> amViolationFor(role, resource) }
    val violationKeys = violations.map { amKey(it.role.id, it.resource.id) }.toSet()
    val allowedCount = grants.size - violations.size

    SgCard {
        CompositionLocalProvider(LocalContentColor provides Sg.colors.foreground) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                "役割 × データの権限を点検する",
                style = MaterialTheme.typography.titleSmall,
                modifier = Modifier.weight(1f),
            )
            TextButton(onClick = { setSelected(emptySet()) }, modifier = Modifier.heightIn(min = 48.dp)) {
                Icon(Icons.Filled.Refresh, null, Modifier.size(18.dp), tint = Sg.colors.mutedForeground)
                Spacer(Modifier.width(4.dp))
                Text("全解除", style = MaterialTheme.typography.labelMedium, color = Sg.colors.mutedForeground)
            }
        }

        Text(
            "5つの役割に、3種類のデータへの閲覧権限を与える。チェックした組合せを「最小権限の原則」と職務分離の観点で判定する。ここでは常時付与する権限を点検し、作業単位・期間単位の一時付与は別に設計する。",
            style = MaterialTheme.typography.bodyMedium,
            color = Sg.colors.mutedForeground,
            modifier = Modifier.padding(top = 4.dp, bottom = 12.dp),
        )

        // The matrix.
        val tableShape = RoundedCornerShape(10.dp)
        Column(
            Modifier.fillMaxWidth().clip(tableShape).border(BorderStroke(1.dp, Sg.colors.border), tableShape)
                .horizontalScroll(rememberScrollState()),
        ) {
            Row(Modifier.height(IntrinsicSize.Min)) {
                AmHeaderCell("役割", null, AmRoleColWidth, Alignment.CenterStart)
                AmResources.forEach { AmHeaderCell(it.label, it.note, AmResourceColWidth, Alignment.Center) }
            }
            AmRoles.forEach { role ->
                Row(Modifier.height(IntrinsicSize.Min)) {
                    Column(
                        Modifier.width(AmRoleColWidth).fillMaxHeight().heightIn(min = AmCellHeight)
                            .border(BorderStroke(0.5.dp, Sg.colors.border)).padding(horizontal = 8.dp, vertical = 6.dp),
                        verticalArrangement = Arrangement.Center,
                    ) {
                        Text(role.label, style = MaterialTheme.typography.labelLarge)
                        Text(role.note, style = MaterialTheme.typography.labelSmall, color = Sg.colors.mutedForeground)
                    }
                    AmResources.forEach { resource ->
                        val key = amKey(role.id, resource.id)
                        val checked = key in selected
                        val isViolation = key in violationKeys
                        val bg: Color = when {
                            !checked -> Color.Transparent
                            isViolation -> Tone.Danger.container()
                            else -> Tone.Success.container()
                        }
                        Box(
                            Modifier.width(AmResourceColWidth).fillMaxHeight().heightIn(min = AmCellHeight)
                                .background(bg)
                                .border(BorderStroke(0.5.dp, Sg.colors.border))
                                .semantics(mergeDescendants = true) { contentDescription = "${role.label}の${resource.label}閲覧権限" }
                                .clickable(role = Role.Checkbox) {
                                    setSelected(if (checked) selected - key else selected + key)
                                },
                            contentAlignment = Alignment.Center,
                        ) {
                            Checkbox(
                                checked = checked, onCheckedChange = null,
                                colors = CheckboxDefaults.colors(
                                    checkedColor = if (isViolation) Sg.colors.destructive else Sg.colors.chart[1],
                                    uncheckedColor = Sg.colors.mutedForeground, checkmarkColor = Sg.colors.card,
                                ),
                            )
                        }
                    }
                }
            }
        }

        // Counters.
        FlowRow(
            Modifier.padding(top = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            AmChip("付与 ${grants.size} 件", Sg.colors.mutedForeground, false)
            AmChip("適正 $allowedCount", Sg.colors.successForeground, true)
            AmChip("違反 ${violations.size}", Sg.colors.destructiveForeground, true)
        }
        Text(
            "推奨ベースライン: 営業=顧客／人事=人事・給与／経理=財務・請求／システム管理者・委託先=なし",
            style = MaterialTheme.typography.bodySmall,
            color = Sg.colors.mutedForeground,
            modifier = Modifier.padding(top = 6.dp),
        )

        // Verdicts.
        Column(Modifier.padding(top = 12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            when {
                grants.isEmpty() -> AmBox(Sg.colors.muted, Sg.colors.border) {
                    Text(
                        "まだ権限を付与していない。チェックを付けると、その組合せの適否と理由を表示する。",
                        style = MaterialTheme.typography.bodyMedium,
                    )
                }
                violations.isEmpty() -> AmBox(Tone.Success.container(), Sg.colors.successForeground.copy(alpha = 0.35f)) {
                    Row(verticalAlignment = Alignment.Top) {
                        Icon(Icons.Filled.CheckCircle, null, Modifier.padding(top = 3.dp).size(18.dp), tint = Sg.colors.successForeground)
                        Spacer(Modifier.width(8.dp))
                        Text(
                            "付与した権限はすべて推奨ベースライン内である。不要になった権限は定期的に棚卸しする。",
                            style = MaterialTheme.typography.bodyMedium, color = Sg.colors.successForeground, fontWeight = FontWeight.SemiBold,
                        )
                    }
                }
                else -> {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Filled.Warning, null, Modifier.size(20.dp), tint = Sg.colors.destructiveForeground)
                        Spacer(Modifier.width(6.dp))
                        Text(
                            "${violations.size} 件の最小権限違反",
                            style = MaterialTheme.typography.titleSmall, color = Sg.colors.destructiveForeground,
                        )
                    }
                    violations.forEach { v ->
                        val tint = if (v.severityHigh) Sg.colors.destructiveForeground else Sg.colors.warningForeground
                        AmBox(Sg.colors.muted, Sg.colors.border) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                AmChip("重大度 ${v.severity}", tint, true)
                                Text(
                                    "${v.role.label} × ${v.resource.label}",
                                    style = MaterialTheme.typography.labelLarge, modifier = Modifier.weight(1f),
                                )
                            }
                            Text(
                                v.reason, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground,
                                modifier = Modifier.padding(top = 6.dp),
                            )
                        }
                    }
                }
            }
        }

        Text(
            "外部委託先には、自社の従業員と同じ権限を与えない。委託先のアカウントは作業単位・期間単位で発行し、契約終了時に確実に失効させる。システム管理者には業務データの閲覧ではなく、アカウント管理に必要な権限だけを与える。",
            style = MaterialTheme.typography.bodySmall,
            color = Sg.colors.mutedForeground,
            modifier = Modifier.padding(top = 12.dp),
        )
        }
    }
}

@Composable
private fun AmHeaderCell(title: String, note: String?, width: androidx.compose.ui.unit.Dp, align: Alignment) {
    Box(
        Modifier.width(width).fillMaxHeight().heightIn(min = 64.dp).background(Sg.colors.muted)
            .border(BorderStroke(0.5.dp, Sg.colors.border)).padding(horizontal = 4.dp, vertical = 6.dp),
        contentAlignment = align,
    ) {
        Column(horizontalAlignment = if (note == null) Alignment.Start else Alignment.CenterHorizontally) {
            Text(title, style = MaterialTheme.typography.labelMedium, fontWeight = FontWeight.Bold, textAlign = if (note == null) TextAlign.Start else TextAlign.Center)
            if (note != null) {
                Text(
                    note, style = MaterialTheme.typography.labelSmall, color = Sg.colors.mutedForeground,
                    textAlign = TextAlign.Center,
                )
            }
        }
    }
}

@Composable
private fun AmChip(text: String, color: Color, emphasized: Boolean) {
    val shape = RoundedCornerShape(8.dp)
    Text(
        text,
        modifier = Modifier.clip(shape).border(BorderStroke(1.dp, if (emphasized) color else Sg.colors.border), shape)
            .padding(horizontal = 10.dp, vertical = 4.dp),
        style = MaterialTheme.typography.labelMedium,
        color = if (emphasized) color else Sg.colors.mutedForeground,
    )
}

@Composable
private fun AmBox(container: Color, border: Color, content: @Composable () -> Unit) {
    val shape = RoundedCornerShape(10.dp)
    Column(
        Modifier.fillMaxWidth().clip(shape).background(container).border(BorderStroke(1.dp, border), shape).padding(12.dp),
    ) { content() }
}
