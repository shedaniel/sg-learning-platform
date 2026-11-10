package app.sgstudy.ui.widgets

import androidx.compose.runtime.Composable
import app.sgstudy.data.model.InteractiveBlock

/** Maps WidgetId (see InteractiveBlock.widget) to its composable. Each widget lives in its own file. */
@Composable
fun WidgetHost(block: InteractiveBlock) {
    when (block.widget) {
        "risk-matrix" -> RiskMatrixWidget(block.props)
        "backup-planner" -> BackupPlannerWidget(block.props)
        "access-matrix" -> AccessMatrixWidget(block.props)
        "hash-demo" -> HashDemoWidget(block.props)
        "incident-triage" -> IncidentTriageWidget(block.props)
        "control-matcher" -> ControlMatcherWidget(block.props)
        "cia-impact" -> CiaImpactWidget(block.props)
        "subnet-calculator" -> SubnetCalculatorWidget(block.props)
    }
}
