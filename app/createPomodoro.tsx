import BackButtonHeader from "@/components/backButtonHeader";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import PageLayout from "@/components/pageLayout";
import { CrimsonLuxe } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomTextInput from "@/components/textInput";
import { router } from "expo-router";

const CreatePomodoroScreen = () => {
  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState("Pomodoro");
  const [selectedTime, setSelectedTime] = useState(25);
  const [customTime, setCustomTime] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Work");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const predefinedTimes = [5, 10, 15, 25, 30, 45, 60, 120, "Custom"];
  const categories = [
    "Work",
    "Study",
    "Coding",
    "Learning",
    "Reading",
    "Writing",
    "Self-Improvement",
    "Personal",
    "Meditation",
    "Exercise",
    "Creativity",
    "Hobbies",
    "Music",
    "Food & Cooking",
    "Social",
    "Gaming",
    "Other",
  ];  

  const handleCreatePomodoro = async () => {
    const timeToSave = isCustomTime ? Number(customTime) : selectedTime;

    if (!title || !timeToSave || !selectedCategory) {
      setShowErrors(true)
      return;
    }
    if (taskType == "Pomodoro") {
      router.push({
        pathname: "/pomodoroScreen",
        params: {
          title,
          time: timeToSave * 60,
          category: selectedCategory,
        },
      });
    }
    if (taskType == "Timer Challenge") {
      router.push({
        pathname: "/timer",
        params: {
          title,
          category: selectedCategory,
        },
      });
    }
  };

  return (
    <PageLayout style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View>
          <BackButtonHeader title="Create Pomodoro" />

          <Text style={styles.label}>Title</Text>
          <CustomTextInput
            name="Title"
            placeholder="Task Name"
            value={title}
            onChangeText={setTitle}
            maxLength={30}
            required={true}
            showError={showErrors}
          />

          <Text style={styles.label}>Task Type</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              onPress={() => setTaskType("Pomodoro")}
              style={[
                styles.toggleOption,
                taskType === "Pomodoro" && styles.selectedOption,
              ]}
            >
              <Text>Pomodoro</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTaskType("Timer Challenge")}
              style={[
                styles.toggleOption,
                taskType === "Timer Challenge" && styles.selectedOption,
              ]}
            >
              <Text>Timer Challenge</Text>
            </TouchableOpacity>
          </View>

          {taskType === "Pomodoro" && (
            <>
              <Text style={styles.label}>Select Time</Text>
              <View style={styles.timeContainer}>
                <FlatList
                  data={predefinedTimes}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      key={item.toString()}
                      style={[
                        styles.timeOption,
                        selectedTime === item && styles.selectedTime,
                      ]}
                      onPress={() => {
                        if (item === "Custom") {
                          setIsCustomTime(true);
                          setSelectedTime(0);
                        } else {
                          setIsCustomTime(false);
                          setSelectedTime(Number(item));
                          setCustomTime("");
                        }
                      }}
                    >
                      <Text>
                        {item === "Custom" ? "Custom" : `${item} min`}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>

              {isCustomTime && (
                <CustomTextInput
                  name="Time"
                  placeholder="Enter custom time (min)"
                  keyboardType="numeric"
                  value={customTime}
                  onChangeText={setCustomTime}
                  required={isCustomTime}
                  showError={showErrors}
                />
              )}
            </>
          )}

          <Text style={styles.label}>Category</Text>
          <TouchableOpacity
            style={[styles.input, { flexDirection: "row" }]}
            onPress={() => setCategoryModalVisible(true)}
          >
            <Text
              style={{ color: selectedCategory ? "#333" : "#999", flex: 1 }}
            >
              {selectedCategory || "Select a category"}
            </Text>
            <Icon name="arrow-drop-down" size={24} color="#333" />
          </TouchableOpacity>

          <Modal
            visible={categoryModalVisible}
            transparent
            animationType="slide"
          >
            <TouchableWithoutFeedback onPress={() => setCategoryModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <FlatList
                  data={categories}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.categoryItem}
                      onPress={() => {
                        setSelectedCategory(item);
                        setCategoryModalVisible(false);
                      }}
                    >
                      <Text style={styles.categoryText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
            </TouchableWithoutFeedback>
          </Modal>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.createButton,
                title
                  ? { backgroundColor: CrimsonLuxe.primary400 }
                  : { backgroundColor: CrimsonLuxe.primary600 },
              ]}
              onPress={handleCreatePomodoro}
              disabled={title != "" && isCustomTime && !customTime}
            >
              <Text style={styles.createText}>✓ Create Pomodoro</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
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
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    height: 48,
    justifyContent: "center",
    paddingVertical: 14,
    marginVertical: 5,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  toggleOption: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    marginHorizontal: 5,
  },
  selectedOption: {
    backgroundColor: CrimsonLuxe.primary100,
    borderColor: CrimsonLuxe.primary300,
  },
  timeContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  timeOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    marginRight: 10,
  },
  selectedTime: {
    backgroundColor: CrimsonLuxe.primary100,
    borderColor: CrimsonLuxe.primary300,
  },
  buttonContainer: {
    marginTop: 30,
  },
  createButton: {
    backgroundColor: CrimsonLuxe.primary400,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  createText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 10,
    padding: 20,
    maxHeight: 300,
  },
  categoryItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
  },
});

export default CreatePomodoroScreen;
