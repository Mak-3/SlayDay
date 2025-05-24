import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  Theme,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { getUser, saveUser } from "@/db/service/UserService";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import exportRealmDataAsJson from "../constants/exportRealmDataAsJson";
import { triggerBackup } from "../constants/backupService";
import { auth } from "@/firebaseConfig";
import { AuthProvider } from "@/contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

const themes: Record<string, Theme> = {
  light: DefaultTheme,
  dark: DarkTheme,
};

export default function RootLayout() {
  const router = useRouter();
  const [isLayoutMounted, setIsLayoutMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const defaultTheme: Theme = DefaultTheme;
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [themeName, setThemeName] = useState<keyof typeof themes>("pastel");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("selectedTheme");
        if (savedTheme && themes[savedTheme]) {
          setTheme(themes[savedTheme]);
          setThemeName(savedTheme as keyof typeof themes);
        } else {
          setTheme(DefaultTheme);
          setThemeName("pastel");
        }

        const userStatus = await AsyncStorage.getItem("isLoggedIn");
        setIsLoggedIn(userStatus === "true");

        setTimeout(() => {
          setIsLayoutMounted(true);
        }, 100);
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    loadSettings();
  }, []);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (isLayoutMounted) {
      if (isLoggedIn === false) {
        router.replace("/signIn");
      } else if (isLoggedIn === true) {
        checkAndRedirectForFirstOpen();
      }
    }
  }, [isLayoutMounted, isLoggedIn, router]);

  if (!loaded || isLoggedIn === null) {
    return <></>;
  }

  const checkAndRedirectForFirstOpen = async () => {
    const user: any = await getUser();
    const today = new Date();

    if (!user || !user.lastOpened) {
      await saveUser({
        userName: user?.userName || "Guest",
        profilePicture: user?.profilePicture,
        email: user?.email || "",
        lastOpened: today,
      });
      router.replace("/quoteOfTheDay");
      return;
    }

    const lastOpenedDate = new Date(user.lastOpened);
    const isSameDay =
      lastOpenedDate.getDate() === today.getDate() &&
      lastOpenedDate.getMonth() === today.getMonth() &&
      lastOpenedDate.getFullYear() === today.getFullYear();
    if (!isSameDay) {
      triggerBackup();
      await saveUser({ ...user, lastOpened: today });
      router.replace("/quoteOfTheDay");
    } else {
      router.replace("/drawer/home");
    }
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
      <ThemeProvider value={theme}>
        <Stack>
          <Stack.Screen name="intro" options={{ headerShown: false }} />

          <Stack.Screen name="signIn" options={{ headerShown: false }} />
          <Stack.Screen name="signUp" options={{ headerShown: false }} />
          <Stack.Screen
            name="forgotPassword"
            options={{ headerShown: false }}
          />

          <Stack.Screen name="quoteOfTheDay" options={{ headerShown: false }} />

          <Stack.Screen name="drawer" options={{ headerShown: false }} />

          <Stack.Screen name="pomodoro" options={{ headerShown: false }} />
          <Stack.Screen
            name="createPomodoro"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="pomodoroScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="pomodoroSessions"
            options={{ headerShown: false }}
          />

          <Stack.Screen name="timer" options={{ headerShown: false }} />

          <Stack.Screen name="calender" options={{ headerShown: false }} />
          <Stack.Screen name="reminder" options={{ headerShown: false }} />
          <Stack.Screen name="createEvent" options={{ headerShown: false }} />

          <Stack.Screen
            name="createChecklist"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="checklistScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="checkList" options={{ headerShown: false }} />
          <Stack.Screen
            name="checklistOverview"
            options={{ headerShown: false }}
          />

          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="editProfile" options={{ headerShown: false }} />

          <Stack.Screen name="createNotes" options={{ headerShown: false }} />
        </Stack>
        <Toast />
      </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
