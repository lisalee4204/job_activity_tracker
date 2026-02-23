# How to Build APK - Step by Step

## Prerequisites

1. **Android Studio** installed
   - Download: https://developer.android.com/studio
   - Install Android SDK (API 33+)

2. **Java JDK 11+** installed
   - Check: `java -version`
   - Download if needed: https://adoptium.net/

3. **Node.js 18+** installed
   - Check: `node --version`

## Step 1: Build Web App

```bash
cd frontend
npm install
npm run build
```

This creates the `dist` folder with your built app.

## Step 2: Sync Capacitor

```bash
cd frontend
npx cap sync
```

This copies your web app to the Android project.

## Step 3: Open in Android Studio

```bash
cd frontend
npx cap open android
```

This opens Android Studio with your project.

## Step 4: Build APK in Android Studio

### Option A: Debug APK (For Testing)

1. In Android Studio: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for build (2-5 minutes)
3. When done, click **locate** in notification
4. APK is in: `android/app/build/outputs/apk/debug/app-debug.apk`

### Option B: Release APK (For Play Store)

1. **Build** → **Generate Signed Bundle / APK**
2. Select **APK**
3. Create keystore (or use existing):
   - Click **Create new...**
   - Fill in keystore details
   - **Save keystore password securely!**
4. Select keystore file
5. Enter passwords
6. Select **release** build variant
7. Click **Finish**
8. APK is in: `android/app/build/outputs/apk/release/app-release.apk`

## Step 5: Test APK

### On Android Device

1. Enable **Developer Options** on your phone:
   - Settings → About Phone → Tap "Build Number" 7 times
2. Enable **USB Debugging**:
   - Settings → Developer Options → USB Debugging
3. Connect phone via USB
4. In Android Studio: **Run** → **Run 'app'**
   - Or drag APK to phone and install

### Using Android Emulator

1. In Android Studio: **Tools** → **Device Manager**
2. Create virtual device
3. Start emulator
4. **Run** → **Run 'app'**

## Step 6: Publish to Play Store

1. Go to [Google Play Console](https://play.google.com/console)
2. Create app listing
3. Upload APK (or AAB bundle)
4. Fill in store listing
5. Submit for review

## Troubleshooting

### "SDK not found"
- Open Android Studio
- **Tools** → **SDK Manager**
- Install Android SDK Platform 33
- Install Android SDK Build-Tools

### "Gradle sync failed"
- In Android Studio: **File** → **Sync Project with Gradle Files**
- Wait for sync to complete

### "Build failed"
- Check Android Studio's **Build** tab for errors
- Common issues:
  - Missing SDK
  - Gradle version mismatch
  - Java version incompatible

### APK too large
- Enable ProGuard/R8 in `build.gradle`
- Remove unused dependencies
- Use Android App Bundle (AAB) instead of APK

## Quick Commands Reference

```bash
# Build web app
cd frontend && npm run build

# Sync to Android
cd frontend && npx cap sync

# Open Android Studio
cd frontend && npx cap open android

# Run on connected device
cd frontend && npx cap run android
```

## Next Steps

Once you have the APK:
1. Test thoroughly on real device
2. Fix any mobile-specific issues
3. Optimize performance
4. Prepare Play Store listing
5. Submit for review

Your mobile app is ready! 🚀







