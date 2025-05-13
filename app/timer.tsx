import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
  Modal,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { CrimsonLuxe } from "@/constants/Colors";
import PageLayout from "@/components/pageLayout";
import BackButtonHeader from "@/components/backButtonHeader";

import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams } from "expo-router";
import { createPomodoro } from "@/db/service/PomodoroService";

const TimerPage = () => {
  const { title, category } = useLocalSearchParams();
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [showLogPrompt, setShowLogPrompt] = useState(false);
  const [startDateTime, setStartDateTime] = useState<any>();
  const [endDateTime, setEndDateTime] = useState<any>(null);

  useEffect(() => {
    if (isRunning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handlePausePlay = () => {
    if(secondsElapsed == 0){
        setStartDateTime(Date.now())
        setIsRunning((prev) => !prev)
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsElapsed(0);
  };

  const handleEndNow = () => {
    setEndDateTime(Date.now())
    setShowLogPrompt(true);
    setIsRunning(false);
  };

  const handleLogYes = async () => {
    try {
      await createPomodoro({
        title: title as string,
        taskType: "Timer Challenge",
        time: secondsElapsed,
        category: category as string,
        createdAt: startDateTime,
        endAt: endDateTime
      });
    } catch (error) {
      console.error("Failed to create Pomodoro:", error);
    }
  };

  const handleLogNo = () => {
    setIsRunning(false);
    setSecondsElapsed(0);
    setShowLogPrompt(false);
  };

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
      <BackButtonHeader title="Stopwatch" />
      <View style={styles.taskContainer}>
        <View
          style={[styles.iconBox, { backgroundColor: CrimsonLuxe.primary400 }]}
        >
          {renderIcon("book", "FontAwesome", "#fff")}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.duration}>{"time"} minutes</Text>
        </View>
      </View>
      <View style={styles.center}>
        <Animated.View
          style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]}
        />
        <Text style={styles.timerText}>{formatTime(secondsElapsed)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.iconButton} onPress={handleReset}>
          <FontAwesome5 name="redo" size={20} color="#bdbdbd" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playPauseButton}
          onPress={() => {
            handlePausePlay}}
        >
          <FontAwesome5
            name={isRunning ? "pause" : "play"}
            size={24}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleEndNow}
          disabled={isRunning}
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
    </PageLayout>
  );
};

export default TimerPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 80,
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
  timerText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#1F2937",
    position: "absolute",
  },
  pulseCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: CrimsonLuxe.primary200,
    opacity: 0.5,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  playPauseButton: {
    width: 100,
    height: 100,
    backgroundColor: CrimsonLuxe.primary400,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
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
});
