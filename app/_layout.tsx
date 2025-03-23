import { DarkTheme, DefaultTheme, ThemeProvider, Theme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, Slot } from 'expo-router'; // ✅ Ensure Slot is imported
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/useColorScheme';
import { PastelTheme, VibrantTheme, EarthyTheme } from '../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

const themes: Record<string, Theme> = {
  pastel: PastelTheme as any,
  vibrant: VibrantTheme as any,
  earthy: EarthyTheme as any,
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
  const [themeName, setThemeName] = useState<keyof typeof themes>('pastel');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('selectedTheme');
        if (savedTheme && themes[savedTheme]) {
          setTheme(themes[savedTheme]);
          setThemeName(savedTheme as keyof typeof themes);
        } else {
          setTheme(DefaultTheme);
          setThemeName('pastel');
        }

        const userStatus = await AsyncStorage.getItem('isLoggedIn');
        setIsLoggedIn(userStatus === 'true');

        setTimeout(() => {
          setIsLayoutMounted(true);
        }, 100);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (isLayoutMounted && isLoggedIn === false) {
      console.log('Navigating to /login...');
      router.replace('/home');
    }
  }, [isLayoutMounted, isLoggedIn, router]);

  if (!loaded || isLoggedIn === null) {
    return null;
  }

  return (
    <ThemeProvider value={theme}>
      <SafeAreaView style={{flex: 1}}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="createReminder" options={{ headerShown: false }} />
        <Stack.Screen name="reminder" options={{ headerShown: false }} />
        <Stack.Screen name="editProfile" options={{ headerShown: false }} />
        <Stack.Screen name="tasks" options={{ headerShown: false }} />
        <Stack.Screen name="todo" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="createTask" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        <Stack.Screen name="createNotes" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="pomodoro" options={{ headerShown: false }} />
        <Stack.Screen name="createRoutine" options={{ headerShown: false }} />
        <Stack.Screen name="routine" options={{ headerShown: false }} />
        <Stack.Screen name="createPomodoro" options={{ headerShown: false }} />
        <Stack.Screen name="pomodoroStatistics" options={{ headerShown: false }} />
      </Stack>
      </SafeAreaView>
      {/* <Slot /> ✅ Ensure Slot is included for proper navigation */}
      <StatusBar style={themeName === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
