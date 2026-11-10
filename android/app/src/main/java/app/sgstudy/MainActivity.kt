package app.sgstudy

import android.graphics.Color
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.foundation.background
import app.sgstudy.data.ContentRepository
import app.sgstudy.ui.nav.AppNav
import app.sgstudy.ui.theme.Sg
import app.sgstudy.ui.theme.SgTheme
import app.sgstudy.ui.theme.ThemeMode

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            var container by remember { mutableStateOf<AppContainer?>(null) }
            LaunchedEffect(Unit) {
                container = AppContainer(applicationContext, ContentRepository.load(applicationContext))
            }
            val mode = container?.themeMode ?: ThemeMode.System
            SgTheme(mode) {
                val dark = Sg.colors.isDark
                DisposableEffect(dark) {
                    enableEdgeToEdge(
                        statusBarStyle = if (dark) SystemBarStyle.dark(Color.TRANSPARENT) else SystemBarStyle.light(Color.TRANSPARENT, Color.TRANSPARENT),
                        navigationBarStyle = if (dark) SystemBarStyle.dark(Color.TRANSPARENT) else SystemBarStyle.light(Color.TRANSPARENT, Color.TRANSPARENT),
                    )
                    onDispose { }
                }
                val c = container
                if (c == null) {
                    Box(Modifier.fillMaxSize().background(Sg.colors.background), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(color = Sg.colors.mutedForeground)
                    }
                } else {
                    CompositionLocalProvider(LocalApp provides c) {
                        Box(Modifier.fillMaxSize().background(Sg.colors.background).statusBarsPadding()) { AppNav() }
                    }
                }
            }
        }
    }
}
