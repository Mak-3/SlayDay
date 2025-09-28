import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import BackButtonHeader from "@/components/backButtonHeader";
import NoDataEvents from "@/components/noDataEvents";
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
  description?: string;
  category?: string;
  repeatType?: string;
  interval?: number;
  weekDays?: string[];
  customInterval?: string;
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
              ? event.time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : event.time,
          description: event.description,
          category: event.category,
          repeatType: event.repeatType,
          interval: event.interval,
          weekDays: event.weekDays,
          customInterval: event.customInterval,
        }));

        const today = new Date().toISOString().split("T")[0];

        const isRecurringEventActive = (event: EventItem) => {
          if (event.isOneTime) {
            return event.date >= today;
          }

          return event.date <= today;
        };

        const upcoming = formatted.filter((event) =>
          isRecurringEventActive(event)
        );
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

  const handleEdit = (item: EventItem) => {
    const eventDate = new Date(item.date);

    const [hours, minutes] = item.time.split(":");
    const timeDate = new Date();
    timeDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    router.push({
      pathname: "/createEvent",
      params: {
        editMode: "true",
        eventId: item.id,
        title: item.title,
        description: item.description || "",
        date: eventDate.toISOString(),
        time: timeDate.toISOString(),
        category: item.category || "Work",
        isOneTime: item.isOneTime.toString(),
        repeatType: item.repeatType || "",
        interval: item.interval?.toString() || "1",
        weekDays: item.weekDays ? JSON.stringify(item.weekDays) : "[]",
        customInterval: item.customInterval || "",
      },
    });
  };

  if (!loading && data.length == 0) {
    return <NoDataEvents />;
  }

  const renderRightActions = (item: EventItem) => (
    <View style={styles.swipeActionsContainer}>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleEdit(item)}
      >
        <Icon name="edit" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Icon name="delete" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item, index }: any) => {
    return (
      <Swipeable renderRightActions={() => renderRightActions(item)}>
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
              <Text style={styles.recurringLabel}>One-time</Text>
            ) : (
              <Text style={styles.recurringLabel}>Recurring</Text>
            )}
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <PageLayout style={styles.container}>
      <BackButtonHeader title="Events & Reminders" createLink="/createEvent" />
      {upcomingEvents?.length === 0 && pastEvents?.length === 0 ? (
        <Text style={{ textAlign: "center" }}>No events.</Text>
      ) : (
        <GestureHandlerRootView style={{ flex: 1 }}>
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
        </GestureHandlerRootView>
      )}
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
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
    width: 50,
    height: "100%",
    borderRadius: 15,
  },
  recurringLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "500",
    color: "#3B82F6",
  },
  swipeActionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  editButton: {
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: "100%",
    borderRadius: 15,
    marginRight: 5,
  },
});

export default EventsLanding;
