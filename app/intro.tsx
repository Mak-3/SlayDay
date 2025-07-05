import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import ChecklistSVG from "@/assets/svgs/Checklist.svg";
import EventsSVG from "@/assets/svgs/Events.svg";
import PomodoroSVG from "@/assets/svgs/Pomodoro.svg";
import BackupSVG from "@/assets/svgs/Backup.svg";
import { CrimsonLuxe } from "@/constants/Colors";
import { router } from "expo-router";

const { width } = Dimensions.get("window");
const PADDING_HORIZONTAL = 20;
const CARD_WIDTH = width - PADDING_HORIZONTAL * 2;

const slides = [
  {
    image: ChecklistSVG,
    text: "Stay on top of your day with smart, simple checklists.",
  },
  {
    image: EventsSVG,
    text: "Create tasks with deadlines, mark important events, and set periodic reminders to stay organized and on track.",
  },
  {
    image: PomodoroSVG,
    text: "Improve your productivity through engaging timer challenges and the Pomodoro technique.",
  },
  {
    image: BackupSVG,
    text: "Keep your data safe with automatic daily backups",
  },
];
EventsSVG;
const Intro = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * CARD_WIDTH,
        animated: true,
      });
    } else {
      router.replace("/signUp");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.carousel}>
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {slides.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.imageContainer}>
                <item.image width={CARD_WIDTH * 0.8} height={300} />
              </View>

              <Text style={styles.text}>{item.text}</Text>
            </View>
          ))}
        </Animated.ScrollView>

        <View style={styles.dotContainer}>
          {slides.map((_, index) => {
            const dotWidth = scrollX.interpolate({
              inputRange: [
                (index - 1) * CARD_WIDTH,
                index * CARD_WIDTH,
                (index + 1) * CARD_WIDTH,
              ],
              outputRange: [14, 30, 14],
              extrapolate: "clamp",
            });

            const dotColor = scrollX.interpolate({
              inputRange: [
                (index - 1) * CARD_WIDTH,
                index * CARD_WIDTH,
                (index + 1) * CARD_WIDTH,
              ],
              outputRange: ["#ccc", CrimsonLuxe.primary400, "#ccc"],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  { width: dotWidth, backgroundColor: dotColor },
                ]}
              />
            );
          })}
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? "Done" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Intro;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  carousel: {
    flex: 1,
  },
  card: {
    width: CARD_WIDTH,
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 40,
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 36,
    marginTop: 20,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  dot: {
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  button: {
    backgroundColor: CrimsonLuxe.primary400,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
