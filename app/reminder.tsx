import React, { useState } from "react";
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

const EventsLanding = () => {
  const [eventsData, setEventsData] = useState({
    "2025-05-16": { marked: true, dotColor: "blue", event: "Team Meeting" },
    "2025-05-18": { marked: true, dotColor: "red", event: "Project Deadline" },
    "2025-05-20": { marked: true, dotColor: "green", event: "John's Birthday" },
    "2025-05-10": { marked: true, dotColor: "blue", event: "Old Meeting" },
    "2025-05-28": { marked: true, dotColor: "red", event: "Past Deadline" },
    "2025-05-01": { marked: true, dotColor: "green", event: "Past Birthday" },
  } as any);

  const [showAllExpired, setShowAllExpired] = useState(false);

  const handleNavigation = (route: any) => {
    router.push(route);
  };

  const today = new Date().toISOString().split("T")[0];

  const eventList = Object.keys(eventsData).map((key, index) => ({
    id: index.toString(),
    date: key,
    title: eventsData[key].event || "Untitled Event",
    type:
      eventsData[key].dotColor === "blue"
        ? "Meeting"
        : eventsData[key].dotColor === "red"
        ? "Deadline"
        : "Birthday",
    time: "10:00 AM", // Optional: You can replace with dynamic time
  }));

  const upcomingEvents = eventList.filter((event) => event.date >= today);
  const expiredEvents = eventList
    .filter((event) => event.date < today)
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // Sort expired events in descending order

  const hasEvents = upcomingEvents.length > 0;

  return (
    <PageLayout style={styles.container}>
      <BackButtonHeader title="Events & Reminders" />

      {/* Focus Session Section */}
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

      {/* Next Event */}
      {hasEvents ? (
        <View style={styles.nextEventCard}>
          <Text style={styles.nextEventLabel}>Next Event</Text>
          <Text style={styles.nextEventTitle}>{upcomingEvents[0].title}</Text>
          <Text style={styles.nextEventTime}>
            {upcomingEvents[0].date}, {upcomingEvents[0].time}
          </Text>
        </View>
      ) : null}

      {/* Upcoming Events List */}
      {hasEvents ? (
        <View style={styles.eventsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Upcoming Events{" "}
              <Text style={{ color: "#aaa" }}>({upcomingEvents.length})</Text>
            </Text>
            <Text style={styles.sectionLink}>View All</Text>
          </View>

          <FlatList
            data={upcomingEvents}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            nestedScrollEnabled={true}
            renderItem={({ item }) => (
              <View style={styles.eventCard}>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventDate}>
                    {item.date} • {item.time}
                  </Text>
                </View>
                <Text style={styles.eventType}>{item.type}</Text>
              </View>
            )}
          />
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Upcoming Events</Text>
          <Text style={styles.emptySubtitle}>
            Plan ahead by adding your first event or reminder.
          </Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleNavigation("/createEvent")}
          >
            <Text style={styles.addButtonText}>Create Reminder</Text>
          </TouchableOpacity>
        </View>
      )}

      {expiredEvents.length > 0 && (
        <View style={styles.eventsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Past Events{" "}
              <Text style={{ color: "#aaa" }}>({upcomingEvents.length})</Text>
            </Text>
            <Text style={styles.sectionLink}>View All</Text>
          </View>

          <FlatList
            data={showAllExpired ? expiredEvents : expiredEvents.slice(0, 3)}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            nestedScrollEnabled={true}
            renderItem={({ item }) => (
              <View style={[styles.eventCard, styles.expiredEventCard]}>
                <View style={styles.eventInfo}>
                  <Text style={styles.expiredEventTitle}>{item.title}</Text>
                  <Text style={styles.expiredEventDate}>
                    {item.date} • {item.time}
                  </Text>
                </View>
                <Text style={styles.expiredEventType}>{item.type}</Text>
              </View>
            )}
          />
        </View>
      )}
    </PageLayout>
  );
};

export default EventsLanding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FA",
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  sectionLink: {
    color: '#3B82F6',
    fontSize: 16,
  },
  startSessionWrapper: {
    marginBottom: 20,
  },
  sessionsContainer: {
    flex: 1,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  sessionGroup: {
    marginBottom: 20,
  },
  startSessionContainer: {
    backgroundColor: "#ECFDF5",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },

  startSessionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#065F46",
    marginBottom: 8,
  },
  startSessionSubtitle: {
    fontSize: 14,
    color: "#065F46",
    textAlign: "center",
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: "#10B981",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  nextEventCard: {
    backgroundColor: "#D1E8FF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  nextEventLabel: {
    color: "#1E90FF",
    fontWeight: "600",
    marginBottom: 8,
  },
  nextEventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  nextEventTime: {
    color: "#666",
    marginTop: 4,
  },
  eventsSection: {
    marginTop: 10,
  },
  eventCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    elevation: 1,
  },
  eventInfo: {
    flexDirection: "column",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  eventDate: {
    color: "#777",
    fontSize: 14,
    marginTop: 4,
  },
  eventType: {
    fontSize: 14,
    color: "#1E90FF",
    alignSelf: "center",
  },
  expiredEventCard: {
    backgroundColor: "#E5E7EB", // light gray
  },
  expiredEventTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#999",
    textDecorationLine: "line-through",
  },
  expiredEventDate: {
    color: "#AAA",
    fontSize: 14,
    marginTop: 4,
  },
  expiredEventType: {
    fontSize: 14,
    color: "#999",
    alignSelf: "center",
  },
  viewAllButtonText: {
    color: "#1E90FF",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: "contain",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: {
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
