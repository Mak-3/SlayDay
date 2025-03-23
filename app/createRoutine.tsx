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
  Switch,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import BackButtonHeader from "@/components/backButtonHeader";
import PageLayout from "@/components/pageLayout";

const CreateRoutine = () => {
  const [routineName, setRoutineName] = useState("");
  const [description, setDescription] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [lockSubtaskOrder, setLockSubtaskOrder] = useState(false);

  const [startTime, setStartTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);

  const [repeatOption, setRepeatOption] = useState<
    "Everyday" | "Weekdays" | "Weekends" | "Custom"
  >("Custom");
  const [customDays, setCustomDays] = useState<string[]>(["Mon", "Wed", "Fri"]);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const toggleCustomDay = (day: string) => {
    setCustomDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const handleTagsChange = (text: string) => {
    setTagsText(text);

    const newTags = text
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    setTags(newTags);
  };

  const toggleLockSubtaskOrder = () => {
    setLockSubtaskOrder((prev) => !prev);
  };

  const handleCreateRoutine = () => {
    console.log({
      routineName,
      description,
      tags,
      startTime: startTime.toISOString(),
      lockSubtaskOrder,
      tasks,
    });

    Alert.alert(
      "Routine Created",
      `Your routine "${routineName}" has been saved!`
    );

    handleCancel();
  };

  const handleCancel = () => {
    setRoutineName("");
    setDescription("");
    setTags([]);
    setTagsText("");
    setTasks([]);
    setStartTime(new Date());
    setLockSubtaskOrder(false);
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
      <BackButtonHeader title="Create Routine" />
      <Text style={styles.label}>Routine Name</Text>
      <TextInput
        placeholder="Enter routine name"
        value={routineName}
        onChangeText={setRoutineName}
        style={styles.input}
        maxLength={30}
      />
      <Text style={styles.charCount}>{routineName.length}/30</Text>

      <Text style={styles.label}>Description</Text>
      <TextInput
        placeholder="Describe your routine"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 100 }]}
        multiline
      />

      <Text style={styles.label}>Start Time</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowStartTimePicker(true)}
      >
        <Text>{startTime.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display={"default"}
          onChange={(event, selectedDate) => {
            setShowStartTimePicker(Platform.OS === "ios");
            if (selectedDate) setStartTime(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Repeat</Text>

      {/* Radio Option: Every Day */}
      <TouchableOpacity
        style={styles.radioOption}
        onPress={() => setRepeatOption("Everyday")}
      >
        <View style={styles.radioCircle}>
          {repeatOption === "Everyday" && <View style={styles.selectedRb} />}
        </View>
        <Text style={styles.radioLabel}>Every Day</Text>
      </TouchableOpacity>

      {/* Radio Option: Weekdays */}
      <TouchableOpacity
        style={styles.radioOption}
        onPress={() => setRepeatOption("Weekdays")}
      >
        <View style={styles.radioCircle}>
          {repeatOption === "Weekdays" && <View style={styles.selectedRb} />}
        </View>
        <Text style={styles.radioLabel}>Weekdays (Mon-Fri)</Text>
      </TouchableOpacity>

      {/* Radio Option: Weekends */}
      <TouchableOpacity
        style={styles.radioOption}
        onPress={() => setRepeatOption("Weekends")}
      >
        <View style={styles.radioCircle}>
          {repeatOption === "Weekends" && <View style={styles.selectedRb} />}
        </View>
        <Text style={styles.radioLabel}>Weekends (Sat-Sun)</Text>
      </TouchableOpacity>

      {/* Radio Option: Custom */}
      <TouchableOpacity
        style={styles.radioOption}
        onPress={() => setRepeatOption("Custom")}
      >
        <View style={styles.radioCircle}>
          {repeatOption === "Custom" && <View style={styles.selectedRb} />}
        </View>
        <Text style={styles.radioLabel}>Custom</Text>
      </TouchableOpacity>

      {/* Custom Days Toggle */}
      {repeatOption === "Custom" && (
        <View style={styles.customDaysContainer}>
          {daysOfWeek.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayToggle,
                customDays.includes(day) && styles.daySelected,
              ]}
              onPress={() => toggleCustomDay(day)}
            >
              <Text
                style={[
                  styles.dayText,
                  customDays.includes(day) && styles.dayTextSelected,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>Tags</Text>
      <TextInput
        placeholder="Comma-separated tags, e.g. Health, Fitness"
        value={tagsText}
        onChangeText={handleTagsChange}
        style={styles.input}
      />

      <View style={styles.lockOrderContainer}>
        <Text style={styles.label}>Lock Subtask Order</Text>
        <Switch
          value={lockSubtaskOrder}
          onValueChange={toggleLockSubtaskOrder}
          thumbColor={lockSubtaskOrder ? "#007AFF" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
      </View>

      <Text style={styles.helperText}>
        {lockSubtaskOrder
          ? "Subtasks must be completed in the given order."
          : "Subtasks can be completed in any order."}
      </Text>

      <View style={styles.taskLabelWrapper}>
        <Text style={styles.label}>Steps in Routine</Text>
        <TouchableOpacity
          onPress={openAddTaskModal}
          style={styles.newTaskButton}
        >
          <Text style={styles.newTaskText}>+ Add Step</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        scrollEnabled={false}
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
              {editingTaskId ? "Edit Step" : "Add New Step"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter step title"
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
          onPress={handleCreateRoutine}
        >
          <Text style={styles.createText}>✓ Create Routine</Text>
        </TouchableOpacity>
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    marginTop: 15,
  },
  subLabel: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  helperText: {
    fontSize: 14,
    color: "gray",
    marginBottom: 16,
  },
  lockOrderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
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
    color: "#999",
    fontSize: 12,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 10,
  },
  dayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 20,
  },
  dayButtonSelected: {
    backgroundColor: "#10B98120",
    borderColor: "#10B981",
  },
  dayText: {
    color: "#333",
    fontSize: 14,
  },
  dayTextSelected: {
    color: "#059669",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4B5563",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4B5563",
  },

  radioLabel: {
    fontSize: 16,
    color: "#333",
  },

  customDaysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },

  dayToggle: {
    borderWidth: 1,
    borderColor: "#4B5563",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },

  daySelected: {
    backgroundColor: "#4B5563",
  },

  taskLabelWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  newTaskButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#10B98120",
    borderRadius: 8,
  },
  newTaskText: {
    color: "#10B981",
    fontWeight: "500",
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    marginVertical: 6,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    color: "#333",
    fontSize: 16,
  },
  iconButton: {
    marginLeft: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
  },
  createButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#10B981",
    borderRadius: 12,
  },
  cancelText: {
    color: "#374151",
    fontWeight: "500",
  },
  createText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000099",
  },
  modalContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalCancelButton: {
    backgroundColor: "#E5E7EB",
  },
  modalSaveButton: {
    backgroundColor: "#10B981",
  },
  buttonText: {
    color: "#333",
    fontWeight: "500",
  },
});

export default CreateRoutine;
