import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import dayjs from "dayjs";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackButtonHeader from "@/components/backButtonHeader";
import PageLayout from "@/components/pageLayout";
import NoDataEvents from "@/components/noDataEvents";
import { CrimsonLuxe } from "@/constants/Colors";

const generateDates = (centerDate: string) => {
  const dates = [];
  for (let i = -7; i <= 7; i++) {
    const date = dayjs(centerDate).add(i, "day").format("YYYY-MM-DD");
    const day = dayjs(date).format("ddd");
    const numericDate = dayjs(date).format("D");
    dates.push({ id: i, date, day, numericDate });
  }
  return dates;
};

const CalenderScreen = () => {
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [showPicker, setShowPicker] = useState(false);
  const dateListRef = useRef<FlatList<any>>(null);

  const onDateChange = (event: any, date?: Date) => {
    setShowPicker(false);
    if (date) {
      const formatted = dayjs(date).format("YYYY-MM-DD");
      setSelectedDate(formatted);
    }
  };

  const dates = generateDates(selectedDate);

  useEffect(() => {
    if (dateListRef.current) {
      dateListRef.current.scrollToIndex({ index: 5, animated: true });
    }
  }, []);

  return (
    <PageLayout style={styles.container}>
      <BackButtonHeader />
      <View style={styles.contentContainer}>
        <View style={styles.dateHeader}>
          <Text style={styles.currentDate}>
            {dayjs(selectedDate).format("dddd, MMMM D")}
          </Text>
          <TouchableOpacity onPress={() => setShowPicker(!showPicker)}>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={28}
              color={CrimsonLuxe.primary400}
            />
          </TouchableOpacity>
        </View>

        {showPicker && (
          <View style={styles.datePickerWrapper}>
            <DateTimePicker
              value={new Date(selectedDate)}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={onDateChange}
            />
          </View>
        )}

        <FlatList
          data={dates}
          ref={dateListRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.dateList}
          onScrollToIndexFailed={(info) => {
            setTimeout(() => {
              dateListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            }, 300);
          }}
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

        <NoDataEvents />
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9FAFB",
  },
  currentDate: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  dateList: {
    marginVertical: 10,
    height: 80,
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
  datePickerWrapper: {
    alignItems: "center",
  },
  selectedDate: {
    backgroundColor: CrimsonLuxe.primary300,
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
});

export default CalenderScreen;
