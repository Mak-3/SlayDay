import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import BackButtonHeader from "@/components/backButtonHeader";
import PageLayout from "@/components/pageLayout";
import { router } from "expo-router";
import { cardColors, CrimsonLuxe } from "@/constants/Colors";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { deleteEvent, getAllEvents } from "@/db/service/EventService";
import { renderIcon } from "@/components/renderIcon";
import { ObjectId } from "bson";
import Toast from "react-native-toast-message";

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  isOneTime: boolean;
}

const EventsLanding = () => {
  const [data, setData] = useState<EventItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [pastEvents, setPastEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchPomodoroSessions = async () => {
      try {
        setLoading(true);
        const result = await getAllEvents();
        const formatted = result.map((event) => ({
          ...event,
          date:
            event.date instanceof Date
              ? event.date.toISOString().split("T")[0]
              : event.date,
          time:
            event.time instanceof Date
              ? event.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : event.time,
        }));

        const today = new Date().toISOString().split("T")[0];

        const upcoming = formatted.filter((event) => event.date >= today);
        const past = formatted.filter(
          (event) => event.date < today && event.isOneTime
        );

        setData(formatted);
        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } catch (error) {
        console.error("Error fetching pomodoros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPomodoroSessions();
  }, []);

  const handleNavigation = (route: any) => {
    router.push(route);
  };

  const handleDelete = async (id: string) => {
    try {
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);

      const today = new Date().toISOString().split("T")[0];
      const updatedUpcoming = updatedData.filter(
        (event) => event.date >= today
      );
      const updatedPast = updatedData.filter(
        (event) => event.date < today && event.isOneTime
      );

      setUpcomingEvents(updatedUpcoming);
      setPastEvents(updatedPast);
      const success = await deleteEvent(new ObjectId(id));
      if (success) {
        Toast.show({
          type: "success",
          text1: "event deleted successfully",
          position: "bottom",
        });
      } else {
        console.warn("Event not found or already deleted.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDelete(id)}
    >
      <Icon name="delete" size={24} color="#fff" />
    </TouchableOpacity>
  );

  const renderItem = ({ item, index }: any) => {
    return (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={styles.taskContainer}>
        <View
          style={[
            styles.iconBox,
            { backgroundColor: cardColors[index % cardColors.length].dark },
          ]}
        >
          {renderIcon(item.category, "#ffffff")}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.timeInfoWrapper}>
            <Text style={styles.duration}>{item.date}</Text>
            <Text style={styles.duration}>{item.time}</Text>
          </View>
          {item.isOneTime ? (
            <Text style={styles.recurringLabel}>Recurring</Text>
          ) : (
            <Text style={styles.recurringLabel}>One-time</Text>
          )}
        </View>
      </View>
    </Swipeable>
    )
  };

  return (
    <PageLayout style={styles.container}>
      <BackButtonHeader title="Events & Reminders" />
      <View style={styles.startSessionContainer}>
        <Text style={styles.startSessionTitle}>Stay Organized!</Text>
        <Text style={styles.startSessionSubtitle}>
          Add reminders and never miss an important event.
        </Text>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => handleNavigation("/createEvent")}
        >
          <Text style={styles.startButtonText}>Create Reminder</Text>
        </TouchableOpacity>
      </View>
      {(upcomingEvents?.length === 0 && pastEvents?.length === 0) ? <Text style={{ textAlign: "center" }}>No events.</Text> : 
      (<GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <FlatList
            data={upcomingEvents}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={{ textAlign: "center" }}>No upcoming events.</Text>
            }
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past Events</Text>
          <FlatList
            data={pastEvents}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={{ textAlign: "center" }}>No past events.</Text>
            }
          />
        </View>
      </GestureHandlerRootView>)
      }
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  startSessionContainer: {
    backgroundColor: CrimsonLuxe.primary200,
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    alignItems: "center",
  },
  startSessionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  startSessionSubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: CrimsonLuxe.primary500,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
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
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
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
  deleteButton: {
    backgroundColor: CrimsonLuxe.primary400 || "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    marginVertical: 8,
    borderRadius: 10,
  },
  recurringLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "500",
    color: "#3B82F6",
  },
});

export default EventsLanding;
