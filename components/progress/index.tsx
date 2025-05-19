import React, { useEffect, useRef, useState } from "react";
import {
  View,
  FlatList,
  Animated,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAllChecklists } from "@/db/service/ChecklistService";
import { router } from "expo-router";

interface Checklist {
  id: string;
  name: string;
  description: string;
  category: string;
  completed: boolean;
  items: {
    id: string;
    title: string;
    isCompleted: boolean;
  }[];
}

const CARD_WIDTH = 160;
const CARD_HEIGHT = 230;
const SPACING = 14;

const soothingColors = ["#ff4b5c", "#ff6a3d", "#4caf50", "#38b6b6", "#3d8bfd"];

const ProgressCard = ({
  checklist,
  index,
  scrollX,
}: {
  checklist: Checklist;
  index: number;
  scrollX: Animated.Value;
}) => {
  const top = scrollX.interpolate({
    inputRange: [
      (index - 1) * (CARD_WIDTH + SPACING),
      index * (CARD_WIDTH + SPACING),
    ],
    outputRange: index === 0 ? [0, 0] : [20, 0],
    extrapolate: "clamp",
  });

  const totalTasks = checklist.items.length;
  const completedTasks = checklist.items.filter((t) => t.isCompleted).length;

  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/checklistScreen",
          params: { id: checklist.id },
        });
      }}
    >
      <Animated.View
        style={[
          styles.progressCard,
          {
            backgroundColor: soothingColors[index % soothingColors.length],
            top,
            marginLeft: index === 0 ? 0 : SPACING / 2,
            marginRight: SPACING / 2,
          },
        ]}
      >
        <Text style={styles.cardTitle}>{checklist.name}</Text>
        <Text style={styles.cardCategory}>{checklist.category}</Text>
        <Text style={styles.cardDeadline}>
          {completedTasks}/{totalTasks} tasks completed
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const Progress = () => {
  const flatListRef = useRef<FlatList<Checklist>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchData = async () => {
      const all = await getAllChecklists();

      const incompleteOnly = all.filter((c) => !c.completed);

      const inProgress = incompleteOnly.filter(
        (c) =>
          c.items.length > 0 &&
          c.items.some((t: any) => t.isCompleted) &&
          c.items.some((t: any) => !t.isCompleted)
      );
      const notStarted = incompleteOnly.filter((c) =>
        c.items.every((t: any) => !t.isCompleted)
      );

      setChecklists([...inProgress, ...notStarted]);
    };

    fetchData();
  }, []);

  const AddNewCard = ({
    index,
    scrollX,
  }: {
    onPress: () => void;
    index: number;
    scrollX: Animated.Value;
  }) => {
    const top = scrollX.interpolate({
      inputRange: [
        (index - 1) * (CARD_WIDTH + SPACING),
        index * (CARD_WIDTH + SPACING),
      ],
      outputRange: index === 0 ? [0, 0] : [20, 0],
      extrapolate: "clamp",
    });

    return (
      <Pressable
        onPress={() => {
          router.navigate("/createChecklist");
        }}
      >
        <Animated.View
          style={[
            styles.progressCard,
            {
              backgroundColor: soothingColors[index % soothingColors.length],
              marginLeft: index === 0 ? 0 : SPACING / 2,
              marginRight: SPACING / 2,
              justifyContent: "center",
              alignItems: "center",
              top,
            },
          ]}
        >
          <Text style={{ fontSize: 40, color: "#ffffff" }}>＋</Text>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Your Progress</Text>
      <FlatList
        ref={flatListRef}
        data={[...checklists, { id: "add_new" } as Checklist]}
        renderItem={({ item, index }) =>
          item.id === "add_new" ? (
            <AddNewCard
              index={index}
              scrollX={scrollX}
              onPress={() => router.push("/createChecklist")}
            />
          ) : (
            <ProgressCard checklist={item} index={index} scrollX={scrollX} />
          )
        }
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 320,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "left",
  },
  progressCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  cardCategory: {
    color: "#f0f0f0",
    fontSize: 14,
    marginTop: 5,
  },
  cardDeadline: {
    color: "#f0f0f0",
    fontSize: 12,
    marginTop: 8,
    fontStyle: "italic",
  },
});

export default Progress;
