import BackButtonHeader from "@/components/backButtonHeader";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { FontAwesome5 } from "@expo/vector-icons";
import PageLayout from "@/components/pageLayout";
import LottieView from "lottie-react-native";
import { CrimsonLuxe } from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";

import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createPomodoro } from "@/db/service/PomodoroService";

const deviceWidth = Dimensions.get("window").width;

const PomodoroUI = () => {
  const { title, time: routeTime, category } = useLocalSearchParams();
  const parsedTime = parseInt(routeTime as string) || 300;

  const [time, setTime] = useState(parsedTime);
  const [remaining, setRemaining] = useState(parsedTime);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [taskTitle, setTaskTitle] = useState(
    (title as string) || "My Focus Task"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [showLogPrompt, setShowLogPrompt] = useState(false);
  const [showResetPrompt, setShowResetPrompt] = useState(false);
  const [startDateTime, setStartDateTime] = useState(0);
  const [endDateTime, setEndDateTime] = useState(0);
  const [showDoneModal, setShowDoneModal] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerStarted && !isPaused) {
      interval = setInterval(() => {
        setRemaining((prev) => {
          if (prev === 1) setShowDoneModal(true);
          return prev > 0 ? prev - 1 : 0;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerStarted, isPaused]);

  const timeFormat = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handlePlay = () => {
    if (!isTimerStarted) {
      setIsTimerStarted(true);
      setIsPaused(false);
      if (startDateTime === 0) {
        setStartDateTime(Date.now());
      }
    }
  };

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  const handleEndNow = () => {
    setEndDateTime(Date.now());
    setShowLogPrompt(true);
    setIsPaused(true);
  };

  const handleLogYes = async () => {
    try {
      await createPomodoro({
        title: taskTitle,
        taskType: "Pomodoro",
        time: time,
        category: category as string,
        createdAt: startDateTime,
        endAt: endDateTime
      });
    } catch (error) {
      console.error("Failed to create Pomodoro:", error);
      alert("Something went wrong while creating the Pomodoro.");
    }
    setShowLogPrompt(false);
    setIsEditing(false);
    setIsTimerStarted(false);
    setRemaining(time);
    setStartDateTime(0);
  };

  const handleLogNo = () => {
    setShowLogPrompt(false);
    setIsEditing(false);
    setIsTimerStarted(false);
    setRemaining(time);
    setStartDateTime(0);
    setEndDateTime(0);
  };

  const handleResetPress = () => {
    setIsPaused(true);
    setShowResetPrompt(true);
  };

  const confirmReset = () => {
    setRemaining(time);
    setIsPaused(false);
    setIsTimerStarted(false);
    setStartDateTime(0);
    setEndDateTime(0);
    setShowResetPrompt(false);
  };

  const cancelReset = () => {
    setShowResetPrompt(false);
    setIsPaused(true); // Keep paused as per request
  };

  const fill = isTimerStarted ? ((time - remaining) / time) * 100 : 0;

  const renderIcon = (icon: string, lib: string, color: string) => {
    switch (lib) {
      case "FontAwesome":
        return <FontAwesome name={icon} size={24} color="#fff" />;
      case "MaterialCommunityIcons":
        return <MaterialCommunityIcons name={icon} size={24} color="#fff" />;
      case "MaterialIcons":
      default:
        return <Icon name={icon} size={24} color="#fff" />;
    }
  };

  return (
    <PageLayout style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <BackButtonHeader title="Pomodoro Session" />
          <View style={styles.taskContainer}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: CrimsonLuxe.primary400 },
              ]}
            >
              {renderIcon("book", "FontAwesome", "#fff")}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{taskTitle}</Text>
              <Text style={styles.duration}>{time} minutes</Text>
            </View>
          </View>

          <View style={styles.pomodoroContainer}>
            <Modal
              visible={showDoneModal}
              transparent
              animationType="fade"
              onRequestClose={() => setShowDoneModal(false)}
            >
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <LottieView
                    source={require("../assets/files/pomodoroComplete.json")}
                    autoPlay
                    loop={false}
                    style={{ width: 300, height: 300 }}
                  />
                  <Text style={styles.modalText}>Session Complete!</Text>
                  <Pressable
                    style={styles.modalCloseButton}
                    onPress={() => setShowDoneModal(false)}
                  >
                    <Text style={styles.modalBtnText}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>

            <View style={styles.timerContainer}>
              <AnimatedCircularProgress
                size={Math.min(deviceWidth - 40, 300)}
                width={22}
                fill={fill}
                tintColor={CrimsonLuxe.primary400}
                backgroundColor="#E5E7EB"
                rotation={0}
                lineCap="round"
              >
                {() => (
                  <Text style={styles.timerText}>{timeFormat(remaining)}</Text>
                )}
              </AnimatedCircularProgress>
            </View>

            <View style={styles.actionButtonsWrapper}>
              <TouchableOpacity
                style={styles.sideButtons}
                onPress={handleResetPress}
              >
                <MaterialCommunityIcons
                  name="refresh"
                  size={20}
                  color="#bdbdbd"
                />
              </TouchableOpacity>

              <View style={styles.actionButtons}>
                {!isTimerStarted && (
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={handlePlay}
                  >
                    <FontAwesome5 name="play" size={20} color="white" />
                  </TouchableOpacity>
                )}
                {isTimerStarted && !isPaused && (
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={handlePause}
                  >
                    <FontAwesome5 name="pause" size={20} color="white" />
                  </TouchableOpacity>
                )}
                {isTimerStarted && isPaused && (
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={handleResume}
                  >
                    <FontAwesome5 name="play" size={20} color="white" />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={styles.sideButtons}
                onPress={handleEndNow}
                disabled={isTimerStarted && !isPaused}
              >
                <FontAwesome5 name="stop" size={20} color="#bdbdbd" />
              </TouchableOpacity>
            </View>

            <Modal
              visible={showLogPrompt}
              transparent
              animationType="fade"
              onRequestClose={() => setShowLogPrompt(false)}
            >
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalText}>
                    Do you want to log this session?
                  </Text>
                  <View style={styles.modalButtons}>
                    <Pressable
                      style={styles.modalBtnYes}
                      onPress={handleLogYes}
                    >
                      <Text style={styles.modalBtnText}>Yes</Text>
                    </Pressable>
                    <Pressable style={styles.modalBtnNo} onPress={handleLogNo}>
                      <Text style={styles.modalBtnText}>No</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>

            <Modal
              visible={showResetPrompt}
              transparent
              animationType="fade"
              onRequestClose={() => setShowResetPrompt(false)}
            >
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalText}>
                    Are you sure you want to reset?
                  </Text>
                  <View style={styles.modalButtons}>
                    <Pressable
                      style={styles.modalBtnYes}
                      onPress={confirmReset}
                    >
                      <Text style={styles.modalBtnText}>Yes</Text>
                    </Pressable>
                    <Pressable style={styles.modalBtnNo} onPress={cancelReset}>
                      <Text style={styles.modalBtnText}>No</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </PageLayout>
  );
};

export default PomodoroUI;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  pomodoroContainer: { padding: 20, justifyContent: "center" },
  timerContainer: { alignItems: "center", marginVertical: 20 },
  timerText: { fontSize: 40, fontWeight: "bold", color: "#1F2937" },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 20,
  },
  sideButtons: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  playButton: {
    width: 100,
    height: 100,
    backgroundColor: CrimsonLuxe.primary400,
    padding: 15,
    borderRadius: 100,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
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
  modalText: { fontSize: 18, marginBottom: 20, textAlign: "center" },
  modalButtons: { flexDirection: "row", gap: 15 },
  modalBtnYes: {
    backgroundColor: "#10B981",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalBtnNo: {
    backgroundColor: "#EF4444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalBtnText: { color: "white", fontSize: 16 },
  modalCloseButton: {
    marginTop: 10,
    backgroundColor: CrimsonLuxe.primary400,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  iconBox: {
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: "column",
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  duration: {
    fontSize: 14,
    color: "#6B7280",
  },
});
