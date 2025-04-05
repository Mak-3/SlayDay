import BackButtonHeader from "@/components/backButtonHeader";
import PageLayout from "@/components/pageLayout";
import { cardColors } from "@/constants/Colors";
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { ProgressBar } from "react-native-paper";

const tasks = [
  {
    title: "Astha App Redesign",
    subtitle: "One more week",
    progress: 0.75,
  },
  {
    title: "Slack App Redesign",
    subtitle: "Wed, 22 Nov 2024",
    progress: 0.5,
  },
  {
    title: "User interview",
    subtitle: "Slack App Redesign",
    date: "Wed, 22 Nov 2024",
    progress: 0.25,
  },
  {
    title: "Gideon Project",
    progress: 0.25,
  },
];

const TaskCard = ({
  item,
  index,
}: {
  item: {
    title: string;
    subtitle?: string;
    date?: string;
    progress: number;
    avatars?: string[];
  };
  index: number;
}) => {
  const dynamicStyles = {
    backgroundColor: cardColors[index  % tasks.length].light,
    minHeight: item.subtitle || item.date || item.avatars ? 140 : 100,
  };

  return (
    <View style={[styles.card, dynamicStyles]}>
      <Text style={styles.title} ellipsizeMode="tail" numberOfLines={2}>
        {item.title}
      </Text>
      {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
      {item.date && <Text style={styles.subtitle}>{item.date}</Text>}
      <View style={styles.progressBarWrapper}>
        <View style={styles.progressBar}>
          <ProgressBar
            progress={item.progress}
            color={cardColors[index  % tasks.length].dark}
          />
        </View>

        <Text style={styles.percentage}>
          {Math.round(item.progress * 100)}%
        </Text>
      </View>
    </View>
  );
};

export default function App() {
  return (
    <PageLayout style={styles.container}>
      <BackButtonHeader title="Checklists" />
      <View style={styles.checklistsContainer}>
        <FlatList
          scrollEnabled={false}
          data={tasks}
          numColumns={2}
          renderItem={({ item, index }) => (
            <TaskCard item={item} index={index} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  checklistsContainer: {
    marginVertical: 20,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    margin: 4,
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 24,
  },
  subtitle: {
    color: "gray",
    marginTop: 4,
  },
  progressBarWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    bottom: -20,
  },
  progressBar: {
    width: "70%",
  },
  percentage: {},
});
