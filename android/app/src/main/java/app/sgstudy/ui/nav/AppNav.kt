package app.sgstudy.ui.nav

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import app.sgstudy.LocalApp
import app.sgstudy.ui.coverage.CoverageScreen
import app.sgstudy.ui.dashboard.DashboardScreen
import app.sgstudy.ui.glossary.GlossaryScreen
import app.sgstudy.ui.glossary.TermScreen
import app.sgstudy.ui.learn.AreaScreen
import app.sgstudy.ui.learn.LearnScreen
import app.sgstudy.ui.learn.LessonScreen
import app.sgstudy.ui.mock.MockHomeScreen
import app.sgstudy.ui.mock.MockResultScreen
import app.sgstudy.ui.mock.MockRunScreen
import app.sgstudy.ui.more.MoreScreen
import app.sgstudy.ui.papers.PastPaperScreen
import app.sgstudy.ui.papers.PastPapersScreen
import app.sgstudy.ui.practice.PracticeScreen
import app.sgstudy.ui.practice.QuestionScreen
import app.sgstudy.ui.practice.QuizScreen
import app.sgstudy.ui.review.ReviewScreen
import app.sgstudy.ui.search.SearchScreen
import app.sgstudy.ui.settings.SettingsScreen
import app.sgstudy.ui.stats.StatisticsScreen
import app.sgstudy.ui.theme.Sg

private data class Tab(val route: String, val label: String, val icon: ImageVector, val selectedIcon: ImageVector)

private val tabs = listOf(
    Tab(Route.Dashboard, "概要", Icons.Outlined.Dashboard, Icons.Filled.Dashboard),
    Tab(Route.Learn, "学習", Icons.Outlined.MenuBook, Icons.Filled.MenuBook),
    Tab(Route.Practice, "演習", Icons.Outlined.Checklist, Icons.Filled.Checklist),
    Tab(Route.Review, "復習", Icons.Outlined.Replay, Icons.Filled.Replay),
    Tab(Route.More, "その他", Icons.Outlined.GridView, Icons.Filled.GridView),
)

private fun idArg() = listOf(navArgument("id") { type = NavType.StringType; defaultValue = "" })

@Composable
fun AppNav() {
    val app = LocalApp.current
    val controller = rememberNavController()
    val nav = remember(controller) { Navigator(controller, app) }
    val entry by controller.currentBackStackEntryAsState()
    val currentRoute = entry?.destination?.route
    val showBar = currentRoute in Route.topLevel

    Scaffold(
        containerColor = Sg.colors.background,
        contentWindowInsets = WindowInsets(0),
        bottomBar = {
            if (showBar) NavigationBar(containerColor = Sg.colors.background, tonalElevation = androidx.compose.ui.unit.Dp(0f)) {
                tabs.forEach { tab ->
                    val selected = currentRoute == tab.route
                    NavigationBarItem(
                        selected = selected,
                        onClick = { if (!selected) when (tab.route) {
                            Route.Dashboard -> nav.openDashboard(); Route.Learn -> nav.openLearn()
                            Route.Practice -> nav.openPractice(); Route.Review -> nav.openReview(); else -> nav.openMore()
                        } },
                        icon = { Icon(if (selected) tab.selectedIcon else tab.icon, contentDescription = tab.label) },
                        label = { Text(tab.label, style = MaterialTheme.typography.labelSmall) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Sg.colors.infoForeground, selectedTextColor = Sg.colors.infoForeground,
                            indicatorColor = Sg.colors.info.copy(alpha = 0.12f),
                            unselectedIconColor = Sg.colors.mutedForeground, unselectedTextColor = Sg.colors.mutedForeground,
                        ),
                    )
                }
            }
        },
    ) { padding ->
        Box(Modifier.fillMaxSize().padding(padding)) {
            NavHost(controller, startDestination = Route.Dashboard) {
                composable(Route.Dashboard) { DashboardScreen(nav) }
                composable(Route.Learn) { LearnScreen(nav) }
                composable(Route.Practice) { PracticeScreen(nav) }
                composable(Route.Review) { ReviewScreen(nav) }
                composable(Route.More) { MoreScreen(nav) }
                composable(Route.Area, idArg()) { AreaScreen(it.arguments?.getString("id").orEmpty(), nav) }
                composable(Route.Lesson, idArg()) { LessonScreen(it.arguments?.getString("id").orEmpty(), nav) }
                composable(Route.Quiz) { QuizScreen(nav) }
                composable(Route.Question, idArg()) { QuestionScreen(it.arguments?.getString("id").orEmpty(), nav) }
                composable(Route.Mock) { MockHomeScreen(nav) }
                composable(Route.MockRun, idArg()) { MockRunScreen(it.arguments?.getString("id").orEmpty(), nav) }
                composable(Route.MockResult, idArg()) { MockResultScreen(it.arguments?.getString("id").orEmpty(), nav) }
                composable(Route.PastPapers) { PastPapersScreen(nav) }
                composable(Route.PastPaper, listOf(navArgument("year") { type = NavType.IntType })) {
                    PastPaperScreen(it.arguments?.getInt("year") ?: 0, nav)
                }
                composable(Route.Glossary) { GlossaryScreen(nav) }
                composable(Route.Term, idArg()) { TermScreen(it.arguments?.getString("id").orEmpty(), nav) }
                composable(Route.Search) { SearchScreen(nav) }
                composable(Route.Statistics) { StatisticsScreen(nav) }
                composable(Route.Coverage) { CoverageScreen(nav) }
                composable(Route.Settings) { SettingsScreen(nav) }
            }
        }
    }
}

