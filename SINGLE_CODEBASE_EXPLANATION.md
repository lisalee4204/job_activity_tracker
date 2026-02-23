# Single Codebase - Web + Mobile

## One Codebase, Two Platforms ✅

You have **ONE codebase** that works for **BOTH** web and mobile!

## How It Works

### Your React App (Single Codebase)
```
frontend/
├── src/              ← Your React code (ONE version)
├── dist/             ← Built web app
└── android/           ← Mobile wrapper (added by Capacitor)
```

### What Capacitor Does

**Capacitor wraps your web app** - it doesn't create a separate version:

```
┌─────────────────────────────────┐
│   Your React Web App            │  ← Same code
│   (frontend/src/)                │
└──────────────┬──────────────────┘
               │
       ┌───────┴───────┐
       │               │
   ┌───▼───┐      ┌───▼────┐
   │  Web  │      │ Mobile │
   │  App  │      │  APK   │
   └───────┘      └────────┘
   (dist/)        (android/)
```

## How You Deploy

### Web Version
```bash
cd frontend
npm run build          # Builds to dist/
# Deploy dist/ to Vercel/Netlify
```

### Mobile Version (APK)
```bash
cd frontend
npm run build          # Same build!
npx cap sync           # Copies dist/ to android/
npx cap open android   # Build APK in Android Studio
```

**Same code, same build, different output!**

## Benefits

✅ **One codebase** - No duplicate code
✅ **One set of features** - Changes apply to both
✅ **Easier maintenance** - Fix bugs once
✅ **Consistent experience** - Same UI/UX everywhere

## What's Different

### Web Version
- Runs in browser
- Accessed via URL
- Hosted on Vercel/Netlify
- Works on desktop/tablet/mobile browsers

### Mobile Version (APK)
- Runs as native app
- Installed on phone
- Published to Play Store
- Same code, wrapped in native container

## Code Structure

Your code detects if it's running on mobile:

```typescript
// In main.tsx
if (Capacitor.isNativePlatform()) {
  // Mobile-specific code (status bar, etc.)
} else {
  // Web-specific code
}
```

But **99% of your code is the same** for both!

## Summary

- ✅ **One codebase** (frontend/src/)
- ✅ **One build process** (npm run build)
- ✅ **Two outputs**:
  - Web: `dist/` folder → Deploy to web hosting
  - Mobile: `android/` folder → Build APK

**You maintain ONE version, not two!** 🎉







