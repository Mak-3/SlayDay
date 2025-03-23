import React from "react";
import { View, Text, SectionList, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const pastSessionsData = [
  {
    date: "2025-03-09",
    data: [
      { id: "1", title: "React Native Basics", duration: "2h" },
      { id: "2", title: "State Management", duration: "1.5h" },
    ],
  },
  {
    date: "2025-03-08",
    data: [
      { id: "3", title: "Advanced Hooks", duration: "2h" },
    ],
  },
];

const PastSessions = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Past Sessions</Text>
      </View>

      <SectionList
        sections={pastSessionsData}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { date } }) => (
          <Text style={styles.sectionHeader}>{date}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.sessionItem}>
            <Text style={styles.sessionTitle}>{item.title}</Text>
            <Text style={styles.sessionDuration}>{item.duration}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#3B82F6",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563EB", // blue-600
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    backgroundColor: "#E5E7EB", // gray-200
    paddingVertical: 8,
    paddingHorizontal: 16,
    color: "#374151", // gray-700
  },
  sessionItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionTitle: {
    fontSize: 16,
    color: "#111827",
  },
  sessionDuration: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  listContainer: {
    paddingTop: 16,
  },
});

export default PastSessions;