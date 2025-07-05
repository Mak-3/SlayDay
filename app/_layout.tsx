import React from "react";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { getUser, saveUser } from "@/db/service/UserService";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../context/AuthContext";

import { triggerBackup } from "../constants/backupService";
import { getRealm } from "@/db/realm";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

function InnerApp() {
  const router = useRouter();
  const [isLayoutMounted, setIsLayoutMounted] = useState(false);
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const { user, loading } = useAuth();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    setTimeout(() => {
      setIsLayoutMounted(true);
    }, 100);
  }, []);

  useEffect(() => {
    if (!loading && isLayoutMounted && fontsLoaded) {
      if (user) {
        checkAndRedirectForFirstOpen();
      } else {
        (async () => {
          try {
            const realm = await getRealm();
            realm.write(() => {
              realm.deleteAll();
            });
          } catch (err) {
            console.error("Failed to clear local Realm:", err);
          }
          setTimeout(() => {
            router.replace("/signIn");
          }, 100);
        })();
      }
    }
  }, [loading, user, isLayoutMounted, fontsLoaded]);

  if (!fontsLoaded || !isLayoutMounted || loading) {
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
