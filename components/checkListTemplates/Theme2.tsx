import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const tasks = [
  { id: 1, text: "Have a glass of water.", time: "07:00", checked: false },
  { id: 2, text: "Morning jogging.", time: "07:30", checked: false },
  { id: 3, text: "Have lunch with Jenny.", time: "12:00", checked: false },
  { id: 4, text: "Send email to Tim.", time: "12:30", checked: false },
  { id: 5, text: "Supermarket shopping list.", time: "15:00", checked: false },
  { id: 6, text: "Grandma’s birthday.", time: "21:00", checked: false },
];

export default function TaskScreen() {
  const [taskList, setTaskList] = React.useState(tasks);

  const toggleCheck = (id: any) => {
    setTaskList((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, checked: !task.checked } : task
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="settings" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.taskContainer}>
        <FlatList
          data={taskList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => toggleCheck(item.id)}
              style={styles.taskCard}
            >
              <View style={styles.taskContent}>
                <Checkbox
                  status={item.checked ? "checked" : "unchecked"}
                  onPress={() => toggleCheck(item.id)}
                  color="#6A5ACD"
                />
                <Text style={styles.taskText}>{item.text}</Text>
              </View>
              <Text style={styles.taskTime}>{item.time}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D5C8FF",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    gap: 15,
  },
  taskContainer: {
    // backgroundColor: "#fff",
    borderRadius: 15,
    flex: 1,
  
  },
  taskCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  taskContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  taskText: {
    fontSize: 18,
    color: "#333",
  },
  taskTime: {
    fontSize: 16,
    color: "#6A5ACD",
    fontWeight: "bold",
  },
});