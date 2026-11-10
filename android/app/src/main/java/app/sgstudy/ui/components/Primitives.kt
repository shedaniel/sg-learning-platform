package app.sgstudy.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import app.sgstudy.ui.theme.Sg

/** Horizontal screen gutter used everywhere. */
val ScreenPadding = 16.dp

enum class Tone { Neutral, Info, Success, Warning, Danger }

@Composable
fun Tone.color(): Color = when (this) {
    Tone.Neutral -> Sg.colors.mutedForeground
    Tone.Info -> Sg.colors.infoForeground
    Tone.Success -> Sg.colors.successForeground
    Tone.Warning -> Sg.colors.warningForeground
    Tone.Danger -> Sg.colors.destructiveForeground
}

@Composable
fun Tone.container(): Color = when (this) {
    Tone.Neutral -> Sg.colors.muted
    Tone.Info -> Sg.colors.info.copy(alpha = 0.10f)
    Tone.Success -> Sg.colors.success.copy(alpha = 0.10f)
    Tone.Warning -> Sg.colors.warning.copy(alpha = 0.12f)
    Tone.Danger -> Sg.colors.destructive.copy(alpha = 0.10f)
}

/**
 * Standard screen: top app bar (back arrow when [onBack] != null) + content slot.
 * The content gets the inner padding; use [ScrollScreen] for a simple scrolling column.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ScreenFrame(
    title: String,
    onBack: (() -> Unit)? = null,
    actions: @Composable RowScope.() -> Unit = {},
    content: @Composable (PaddingValues) -> Unit,
) {
    Scaffold(
        containerColor = Sg.colors.background,
        contentWindowInsets = WindowInsets(0),
        topBar = {
            TopAppBar(
                title = { Text(title, style = MaterialTheme.typography.titleLarge, maxLines = 1, overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis) },
                navigationIcon = {
                    if (onBack != null) IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "戻る")
                    }
                },
                actions = actions,
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Sg.colors.background, scrolledContainerColor = Sg.colors.background),
            )
        },
        content = content,
    )
}

/** [ScreenFrame] whose body is a vertically scrolling column with standard padding and 16dp spacing. */
@Composable
fun ScrollScreen(
    title: String,
    onBack: (() -> Unit)? = null,
    actions: @Composable RowScope.() -> Unit = {},
    content: @Composable ColumnScope.() -> Unit,
) {
    ScreenFrame(title, onBack, actions) { padding ->
        Column(
            Modifier.padding(padding).fillMaxSize().verticalScroll(rememberScrollState())
                .padding(horizontal = ScreenPadding).padding(top = 4.dp, bottom = 32.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            content = content,
        )
    }
}

/** Flat bordered card (no shadow), 14dp radius. Clickable when [onClick] is given. */
@Composable
fun SgCard(
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null,
    contentPadding: Dp = 16.dp,
    container: Color = Sg.colors.card,
    borderColor: Color = Sg.colors.border,
    content: @Composable ColumnScope.() -> Unit,
) {
    val shape = RoundedCornerShape(14.dp)
    val base = modifier.fillMaxWidth().clip(shape).background(container, shape).border(BorderStroke(1.dp, borderColor), shape)
    Column(
        (if (onClick != null) base.clickable(onClick = onClick) else base).padding(contentPadding),
        content = content,
    )
}

@Composable
fun Badge(text: String, tone: Tone = Tone.Neutral, modifier: Modifier = Modifier) {
    Text(
        text,
        modifier = modifier.clip(RoundedCornerShape(6.dp)).background(tone.container()).padding(horizontal = 8.dp, vertical = 2.dp),
        style = MaterialTheme.typography.labelMedium,
        color = tone.color(),
    )
}

@Composable
fun SectionTitle(text: String, modifier: Modifier = Modifier, action: (@Composable () -> Unit)? = null) {
    Row(modifier.fillMaxWidth().padding(top = 8.dp), verticalAlignment = Alignment.CenterVertically) {
        Text(text, style = MaterialTheme.typography.titleLarge, modifier = Modifier.weight(1f))
        action?.invoke()
    }
}

@Composable
fun SgProgressBar(fraction: Float, modifier: Modifier = Modifier, color: Color = Sg.colors.info, height: Dp = 6.dp) {
    Box(modifier.fillMaxWidth().height(height).clip(RoundedCornerShape(height)).background(Sg.colors.muted)) {
        Box(Modifier.fillMaxHeight().fillMaxWidth(fraction.coerceIn(0f, 1f)).clip(RoundedCornerShape(height)).background(color))
    }
}

@Composable
fun PrimaryButton(text: String, onClick: () -> Unit, modifier: Modifier = Modifier, enabled: Boolean = true, icon: ImageVector? = null) {
    Button(
        onClick = onClick, enabled = enabled, modifier = modifier.heightIn(min = 48.dp), shape = RoundedCornerShape(10.dp),
        colors = ButtonDefaults.buttonColors(containerColor = Sg.colors.primary, contentColor = Sg.colors.onPrimary),
    ) {
        if (icon != null) { Icon(icon, null, Modifier.size(18.dp)); Spacer(Modifier.width(8.dp)) }
        Text(text, style = MaterialTheme.typography.labelLarge)
    }
}

@Composable
fun SecondaryButton(text: String, onClick: () -> Unit, modifier: Modifier = Modifier, enabled: Boolean = true, icon: ImageVector? = null) {
    OutlinedButton(
        onClick = onClick, enabled = enabled, modifier = modifier.heightIn(min = 48.dp), shape = RoundedCornerShape(10.dp),
        border = BorderStroke(1.dp, Sg.colors.input),
        colors = ButtonDefaults.outlinedButtonColors(contentColor = Sg.colors.foreground),
    ) {
        if (icon != null) { Icon(icon, null, Modifier.size(18.dp)); Spacer(Modifier.width(8.dp)) }
        Text(text, style = MaterialTheme.typography.labelLarge)
    }
}

/** Selectable pill used for filters (part, difficulty, count...). */
@Composable
fun ChoiceChip(label: String, selected: Boolean, onClick: () -> Unit, modifier: Modifier = Modifier) {
    FilterChip(
        selected = selected, onClick = onClick, modifier = modifier,
        label = { Text(label, style = MaterialTheme.typography.labelLarge) },
        shape = RoundedCornerShape(10.dp),
        colors = FilterChipDefaults.filterChipColors(
            selectedContainerColor = Sg.colors.info.copy(alpha = 0.12f), selectedLabelColor = Sg.colors.infoForeground,
            labelColor = Sg.colors.foreground,
        ),
        border = FilterChipDefaults.filterChipBorder(
            enabled = true, selected = selected, borderColor = Sg.colors.input, selectedBorderColor = Sg.colors.info.copy(alpha = 0.5f),
        ),
    )
}

@Composable
fun StatTile(label: String, value: String, modifier: Modifier = Modifier, tone: Tone = Tone.Neutral, sub: String? = null) {
    SgCard(modifier, contentPadding = 14.dp) {
        Text(label, style = MaterialTheme.typography.labelMedium, color = Sg.colors.mutedForeground)
        Text(
            value, style = MaterialTheme.typography.headlineSmall.copy(fontFamily = FontFamily.Monospace, fontWeight = FontWeight.SemiBold),
            color = if (tone == Tone.Neutral) Sg.colors.foreground else tone.color(),
        )
        if (sub != null) Text(sub, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
    }
}

@Composable
fun EmptyState(title: String, description: String? = null, modifier: Modifier = Modifier, action: (@Composable () -> Unit)? = null) {
    Column(modifier.fillMaxWidth().padding(vertical = 32.dp, horizontal = 16.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(title, style = MaterialTheme.typography.titleMedium, textAlign = TextAlign.Center)
        if (description != null) Text(description, style = MaterialTheme.typography.bodyMedium, color = Sg.colors.mutedForeground, textAlign = TextAlign.Center)
        action?.invoke()
    }
}

@Composable
fun Divider(modifier: Modifier = Modifier) {
    Box(modifier.fillMaxWidth().height(1.dp).background(Sg.colors.border))
}

/** A tappable list row: title, optional subtitle and trailing content. Used for lesson/term/question lists. */
@Composable
fun ListRow(
    title: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    leading: (@Composable () -> Unit)? = null,
    trailing: (@Composable () -> Unit)? = null,
    onClick: (() -> Unit)? = null,
) {
    Row(
        (if (onClick != null) modifier.clickable(onClick = onClick) else modifier).fillMaxWidth().padding(vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        leading?.invoke()
        Column(Modifier.weight(1f)) {
            Text(title, style = MaterialTheme.typography.titleSmall)
            if (subtitle != null) Text(subtitle, style = MaterialTheme.typography.bodySmall, color = Sg.colors.mutedForeground)
        }
        trailing?.invoke()
    }
}
