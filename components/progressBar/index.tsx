import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface ProgressBarProps {
  progress: number;
  showStatus: boolean;
  activeColor: string;
  title?: string;
}

const TOTAL_BARS = 5;
const BAR_HEIGHT = 10;
const BAR_WIDTH = 50;
const BAR_GAP = 10;

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress = 70,
  showStatus,
  activeColor = "#4f46e5",
  title = "Progress",
}) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    });

    animation.start();

    return () => animation.stop();
  }, [progress]);

  const getWidthForBar = (index: number) => {
    const progressPerBar = 100 / TOTAL_BARS;
    const startThreshold = index * progressPerBar;
    const endThreshold = (index + 1) * progressPerBar;

    return animatedProgress.interpolate({
      inputRange: [startThreshold, endThreshold],
      outputRange: [0, BAR_WIDTH],
      extrapolate: "clamp",
    });
  };

  return (
    <View style={styles.progressBarWrapper}>
      {showStatus && (
        <View style={styles.progressInfoWrapper}>
          <Text style={styles.progress}>{title}</Text>
          <Animated.Text style={styles.progressValue}>
            {animatedProgress.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            })}
          </Animated.Text>
        </View>
      )}

      <View style={styles.progressBar}>
        {Array.from({ length: TOTAL_BARS }).map((_, index) => (
          <View key={index} style={styles.progressItem}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: getWidthForBar(index), backgroundColor: activeColor },
              ]}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  progressBarWrapper: {
    width: (BAR_WIDTH + BAR_GAP) * TOTAL_BARS,
  },
  progressInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progress: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  progressValue: {
    fontSize: 16,
    color: "#4f46e5",
    fontWeight: "600",
  },
  progressBar: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressItem: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
});
