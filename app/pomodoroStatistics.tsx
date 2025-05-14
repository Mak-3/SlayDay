import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import PageLayout from "@/components/pageLayout";
import BackButtonHeader from "@/components/backButtonHeader";
import LineChartComponent from "@/components/lineChart";
import {
  getAllPomodoros,
  getPomodoroStats,
} from "@/db/service/PomodoroService";
import { getIcon } from "@/constants/IconsMapping";
import { router } from "expo-router";
import { renderIcon } from "@/components/renderIcon";
import { CrimsonLuxe } from "@/constants/Colors";

interface pomodoroSessions {
  id: any;
  title: string;
  taskType: string;
  time: number;
  category: string;
  createdAt: Date;
  endAt: Date;
}

const PomodoroStatistics = () => {
  const [lastSessions, setLastSessions] = useState<pomodoroSessions[]>([]);
  const [allTimeStats, setAllTimeStats] = useState({ total: 0, totalTime: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllPomodoros();
        const sorted = result.sort(
          (a: pomodoroSessions, b: pomodoroSessions) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setLastSessions(sorted.slice(0, 3));

        const stats = await getPomodoroStats("allTime");
        let total = 0;
        let totalTime = 0;

        Object.values(stats).forEach((item: any) => {
          const count = typeof item.total === "number" ? item.total : 0;
          const time = typeof item.totalTime === "number" ? item.totalTime : 0;
          total += count;
          totalTime += time;
        });

        setAllTimeStats({ total, totalTime });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchData();
  }, []);

  const formatMinutes = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h > 0 ? `${h}h ` : ""}${m}m`;
  };

  const formatDuration = (start: Date, end: Date) => {
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ""}${mins}m`;
  };

  const renderItem = ({ item }: { item: pomodoroSessions }) => {
    const formattedStart = new Date(item.createdAt).toLocaleTimeString();
    const duration = formatDuration(item.createdAt, item.endAt);

    return (
      <View style={styles.taskContainer}>
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor:
                getIcon[item.category]?.backgroundColor || "#ccc",
            },
          ]}
        >
          {renderIcon(item.category, "#fff")}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.timeInfoWrapper}>
            <Text style={styles.duration}>{formattedStart}</Text>
            <Text style={styles.duration}>{duration}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <PageLayout style={styles.container}>
      <BackButtonHeader title="Pomodoro Statistics" />
      <View style={styles.activeHoursContainer}>
        <Text style={styles.activeHoursLabel}>Active Hours</Text>
        <View style={styles.totalHoursWrapper}>
          <Text style={styles.activeHoursValue}>Today: 0</Text>
          <Text style={styles.activeHoursValue}>
            Total: {formatMinutes(allTimeStats.totalTime)}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Progress</Text>
      <LineChartComponent />

      {lastSessions.length > 0 && (
        <>
          <View style={styles.pastSessionsTitleWrapper}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
            <TouchableOpacity
              onPress={() => {
                router.push("/drawer/pomodoroSessions");
              }}
            >
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={lastSessions}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        </>
      )}
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {},
  activeHoursContainer: {
    backgroundColor: CrimsonLuxe.primary100,
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
  },
  totalHoursWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  activeHoursLabel: {
    fontSize: 16,
    color: CrimsonLuxe.primary400,
    marginBottom: 10,
  },
  activeHoursValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: CrimsonLuxe.primary400,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginVertical: 20,
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    gap: 5,
  },
  timeInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  duration: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  pastSessionsTitleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewAll: {
    color: "#777",
  },
});

export default PomodoroStatistics;
