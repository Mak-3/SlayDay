import BackButtonHeader from "@/components/backButtonHeader";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from "react-native";

const ToDoApp = () => {
  
  const [tasks, setTasks] = useState([
    { id: "1", title: "Finish user onboarding", completed: false },
    {
      id: "2",
      title: "Solve the Dabble prioritisation issue",
      completed: false,
    },
    { id: "3", title: "Hold to reorder on mobile", completed: false },
    { id: "4", title: "Update onboarding workflow templates", completed: true },
    { id: "5", title: "Connect time tracking with tasks", completed: true },
  ]);
  

  const [modalVisible, setModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const toggleComplete = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const openAddTaskModal = () => {
    setCurrentTask("");
    setEditingTaskId(null);
    setModalVisible(true);
  };

  const openEditTaskModal = (task: any) => {
    setCurrentTask(task.title);
    setEditingTaskId(task.id);
    setModalVisible(true);
  };

  const handleSaveTask = () => {
    if (!currentTask.trim()) {
      Alert.alert("Task cannot be empty!");
      return;
    }

    if (editingTaskId) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTaskId ? { ...task, title: currentTask } : task
        )
      );
    } else {
      const newTask = {
        id: Date.now().toString(),
        title: currentTask,
        completed: false,
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }

    setModalVisible(false);
    setCurrentTask("");
    setEditingTaskId(null);
  };

  const handleDeleteTask = (id: string) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        },
      },
    ]);
  };

  const renderTask = ({ item }: any) => (
    <View style={[styles.taskCard, item.completed && styles.completedTaskCard]}>
      <MaterialIcons name="drag-indicator" size={24} color="grey" />
      <TouchableOpacity
        onPress={() => toggleComplete(item.id)}
        style={[styles.checkbox, item.completed && styles.checked]}
      >
        {item.completed && (
          <MaterialIcons name="check" size={16} color="white" />
        )}
      </TouchableOpacity>

      <View style={styles.taskContent}>
        <Text
          style={[styles.taskTitle, item.completed && styles.completedText]}
        >
          {item.title}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => openEditTaskModal(item)}
        style={styles.iconButton}
      >
        <MaterialIcons name="edit" size={20} color="#4B5563" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleDeleteTask(item.id)}
        style={styles.iconButton}
      >
        <MaterialIcons name="delete" size={20} color="#DC2626" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <BackButtonHeader />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={openAddTaskModal}
          style={styles.newTaskButton}
        >
          <Text style={styles.newTaskText}>+ New Task</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={styles.list}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editingTaskId ? "Edit Task" : "Add New Task"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter task title"
              value={currentTask}
              onChangeText={setCurrentTask}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setCurrentTask("");
                  setEditingTaskId(null);
                }}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveTask}
                style={[styles.modalButton, styles.saveButton]}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  newTaskButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  newTaskText: { color: "#fff", fontWeight: "bold" },
  list: { paddingBottom: 50 },
  taskCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  completedTaskCard: { backgroundColor: "#F3F4F6" },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: { backgroundColor: "#4F46E5" },
  taskContent: { flex: 1 },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  completedText: { textDecorationLine: "line-through", color: "#9CA3AF" },
  iconButton: {
    marginLeft: 8,
    padding: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 16,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: { backgroundColor: "#E5E7EB" },
  saveButton: { backgroundColor: "#4F46E5" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

export default ToDoApp;
