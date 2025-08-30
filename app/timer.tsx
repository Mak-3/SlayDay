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

import { MaterialIcons as Icon, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { createPomodoro } from "@/db/service/PomodoroService";
import { renderIcon } from "@/components/renderIcon";

type params = {
  title: string;
  category: string;
};

const TimerPage = () => {
  const { title, category } = useLocalSearchParams<params>();
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  // Ripple animations: three concentric waves
  const rippleAnims = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  const rippleLoops = useRef<Animated.CompositeAnimation[]>([]).current;
  const [showLogPrompt, setShowLogPrompt] = useState(false);
  const [startDateTime, setStartDateTime] = useState<any>();
  const [endDateTime, setEndDateTime] = useState<any>(null);

  useEffect(() => {
    if (isRunning) {
      // Start staggered ripple loops
      rippleLoops.forEach((loop) => loop.stop());
      rippleLoops.length = 0;
      rippleAnims.forEach((anim, index) => {
        anim.setValue(0);
        const loop = Animated.loop(
          Animated.sequence([
            Animated.delay(index * 350),
            Animated.timing(anim, {
              toValue: 1,
              duration: 1200,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        );
        rippleLoops.push(loop);
        loop.start();
      });
    } else {
      // Stop and reset ripples
      rippleLoops.forEach((loop) => loop.stop());
      rippleAnims.forEach((anim) => anim.stopAnimation(() => anim.setValue(0)));
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
    if (secondsElapsed === 0 && !isRunning) {
      setStartDateTime(new Date());
    }
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsElapsed(0);
  };

  const handleEndNow = () => {
    setEndDateTime(new Date());
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
        createdAt: startDateTime as Date,
        endAt: (endDateTime as Date) ?? new Date(),
      });
      setShowLogPrompt(false);
      setIsRunning(false);
      setSecondsElapsed(0);
      router.push("/drawer/pomodoroSessions");
    } catch (error) {
      console.error("Failed to create Pomodoro:", error);
    }
  };

  const handleLogNo = () => {
    setIsRunning(false);
    setSecondsElapsed(0);
    setShowLogPrompt(false);
  };

  return (
    <PageLayout style={styles.container}>
      <BackButtonHeader title="Stopwatch" />
      <View style={styles.taskContainer}>
        <View
          style={[styles.iconBox, { backgroundColor: CrimsonLuxe.primary400 }]}
        >
          {renderIcon(category, "#FFFFFF")}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.duration}>{category}</Text>
        </View>
      </View>
      <View style={styles.center}>
        {rippleAnims.map((anim, index) => {
          const scale = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 2.4],
          });
          const opacity = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.35, 0],
          });
          return (
            <Animated.View
              key={index}
              style={[styles.rippleCircle, { transform: [{ scale }], opacity }]}
            />
          );
        })}
        <View style={styles.coreCircle} />
        <Text style={styles.timerText}>{formatTime(secondsElapsed)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.iconButton} onPress={handleReset}>
          <FontAwesome5 name="redo" size={20} color="#bdbdbd" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playPauseButton}
          onPress={handlePausePlay}
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
    position: "relative",
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
  // New ripple-based animation styles
  rippleCircle: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: CrimsonLuxe.primary200,
  },
  coreCircle: {
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
