package app.sgstudy.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.ColorScheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/** Design tokens mirrored from the web app (coss ui palette in src/app/globals.css). */
data class SgColors(
    val background: Color,
    val foreground: Color,
    val card: Color,
    val muted: Color,
    val mutedForeground: Color,
    val border: Color,
    val input: Color,
    val primary: Color,
    val onPrimary: Color,
    val info: Color,
    val infoForeground: Color,
    val success: Color,
    val successForeground: Color,
    val warning: Color,
    val warningForeground: Color,
    val destructive: Color,
    val destructiveForeground: Color,
    /** chart palette c1..c5 (area colours) */
    val chart: List<Color>,
    val isDark: Boolean,
) {
    /** Tinted background used for badges/callouts: the tone colour at ~10% over the surface. */
    fun tint(tone: Color, alpha: Float = 0.10f): Color = tone.copy(alpha = alpha)
}

val LightSgColors = SgColors(
    background = Color(0xFFFFFFFF),
    foreground = Color(0xFF262626),
    card = Color(0xFFFFFFFF),
    muted = Color(0xFFF5F5F5),
    mutedForeground = Color(0xFF676767),
    border = Color(0xFFEBEBEB),
    input = Color(0xFFE5E5E5),
    primary = Color(0xFF262626),
    onPrimary = Color(0xFFFAFAFA),
    info = Color(0xFF3B82F6),
    infoForeground = Color(0xFF1D4ED8),
    success = Color(0xFF10B981),
    successForeground = Color(0xFF047857),
    warning = Color(0xFFF59E0B),
    warningForeground = Color(0xFFB45309),
    destructive = Color(0xFFEF4444),
    destructiveForeground = Color(0xFFB91C1C),
    chart = listOf(Color(0xFFEA580C), Color(0xFF0D9488), Color(0xFF164E63), Color(0xFFFBBF24), Color(0xFFF59E0B), Color(0xFFF59E0B)),
    isDark = false,
)

val DarkSgColors = SgColors(
    background = Color(0xFF141414),
    foreground = Color(0xFFF5F5F5),
    card = Color(0xFF181818),
    muted = Color(0xFF212121),
    mutedForeground = Color(0xFF8C8C8C),
    border = Color(0xFF2A2A2A),
    input = Color(0xFF303030),
    primary = Color(0xFFF5F5F5),
    onPrimary = Color(0xFF262626),
    info = Color(0xFF3B82F6),
    infoForeground = Color(0xFF60A5FA),
    success = Color(0xFF10B981),
    successForeground = Color(0xFF34D399),
    warning = Color(0xFFF59E0B),
    warningForeground = Color(0xFFFBBF24),
    destructive = Color(0xFFF05252),
    destructiveForeground = Color(0xFFF87171),
    chart = listOf(Color(0xFF1D4ED8), Color(0xFF10B981), Color(0xFFF59E0B), Color(0xFFA855F7), Color(0xFFF43F5E), Color(0xFFF43F5E)),
    isDark = true,
)

val LocalSgColors = staticCompositionLocalOf { LightSgColors }

/** Access tokens as `Sg.colors.info` etc. */
object Sg {
    val colors: SgColors @Composable @ReadOnlyComposable get() = LocalSgColors.current
}

/** Resolves an area's CSS colour token ("var(--c1)") to the right palette colour for the theme. */
@Composable
fun areaColor(token: String): Color {
    val idx = Regex("c(\\d)").find(token)?.groupValues?.get(1)?.toIntOrNull()?.minus(1) ?: 0
    return Sg.colors.chart[idx.coerceIn(0, Sg.colors.chart.lastIndex)]
}

private fun scheme(c: SgColors): ColorScheme {
    val base = if (c.isDark) darkColorScheme() else lightColorScheme()
    return base.copy(
        primary = c.primary, onPrimary = c.onPrimary,
        primaryContainer = c.muted, onPrimaryContainer = c.foreground,
        secondary = c.mutedForeground, onSecondary = c.background,
        secondaryContainer = c.muted, onSecondaryContainer = c.foreground,
        tertiary = c.info,
        background = c.background, onBackground = c.foreground,
        surface = c.background, onSurface = c.foreground,
        surfaceVariant = c.muted, onSurfaceVariant = c.mutedForeground,
        surfaceContainer = c.card, surfaceContainerLow = c.background, surfaceContainerHigh = c.muted,
        surfaceContainerHighest = c.muted, surfaceContainerLowest = c.background,
        outline = c.input, outlineVariant = c.border,
        error = c.destructive, onError = Color.White,
        errorContainer = c.destructive.copy(alpha = 0.12f), onErrorContainer = c.destructiveForeground,
    )
}

// Larger type than the Material default: this is a Japanese reading app.
private val SgTypography = Typography(
    displaySmall = TextStyle(fontSize = 28.sp, lineHeight = 38.sp, fontWeight = FontWeight.Bold),
    headlineMedium = TextStyle(fontSize = 24.sp, lineHeight = 34.sp, fontWeight = FontWeight.Bold),
    headlineSmall = TextStyle(fontSize = 22.sp, lineHeight = 32.sp, fontWeight = FontWeight.Bold),
    titleLarge = TextStyle(fontSize = 20.sp, lineHeight = 30.sp, fontWeight = FontWeight.SemiBold),
    titleMedium = TextStyle(fontSize = 17.sp, lineHeight = 26.sp, fontWeight = FontWeight.SemiBold),
    titleSmall = TextStyle(fontSize = 15.sp, lineHeight = 22.sp, fontWeight = FontWeight.SemiBold),
    bodyLarge = TextStyle(fontSize = 16.sp, lineHeight = 28.sp),
    bodyMedium = TextStyle(fontSize = 15.sp, lineHeight = 25.sp),
    bodySmall = TextStyle(fontSize = 13.sp, lineHeight = 20.sp),
    labelLarge = TextStyle(fontSize = 15.sp, lineHeight = 20.sp, fontWeight = FontWeight.SemiBold),
    labelMedium = TextStyle(fontSize = 13.sp, lineHeight = 18.sp, fontWeight = FontWeight.Medium),
    labelSmall = TextStyle(fontSize = 12.sp, lineHeight = 16.sp, fontWeight = FontWeight.Medium),
)

private val SgShapes = Shapes(
    extraSmall = RoundedCornerShape(6.dp),
    small = RoundedCornerShape(8.dp),
    medium = RoundedCornerShape(10.dp),
    large = RoundedCornerShape(14.dp),
    extraLarge = RoundedCornerShape(20.dp),
)

enum class ThemeMode { System, Light, Dark }

@Composable
fun SgTheme(mode: ThemeMode = ThemeMode.System, content: @Composable () -> Unit) {
    val dark = when (mode) {
        ThemeMode.System -> isSystemInDarkTheme()
        ThemeMode.Light -> false
        ThemeMode.Dark -> true
    }
    val colors = if (dark) DarkSgColors else LightSgColors
    CompositionLocalProvider(LocalSgColors provides colors) {
        MaterialTheme(colorScheme = scheme(colors), typography = SgTypography, shapes = SgShapes, content = content)
    }
}
