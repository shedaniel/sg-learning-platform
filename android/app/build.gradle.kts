plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.plugin.compose")
    id("org.jetbrains.kotlin.plugin.serialization")
}

android {
    namespace = "app.sgstudy"
    compileSdk = 37

    defaultConfig {
        applicationId = "app.sgstudy"
        minSdk = 26
        targetSdk = 36
        // CI passes these (version.txt + commit hash, run number); local builds fall back to dev values.
        versionCode = (findProperty("sgVersionCode") as String?)?.toInt() ?: 1
        versionName = (findProperty("sgVersionName") as String?) ?: "0.1.0-dev"
    }

    // Stable release key (from CI secrets / a local keystore) so Obtainium and `adb install -r` can update in place.
    val releaseKeystore = System.getenv("SG_KEYSTORE_FILE")
    signingConfigs {
        if (releaseKeystore != null) {
            create("release") {
                storeFile = file(releaseKeystore)
                storePassword = System.getenv("SG_KEYSTORE_PASSWORD")
                keyAlias = System.getenv("SG_KEY_ALIAS") ?: "sgstudy"
                keyPassword = System.getenv("SG_KEY_PASSWORD") ?: System.getenv("SG_KEYSTORE_PASSWORD")
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            // Without a release keystore (plain local build) fall back to the debug key so it still installs.
            signingConfig = signingConfigs.findByName("release") ?: signingConfigs.getByName("debug")
        }
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2026.09.00")
    implementation(composeBom)
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.foundation:foundation")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.activity:activity-compose:1.13.0")
    implementation("androidx.navigation:navigation-compose:2.10.2")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.10.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.10.0")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.12.0")
    implementation("com.caverock:androidsvg-aar:1.4")
    debugImplementation("androidx.compose.ui:ui-tooling")
}
