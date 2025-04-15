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
        <View style={styles.section}>
          <View style={styles.todayTaskWrapper}>
            <Text style={styles.sectionTitle}>Today's tasks</Text>
            <TouchableOpacity onPress={() => router.push("/pomodoroSessions")}>
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={28}
                color={CrimsonLuxe.primary400}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
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
    </PageLayout>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
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
  todayTaskWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default Home;
