import BackButtonHeader from "@/components/backButtonHeader";
import {CrimsonLuxe } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";

import { getAllPomodoros } from "@/db/service/PomodoroService";
import { getIcon } from "@/constants/IconsMapping";
import NoDataPomodoro from "@/components/noData";
interface pomodoroSessions {
  id: any;
  title: string;
  taskType: string;
  time: number;
  category: string;
  createdAt: Date;
  endAt: Date;
}

export default function App() {
  const [data, setData] = useState<pomodoroSessions[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPomodoroSessions = async () => {
      setLoading(true);
      const result = await getAllPomodoros();
      setData(result);
      setLoading(false);
    };
    fetchPomodoroSessions();
  }, []);

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => setData((prev) => prev.filter((item) => item.id !== id))}
    >
      <Icon name="delete" size={24} color="#fff" />
    </TouchableOpacity>
  );

  const formatDuration = (start: Date, end: Date) => {
    const diffMs = end.getTime() - start.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    return `${seconds} second${seconds !== 1 ? "s" : ""}`;
  };

  const renderIcon = (category: string, color: string) => {
    const iconObj = getIcon[category] || getIcon["Other"];
    const { icon, library } = iconObj;

    switch (library) {
      case "FontAwesome":
        return <FontAwesome name={icon} size={24} color={color} />;
      case "MaterialCommunityIcons":
        return <MaterialCommunityIcons name={icon} size={24} color={color} />;
      case "MaterialIcons":
        return <Icon name={icon} size={24} color={color} />;
      case "FontAwesome5":
        return <FontAwesome5 name={icon} size={24} color={color} />;
      case "Feather":
        return <Feather name={icon} size={24} color={color} />;
      default:
        return <Icon name="help" size={24} color={color} />;
    }
  };

  const renderItem = ({ item, index }: any) => {
    const formattedStart = new Date(item.createdAt).toLocaleTimeString();
    const duration = formatDuration(
      new Date(item.createdAt),
      new Date(item.endAt)
    );
    return (
      <Swipeable renderRightActions={() => renderRightActions(item.id)}>
        <View style={styles.taskContainer}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: getIcon[item.category].backgroundColor },
            ]}
          >
            {renderIcon(item.category, "#fff")}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.timeInfoWrapper}>
              <Text style={styles.duration}>{formattedStart}</Text>
              <Text style={styles.duration}>{duration}</Text>
            </View>
          </View>
        </View>
      </Swipeable>
    );
  };
  console.log(data.length, "dt")

  if (!loading && data.length === 0){
    return <NoDataPomodoro />
  }
  return (
    <GestureHandlerRootView style={{ flex: 1, padding: 20 }}>
      <BackButtonHeader title="Pomodoro History" />
      <View style={styles.contentWrapper}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    marginVertical: 10,
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    gap: 5,
  },
  timeInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  duration: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  playButton: {
    backgroundColor: "#10B981",
    borderRadius: 999,
    padding: 8,
  },
  deleteButton: {
    backgroundColor: CrimsonLuxe.primary400 || "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    marginVertical: 8,
    borderRadius: 10,
  },
});
