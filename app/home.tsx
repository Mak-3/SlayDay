import React, { useState } from "react";
import {
  StyleSheet,
  Animated,
} from "react-native";
import Header from "@/components/header";
import Progress from "@/components/progress";
import FloatingMenu from "@/components/floatingMenu";
import Button from "@/components/button";
import { router } from "expo-router";
import CalendarScreen from "@/components/calenderView";
import PageLayout from "@/components/pageLayout";
import { clearRealmDatabase } from "@/db/service/ChecklistService";

const tasks = [
  { id: "1", title: "Finish React Native Project", due: "Today" },
  { id: "2", title: "Read 10 pages of a book", due: "Today" },
  { id: "3", title: "Workout for 30 minutes", due: "Tomorrow" },
];

const handleNavigation = (route: any) => {
  router.push(route);
};

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <PageLayout style={styles.container}>
      <Animated.View
        style={[styles.content, { opacity: isMenuOpen ? 0.4 : 1 }]}
      >
        <Header />
        <Progress />
      </Animated.View>

      <Button onPress={() => handleNavigation("/checklistOverview")} title="pomodoro" />
      <Button onPress={() => clearRealmDatabase()} title="clear db" style={{marginVertical: 20}}/>
      <CalendarScreen/>
      <FloatingMenu onMenuToggle={setIsMenuOpen} />
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff'
  },
  content: {
    flex: 1,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "600",
    color: "#374151",
    marginTop: 10,
  },
  username: {
    color: "#FF6B6B",
    fontWeight: "700",
  },
  quote: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#6B7280",
    marginBottom: 10,
  },
  section: {
    marginTop: 200,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
  },
  taskItem: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 2,
  },
  taskText: {
    fontSize: 16,
    color: "#374151",
  },
  dueText: {
    fontSize: 14,
    color: "#FF6B6B",
  },
});

export default Home;