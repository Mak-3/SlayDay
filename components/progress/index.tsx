import React, { useRef, useState } from "react";
import { View, FlatList, Animated, StyleSheet, Text } from "react-native";

interface Task {
  id: string;
  title: string;
  category: string;
  deadline?: string;
  priority: string;
  moreInfo?: string;
  completed: boolean;
}

const CARD_WIDTH = 160;
const CARD_HEIGHT = 230;
const SPACING = 14;

const DUMMY_TASKS: Task[] = [
  {
    id: "1",
    title: "Meeting with team",
    category: "Work",
    deadline: "2025-03-03",
    priority: "High",
    completed: false,
  },
  {
    id: "2",
    title: "Gym Workout",
    category: "Health",
    deadline: "2025-03-05",
    priority: "Medium",
    completed: false,
  },
  {
    id: "3",
    title: "Grocery Shopping",
    category: "Personal",
    deadline: "2025-03-04",
    priority: "Low",
    completed: false,
  },
  {
    id: "4",
    title: "Doctor Appointment",
    category: "Health",
    deadline: "2025-03-06",
    priority: "High",
    completed: false,
  },
  {
    id: "5",
    title: "Project Deadline",
    category: "Work",
    deadline: "2025-03-10",
    priority: "High",
    completed: false,
  },
  {
    id: "6",
    title: "Weekend Trip",
    category: "Personal",
    deadline: "2025-03-12",
    priority: "Low",
    completed: false,
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "#ff4d4d";
    case "Medium":
      return "#ffa500";
    case "Low":
      return "#4caf50";
    default:
      return "#3498db";
  }
};

const ProgressCard = ({
  task,
  index,
  scrollX,
}: {
  task: Task;
  index: number;
  scrollX: Animated.Value;
}) => {
  const top = scrollX.interpolate({
    inputRange: [
      (index - 1) * (CARD_WIDTH + SPACING),
      index * (CARD_WIDTH + SPACING),
    ],
    outputRange: index === 0 ? [0, 0] : [20, 0],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.progressCard,
        {
          backgroundColor: getPriorityColor(task.priority),
          top,
          marginLeft: index === 0 ? 0 : SPACING / 2,
          marginRight: SPACING / 2,
        },
      ]}
    >
      <Text style={styles.cardTitle}>{task.title}</Text>
      <Text style={styles.cardCategory}>{task.category}</Text>
      {task.deadline && (
        <Text style={styles.cardDeadline}>Due: {task.deadline}</Text>
      )}
    </Animated.View>
  );
};

const Progress = () => {
  const flatListRef = useRef<FlatList<Task>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [tasks] = useState<Task[]>(DUMMY_TASKS);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Your Progress</Text>
      <FlatList
        ref={flatListRef}
        data={tasks}
        renderItem={({ item, index }) => (
          <ProgressCard task={item} index={index} scrollX={scrollX} />
        )}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 320,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "left",
  },
  progressCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  cardCategory: {
    color: "#f0f0f0",
    fontSize: 14,
    marginTop: 5,
  },
  cardDeadline: {
    color: "#f0f0f0",
    fontSize: 12,
    marginTop: 8,
    fontStyle: "italic",
  },
});

export default Progress;
