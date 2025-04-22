import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Modal,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { MaterialIcons } from "@expo/vector-icons";
import { ObjectId } from "bson";
import { router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";

import PageLayout from "@/components/pageLayout";
import CustomTextInput from "@/components/textInput";
import ProgressBar from "@/components/progressBar";
import BackButtonHeader from "@/components/backButtonHeader";
import { CrimsonLuxe } from "@/constants/Colors";
import {
  getChecklistById,
  updateChecklist,
} from "@/db/service/ChecklistService";
import LottieView from "lottie-react-native";
import dayjs from "dayjs";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface ChecklistData {
  _id: string;
  title: string;
  tasks: Task[];
}

const ChecklistScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [checklist, setChecklist] = useState<ChecklistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [bottomSheetTask, setBottomSheetTask] = useState<Task | null>(null);
  const [translateY] = useState(new Animated.Value(300));
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showDoneModal, setShowDoneModal] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    setTimeout(() => {
      if (lottieRef.current) {
        lottieRef.current.reset();
        lottieRef.current.play();
      }
    }, 100);
  }, [showDoneModal]);

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const data = await getChecklistById(id);
        const formattedTasks: Task[] = data.tasks.map((task: any) => ({
          id: task.id || new ObjectId().toString(),
          title: task.title,
          completed: task.isCompleted,
        }));
        setChecklist(data);
        setTasks(formattedTasks);
      } catch (error) {
        console.error("Error fetching checklist:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchChecklist();
    }
  }, [id]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const onDateChange = (event: any, date?: Date) => {
    setShowPicker(false);
    setIsBottomSheetVisible(true);
    if (date) {
      const formatted = dayjs(date).format("YYYY-MM-DD");
      setSelectedDate(formatted);
    }
    console.log(showPicker, isBottomSheetVisible, "dk")
  };

  const toggleComplete = (taskId: string) => {
    setTasks((prev) => {
      const updatedTasks = prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );

      const sortedTasks = [...updatedTasks].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });

      const allCompleted = sortedTasks.every((task) => task.completed);
      if (allCompleted) {
        setShowDoneModal(true);
      }

      return sortedTasks;
    });

    setEditingTaskId(null);
  };

  const addTask = () => {
    const newTask: Task = {
      id: new ObjectId().toString(),
      title: "",
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setEditingTaskId(newTask.id);
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const updateTaskText = (taskId: string, title: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, title } : task))
    );
  };

  const handleOutsideClick = () => {
    Keyboard.dismiss();
    setEditingTaskId(null);
    setTasks((prev) => prev.filter((task) => task.title.trim() !== ""));
  };

  const handleSaveChecklist = async () => {
    try {
      await updateChecklist(new ObjectId(checklist!._id), {
        tasks: tasks.map((task) => ({
          title: task.title,
          isCompleted: task.completed,
        })),
      });
      Toast.show({ type: "success", text1: "Checklist updated successfully" });
      router.back();
    } catch (err) {
      console.error("Failed to update checklist", err);
    }
  };

  const openBottomSheet = (task: Task) => {
    // setShowPicker(true);
    setBottomSheetTask(task);
    setIsBottomSheetVisible(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeBottomSheet = () => {
    Animated.timing(translateY, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsBottomSheetVisible(false));
  };

  const handleChecklistCompleted = () => {
    setShowDoneModal(false);
    handleSaveChecklist();
    router.push("/checklistOverview");
  };

  const renderBottomSheet = () => {
    if (!bottomSheetTask) return null;

    const handleUpdate = () => {
      updateTaskText(bottomSheetTask.id, bottomSheetTask.title);
      closeBottomSheet();
    };

    const handleDelete = () => {
      deleteTask(bottomSheetTask.id);
      closeBottomSheet();
    };

    return (
      <Modal
        transparent
        visible={isBottomSheetVisible}
        onRequestClose={closeBottomSheet}
      >
        <TouchableWithoutFeedback onPress={closeBottomSheet}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.bottomSheetContainer,
                  { transform: [{ translateY }], marginBottom: keyboardHeight },
                ]}
              >
                <View style={styles.sheetContent}>
                  <Text style={styles.sheetTitle}>Edit Task</Text>
                  <CustomTextInput
                    name="title"
                    placeholder="Title"
                    value={bottomSheetTask.title}
                    onChangeText={(text: string) =>
                      setBottomSheetTask({ ...bottomSheetTask, title: text })
                    }
                  />
                  <TouchableOpacity
                    style={styles.deadlineButton}
                    onPress={() => {
                      setIsBottomSheetVisible(false)
                      setShowPicker(true)}
                  }
                  >
                    <Text style={{ color: "#333" }}>
                      📅 Set Deadline (not implemented)
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.sheetActions}>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={handleDelete}
                    >
                      <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleUpdate}
                    >
                      <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const renderItem = ({ item, drag, isActive }: any) => {
    const isEditing = editingTaskId === item.id;
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          activeOpacity={1}
          style={[styles.taskItem, isActive && styles.activeTask]}
        >
          <MaterialIcons name="drag-indicator" size={24} color="grey" />
          <TouchableOpacity
            onPress={() => toggleComplete(item.id)}
            style={[
              styles.checkbox,
              item.completed && styles.checked,
              { borderColor: CrimsonLuxe.primary400 },
            ]}
          >
            {item.completed && (
              <MaterialIcons name="check" size={14} color="white" />
            )}
          </TouchableOpacity>

          {isEditing ? (
            <TextInput
              style={styles.input}
              value={item.title}
              onChangeText={(text) => updateTaskText(item.id, text)}
              onBlur={handleOutsideClick}
              autoFocus
            />
          ) : (
            <Text
              style={[styles.taskText, item.completed && styles.completedText]}
            >
              {item.title}
            </Text>
          )}

          <TouchableOpacity
            onPress={() => openBottomSheet(item)}
            style={styles.icons}
          >
            <MaterialIcons name="edit" size={20} color="gray" />
          </TouchableOpacity>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  if (loading) {
    return (
      <PageLayout>
        <ActivityIndicator size="large" />
      </PageLayout>
    );
  }

  if (!checklist) {
    return (
      <PageLayout>
        <Text style={styles.errorText}>Checklist not found.</Text>
      </PageLayout>
    );
  }

  const getProgress = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter((task) => task.completed).length;
    return (completedTasks / tasks.length) * 100;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <TouchableWithoutFeedback onPress={handleOutsideClick}>
          <View style={styles.container}>
            <BackButtonHeader />
            <View style={styles.progressWrapper}>
              <Text style={styles.sectionTitle}>{checklist.title}</Text>
              <ProgressBar
                activeColor={CrimsonLuxe.primary400}
                showStatus={false}
                progress={getProgress()}
              />
            </View>

            <DraggableFlatList
              showsVerticalScrollIndicator={false}
              data={tasks}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              onDragEnd={({ data }) => setTasks(data)}
              containerStyle={{ flex: 1 }}
              activationDistance={10}
              dragItemOverflow={true}
            />

            <TouchableOpacity style={styles.addTaskButton} onPress={addTask}>
              <Text style={styles.addTaskText}>+ Add Task</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveChecklistButton}
              onPress={handleSaveChecklist}
            >
              <Text style={styles.saveChecklistText}>Save Checklist</Text>
            </TouchableOpacity>
            <Modal
              visible={showDoneModal}
              transparent
              animationType="fade"
              onRequestClose={() => setShowDoneModal(false)}
            >
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <LottieView
                    ref={lottieRef}
                    source={require("../assets/files/checklistComplete.json")}
                    autoPlay
                    loop={false}
                    style={{ width: 300, height: 300 }}
                  />
                  <Text style={styles.modalText}>
                    {checklist.title} Completed!
                  </Text>
                  <Pressable
                    style={styles.modalCloseButton}
                    onPress={() => handleChecklistCompleted()}
                  >
                    <Text style={styles.modalBtnText}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>

            <Modal
              visible={showPicker}
              transparent
              animationType="fade"
              onRequestClose={() => setShowPicker(false)}
            >
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <View style={styles.datePickerWrapper}>
                    <DateTimePicker
                      value={new Date(selectedDate)}
                      mode="date"
                      display={Platform.OS === "ios" ? "inline" : "default"}
                      onChange={onDateChange}
                    />
                  </View>
                </View>
              </View>
            </Modal>

            {renderBottomSheet()}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default ChecklistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "left",
  },
  progressWrapper: {
    marginVertical: 20,
    backgroundColor: CrimsonLuxe.primary200,
    borderRadius: 20,
    padding: 20,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  activeTask: {
    backgroundColor: "#f3f3f3",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    marginHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    backgroundColor: CrimsonLuxe.primary400,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  icons: {
    paddingHorizontal: 8,
  },
  addTaskButton: {
    marginTop: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
  },
  addTaskText: {
    color: "#333",
  },
  saveChecklistButton: {
    marginTop: 16,
    backgroundColor: CrimsonLuxe.primary400,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveChecklistText: {
    color: "#fff",
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  bottomSheetContainer: {
    backgroundColor: "#fff",
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    paddingBottom: 30,
  },
  sheetContent: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  deadlineButton: {
    padding: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 16,
  },
  sheetActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  saveButton: {
    flex: 1,
    backgroundColor: CrimsonLuxe.primary400,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 8,
    alignItems: "center",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 8,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
  },
  deleteText: {
    color: "#000",
  },
  errorText: {
    padding: 20,
    fontSize: 16,
    color: "red",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalText: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  modalBtnText: { color: "white", fontSize: 16 },
  modalCloseButton: {
    marginTop: 10,
    backgroundColor: CrimsonLuxe.primary400,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  datePickerWrapper: {
    alignItems: "center",
  },
  selectedDate: {
    backgroundColor: CrimsonLuxe.primary300,
  },
});
