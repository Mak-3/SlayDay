import React, { useState } from "react";
import {
  StyleSheet,
  Animated,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import Header from "@/components/header";
import Progress from "@/components/progress";
import FloatingMenu from "@/components/floatingMenu";
import { router } from "expo-router";
import PageLayout from "@/components/pageLayout";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { CrimsonLuxe } from "@/constants/Colors";
import TaskCard from "@/components/taskStatusCard";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <View style={{ flex: 1 }}>
      <PageLayout style={styles.container}>
        <Animated.View
          style={[styles.content, { opacity: isMenuOpen ? 0.4 : 1 }]}
        >
          <Header />
          <Progress />
          <View style={styles.section}>
            <View style={styles.todayTaskWrapper}>
              <Text style={styles.sectionTitle}>Today's tasks</Text>
              <TouchableOpacity onPress={() => router.push("/drawer/calender")}>
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={28}
                  color={CrimsonLuxe.primary400}
                />
              </TouchableOpacity>
            </View>
            <TaskCard />
          </View>
        </Animated.View>
      </PageLayout>

      {isMenuOpen && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <TouchableWithoutFeedback onPress={() => setIsMenuOpen(false)}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
          <FloatingMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
        </View>
      )}

      {!isMenuOpen && (
        <FloatingMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "left",
  },
  quoteCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#FFF5F5",
    borderRadius: 16,
    borderLeftWidth: 5,
    borderLeftColor: CrimsonLuxe.primary300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  quoteLabel: {
    fontSize: 14,
    color: CrimsonLuxe.primary500,
    fontWeight: "600",
    marginBottom: 6,
  },
  quoteText: {
    fontSize: 16,
    color: "#333",
    fontStyle: "italic",
    lineHeight: 22,
  },

  todayTaskWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default Home;
