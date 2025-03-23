import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import BackButtonHeader from "@/components/backButtonHeader";

const initialTasks = [
  { id: "1", text: "Buy groceries", completed: false },
  { id: "2", text: "Work on React Native project", completed: false },
  { id: "3", text: "Read a book", completed: false },
  { id: "4", text: "Exercise for 30 minutes", completed: false },
];

interface TodoProps {
  item: any;
  drag: any;
  isActive: boolean;
}

export default function TodoScreen() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const moveTask = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= tasks.length || toIndex >= tasks.length) {
      return;
    }

    const updatedTasks = [...tasks];
    const [movedItem] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedItem);
    setTasks(updatedTasks);
  };

  const renderItem: React.FC<TodoProps> = ({ item, drag, isActive }) => (
    <ScaleDecorator>
      <TouchableOpacity
        style={[styles.taskItem, isActive && styles.activeTask]}
        onLongPress={drag}
        activeOpacity={1}
      >
        <MaterialIcons name="drag-indicator" size={24} color="grey" />
        <TouchableOpacity onPress={() => toggleComplete(item.id)} style={styles.checkbox}>
          <Ionicons
            name={item.completed ? "checkbox" : "square-outline"}
            size={24}
            color={item.completed ? "green" : "black"}
          />
        </TouchableOpacity>
        <Text style={[styles.taskText, item.completed && styles.completedText]}>
          {item.text}
        </Text>
        <Ionicons name="menu" size={24} color="gray" />
      </TouchableOpacity>
    </ScaleDecorator>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <BackButtonHeader />
        <Text style={styles.title}>My To-Do List</Text>
        <DraggableFlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => setTasks(data)}
          containerStyle={{ flex: 1 }}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f8f8" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  activeTask: { backgroundColor: "#e0e0e0" },
  taskText: { flex: 1, fontSize: 16, marginLeft: 10 },
  completedText: { textDecorationLine: "line-through", color: "gray" },
  checkbox: { paddingRight: 10 },
});