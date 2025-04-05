import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
  Easing,
} from "react-native";

type Item = {
  id: string;
  title: string;
  isDone: boolean;
};

const listItemHeight = 80;
const listItemGap = 20;

const TimelineList = () => {
  const [data, setData] = useState<Item[]>([
    { id: "1", title: "Buy groceries", isDone: true },
    { id: "2", title: "Work on React Native project", isDone: false },
    { id: "3", title: "Read a book", isDone: false },
    { id: "4", title: "Exercise for 30 minutes", isDone: false },
  ]);

  const animatedCircles = useRef(data.map(() => new Animated.Value(0))).current;
  const animatedLines = useRef(data.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    data.forEach((item, index) => {
      if (item.isDone) {
        Animated.timing(animatedCircles[index], {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start();

        Animated.timing(animatedLines[index], {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start();
      }
    });
  }, []);

  const toggleStatus = (index: number) => {
    const updatedData = [...data];

    const lastDoneIndex = [...data]
      .map((item, idx) => (item.isDone ? idx : -1))
      .filter((idx) => idx !== -1)
      .pop();

    const isCurrentlyDone = data[index].isDone;

    if (isCurrentlyDone) {
      if (index !== lastDoneIndex) return;
      Animated.timing(animatedLines[index], {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start(() => {
        Animated.timing(animatedCircles[index], {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start(() => {
          updatedData[index].isDone = false;
          setData(updatedData);
        });
      });

      return;
    }

    const canMark = index === 0 || data[index - 1].isDone;

    if (!canMark) return;

    Animated.timing(animatedCircles[index], {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(animatedLines[index], {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start(() => {
        updatedData[index].isDone = true;
        setData(updatedData);
      });
    });
  };

  const renderItem = ({ item, index }: { item: Item; index: number }) => {
    const isLastItem = index === data.length - 1;

    const circleBorderColor = animatedCircles[index].interpolate({
      inputRange: [0, 1],
      outputRange: ["#D1D5DB", "#F59E0B"],
    });

    return (
      <View style={styles.row}>
        <View style={styles.timelineContainer}>
          <Animated.View
            style={[
              styles.circle,
              {
                borderColor: circleBorderColor,
              },
            ]}
          />

          {!isLastItem && (
            <View style={styles.lineContainer}>
              <View style={styles.lineBackground} />

              <Animated.View
                style={[
                  styles.lineFill,
                  {
                    height: animatedLines[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, listItemHeight + listItemGap],
                    }),
                    top: 0,
                  },
                ]}
              />
            </View>
          )}
        </View>

        <View
          style={[
            styles.contentContainer,
            index !== data.length - 1 && { marginBottom: listItemGap },
          ]}
        >
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.statusWrapper}>
            <TouchableOpacity
              onPress={() => toggleStatus(index)}
              style={[styles.checkbox, item.isDone && styles.checked]}
            >
              {item.isDone && (
                <MaterialIcons name="check" size={14} color="white" />
              )}
            </TouchableOpacity>
            <Text style={item.isDone ? styles.doneText : styles.markAsDone}>
              {item.isDone ? "Done" : "Mark as done"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      scrollEnabled={false}
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    // paddingVertical: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  timelineContainer: {
    alignItems: "center",
    width: 40,
    top: listItemHeight / 2 - 8,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    backgroundColor: "white",
    zIndex: 1,
  },
  lineContainer: {
    position: "relative",
    width: 2,
    flex: 1,
    marginTop: 2,
    overflow: "hidden",
  },
  lineBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#D1D5DB",
  },
  lineFill: {
    position: "absolute",
    width: "100%",
    backgroundColor: "#F59E0B",
    top: 0,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    height: listItemHeight,
    borderRadius: 12,
    justifyContent: "center",
    borderColor: '#F59E0B',
    borderWidth: 1
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  doneText: {
    color: "#10B981",
    fontWeight: "600",
  },
  markAsDone: {
    color: "#6B7280",
    marginRight: 10,
  },
  markAsDoneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusWrapper: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  doneRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default TimelineList;
