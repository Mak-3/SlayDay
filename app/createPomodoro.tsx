import BackButtonHeader from "@/components/backButtonHeader";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { FontAwesome5 } from "@expo/vector-icons";
import PastSessions from "@/components/pastSessions";
import PageLayout from "@/components/pageLayout";

const deviceWidth = Dimensions.get("window").width;

const PomodoroUI = () => {
  const [time, setTime] = useState(300);
  const [remaining, setRemaining] = useState(time);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [taskTitle, setTaskTitle] = useState("Creating App Design System ");
  const [isEditing, setIsEditing] = useState(false);
  const [showLogPrompt, setShowLogPrompt] = useState(false);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [startDateTime, setStartDateTime] = useState(0);
  const [endDateTime, setEndDateTime] = useState(0);
  const [showCustomTimerModal, setShowCustomTimerModal] = useState(false);
  const [customMinutesInput, setCustomMinutesInput] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerStarted && !isPaused) {
      interval = setInterval(() => {
        setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerStarted, isPaused]);

  const timeFormat = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }

    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const presets = [5, 10, 20, 25, 60, 120];

  const handlePresetPress = (min: number) => {
    if (isTimerStarted) return;
    setTime(min * 60);
    setRemaining(min * 60);
    setSelectedTime(min);
  };

  const handleCustomTimeConfirm = () => {
    if (isTimerStarted) return;
    const mins = parseInt(customMinutesInput);
    if (!isNaN(mins) && mins > 0) {
      setTime(mins * 60);
      setRemaining(mins * 60);
      setSelectedTime(null);
      setShowCustomTimerModal(false);
      setCustomMinutesInput("");
    }
  };

  const handlePlay = () => {
    if (!isTimerStarted) {
      setIsTimerStarted(true);
      setIsPaused(false);
      if(startDateTime == 0){
        const currentTime = new Date().getTime()
        setStartDateTime(currentTime);
      }
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleEndNow = () => {
    setShowLogPrompt(true);
    setIsPaused(true);
  };

  const handleLogYes = () => {
    setShowLogPrompt(false);
    setIsEditing(false);
    setTime(300);
    setTaskTitle("Creating App Design System ");
    setRemaining(time);
    setIsTimerStarted(false);

    const currentTime = new Date().getTime();
    setEndDateTime(currentTime)
    console.log("Session logged!");
  };

  const handleLogNo = () => {
    setShowLogPrompt(false);
    setIsEditing(false);
    setTime(300);
    setTaskTitle("Creating App Design System ");
    setRemaining(time);
    setIsTimerStarted(false);
    console.log("Session discarded!");
  };

  const fill = isTimerStarted ? ((time - remaining) / time) * 100 : 0;

  return (
    <PageLayout style={styles.container}>
      <BackButtonHeader title="Start your focus session" />
      <View style={styles.pomodoroContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.presetButtonsWrapper}
          data={presets}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              disabled={isTimerStarted}
              style={[
                styles.presetButton,
                selectedTime === item && styles.selectedPresetButton,
              ]}
              onPress={() => handlePresetPress(item)}
            >
              <Text
                style={[
                  styles.presetText,
                  selectedTime === item && { color: "#FFFFFF" },
                ]}
              >
                {item} min
              </Text>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.customTimerButton}
              onPress={() => setShowCustomTimerModal(true)}
              disabled={isTimerStarted}
            >
              <Text style={styles.customTimerButtonText}>Custom</Text>
            </TouchableOpacity>
          }
        />

        <View style={styles.timerContainer}>
          <AnimatedCircularProgress
            size={Math.min(deviceWidth - 40, 350)}
            width={20}
            fill={fill}
            tintColor="#3B82F6"
            backgroundColor="#E5E7EB"
            rotation={0}
            lineCap="round"
          >
            {() => (
              <Text style={styles.timerText}>{timeFormat(remaining)}</Text>
            )}
          </AnimatedCircularProgress>
        </View>

        <View style={styles.actionButtons}>
          {!isTimerStarted && (
            <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
              <FontAwesome5 name="play" size={20} color="white" />
            </TouchableOpacity>
          )}
          {isTimerStarted && !isPaused && (
            <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
              <FontAwesome5 name="pause" size={20} color="white" />
            </TouchableOpacity>
          )}
          {isTimerStarted && isPaused && (
            <TouchableOpacity
              style={styles.resumeButton}
              onPress={handleResume}
            >
              <FontAwesome5 name="play" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.focusText}>I'm Focusing on</Text>

        <View style={styles.taskContainer}>
          {isEditing ? (
            <View style={styles.taskInputContainer}>
              <TextInput
                style={styles.taskInput}
                value={taskTitle}
                onChangeText={setTaskTitle}
                placeholder="Enter your focus task..."
                maxLength={50}
                autoFocus
              />
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.saveIcon}>✔️</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                  setIsEditing(false);
                  setTaskTitle(taskTitle || "Creating App Design System "); // reset if canceled
                }}
              >
                <Text style={styles.cancelIcon}>❌</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.taskDisplay}
              onPress={() => setIsEditing(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.taskText}>
                {taskTitle || "Tap to add your focus task"}
              </Text>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.endButton} onPress={handleEndNow}>
          <Text style={styles.endText}>End Now</Text>
        </TouchableOpacity>

        <Modal
          visible={showLogPrompt}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowLogPrompt(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>
                Do you want to log this session?
              </Text>

              <View style={styles.modalButtons}>
                <Pressable style={styles.modalBtnYes} onPress={handleLogYes}>
                  <Text style={styles.modalBtnText}>Yes</Text>
                </Pressable>

                <Pressable style={styles.modalBtnNo} onPress={handleLogNo}>
                  <Text style={styles.modalBtnText}>No</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Custom Timer Modal */}
        <Modal
          visible={showCustomTimerModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCustomTimerModal(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.customModalContainer}>
              <Text style={styles.modalText}>Set Custom Timer (minutes)</Text>
              <TextInput
                style={styles.customModalInput}
                placeholder="Enter minutes"
                keyboardType="numeric"
                value={customMinutesInput}
                onChangeText={setCustomMinutesInput}
              />

              <View style={styles.modalButtons}>
                <Pressable
                  style={styles.modalBtnYes}
                  onPress={handleCustomTimeConfirm}
                >
                  <Text style={styles.modalBtnText}>Confirm</Text>
                </Pressable>

                <Pressable
                  style={styles.modalBtnNo}
                  onPress={() => setShowCustomTimerModal(false)}
                >
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {},
  pomodoroContainer: { alignItems: "center" },
  presetButtonsWrapper: { marginVertical: 20 },
  presetButton: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  selectedPresetButton: {
    backgroundColor: "#3B82F6",
  },
  presetText: {
    fontSize: 16,
    color: "#111827",
  },
  customTimerButton: {
    backgroundColor: "#6B7280",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  customTimerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  timerContainer: { marginVertical: 20 },
  timerText: {
    fontSize: 48,
    color: "#111827",
    fontWeight: "bold",
  },
  actionButtons: { flexDirection: "row", marginVertical: 20 },
  playButton: {
    backgroundColor: "#10B981",
    padding: 20,
    borderRadius: 50,
  },
  pauseButton: {
    backgroundColor: "#F59E0B",
    padding: 20,
    borderRadius: 50,
  },
  resumeButton: {
    backgroundColor: "#10B981",
    padding: 20,
    borderRadius: 50,
  },
  focusText: { fontSize: 18, marginVertical: 10 },

  endButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  endText: { color: "#FFFFFF", fontSize: 16 },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  customModalContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalText: { fontSize: 16, marginBottom: 20 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalBtnYes: {
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  modalBtnNo: {
    backgroundColor: "#6B7280",
    padding: 12,
    borderRadius: 8,
  },
  modalBtnText: { color: "#FFFFFF", fontWeight: "600" },
  customModalInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    marginBottom: 20,
  },
  taskContainer: {
    marginVertical: 16,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
  },

  taskDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    minHeight: 50,
  },

  taskText: {
    fontSize: 16,
    color: "#111827",
    flexShrink: 1,
  },

  editIcon: {
    marginLeft: 8,
    fontSize: 18,
  },

  taskInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#3B82F6",
    minHeight: 50,
    width: "100%",
  },

  taskInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },

  iconButton: {
    marginLeft: 10,
  },

  saveIcon: {
    fontSize: 20,
    color: "#10B981",
  },

  cancelIcon: {
    fontSize: 20,
    color: "#EF4444",
  },
});

export default PomodoroUI;
