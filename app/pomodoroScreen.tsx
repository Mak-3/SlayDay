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
import PageLayout from "@/components/pageLayout";
import LottieView from "lottie-react-native";
import { CrimsonLuxe } from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";

import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";
import { createPomodoro } from "@/db/service/PomodoroService";
import { getIcon } from "@/constants/IconsMapping";

const deviceWidth = Dimensions.get("window").width;

type params = {
  title: string,
  time: string,
  category: string
}
const PomodoroUI = () => {
  const { title, time: routeTime, category } = useLocalSearchParams<params>();
  const parsedTime = parseInt(routeTime as string) || 300;

  const [time, setTime] = useState(parsedTime);
  const [remaining, setRemaining] = useState(parsedTime);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [taskTitle, setTaskTitle] = useState(
    title || "My Focus Task"
  );
  const [showLogPrompt, setShowLogPrompt] = useState(false);
  const [showResetPrompt, setShowResetPrompt] = useState(false);
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [endDateTime, setEndDateTime] = useState<Date | null>(null);
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
      if (!startDateTime) {
        setStartDateTime(new Date());
      }
    }
  };

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  const handleEndNow = () => {
    setEndDateTime(new Date());
    setShowLogPrompt(true);
    setIsPaused(true);
  };

  const handleLogYes = async () => {
    if (startDateTime && endDateTime) {
      try {
        await createPomodoro({
          title: taskTitle,
          taskType: "Pomodoro",
          time: time,
          category: category,
          createdAt: startDateTime,
          endAt: endDateTime,
        });
        router.push('/pomodoroSessions');
      } catch (error) {
        console.error("Failed to create Pomodoro:", error);
        alert("Something went wrong while creating the Pomodoro.");
      }
      setShowLogPrompt(false);
      setIsTimerStarted(false);
      setRemaining(time);
      setStartDateTime(null);
    }
  };

  const handleLogNo = () => {
    setShowLogPrompt(false);
    setIsTimerStarted(false);
    setRemaining(time);
    setStartDateTime(null);
    setEndDateTime(null);
  };

  const handleResetPress = () => {
    setIsPaused(true);
    setShowResetPrompt(true);
  };

  const confirmReset = () => {
    setRemaining(time);
    setIsPaused(false);
    setIsTimerStarted(false);
    setStartDateTime(null);
    setEndDateTime(null);
    setShowResetPrompt(false);
  };

  const cancelReset = () => {
    setShowResetPrompt(false);
    setIsPaused(true);
  };

  const fill = isTimerStarted ? ((time - remaining) / time) * 100 : 0;

  const renderIcon = (category: string, color: string) => {
    const iconObj = getIcon[category] || getIcon["Other"];
    const { icon, library } = iconObj;

    switch (library) {
      case "FontAwesome":
        return <FontAwesome name={icon} size={24} color={color} />;
      case "MaterialCommunityIcons":
        return <MaterialCommunityIcons name={icon} size={24} color={color} />;
      case "MaterialIcons":
        return <Icon name={icon} size={24} color={color} />;
      case "FontAwesome5":
        return <FontAwesome5 name={icon} size={24} color={color} />;
      case "Feather":
        return <Feather name={icon} size={24} color={color} />;
      default:
        return <Icon name="help" size={24} color={color} />;
    }
  };

  return (
    <PageLayout style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <BackButtonHeader title="Pomodoro Session"/>
          <View style={styles.taskContainer}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: CrimsonLuxe.primary400 },
              ]}
            >
              {renderIcon(category, "#FFFFFF")}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{taskTitle}</Text>
              <Text style={styles.duration}>{Math.floor(time / 60)} minutes</Text>
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
                    <FontAwesome5 name="play" size={30} color="white" />
                  </TouchableOpacity>
                )}
                {isTimerStarted && !isPaused && (
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={handlePause}
                  >
                    <FontAwesome5 name="pause" size={30} color="white" />
                  </TouchableOpacity>
                )}
                {isTimerStarted && isPaused && (
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={handleResume}
                  >
                    <FontAwesome5 name="play" size={30} color="white" />
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
  timerText: { fontSize: 48, fontWeight: "bold", color: "#1F2937" },
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
    width: 90,
    height: 90,
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
