import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import BackButtonHeader from "@/components/backButtonHeader";
import LineChart from "@/components/lineChart";
import PageLayout from "@/components/pageLayout";
import { router } from "expo-router";
import { CrimsonLuxe } from "@/constants/Colors";
import dayjs from "dayjs";

const handleNavigation = (route: any) => {
  router.push(route);
};

const Pomodoro = () => {
  return (
    <PageLayout style={styles.container}>
      <BackButtonHeader title="Pomodoro Statistics" />

      <View style={styles.activeHoursContainer}>
        <Text style={styles.activeHoursLabel}>Active Hours</Text>
        <View style={styles.totalHoursWrapper}>
          <Text style={styles.activeHoursValue}>Today: 0</Text>
          <Text style={styles.activeHoursValue}>Total: 4h 30m</Text>
        </View>
      </View>

      <View style={styles.progressWrapper}>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <LineChart />
      </View>
      <View style={styles.sessionsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Past Sessions</Text>
          <Text
            style={styles.sectionLink}
            onPress={() => {
              router.push("/pomodoroStatistics");
            }}
          >
            View All
          </Text>
        </View>

        <View style={styles.sessionGroup}>
          <Text style={styles.groupTitle}>Today</Text>
          <View style={styles.sessionItem}>
            <Text style={styles.sessionTask}>Deep Work</Text>
            <Text style={styles.sessionTime}>1h 20m</Text>
          </View>
          <View style={styles.sessionItem}>
            <Text style={styles.sessionTask}>Reading</Text>
            <Text style={styles.sessionTime}>45m</Text>
          </View>
        </View>

        <View style={styles.sessionGroup}>
          <Text style={styles.groupTitle}>Yesterday</Text>
          <View style={styles.sessionItem}>
            <Text style={styles.sessionTask}>Design Review</Text>
            <Text style={styles.sessionTime}>2h 10m</Text>
          </View>
        </View>

        <View style={styles.sessionGroup}>
          <Text style={styles.groupTitle}>March 10, 2025</Text>
          <View style={styles.sessionItem}>
            <Text style={styles.sessionTask}>Coding Practice</Text>
            <Text style={styles.sessionTime}>1h 30m</Text>
          </View>
        </View>
      </View>
    </PageLayout>
  );
};

export default Pomodoro;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  activeHoursContainer: {
    backgroundColor: CrimsonLuxe.primary100,
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
  },
  totalHoursWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  activeHoursLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  activeHoursValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  progressWrapper: {
    marginVertical: 20,
  },
  sessionsContainer: {
    flex: 1,
    marginVertical: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionLink: {
    color: CrimsonLuxe.primary400,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 15,
  },
  sessionGroup: {
    marginBottom: 20,
  },
  startSessionContainer: {
    backgroundColor: "#ECFDF5",
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    alignItems: "center",
  },

  startSessionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#065F46",
    marginBottom: 8,
  },

  startSessionSubtitle: {
    fontSize: 14,
    color: "#065F46",
    textAlign: "center",
    marginBottom: 16,
  },

  groupTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
  },
  sessionItem: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sessionTask: {
    fontSize: 16,
    color: "#111827",
  },
  sessionTime: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10B981",
  },
  startButton: {
    backgroundColor: "#10B981",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
