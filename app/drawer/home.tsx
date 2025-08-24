import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Animated,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  BackHandler,
} from "react-native";
import Header from "@/components/header";
import Progress from "@/components/progress";
import FloatingMenu from "@/components/floatingMenu";
import { router, useFocusEffect } from "expo-router";
import PageLayout from "@/components/pageLayout";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CrimsonLuxe } from "@/constants/Colors";
import TaskCard from "@/components/taskStatusCard";
import { getChecklistCount } from "@/db/service/ChecklistService";
import { getEventCount } from "@/db/service/EventService";
import NoDataSVG from "@/assets/svgs/NoEvents.svg";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [checklistCount, setChecklistCount] = useState<number>(0);
  const [eventCount, setEventCount] = useState<number>(0);

  useFocusEffect(
    useCallback(() => {
      const fetchCounts = async () => {
        try {
          const checklistRes = await getChecklistCount();
          const eventRes = await getEventCount();

          setChecklistCount(checklistRes.total || 0);
          setEventCount(eventRes.total || 0);
        } catch (error) {
          console.error("Failed to fetch counts:", error);
        }
      };

      fetchCounts();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const hasData = eventCount > 0 || checklistCount > 0;

  return (
    <View style={{ flex: 1 }}>
      <PageLayout style={styles.container}>
        <Animated.View style={[styles.content]}>
          <Header />
          {hasData ? (
            <>
              <Progress />
              {eventCount > 0 && (
                <View style={styles.section}>
                  <View style={styles.todayTaskWrapper}>
                    <Text style={styles.sectionTitle}>Today's tasks</Text>
                    <TouchableOpacity
                      onPress={() => router.push("/drawer/calender")}
                    >
                      <MaterialCommunityIcons
                        name="calendar-month-outline"
                        size={28}
                        color={CrimsonLuxe.primary400}
                      />
                    </TouchableOpacity>
                  </View>
                  <TaskCard />
                </View>
              )}
            </>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No Data Available</Text>
              <NoDataSVG width={"90%"} height={300} />
            </View>
          )}
        </Animated.View>
      </PageLayout>

      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {isMenuOpen && (
          <TouchableWithoutFeedback onPress={() => setIsMenuOpen(false)}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
        )}
        <FloatingMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  noDataContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  noDataText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 40,
  },
});

export default Home;
