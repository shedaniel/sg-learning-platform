package app.sgstudy.ui.more

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import app.sgstudy.ui.components.*
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.theme.Sg

@Composable
fun MoreScreen(nav: Navigator) {
    ScrollScreen("その他") {
        SgCard(contentPadding = 4.dp) {
            Entry(Icons.Filled.Timer, "模擬試験", "60問・120分の本番形式", nav::openMock)
            Divider(Modifier.padding(horizontal = 12.dp))
            Entry(Icons.Filled.Description, "過去問", "IPA公開問題 2023〜2026", nav::openPastPapers)
            Divider(Modifier.padding(horizontal = 12.dp))
            Entry(Icons.Filled.LibraryBooks, "用語集", "363語", nav::openGlossary)
            Divider(Modifier.padding(horizontal = 12.dp))
            Entry(Icons.Filled.Search, "検索", "レッスン・用語・問題を横断検索", nav::openSearch)
        }
        SgCard(contentPadding = 4.dp) {
            Entry(Icons.Filled.BarChart, "統計", "正答率・学習履歴・分野別の習熟度", nav::openStatistics)
            Divider(Modifier.padding(horizontal = 12.dp))
            Entry(Icons.Filled.TrackChanges, "シラバス対応", "Ver.4.1 の全51項目との対応", nav::openCoverage)
            Divider(Modifier.padding(horizontal = 12.dp))
            Entry(Icons.Filled.Settings, "設定", "表示・バックアップ・リセット", nav::openSettings)
        }
    }
}

@Composable
private fun Entry(icon: ImageVector, title: String, subtitle: String, onClick: () -> Unit) {
    ListRow(
        title = title, subtitle = subtitle, onClick = onClick, modifier = Modifier.padding(horizontal = 12.dp),
        leading = { Icon(icon, null, tint = Sg.colors.mutedForeground, modifier = Modifier.size(22.dp)) },
        trailing = { Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, null, tint = Sg.colors.mutedForeground) },
    )
}
