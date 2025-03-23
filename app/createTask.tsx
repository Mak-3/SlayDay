import BackButtonHeader from "@/components/backButtonHeader";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import PageLayout from "@/components/pageLayout";

const CreateTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [priority, setPriority] = useState("Low");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagsText, setTagsText] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleCreateEvent = () => {
    console.log({
      title,
      description,
      deadline: deadline.toISOString(),
      priority: priority,
      tags,
      tasks,
    });
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setDeadline(new Date());
    setTags([]);
    setTagsText("");
    setPriority("Low");
    setTasks([]);
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString();
  };

  const handleTagsChange = (text: string) => {
    setTagsText(text);

    const newTags = text
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    setTags(newTags);
  };

  const PrioritySelector = () => {
    const options = ["Low", "Medium", "High"];
    const colors = {
      Low: "#10B981",
      Medium: "#FBBF24",
      High: "#EF4444",
    } as any;

    return (
      <View style={styles.priorityContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.priorityOption,
              {
                borderColor: priority === option ? colors[option] : "#DDD",
                backgroundColor:
                  priority === option ? `${colors[option]}20` : "#FFF",
              },
            ]}
            onPress={() => setPriority(option)}
          >
            <View
              style={[
                styles.radioCircle,
                {
                  borderColor: priority === option ? colors[option] : "#999",
                },
              ]}
            >
              {priority === option && (
                <View
                  style={[
                    styles.selectedRb,
                    { backgroundColor: colors[option] },
                  ]}
                />
              )}
            </View>
            <Text style={styles.priorityText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
    <View style={styles.taskCard} key={item.id}>
      <View style={styles.taskContent}>
        <Text style={styles.taskTitle}>{item.title}</Text>
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
    <PageLayout style={styles.container}>
      <BackButtonHeader title="Create Task"/>
      <Text style={styles.label}>Title</Text>
      <TextInput
        placeholder="Name of task"
        value={title}
        onChangeText={setTitle}
        maxLength={30}
        style={styles.input}
      />
      <Text style={styles.charCount}>{title.length}/30</Text>

      <Text style={styles.label}>Description</Text>
      <View style={styles.descriptionBox}>
        <TextInput
          placeholder="Details about task"
          value={description}
          onChangeText={setDescription}
          style={styles.descriptionInput}
          multiline
        />
      </View>

      <Text style={styles.label}>Deadline</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowStartPicker(true)}
      >
        <Text style={{ color: deadline ? "#333" : "#999" }}>
          {formatDateTime(deadline)}
        </Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={deadline}
          mode="datetime"
          display={"default"}
          onChange={(task, selectedDate) => {
            setShowStartPicker(Platform.OS === "ios");
            if (selectedDate) setDeadline(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Priority</Text>
      <PrioritySelector />

      <Text style={styles.label}>Tags</Text>
      <TextInput
        style={styles.input}
        placeholder="Comma-separated tags, e.g. Finance, Credit Card"
        value={tagsText}
        onChangeText={handleTagsChange}
      />

      <View style={styles.taskLabelWrapper}>
        <Text style={styles.label}>Sub Tasks</Text>
        <TouchableOpacity
          onPress={openAddTaskModal}
          style={styles.newTaskButton}
        >
          <Text style={styles.newTaskText}>+ Add Task</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        scrollEnabled={false}
        nestedScrollEnabled={true}
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
                style={[styles.modalButton, styles.modalCancelButton]}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveTask}
                style={[styles.modalButton, styles.modalSaveButton]}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateEvent}
        >
          <Text style={styles.createText}>✓ Create Task</Text>
        </TouchableOpacity>
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#333",
    height: 48,
    justifyContent: "center",
    paddingVertical: 14,
    marginVertical: 5,
  },
  charCount: {
    alignSelf: "flex-end",
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  descriptionBox: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    marginVertical: 5,
  },
  descriptionInput: {
    minHeight: 80,
    paddingHorizontal: 12,
    paddingTop: 10,
    textAlignVertical: "top",
    color: "#333",
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  priorityOption: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  taskContent: { flex: 1 },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#999",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#444",
  },
  priorityText: {
    fontSize: 14,
    color: "#333",
  },
  taskLabelWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  cancelButton: {
    flex: 0.48,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelText: {
    color: "#333",
    fontSize: 16,
  },
  createButton: {
    flex: 0.48,
    backgroundColor: "#4F46E5",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  createText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  newTaskButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  newTaskText: { color: "#fff", fontWeight: "bold" },
  taskCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
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
  modalSaveButton: { backgroundColor: "#4F46E5" },
  modalCancelButton: {
    backgroundColor: "#E5E7EB",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

export default CreateTask;