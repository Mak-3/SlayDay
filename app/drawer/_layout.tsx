import { createDrawerNavigator } from "@react-navigation/drawer";
import { withLayoutContext } from "expo-router";
import { ThemeProvider } from "@react-navigation/native";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { getChecklistCount } from "@/db/service/ChecklistService";
import { getPomodoroCount } from "@/db/service/PomodoroService";
import { getEventCount } from "@/db/service/EventService";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const DrawerNavigator = createDrawerNavigator();
const Drawer = withLayoutContext(DrawerNavigator.Navigator);

export default function DrawerLayout() {

  const [checklistCount, setChecklistCount] = useState<number>(0);
  const [pomodoroCount, setPomodoroCount] = useState<number>(0);
  const [eventCount, setEventCount] = useState<number>(0);

  useEffect(() => {
    const fetchCounts = async () => {
      const checklistCount = await getChecklistCount();
      const pomodoroCount = await getPomodoroCount();
      const eventCount = await getEventCount();

      setChecklistCount(checklistCount.total);
      setPomodoroCount(pomodoroCount.total);
      setEventCount(eventCount.total);
    };

    fetchCounts();
  }, []);

  return (
    <ThemeProvider value={DefaultTheme}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerActiveTintColor: "#FF6B6B",
          drawerInactiveTintColor: "#333",
          drawerStyle: {
            backgroundColor: "#fff",
          },
        }}
      >
        <Drawer.Screen
          name="home"
          options={{
            title: "Home",
            gestureEnabled: false,
            drawerLabel: () => <DrawerItemWithCount title="Home" count={0} />,
          }}
        />
        <Drawer.Screen
          name="checklistOverview"
          options={{
            title: "Checklists",
            drawerLabel: () => (
              <DrawerItemWithCount title="Checklists" count={checklistCount} />
            ),
          }}
        />
        <Drawer.Screen
          name="pomodoroSessions"
          options={{
            title: "Pomodoro",
            drawerLabel: () => (
              <DrawerItemWithCount title="Pomodoro" count={pomodoroCount} />
            ),
          }}
        />
        <Drawer.Screen
          name="reminder"
          options={{
            title: "Reminder",
            drawerLabel: () => (
              <DrawerItemWithCount
                title="Events & Reminder"
                count={eventCount}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="calender"
          options={{
            title: "Calendar",
            drawerLabel: () => <DrawerItemWithCount title="Calendar" />,
          }}
        />
      </Drawer>
    </ThemeProvider>
  );
}

const DrawerItemWithCount = ({ title, count }: any) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Text style={{ fontSize: 16, color: "#333", marginLeft: 12 }}>{title}</Text>
    {count > 0 && (
      <View
        style={{
          backgroundColor: "#FF6B6B",
          borderRadius: 10,
          paddingHorizontal: 6,
          paddingVertical: 2,
          marginLeft: 20,
        }}
      >
        <Text style={{ color: "#FFF", fontSize: 12, fontWeight: "bold" }}>
          {count}
        </Text>
      </View>
    )}
    <Feather name="chevron-right" size={24} color="#aaa" />
  </View>
);
