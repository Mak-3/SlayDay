import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import dayjs from "dayjs";
import TimeCard from "../timeCard"; // Assuming this is your task card component

const generateDates = () => {
  let dates = [];
  for (let i = -3; i <= 10; i++) {
    let date = dayjs().add(i, "day").format("YYYY-MM-DD");
    let day = dayjs(date).format("ddd");
    let numericDate = dayjs(date).format("D");
    dates.push({ id: i, date, day, numericDate });
  }
  return dates;
};

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const dates = generateDates();

  return (
    <View style={styles.container}>
      {/* Date Heading */}
      <Text style={styles.currentDate}>
        {dayjs(selectedDate).format("dddd, MMMM D")}
      </Text>

      {/* Horizontal Date List */}
      <FlatList
        data={dates}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.dateList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.dateItem,
              item.date === selectedDate && styles.selectedDate,
            ]}
            onPress={() => setSelectedDate(item.date)}
          >
            <Text
              style={[
                styles.dayText,
                item.date === selectedDate && styles.selectedDateText,
              ]}
            >
              {item.day}
            </Text>
            <Text
              style={[
                styles.numericDateText,
                item.date === selectedDate && styles.selectedDateText,
              ]}
            >
              {item.numericDate}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Events / Tasks Section */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Sample Card 1 */}
        <View style={[styles.taskCard, { backgroundColor: "#FEE2E2" }]}>
          <Text style={styles.taskTitle}>Meeting with front-end developers</Text>
          <Text style={styles.taskSubtitle}>Flose Real Estate Project</Text>
          <View style={styles.taskFooter}>
            <Text style={styles.taskTime}>9:50 AM - 10:50 AM</Text>
            <View style={styles.avatarGroup}>
              <View style={styles.avatar} />
              <View style={styles.avatar} />
              <View style={styles.avatar} />
            </View>
          </View>
        </View>

        {/* Sample Card 2 */}
        <View style={[styles.taskCard, { backgroundColor: "#E0E7FF" }]}>
          <Text style={styles.taskTitle}>Internal marketing session</Text>
          <Text style={styles.taskSubtitle}>Marketing Department</Text>
          <View style={styles.taskFooter}>
            <Text style={styles.taskTime}>11:00 AM - 12:00 AM</Text>
            <View style={styles.avatarGroup}>
              <View style={styles.avatar} />
              <View style={styles.avatar} />
              <Text style={styles.moreAvatar}>+6</Text>
            </View>
          </View>
        </View>

        {/* Your TimeCard component can be used here as well */}
        {/* <TimeCard selectedDate={selectedDate} /> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  currentDate: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#111827",
  },
  dateList: {
    paddingVertical: 12,
  },
  dateItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedDate: {
    backgroundColor: "#6366F1",
  },
  dayText: {
    fontSize: 12,
    color: "#6B7280",
  },
  numericDateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  selectedDateText: {
    color: "#fff",
    fontWeight: "700",
  },
  contentContainer: {
    marginTop: 20,
  },
  taskCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  taskSubtitle: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 12,
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskTime: {
    fontSize: 12,
    color: "#6B7280",
  },
  avatarGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#D1D5DB",
    marginLeft: -8,
    borderWidth: 2,
    borderColor: "#fff",
  },
  moreAvatar: {
    fontSize: 12,
    backgroundColor: "#4B5563",
    color: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: -8,
    borderWidth: 2,
    borderColor: "#fff",
  },
});

export default CalendarScreen;