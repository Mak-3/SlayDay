import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Calendar } from "react-native-calendars";

const CustomCalendar = () => {
  const markedDates = {
    "2024-04-14": { startingDay: true, color: "#FFA726", textColor: "#fff" },
    "2024-04-15": { color: "#FFA726", textColor: "#fff" },
    "2024-04-16": { color: "#FFA726", textColor: "#fff" },
    "2024-04-17": { color: "#FFA726", textColor: "#fff" },
    "2024-04-18": { color: "#FFA726", textColor: "#fff" },
    "2024-04-19": { color: "#FFA726", textColor: "#fff" },

    "2024-04-20": { color: "#FFA726", textColor: "#fff" },
    "2024-04-21": { color: "#FFA726", textColor: "#fff" },
    "2024-04-22": { color: "#FFA726", textColor: "#fff" },
    "2024-04-23": { color: "#FFA726", textColor: "#fff" },
    "2024-04-24": { endingDay: true, color: "#FFA726", textColor: "#fff" },
  };

  return (
    <View>
      <Calendar
        current={"2024-04-14"}
        markingType={"period"}
        markedDates={markedDates}
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#333",
          selectedDayBackgroundColor: "#FFA726",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#FF5722",
          dayTextColor: "#333",
          textDisabledColor: "#d9e1e8",
          arrowColor: "#FFA726",
          monthTextColor: "#333",
          indicatorColor: "#FFA726",
          textDayFontWeight: "400",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "400",
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 12,
        }}
      />

      <View style={styles.footerContainer}>
        <Text style={styles.streakText}>11 Days in a Row!</Text>
      </View>
    </View>
  );
};

export default CustomCalendar;

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: "#FFF",
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  streakText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF8F00",
  }
});
