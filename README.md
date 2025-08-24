# Habitus - Productivity App

A comprehensive productivity app built with Expo and React Native, featuring checklists, events, Pomodoro timer, and automatic backups.

## Features

- **Checklists**: Create and manage tasks with smart organization
- **Events**: Schedule events with deadlines and reminders
- **Pomodoro Timer**: Improve productivity with focused work sessions
- **Automatic Backups**: Keep your data safe with daily backups
- **Intro Screen**: First-time user experience with app features overview

## Intro Screen Logic

The app includes intelligent routing logic that shows the intro screen only when the app is first installed:

- **First Installation**: Users see the intro screen with feature overview
- **Subsequent Launches**: Users go directly to sign-in screen
- **Installation Status**: Tracked using AsyncStorage with key `appInstalled`

### Implementation Details

- **Location**: `app/intro.tsx` - Intro screen component
- **Utilities**: `constants/appInstallation.ts` - Installation status management
- **Routing**: `app/_layout.tsx` - Main routing logic
- **Testing**: `context/AuthContext.tsx` - Includes `resetInstallationStatus()` for testing

### Testing the Intro Screen

To test the intro screen functionality, you can reset the installation status:

```javascript
import { useAuth } from '@/context/AuthContext';

const { resetInstallationStatus } = useAuth();
await resetInstallationStatus();
```

This will cause the app to show the intro screen on the next launch.

---

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
