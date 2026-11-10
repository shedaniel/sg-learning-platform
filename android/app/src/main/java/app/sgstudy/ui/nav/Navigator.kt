package app.sgstudy.ui.nav

import android.net.Uri
import androidx.navigation.NavHostController
import app.sgstudy.AppContainer
import app.sgstudy.logic.QuizConfig

object Route {
    const val Dashboard = "dashboard"
    const val Learn = "learn"
    const val Practice = "practice"
    const val Review = "review"
    const val More = "more"

    const val Area = "area?id={id}"
    const val Lesson = "lesson?id={id}"
    const val Quiz = "quiz"
    const val Question = "question?id={id}"
    const val Mock = "mock"
    const val MockRun = "mock/run?id={id}"
    const val MockResult = "mock/result?id={id}"
    const val PastPapers = "papers"
    const val PastPaper = "papers/{year}"
    const val Glossary = "glossary"
    const val Term = "term?id={id}"
    const val Search = "search"
    const val Statistics = "statistics"
    const val Coverage = "coverage"
    const val Settings = "settings"

    val topLevel = listOf(Dashboard, Learn, Practice, Review, More)
}

/** Every screen navigates through this; do not use NavController directly in screens. */
class Navigator(private val controller: NavHostController, private val app: AppContainer) {
    fun back() { controller.popBackStack() }

    private fun go(route: String) { controller.navigate(route) { launchSingleTop = true } }
    private fun goTab(route: String) {
        controller.navigate(route) {
            popUpTo(Route.Dashboard) { saveState = true }
            launchSingleTop = true
            restoreState = true
        }
    }

    fun openDashboard() = goTab(Route.Dashboard)
    fun openLearn() = goTab(Route.Learn)
    fun openPractice() = goTab(Route.Practice)
    fun openReview() = goTab(Route.Review)
    fun openMore() = goTab(Route.More)

    fun openArea(areaId: String) = go("area?id=${Uri.encode(areaId)}")
    /** Lesson ids look like "security/cia-and-design". */
    fun openLesson(lessonId: String) = go("lesson?id=${Uri.encode(lessonId)}")
    fun openQuestion(questionId: String) = go("question?id=${Uri.encode(questionId)}")

    /** Starts a quiz run (shows QuizScreen). The config picks questions, mode and feedback style. */
    fun startQuiz(config: QuizConfig) {
        app.pendingQuiz = config
        // a fresh run each time, even when one is already on the stack
        controller.navigate(Route.Quiz)
    }

    fun openMock() = go(Route.Mock)
    fun openMockRun(mockId: String) = go("mock/run?id=${Uri.encode(mockId)}")
    /** Replaces the run screen with the results so Back goes to the mock home. */
    fun openMockResult(mockId: String, replaceCurrent: Boolean = false) {
        controller.navigate("mock/result?id=${Uri.encode(mockId)}") {
            launchSingleTop = true
            if (replaceCurrent) popUpTo(Route.Mock) { inclusive = false }
        }
    }

    fun openPastPapers() = go(Route.PastPapers)
    fun openPastPaper(year: Int) = go("papers/$year")
    fun openGlossary() = go(Route.Glossary)
    fun openTerm(termId: String) = go("term?id=${Uri.encode(termId)}")
    fun openSearch() = go(Route.Search)
    fun openStatistics() = go(Route.Statistics)
    fun openCoverage() = go(Route.Coverage)
    fun openSettings() = go(Route.Settings)
}
