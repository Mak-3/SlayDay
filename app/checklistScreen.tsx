import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Pressable,
  KeyboardAvoidingView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { MaterialIcons } from "@expo/vector-icons";
import { ObjectId } from "bson";
import { router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";

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

import * as DocumentPicker from "expo-document-picker";
import { getUser } from "@/db/service/UserService";

import BottomSheet, {
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
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

const ChecklistScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [originalChecklist, setOriginalChecklist] =
    useState<ChecklistData | null>(null);
  const [checklist, setChecklist] = useState<ChecklistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [bottomSheetTask, setBottomSheetTask] = useState<Task | null>(null);
  const [showDoneModal, setShowDoneModal] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [isTitleSheetVisible, setIsTitleSheetVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [jsonUploadEnabled, setJsonUploadEnabled] = useState(false);
  const taskBottomSheetRef = useRef<BottomSheet>(null);
  const checklistBottomSheetRef = useRef<BottomSheet>(null);
  const lottieRef = useRef<LottieView>(null);

  // Add new state for keyboard handling
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Memoize handlers to prevent unnecessary re-renders
  const handleKeyboardShow = useCallback((e: any) => {
    setKeyboardVisible(true);
  }, []);

  const handleKeyboardHide = useCallback(() => {
    setKeyboardVisible(false);

    // Only adjust bottom sheets if they're visible
    if (isBottomSheetVisible) {
      taskBottomSheetRef.current?.snapToIndex(0);
    } else if (isTitleSheetVisible) {
      checklistBottomSheetRef.current?.snapToIndex(0);
    }
  }, [isBottomSheetVisible, isTitleSheetVisible]);

  // Improved keyboard effect
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      handleKeyboardShow
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      handleKeyboardHide
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [handleKeyboardShow, handleKeyboardHide]);

  // Improved bottom sheet handling
  const openBottomSheet = useCallback((task: Task) => {
    setBottomSheetTask(task);
    setSelectedDate(task.deadline ? task.deadline : null);
    setIsBottomSheetVisible(true);
    taskBottomSheetRef.current?.expand();
  }, []);

  const closeBottomSheet = useCallback(() => {
    taskBottomSheetRef.current?.close();
    setIsBottomSheetVisible(false);
    setBottomSheetTask(null);
  }, []);

  const openTitleSheet = useCallback(() => {
    setEditedTitle(checklist?.title || "");
    setIsTitleSheetVisible(true);
    checklistBottomSheetRef.current?.expand();
  }, [checklist?.title]);

  const closeTitleSheet = useCallback(() => {
    checklistBottomSheetRef.current?.close();
    setIsTitleSheetVisible(false);
    setEditedTitle("");
  }, []);

  const handleSaveChecklistTasks = useCallback(async () => {
    if (!checklist) return;
    try {
      await updateChecklist(new ObjectId(checklist._id), {
        title: checklist.title,
        tasks: checklist.tasks
          .filter((task) => task.title.trim() !== "")
          .map(({ id, title, isCompleted, deadline }) => ({
            id,
            title,
            isCompleted,
            deadline,
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
  }, [checklist, router]);

  const handleChecklistCompleted = useCallback(() => {
    setShowDoneModal(false);
    handleSaveChecklistTasks();
    router.push("/drawer/checklistOverview");
  }, [handleSaveChecklistTasks, router]);

  const renderDoneModal = useCallback(
    (title: string) => {
      return (
        showDoneModal && (
          <View style={StyleSheet.absoluteFillObject}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <LottieView
                  ref={lottieRef}
                  source={require("../assets/files/checklistComplete.json")}
                  autoPlay
                  loop={false}
                  style={{ width: 200, height: 200 }}
                />
                <Text style={styles.modalText}>{title} Completed!</Text>
                <Pressable
                  style={styles.modalCloseButton}
                  onPress={handleChecklistCompleted}
                >
                  <Text style={styles.modalBtnText}>Close</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )
      );
    },
    [showDoneModal, handleChecklistCompleted]
  );

  // Improved bottom sheet render function
  const renderBottomSheet = useCallback(() => {
    if (!bottomSheetTask) return null;

    const handleUpdate = () => {
      if (!checklist) return;

      setChecklist((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.map((task) =>
                task.id === bottomSheetTask.id
                  ? {
                      ...task,
                      title: bottomSheetTask.title,
                      deadline: selectedDate
                        ? dayjs(selectedDate).toDate()
                        : undefined,
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
      <>
        {isBottomSheetVisible && (
          <TouchableWithoutFeedback onPress={closeBottomSheet}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
        )}

        <BottomSheet
          ref={taskBottomSheetRef}
          enablePanDownToClose
          onClose={closeBottomSheet}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
        >
          <BottomSheetView style={{ flex: 1 }}>
            <View style={styles.sheetContent}>
              <Text style={styles.sheetTitle}>Edit Task</Text>
              <BottomSheetTextInput
                placeholder="Title"
                value={bottomSheetTask.title}
                onChangeText={(text: string) =>
                  setBottomSheetTask({ ...bottomSheetTask, title: text })
                }
                style={[
                  styles.bottomSheetInput,
                  styles.bottomSheetFocusedInput,
                ]}
              />

              <TouchableOpacity
                style={styles.deadlineButton}
                onPress={() => {
                  setSelectedDate(bottomSheetTask.deadline || null);
                  setShowPicker(true);
                }}
              >
                <Text style={styles.deadlineText}>
                  📅 Deadline:{" "}
                  {selectedDate
                    ? dayjs(selectedDate).format("MMM DD, YYYY")
                    : "No deadline set"}
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
          </BottomSheetView>
        </BottomSheet>
      </>
    );
  }, [bottomSheetTask, isBottomSheetVisible, selectedDate, closeBottomSheet]);

  // Improved title bottom sheet render function
  const renderTitleBottomSheet = useCallback(() => {
    if (!editedTitle) return null;

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
      <>
        {isTitleSheetVisible && (
          <TouchableWithoutFeedback onPress={closeTitleSheet}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
        )}

        <BottomSheet
          ref={checklistBottomSheetRef}
          enablePanDownToClose
          onClose={closeTitleSheet}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
        >
          <BottomSheetView style={{ flex: 1 }}>
            <View style={styles.sheetContent}>
              <Text style={styles.sheetTitle}>Edit Checklist</Text>

              <BottomSheetTextInput
                placeholder="Checklist Title"
                value={editedTitle}
                onChangeText={setEditedTitle}
                style={[
                  styles.bottomSheetInput,
                  styles.bottomSheetFocusedInput,
                ]}
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
          </BottomSheetView>
        </BottomSheet>
      </>
    );
  }, [editedTitle, isTitleSheetVisible, closeTitleSheet]);

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
    if (!originalChecklist || !checklist) return;

    const isEqual =
      JSON.stringify(originalChecklist) === JSON.stringify(checklist);
    setIsChanged(!isEqual);
  }, [checklist, originalChecklist]);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const userInfo: any = await getUser();
      const jsonPrefValue = userInfo?.preferences?.jsonUploadEnabled ?? false;
      setJsonUploadEnabled(jsonPrefValue);
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  };

  const onDateChange = (event: any, date?: Date) => {
    setShowPicker(false);
    setIsBottomSheetVisible(true);
    if (event.type === "set" && date) {
      setSelectedDate(date);
    }
    setIsBottomSheetVisible(true);
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

  const handleDeleteChecklist = async () => {
    try {
      await deleteChecklist(new ObjectId(new ObjectId(id)));
      Toast.show({ type: "success", text1: "Checklist updated successfully" });
      router.replace("/drawer/checklistOverview");
    } catch (err) {
      console.error("Failed to update checklist", err);
    }
  };

  const getProgress = () => {
    const completedCount =
      checklist?.tasks.filter((task) => task.isCompleted).length || 0;
    const totalTasks = checklist?.tasks.length || 0;
    const progress = totalTasks ? (completedCount / totalTasks) * 100 : 0;
    return progress;
  };

  const handleUploadJson = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
      });

      if (result.canceled || !result.assets || !result.assets.length) return;

      const fileUri = result.assets[0].uri;
      const fileContent = await fetch(fileUri).then((res) => res.text());
      const parsed = JSON.parse(fileContent);

      if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
        Toast.show({ type: "error", text1: "Invalid file format" });
        return;
      }

      const newTasks: Task[] = parsed.tasks.map((task: any) => ({
        id: new ObjectId().toString(),
        title: task.title || "",
        isCompleted: !!task.isCompleted,
        deadline: task.deadline ? new Date(task.deadline) : undefined,
      }));

      setChecklist((prev) =>
        prev
          ? {
              ...prev,
              tasks: [...prev.tasks, ...newTasks],
            }
          : prev
      );

      Toast.show({ type: "success", text1: "Tasks imported successfully" });
    } catch (error) {
      console.error("Failed to import tasks", error);
      Toast.show({ type: "error", text1: "Failed to import tasks" });
    }
  };

  const formatDeadline = (deadline: any) => {
    return dayjs(deadline).format("MMM D, YYYY");
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
              setSelectedDate(new Date(item.deadline));
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
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!checklist) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.errorText}>Checklist not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        enabled={!keyboardVisible}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={handleOutsideClick}>
            <View style={styles.container}>
              <BackButtonHeader />

              {/* Fixed Header */}
              <View style={styles.headerContainer}>
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
              </View>

              {/* Scrollable List */}
              <View style={styles.listContainer}>
                <DraggableFlatList
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  data={checklist.tasks || []}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                  onDragEnd={({ data }) => {
                    setChecklist(
                      (prevChecklist) =>
                        ({
                          ...prevChecklist,
                          tasks: data,
                        } as any)
                    );
                  }}
                  contentContainerStyle={{ 
                    paddingBottom: Platform.OS === "android" ? 40 : 20 
                  }}
                />
              </View>

              {/* Fixed Footer */}
              <View style={styles.footerContainer}>
                <View style={styles.tasksButtonWrapper}>
                  {jsonUploadEnabled && (
                    <TouchableOpacity
                      style={styles.importButton}
                      onPress={handleUploadJson}
                    >
                      <Text style={styles.importButtonText}>
                        📤 Import Tasks
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.addTaskButton}
                    onPress={addTask}
                  >
                    <Text style={styles.addTaskText}>+ Add Task</Text>
                  </TouchableOpacity>
                </View>

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
              </View>

              {showPicker && (
                <DateTimePicker
                  value={selectedDate ? new Date(selectedDate) : new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </GestureHandlerRootView>
      </KeyboardAvoidingView>
      {renderBottomSheet()}
      {renderTitleBottomSheet()}
      {renderDoneModal(checklist.title)}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === "android" ? 10 : 0,
  },
  headerContainer: {
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
  },
  footerContainer: {
    paddingTop: 10,
    paddingBottom: Platform.OS === "android" ? 20 : 10,
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
    gap: 10,
    alignItems: "center",
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
  tasksButtonWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },
  addTaskButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  addTaskText: {
    color: "#333",
  },
  saveChecklistButton: {
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  bottomSheetInput: {
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
  bottomSheetFocusedInput: {
    backgroundColor: CrimsonLuxe.primary100,
    borderColor: CrimsonLuxe.primary300,
  },
  bottomSheetContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
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
    marginBottom: 12,
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
  importButton: {
    backgroundColor: CrimsonLuxe.primary400,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    flex: 1,
    alignItems: "center",
  },
  importButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ChecklistScreen;
