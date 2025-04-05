import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "../progressBar";
import { router } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;
const SPACING = 15;

interface Task {
  id: string;
  title: string;
  category: string;
  deadline?: string;
  priority: string;
  moreInfo?: string;
  completed: boolean;
}

const DUMMY_TASKS: Task[] = [
  {
    id: "1",
    title: "Meeting with team",
    moreInfo: "Discuss upcoming project roadmap and key milestones.",
    category: "Work",
    deadline: "2025-03-03",
    priority: "High",
    completed: false,
  },
  {
    id: "2",
    title: "Gym Workout",
    moreInfo: "Focus on upper body strength and core exercises.",
    category: "Health",
    deadline: "2025-03-05",
    priority: "Medium",
    completed: false,
  },
  {
    id: "3",
    title: "Grocery Shopping",
    moreInfo: "Buy fresh vegetables, dairy, and snacks for the week.",
    category: "Personal",
    deadline: "2025-03-04",
    priority: "Low",
    completed: false,
  },
];

const priorityColors: Record<string, string> = {
  High: "#ff4d4d",
  Medium: "#ffa500",
  Low: "#28a745",
};

const getTimeLeft = (deadline: string) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffMs = deadlineDate.getTime() - now.getTime();

  if (diffMs <= 0) return "Expired";

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`;
  return `${minutes} min${minutes > 1 ? "s" : ""} left`;
};

const TaskCard = ({ task, index }: { task: Task, index: number }) => {
  return (
    <View style={[styles.taskCard, index == 0 ? {backgroundColor: '#FEE2E2'} : {backgroundColor: '#E0E7FF'}]}>
      <View
        style={[
          styles.priorityWrapper,
          { backgroundColor: priorityColors[task.priority] },
        ]}
      >
        <Text style={styles.taskPriority}>{task.priority}</Text>
      </View>
      <Text style={styles.taskTitle}>{task.title}</Text>
      <Text style={styles.moreInfo} ellipsizeMode="tail" numberOfLines={2}>
        {task.moreInfo}
      </Text>
      <ProgressBar/>
      <View style={styles.taskFooter}>
        <Text style={styles.taskCategory}>{task.category}</Text>
        {task.deadline && (
          <View style={styles.deadlineWrapper}>
            <Ionicons name="time" size={20} color="#555" />
            <Text style={styles.taskDeadline}>
              {getTimeLeft(task.deadline)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const UpcomingTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<Task>>(null);

  const saveTasksToStorage = async () => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(DUMMY_TASKS));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  const loadTasksFromStorage = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  useEffect(() => {
    saveTasksToStorage();
    loadTasksFromStorage();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.priorityHeader}>
        <Text style={styles.heading}>
          Priority Tasks <Text style={{color: '#cccccc'}}>(12)</Text>
        </Text>
        <TouchableOpacity onPress={() => router.push('./checkList')}>
          <Text style={styles.link}>View All</Text> 
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: "center" }}>
        <FlatList
          ref={flatListRef}
          data={tasks}
          renderItem={({ item, index }) => <TaskCard task={item} index={index} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + SPACING}
          decelerationRate="fast"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
        />
        <View style={styles.dotContainer}>
          {tasks.map((_, index) => {
            const dotWidth = scrollX.interpolate({
              inputRange: [
                (index - 1) * (CARD_WIDTH + SPACING),
                index * (CARD_WIDTH + SPACING),
                (index + 1) * (CARD_WIDTH + SPACING),
              ],
              outputRange: [14, 30, 14],
              extrapolate: "clamp",
            });

            const dotColor = scrollX.interpolate({
              inputRange: [
                (index - 1) * (CARD_WIDTH + SPACING),
                index * (CARD_WIDTH + SPACING),
                (index + 1) * (CARD_WIDTH + SPACING),
              ],
              outputRange: ["#ccc", "#222", "#ccc"],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  { width: dotWidth, backgroundColor: dotColor },
                ]}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  priorityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  link: {
    color: '#3B82F6',
    fontSize: 16,
  },
  taskCard: {
    width: CARD_WIDTH,
    backgroundColor: "#FEE2E2",
    padding: 20,
    marginRight: SPACING,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
    gap: 8,
    marginVertical: 20,
    marginLeft: 2
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  moreInfo: {
    fontSize: 14,
    color: "#666",
  },
  taskCategory: {
    fontSize: 14,
    color: "#555",
  },
  priorityWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  taskPriority: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  deadlineWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  taskDeadline: {
    fontSize: 14,
    color: "#555",
  },
  dotContainer: {
    flexDirection: "row",
  },
  dot: {
    height: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
});

export default UpcomingTasks;
