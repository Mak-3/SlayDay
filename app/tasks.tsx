import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import PageLayout from "@/components/pageLayout";
import UpcomingTasks from "@/components/upcomingTasks";
import BackButtonHeader from "@/components/backButtonHeader";
import TaskStatusCard from "@/components/taskStatusCard";

const TasksPage = () => {
  const navigation = useNavigation();

  const overviewCards = [
    { title: "Pending", count: 5, color: "#F59E0B", screen: "PendingTasks" },
    {
      title: "In Progress",
      count: 2,
      color: "#3B82F6",
      screen: "InProgressTasks",
    },
    {
      title: "Completed",
      count: 12,
      color: "#10B981",
      screen: "CompletedTasks",
    },
    { title: "Overdue", count: 1, color: "#EF4444", screen: "OverdueTasks" },
  ];

  const upcomingTasks = [
    { title: "Design Meeting", due: "Today", priorityColor: "#3B82F6" },
    { title: "Grocery Shopping", due: "Tomorrow", priorityColor: "#F59E0B" },
    { title: "Workout", due: "Monday", priorityColor: "#10B981" },
  ];

  return (
    <PageLayout style={styles.container}>
      <BackButtonHeader title="Tasks" />
      <UpcomingTasks />
      <Text style={styles.sectionTitle}>Overview</Text>
      <View style={styles.overviewContainer}>
        <TaskStatusCard
          title="To Do List"
          tasks={20}
          bgColor="#2D9CDB"
          iconName="check-square"
          bgIconName="check-square"
        />

        <TaskStatusCard
          title="In Progress"
          tasks={15}
          bgColor="#F2994A"
          iconName="activity"
          bgIconName="activity"
        />
        <TaskStatusCard
          title="Review"
          tasks={10}
          bgColor="#9B51E0"
          iconName="search"
          bgIconName="search"
        />

        <TaskStatusCard
          title="Completed"
          tasks={30}
          bgColor="#27AE60"
          iconName="check-circle"
          bgIconName="check-circle"
        />
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },
  startSessionWrapper: {
    marginBottom: 20,
  },
  sessionsContainer: {
    flex: 1,
    marginVertical: 20,
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
    marginBottom: 20,
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

  addButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 24,
  },
  addButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
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
  upcomingTasksList: {
    paddingBottom: 16,
  },
  upcomingTaskCard: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 16,
    marginRight: 12,
    width: 220,
  },
  upcomingTaskHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  upcomingTaskTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  upcomingTaskDue: {
    color: "#6B7280",
  },
  overviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  overviewCard: {
    backgroundColor: "#FFFFFF",
    borderLeftWidth: 5,
    borderRadius: 10,
    width: "48%",
    marginBottom: 16,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  overviewTitle: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "600",
  },
  overviewCount: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
});

export default TasksPage;
