import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PageLayout from "@/components/pageLayout";
import BackButtonHeader from "@/components/backButtonHeader";
import LineChartComponent from "@/components/lineChart";

const pomodoroStatistics = () => {
  return (
    <PageLayout style={styles.container}>
      <BackButtonHeader />
      <View style={styles.activeHoursContainer}>
        <Text style={styles.activeHoursLabel}>Active Hours</Text>
        <View style={styles.totalHoursWrapper}>
          <Text style={styles.activeHoursValue}>Today: 0</Text>
          <Text style={styles.activeHoursValue}>Total: 4h 30m</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Your Progress</Text>
            <LineChartComponent />
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {},
  activeHoursContainer: {
    backgroundColor: "#E0F2FE",
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
  },
  totalHoursWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  activeHoursLabel: {
    fontSize: 16,
    color: "#0369A1",
    marginBottom: 10,
  },
  activeHoursValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0284C7",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 15,
  },
});

export default pomodoroStatistics;
