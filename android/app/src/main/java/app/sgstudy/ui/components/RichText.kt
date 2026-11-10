package app.sgstudy.ui.components

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.*
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import app.sgstudy.LocalApp
import app.sgstudy.ui.nav.Navigator
import app.sgstudy.ui.theme.Sg

private val TOKEN = Regex("(\\*\\*[^*]+\\*\\*|`[^`]+`|\\{\\{term:[^}|]+\\|[^}]+\\}\\}|\\{\\{term:[^}]+\\}\\})")

/**
 * Builds an AnnotatedString for the lesson mini-markup: **bold**, `code`, {{term:id}} and {{term:id|label}}.
 * Terms become tappable links that open the glossary page via [nav] (plain accent text when nav is null).
 */
@Composable
fun rememberRichString(text: String, nav: Navigator?): AnnotatedString {
    val app = LocalApp.current
    val link = Sg.colors.infoForeground
    val codeBg = Sg.colors.muted
    return remember(text, link, codeBg, nav) {
        buildAnnotatedString {
            var last = 0
            for (m in TOKEN.findAll(text)) {
                append(text.substring(last, m.range.first))
                val part = m.value
                when {
                    part.startsWith("**") -> withStyle(SpanStyle(fontWeight = FontWeight.Bold)) { append(part.substring(2, part.length - 2)) }
                    part.startsWith("`") -> withStyle(SpanStyle(fontFamily = FontFamily.Monospace, background = codeBg)) { append(part.substring(1, part.length - 1)) }
                    part.startsWith("{{term:") -> {
                        val body = part.substring(7, part.length - 2)
                        val id = body.substringBefore('|')
                        val label = if ('|' in body) body.substringAfter('|') else app.content.termById[id]?.ja ?: id
                        val style = SpanStyle(color = link, textDecoration = TextDecoration.Underline)
                        if (nav != null) {
                            withLink(
                                LinkAnnotation.Clickable(
                                    tag = id,
                                    styles = TextLinkStyles(style = style),
                                    linkInteractionListener = { nav.openTerm(id) },
                                ),
                            ) { append(label) }
                        } else {
                            withStyle(style) { append(label) }
                        }
                    }
                }
                last = m.range.last + 1
            }
            append(text.substring(last))
        }
    }
}

/** Text with the lesson mini-markup; tapping a {{term:...}} opens its glossary page. */
@Composable
fun RichText(
    text: String,
    nav: Navigator?,
    modifier: Modifier = Modifier,
    style: TextStyle = MaterialTheme.typography.bodyLarge,
    color: Color = Color.Unspecified,
) {
    Text(
        rememberRichString(text, nav), modifier = modifier,
        style = style, color = if (color != Color.Unspecified) color else Sg.colors.foreground,
    )
}
