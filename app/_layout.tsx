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
import { useColorScheme } from "@/hooks/useColorScheme";

SplashScreen.preventAutoHideAsync();

const themes: Record<string, Theme> = {
  light: DefaultTheme,
  dark: DarkTheme,
};

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
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
    if (isLayoutMounted && isLoggedIn === false) {
      router.replace("/home");
    }
  }, [isLayoutMounted, isLoggedIn, router]);

  if (!loaded || isLoggedIn === null) {
    return null;
  }

  return (
    <ThemeProvider value={theme}>
      <Stack>
        <Stack.Screen name="intro" options={{ headerShown: false }} />

        <Stack.Screen name="signIn" options={{ headerShown: false }} />
        <Stack.Screen name="signUp" options={{ headerShown: false }} />

        <Stack.Screen name="quoteOfTheDay" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="calender" options={{ headerShown: false }} />

        <Stack.Screen name="pomodoro" options={{ headerShown: false }} />
        <Stack.Screen name="createPomodoro" options={{ headerShown: false }} />
        <Stack.Screen name="pomodoroScreen" options={{ headerShown: false }} />
        <Stack.Screen name="timer" options={{ headerShown: false }} />
        <Stack.Screen
          name="pomodoroSessions"
          options={{ headerShown: false }}
        />

        <Stack.Screen name="reminder" options={{ headerShown: false }} />
        <Stack.Screen name="createEvent" options={{ headerShown: false }} />

        <Stack.Screen name="createChecklist" options={{ headerShown: false }} />
        <Stack.Screen name="checklistScreen" options={{ headerShown: false }} />
        <Stack.Screen name="checkList" options={{ headerShown: false }} />
        <Stack.Screen
          name="checklistOverview"
          options={{ headerShown: false }}
        />

        <Stack.Screen name="settings" options={{ title: "Settings" }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="editProfile" options={{ headerShown: false }} />

        <Stack.Screen name="createNotes" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
