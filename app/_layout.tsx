import React from "react";
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
      if (!isAuthChecked || !isLayoutMounted || !fontsLoaded) return;

      try {
        if (authUser) {
          await checkAndRedirectForFirstOpen();
        } else {
          router.replace("/signIn");
        }
      } catch (error) {
        console.error("Navigation error:", error);
        router.replace("/signIn");
      }
    };

    decideNavigation();
  }, [isAuthChecked, authUser, isLayoutMounted, fontsLoaded]);

  if (!fontsLoaded || !isLayoutMounted || !isAuthChecked) {
    return null;
  }

  const checkAndRedirectForFirstOpen = async () => {
    try {
      const userData: any = await getUser();
      const today = new Date();

      if (!userData || !userData.lastOpened) {
        await saveUser({
          name: userData?.name || "Guest",
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
        if (userData.preferences?.automaticBackupEnabled) {
          triggerBackup();
        }
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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="intro" />
        <Stack.Screen
          name="signIn"
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="signUp"
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />
        <Stack.Screen name="forgotPassword" />
        <Stack.Screen name="quoteOfTheDay" />
        <Stack.Screen
          name="drawer"
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />
        <Stack.Screen name="pomodoro" />
        <Stack.Screen name="createPomodoro" />
        <Stack.Screen name="pomodoroScreen" />
        <Stack.Screen name="pomodoroSessions" />
        <Stack.Screen name="timer" />
        <Stack.Screen name="calender" />
        <Stack.Screen name="reminder" />
        <Stack.Screen name="createEvent" />
        <Stack.Screen name="createChecklist" />
        <Stack.Screen name="checklistScreen" />
        <Stack.Screen name="checkList" />
        <Stack.Screen name="checklistOverview" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="editProfile" />
        <Stack.Screen name="createNotes" />
        <Stack.Screen name="notes" />
        <Stack.Screen
          name="(drawer)"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="+not-found" options={{ presentation: "modal" }} />
      </Stack>
      <Toast />
    </>
  );
}
