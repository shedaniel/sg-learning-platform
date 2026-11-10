package app.sgstudy.ui.search

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import app.sgstudy.ui.theme.Sg

/** Rounded single-line search field with a leading magnifier and a clear button. Shared by search and glossary. */
@Composable
fun SgSearchField(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    modifier: Modifier = Modifier,
    focusRequester: FocusRequester? = null,
) {
    val focus = LocalFocusManager.current
    OutlinedTextField(
        value = value, onValueChange = onValueChange,
        modifier = modifier.fillMaxWidth().heightIn(min = 52.dp).let { if (focusRequester != null) it.focusRequester(focusRequester) else it },
        singleLine = true,
        textStyle = MaterialTheme.typography.bodyLarge,
        placeholder = { Text(placeholder, style = MaterialTheme.typography.bodyLarge, color = Sg.colors.mutedForeground) },
        leadingIcon = { Icon(Icons.Filled.Search, null, tint = Sg.colors.mutedForeground) },
        trailingIcon = {
            if (value.isNotEmpty()) IconButton(onClick = { onValueChange("") }) { Icon(Icons.Filled.Close, "クリア", tint = Sg.colors.mutedForeground) }
        },
        shape = MaterialTheme.shapes.medium,
        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
        keyboardActions = KeyboardActions(onSearch = { focus.clearFocus() }),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = Sg.colors.info, unfocusedBorderColor = Sg.colors.input,
            focusedContainerColor = Sg.colors.background, unfocusedContainerColor = Sg.colors.background,
            cursorColor = Sg.colors.info,
        ),
    )
}
