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
import NoDataCalender from "@/components/noDataCalender";
import { cardColors, CrimsonLuxe } from "@/constants/Colors";
import { getRealm } from "@/db/realm";
import { renderIcon } from "@/components/renderIcon";

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

const fetchEventsForDate = async (selectedDate: string) => {
  const realm = await getRealm();

  const allEvents = realm.objects("Event").sorted("createdAt", true);
  const result: any[] = [];

  const selected = dayjs(selectedDate);

  for (const event of allEvents as any) {
    const eventDate = dayjs(event.date);
    const interval = event.interval || 1;

    if (event.isOneTime) {
      if (eventDate.isSame(selected, "day")) {
        result.push(event);
      }
    } else {
      if (event.repeatType === "Daily") {
        const diff = selected.diff(eventDate, "day");
        if (diff >= 0 && diff % interval === 0) {
          result.push(event);
        }
      } else if (event.repeatType === "Weekly") {
        const dayName = selected.format("ddd");
        const diffWeeks = selected.diff(eventDate, "week");
        const isValidDay = event.weekDays?.includes(dayName);
        if (diffWeeks >= 0 && diffWeeks % interval === 0 && isValidDay) {
          result.push(event);
        }
      } else if (event.repeatType === "Monthly") {
        const diffMonths = selected.diff(eventDate, "month");
        if (
          diffMonths >= 0 &&
          diffMonths % interval === 0 &&
          eventDate.date() === selected.date()
        ) {
          result.push(event);
        }
      } else if (event.repeatType === "Yearly") {
        const diffYears = selected.diff(eventDate, "year");
        if (
          diffYears >= 0 &&
          diffYears % interval === 0 &&
          eventDate.date() === selected.date() &&
          eventDate.month() === selected.month()
        ) {
          result.push(event);
        }
      }
    }
  }

  const mapped = result.map((event: any) => ({
    id: event._id,
    title: event.title,
    description: event.description,
    date: event.date,
    time: event.time,
    repeatType: event.repeatType,
    customInterval: event.customInterval,
    interval: event.interval,
    category: event.category,
    isOneTime: event.isOneTime,
    weekDays: event.weekDays,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  }));

  const sorted = mapped.sort((a, b) => {
    const aDateTime = dayjs(a.time);
    const bDateTime = dayjs(b.time);
    return aDateTime.valueOf() - bDateTime.valueOf();
  });

  return sorted;
};

const CalenderScreen = () => {
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [showPicker, setShowPicker] = useState(false);
  const dateListRef = useRef<FlatList<any>>(null);
  const [events, setEvents] = useState<any[]>([]);

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

  useEffect(() => {
    const loadEvents = async () => {
      const eventsForDate = await fetchEventsForDate(selectedDate);
      setEvents(eventsForDate);
    };
    loadEvents();
  }, [selectedDate]);

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
              key={item.id}
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

        {events.length > 0 ? (
          events.map((event, index) => (
            <View
              style={[styles.cardWrapper, index % 2 != 0 && { marginLeft: 50 }]}
              key={event.id}
            >
              <View style={styles.timeWrapper}>
                <Text style={styles.time}>
                  {dayjs(event.time).format("h:mm A")}
                </Text>
              </View>
              <View
                key={event.id}
                style={[
                  styles.card,
                  {
                    backgroundColor:
                      cardColors[index % cardColors.length].light,
                  },
                ]}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    padding: 8,
                    borderRadius: 10,
                    backgroundColor: cardColors[index % cardColors.length].dark,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {renderIcon(
                    event.category,
                    cardColors[index % cardColors.length].light
                  )}
                </View>
                <View style={styles.titleWrapper}>
                  <Text style={styles.cardTitle}>{event.title}</Text>
                  <Text style={styles.cardDescription}>
                    {event.description}
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <NoDataCalender selectedDate={selectedDate} />
        )}
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
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
  cardWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  card: {
    width: "75%",
    marginVertical: 12,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
  },
  time: {
    fontSize: 12,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  timeWrapper: {
    marginRight: 10,
  },
  titleWrapper: {
    marginLeft: 12,
    gap: 4,
    flexShrink: 1,
  },
  cardDescription: {
    lineHeight: 22,
  },
  cardRepeatText: {
    color: "#6B7280",
    fontSize: 12,
  },
});

export default CalenderScreen;
