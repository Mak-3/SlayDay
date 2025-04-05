import BackButtonHeader from "@/components/backButtonHeader";
import { cardColors, CrimsonLuxe } from "@/constants/Colors";
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getAllPomodoros } from "@/db/service/PomodoroService";

const tasks = [
  { id: "1", title: "Reading Books", duration: "50 minutes", icon: "book", iconLib: "FontAwesome", bg: "#F87171" },
  { id: "2", title: "Editing Audio", duration: "75 minutes", icon: "music-note", iconLib: "MaterialIcons", bg: "#FBBF24" },
  { id: "3", title: "Learn Programming", duration: "50 minutes", icon: "code-tags", iconLib: "MaterialCommunityIcons", bg: "#60A5FA" },
  { id: "4", title: "Dumbbell Exercise", duration: "25 minutes", icon: "dumbbell", iconLib: "MaterialCommunityIcons", bg: "#4ADE80" },
  { id: "5", title: "Tech Exploration", duration: "50 minutes", icon: "devices", iconLib: "MaterialIcons", bg: "#FACC15" },
  { id: "6", title: "Meditation", duration: "25 minutes", icon: "spa", iconLib: "MaterialIcons", bg: "#F87171" },
  { id: "7", title: "Fixing Smartphone", duration: "75 minutes", icon: "smartphone", iconLib: "MaterialIcons", bg: "#9CA3AF" },
];

export default function App() {
  const pomodoroSessions = getAllPomodoros();
  const [data, setData] = useState(tasks);

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => setData(data.filter((item) => item.id !== id))}
    >
      <Icon name="delete" size={24} color="#fff" />
    </TouchableOpacity>
  );

  const renderIcon = (icon: string, lib: string, color: string) => {
    switch (lib) {
      case "FontAwesome":
        return <FontAwesome name={icon} size={24} color="#fff" />;
      case "MaterialCommunityIcons":
        return <MaterialCommunityIcons name={icon} size={24} color="#fff" />;
      case "MaterialIcons":
      default:
        return <Icon name={icon} size={24} color="#fff" />;
    }
  };

  const renderItem = ({ item }: any) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={styles.taskContainer}>
        <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
          {renderIcon(item.icon, item.iconLib, "#fff")}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.duration}>{item.duration}</Text>
        </View>
        <TouchableOpacity style={styles.playButton}>
          <Icon name="play-arrow" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#fff", padding: 20}}>
      <BackButtonHeader title={'Past Sessions'} />
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
    marginVertical: 10
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