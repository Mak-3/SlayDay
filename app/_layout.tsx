import React from "react";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { getUser, saveUser } from "@/db/service/UserService";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { isAppInstalled } from "@/constants/appInstallation";

import { triggerBackup } from "../constants/backupService";
import { getRealm } from "@/db/realm";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <InnerApp />
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

function InnerApp() {
  const router = useRouter();
  const [isLayoutMounted, setIsLayoutMounted] = useState(false);
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const { user, loading } = useAuth();
  const [appInstallationStatus, setAppInstallationStatus] = useState<boolean | null>(null);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, [fontsLoaded]);

  // Check if app has been installed before
  useEffect(() => {
    const checkAppInstallation = async () => {
      try {
        const appInstalled = await isAppInstalled();
        setAppInstallationStatus(appInstalled);
      } catch (error) {
        console.error("Error checking app installation status:", error);
        setAppInstallationStatus(false);
      }
    };
    
    checkAppInstallation();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLayoutMounted(true);
    }, 100);
  }, []);

  useEffect(() => {
    if (!loading && isLayoutMounted && fontsLoaded && appInstallationStatus !== null) {
      if (user) {
        checkAndRedirectForFirstOpen();
      } else {
        if (!appInstallationStatus) {
          router.replace("/intro");
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
    }
  }, [loading, user, isLayoutMounted, fontsLoaded, appInstallationStatus]);

  if (!fontsLoaded || !isLayoutMounted || loading || appInstallationStatus === null) {
    return null;
  }

  const checkAndRedirectForFirstOpen = async () => {
    try {
      const userData: any = await getUser();
      const today = new Date();

      if (!userData || !userData.lastOpened) {
        await saveUser({
          name: userData?.name || "",
          profilePicture: userData?.profilePicture,
          email: userData?.email || "",
          lastOpened: today,
        });
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
        <Stack.Screen
          name="emailVerification"
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
