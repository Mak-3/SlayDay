import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { cardColors, CrimsonLuxe } from "@/constants/Colors";
import { ObjectId } from "bson";
import { getAllEvents } from "@/db/service/EventService";
import { renderIcon } from "../renderIcon";

interface EventType {
  id: ObjectId;
  title: string;
  description?: string;
  date: Date;
  time: Date;
  repeatType?: string;
  customInterval?: string;
  interval?: number;
  category: string;
  isOneTime: boolean;
  weekDays?: string[];
  createdAt: Date;
}

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const TaskCard = () => {
  const [expandedId, setExpandedId] = useState<ObjectId | null>(null);
  const [todayEvents, setTodayEvents] = useState<EventType[]>([]);

  const fetchTodayTasks = async () => {
    const allEvents = await getAllEvents();
    const today = new Date();

    const isMatchingRepeat = (event: EventType) => {
      const today = new Date();
      const eventDate = new Date(event.date);

      if (event.isOneTime) {
        return isToday(eventDate);
      }

      if (event.repeatType === "Daily") {
        return eventDate <= today;
      }

      if (event.repeatType === "Weekly" && event.weekDays) {
        const currentDay = today.toLocaleString("en-US", { weekday: "short" });
        return eventDate <= today && event.weekDays.includes(currentDay);
      }

      if (event.repeatType === "Monthly") {
        return eventDate <= today && eventDate.getDate() === today.getDate();
      }

      if (event.repeatType === "Yearly") {
        return (
          eventDate <= today &&
          eventDate.getDate() === today.getDate() &&
          eventDate.getMonth() === today.getMonth()
        );
      }

      if (event.repeatType === "Custom" && event.interval) {
        if (eventDate > today) return false;

        const diffDays = Math.floor(
          (today.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        return diffDays % event.interval === 0;
      }

      return false;
    };

    const filtered = allEvents.filter((event: EventType) =>
      isMatchingRepeat(event)
    );

    filtered.sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    );
    
    setTodayEvents(filtered);
  };

  useEffect(() => {
    fetchTodayTasks();
  }, []);

  const handleToggleDescription = (id: ObjectId) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <FlatList
      data={todayEvents}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false}
      renderItem={({ item, index }) => (
        <View style={styles.card}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: cardColors[index % cardColors.length].dark },
            ]}
          >
            {renderIcon(item.category, "#ffffff")}
          </View>

          <View style={styles.infoWrapper}>
            <Text style={styles.title}>{item.title}</Text>

            <TouchableOpacity onPress={() => handleToggleDescription(item.id)}>
              <Text
                style={styles.description}
                numberOfLines={expandedId === item.id ? undefined : 2}
                ellipsizeMode="tail"
              >
                {item.description || "No description provided."}
              </Text>
            </TouchableOpacity>

            <View style={styles.metaRow}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color="#888"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.timeText}>
                {new Date(item.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "flex-start",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    marginVertical: 10,
    marginHorizontal: 6,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: CrimsonLuxe.primary100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: "#444",
    lineHeight: 18,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 13,
    color: "#888",
  },
});

export default TaskCard;
