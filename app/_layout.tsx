import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { getUser, saveUser } from "@/db/service/UserService";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { triggerBackup } from "../constants/backupService";
import { listenForAuthChanges } from "@/firebaseConfig";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <InnerApp />
    </GestureHandlerRootView>
  );
}

function InnerApp() {
  const router = useRouter();
  const [isLayoutMounted, setIsLayoutMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [authUser, setAuthUser] = useState<any>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
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

  useEffect(() => {
    const unsubscribe = listenForAuthChanges((user: any) => {
      setAuthUser(user);
      setIsAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const decideNavigation = async () => {
      if (!isAuthChecked) return;

      if (authUser) {
        await checkAndRedirectForFirstOpen();
      } else {
        router.replace("/signIn");
      }
    };

    decideNavigation();
  }, [isAuthChecked, authUser]);

  if (!fontsLoaded || !isLayoutMounted || !isAuthChecked) {
    return null;
  }

  const checkAndRedirectForFirstOpen = async () => {
    try {
      const userData: any = await getUser();
      const today = new Date();

      if (!userData || !userData.lastOpened) {
        await saveUser({
          userName: userData?.userName || "Guest",
          profilePicture: userData?.profilePicture,
          email: userData?.email || "",
          lastOpened: today,
        });
        router.replace("/quoteOfTheDay");
        return;
      }

      const lastOpenedDate = new Date(userData.lastOpened);
      const isSameDay =
        lastOpenedDate.getDate() === today.getDate() &&
        lastOpenedDate.getMonth() === today.getMonth() &&
        lastOpenedDate.getFullYear() === today.getFullYear();

      if (!isSameDay) {
        triggerBackup();
        await saveUser({ ...userData, lastOpened: today });
        router.replace("/quoteOfTheDay");
      } else {
        router.replace("/drawer/home");
      }
    } catch (error) {
      console.error("Error during first open check:", error);
      router.replace("/drawer/home");
    }
  };

  return (
    <>
      <Stack>
        <Stack.Screen name="intro" options={{ headerShown: false }} />
        <Stack.Screen name="signIn" options={{ headerShown: false }} />
        <Stack.Screen name="signUp" options={{ headerShown: false }} />
        <Stack.Screen name="forgotPassword" options={{ headerShown: false }} />
        <Stack.Screen name="quoteOfTheDay" options={{ headerShown: false }} />
        <Stack.Screen name="drawer" options={{ headerShown: false }} />
        <Stack.Screen name="pomodoro" options={{ headerShown: false }} />
        <Stack.Screen name="createPomodoro" options={{ headerShown: false }} />
        <Stack.Screen name="pomodoroScreen" options={{ headerShown: false }} />
        <Stack.Screen name="pomodoroSessions" options={{ headerShown: false }} />
        <Stack.Screen name="timer" options={{ headerShown: false }} />
        <Stack.Screen name="calender" options={{ headerShown: false }} />
        <Stack.Screen name="reminder" options={{ headerShown: false }} />
        <Stack.Screen name="createEvent" options={{ headerShown: false }} />
        <Stack.Screen name="createChecklist" options={{ headerShown: false }} />
        <Stack.Screen name="checklistScreen" options={{ headerShown: false }} />
        <Stack.Screen name="checkList" options={{ headerShown: false }} />
        <Stack.Screen name="checklistOverview" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="editProfile" options={{ headerShown: false }} />
        <Stack.Screen name="createNotes" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </>
  );
}
