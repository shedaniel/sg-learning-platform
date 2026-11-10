# SG 学習 — Android app

Native, fully offline Android version of the study platform (Kotlin, Jetpack Compose, Material 3).
All content (27 lessons, 363 terms, 566 questions, 22 diagrams, past-paper metadata) is bundled in the APK;
progress is stored on the device in SQLite. No account, no network.

## Build and install

Requirements: JDK 21 (`JAVA_HOME=/opt/homebrew/opt/openjdk@21`), Android SDK with platform 37 (path in `local.properties`).

```bash
cd android
JAVA_HOME=/opt/homebrew/opt/openjdk@21 ./gradlew assembleRelease
# app/build/outputs/apk/release/app-release.apk  (signed with the debug key, installable directly)
adb install -r app/build/outputs/apk/release/app-release.apk
```

## Updating the content

Lessons, questions and terms live in the web app's TypeScript (`src/content`). After changing them, from the repo root:

```bash
npm run export:android   # rewrites android/app/src/main/assets/content (JSON + themed SVG diagrams)
```

then rebuild the APK. Reinstalling with `adb install -r` (same signing key) keeps your progress.

## Layout

```
app/src/main/java/app/sgstudy/
  data/      content models + loader, SQLite progress store
  logic/     ports of the web logic: quiz selection, mock exam scoring, SRS, progress, search
  ui/        theme (coss ui tokens), shared components, navigation, one package per feature
  ui/widgets the 8 interactive simulators
```

Progress can be backed up to / restored from a JSON file in 設定. It is local to the device; there is no sync.
