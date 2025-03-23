import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PageLayout from "@/components/pageLayout";
import CustomCalendar from "@/components/calenderStreak";
import BackButtonHeader from "@/components/backButtonHeader";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const routine = () => {
  return (
    <PageLayout style={styles.container}>
      <BackButtonHeader title="Habit Insights"/>
      <CustomCalendar />
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialCommunityIcons
            name="progress-check"
            size={28}
            color="#A34EF9"
          />
          <Text style={styles.statValue}>85%</Text>
          <Text style={styles.statLabel}>Completion Rate</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="flame" size={28} color="#FF6D6D" />
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Milestones</Text>
        </View>
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
    textAlign: "center",
  },
});

export default routine;