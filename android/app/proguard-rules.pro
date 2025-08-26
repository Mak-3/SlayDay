# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Add any project specific keep options here:
# Keep OkHttp/Okio and networking stack
-keep class okhttp3.** { *; }
-dontwarn okhttp3.**
-keep class okio.** { *; }
-dontwarn okio.**
-keep class javax.net.** { *; }
-keep class com.facebook.react.modules.network.** { *; }
-keep class com.facebook.react.modules.websocket.** { *; }
# QUIC/cronet native bindings sometimes used by RN devtools; keep to be safe
-dontwarn org.chromium.**
# Keep DNS resolver configs
-keep class sun.net.dns.** { *; }
# Keep Firebase networking if used
-keep class com.google.firebase.** { *; }
# Keep Android networking
-keep class android.net.** { *; }
# Keep Realm (react-native and core)
-keep class io.realm.react.** { *; }
-dontwarn io.realm.react.**
-keep class io.realm.** { *; }
-dontwarn io.realm.**
