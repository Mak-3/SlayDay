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
  deleteChecklist,
  getChecklistById,
  updateChecklist,
} from "@/db/service/ChecklistService";
import LottieView from "lottie-react-native";
import dayjs from "dayjs";
import { renderIcon } from "@/components/renderIcon";

interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  deadline?: Date;
}

interface ChecklistData {
  _id: string;
  title: string;
  tasks: Task[];
  deadline?: Date;
  category: string;
  description: string;
}

const ChecklistScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [originalChecklist, setOriginalChecklist] =
    useState<ChecklistData | null>(null);
  const [checklist, setChecklist] = useState<ChecklistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [bottomSheetTask, setBottomSheetTask] = useState<Task | null>(null);
  const [translateY] = useState(new Animated.Value(300));
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showDoneModal, setShowDoneModal] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [isTitleSheetVisible, setIsTitleSheetVisible] = useState(false);
  const [titleTranslateY] = useState(new Animated.Value(300));
  const [editedTitle, setEditedTitle] = useState("");

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
        setChecklist(data);
        setOriginalChecklist(data);
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

  useEffect(() => {
    if (!originalChecklist || !checklist) return;

    const isEqual =
      JSON.stringify(originalChecklist) === JSON.stringify(checklist);
    setIsChanged(!isEqual);
  }, [checklist, originalChecklist]);

  const onDateChange = (event: any, date?: Date) => {
    setShowPicker(false);
    setIsBottomSheetVisible(true);
    if (date) {
      setSelectedDate(date);
    }
  };

  const toggleComplete = (taskId: string) => {
    if (!checklist) return;

    const updatedTasks = checklist.tasks
      .map((task) => {
        return task.id === taskId
          ? { ...task, isCompleted: !task.isCompleted }
          : task;
      })
      .sort((a, b) =>
        a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1
      );

    const allCompleted = updatedTasks.every((task) => task.isCompleted);
    if (allCompleted) {
      setShowDoneModal(true);
    }
    setChecklist((prev) => (prev ? { ...prev, tasks: updatedTasks } : prev));
    setEditingTaskId(null);
  };

  const addTask = () => {
    const newTask: Task = {
      id: new ObjectId().toString(),
      title: "",
      isCompleted: false,
    };

    if (checklist) {
      setChecklist((prev) =>
        prev ? { ...prev, tasks: [...prev.tasks, newTask] } : prev
      );
      setEditingTaskId(newTask.id);
    }
  };

  const deleteTask = (taskId: string) => {
    setChecklist((prev) =>
      prev
        ? {
            ...prev,
            tasks: prev.tasks.filter((task) => task.id !== taskId),
          }
        : prev
    );
  };

  const updateTaskText = (taskId: string, title: string) => {
    setChecklist((prev) =>
      prev
        ? {
            ...prev,
            tasks: prev.tasks.map((task) =>
              task.id === taskId ? { ...task, title } : task
            ),
          }
        : prev
    );
  };

  const handleOutsideClick = () => {
    Keyboard.dismiss();
    setEditingTaskId(null);
    setChecklist((prev) =>
      prev
        ? {
            ...prev,
            tasks: prev.tasks.filter((task) => task.title.trim() !== ""),
          }
        : prev
    );
  };

  const handleSaveChecklistTasks = async () => {
    if (!checklist) return;
    try {
      await updateChecklist(new ObjectId(checklist._id), {
        title: checklist.title,
        tasks: checklist.tasks.map(({ id, title, isCompleted, deadline }) => ({
          id,
          title,
          isCompleted: isCompleted,
          deadline: deadline,
        })),
        deadline: checklist.deadline,
        lastSaved: new Date(),
      });
      Toast.show({ type: "success", text1: "Checklist updated successfully" });
      setIsChanged(false);
      router.replace("/drawer/checklistOverview");
    } catch (err) {
      console.error("Failed to update checklist", err);
    }
  };

  const handleDeleteChecklist = async () => {
    try {
      await deleteChecklist(new ObjectId(new ObjectId(id)));
      Toast.show({ type: "success", text1: "Checklist updated successfully" });
      router.replace("/drawer/checklistOverview");
    } catch (err) {
      console.error("Failed to update checklist", err);
    }
  };

  const openBottomSheet = (task: Task) => {
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

  const openTitleSheet = () => {
    setEditedTitle(checklist?.title || "");
    setIsTitleSheetVisible(true);
    Animated.timing(titleTranslateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeTitleSheet = () => {
    Animated.timing(titleTranslateY, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsTitleSheetVisible(false));
  };

  const handleChecklistCompleted = () => {
    setShowDoneModal(false);
    handleSaveChecklistTasks();
    router.push("/drawer/checklistOverview");
  };

  const renderBottomSheet = () => {
    if (!bottomSheetTask) return null;

    const handleUpdate = () => {
      setChecklist((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.map((task) =>
                task.id === bottomSheetTask.id
                  ? {
                      ...task,
                      title: bottomSheetTask.title,
                      deadline: dayjs(selectedDate).toDate(),
                    }
                  : task
              ),
            }
          : prev
      );
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
                      setIsBottomSheetVisible(false);
                      setShowPicker(true);
                    }}
                  >
                    <Text style={styles.deadlineText}>
                      📅 Deadline: {dayjs(selectedDate).format("MMM DD, YYYY")}
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

  const renderTitleBottomSheet = () => {
    const handleMarkAllDone = () => {
      setChecklist((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.map((task) => ({ ...task, isCompleted: true })),
            }
          : prev
      );
    };

    const handleSaveChecklist = () => {
      setChecklist((prev) => (prev ? { ...prev, title: editedTitle } : prev));
      closeTitleSheet();
    };

    return (
      <Modal
        transparent
        visible={isTitleSheetVisible}
        onRequestClose={closeTitleSheet}
      >
        <TouchableWithoutFeedback onPress={closeTitleSheet}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.bottomSheetContainer,
                  {
                    transform: [{ translateY: titleTranslateY }],
                    marginBottom: keyboardHeight,
                  },
                ]}
              >
                <View style={styles.sheetContent}>
                  <Text style={styles.sheetTitle}>Edit Checklist</Text>

                  <CustomTextInput
                    name="checklistTitle"
                    placeholder="Checklist Title"
                    value={editedTitle}
                    onChangeText={setEditedTitle}
                  />

                  <TouchableOpacity
                    style={styles.markDoneButton}
                    onPress={handleMarkAllDone}
                  >
                    <Text style={styles.markDoneText}>Mark All as Done</Text>
                  </TouchableOpacity>

                  <View style={styles.sheetActions}>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={handleDeleteChecklist}
                    >
                      <Text style={styles.deleteText}>Delete Checklist</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleSaveChecklist}
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

  const formatDeadline = (deadline: any) => {
    return dayjs(deadline).format("MMM D, HH:mm");
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
              item.isCompleted && styles.checked,
              { borderColor: CrimsonLuxe.primary400 },
            ]}
          >
            {item.isCompleted && (
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
              style={[
                styles.taskText,
                item.isCompleted && styles.completedText,
              ]}
            >
              {item.title}
            </Text>
          )}
          {item.deadline && (
            <Text style={styles.deadline}>{formatDeadline(item.deadline)}</Text>
          )}
          <TouchableOpacity
            onPress={() => {
              setSelectedDate(item.deadline);
              openBottomSheet(item);
            }}
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
    const completedCount =
      checklist?.tasks.filter((task) => task.isCompleted).length || 0;
    const totalTasks = checklist?.tasks.length || 0;
    const progress = totalTasks ? (completedCount / totalTasks) * 100 : 0;
    return progress;
  };

  return (
    <PageLayout>
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
                <View style={styles.checklistHeader}>
                  <View style={styles.checklistTitleWrapper}>
                    {renderIcon(checklist.category, CrimsonLuxe.primary500)}
                    <Text style={styles.sectionTitle}>{checklist.title}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={openTitleSheet}
                    style={styles.icons}
                  >
                    <MaterialIcons name="edit" size={20} color="gray" />
                  </TouchableOpacity>
                </View>

                <Text
                  style={styles.sectionDescription}
                  ellipsizeMode="tail"
                  numberOfLines={3}
                >
                  {checklist.description}
                </Text>
                <ProgressBar
                  activeColor={CrimsonLuxe.primary400}
                  showStatus={false}
                  progress={getProgress()}
                />
              </View>

              <DraggableFlatList
                showsVerticalScrollIndicator={false}
                data={checklist.tasks || []}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                onDragEnd={({ data }) => {
                  setChecklist(
                    (prevChecklist) =>
                      ({
                        ...prevChecklist,
                        tasks: data,
                      } as any)
                  );
                }}
                containerStyle={{ flex: 1 }}
                activationDistance={10}
                dragItemOverflow={true}
              />

              <TouchableOpacity style={styles.addTaskButton} onPress={addTask}>
                <Text style={styles.addTaskText}>+ Add Task</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.saveChecklistButton,
                  !isChanged && { backgroundColor: CrimsonLuxe.primary200 },
                ]}
                onPress={handleSaveChecklistTasks}
                disabled={!isChanged}
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
                        value={selectedDate}
                        mode="date"
                        display={Platform.OS === "ios" ? "inline" : "default"}
                        onChange={onDateChange}
                      />
                    </View>
                  </View>
                </View>
              </Modal>

              {renderBottomSheet()}
              {renderTitleBottomSheet()}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </PageLayout>
  );
};

export default ChecklistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left",
  },
  sectionDescription: {
    fontSize: 18,
    marginBottom: 10,
  },
  checklistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  checklistTitleWrapper: {
    flexDirection: "row",
    gap: 6,
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
  deadline: {
    fontSize: 13,
    color: "#888",
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
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 12,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
  },
  deadlineText: {
    fontSize: 14,
    color: "#333",
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  checklistTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  markDoneButton: {
    padding: 15,
    backgroundColor: CrimsonLuxe.primary400,
    borderRadius: 10,
    marginVertical: 5,
  },
  markDoneText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
});
