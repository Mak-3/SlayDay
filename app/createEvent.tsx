import BackButtonHeader from "@/components/backButtonHeader";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import PageLayout from "@/components/pageLayout";
import CustomTextInput from "@/components/textInput";
import CustomTextArea from "@/components/textArea";
import { CrimsonLuxe } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import { createEvent } from "@/db/service/EventService";
import { router, useLocalSearchParams } from "expo-router";

type Params = {
  selectedDate?: string;
};

type Event = {
  title: string;
  description: string;
  date: Date;
  category: string;
  createdAt: Date;
  interval?: number;
  isOneTime: boolean;
  time: Date;
  repeatType?: "Daily" | "Weekly" | "Monthly" | "Yearly";
  weekDays?: string[];
};

const CreateEventScreen = () => {
  const { selectedDate } = useLocalSearchParams<Params>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => {
    if (selectedDate) {
      const parsedDate = new Date(selectedDate);
      return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    }
    return new Date();
  });
  const [time, setTime] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState("");

  const [repeatType, setRepeatType] = useState("");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [interval, setInterval] = useState("1");

  const [isOneTime, setIsOneTime] = useState(true);
  const categories = [
    "Work",
    "Personal",
    "Birthday",
    "Exercise",
    "Meeting",
    "Health",
  ];
  const repeatOptions = ["Daily", "Weekly", "Monthly", "Yearly"];
  const weekdaysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [weekDays, setWeekDays] = useState<Record<string, boolean>>({
    Mon: false,
    Tue: true,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
    Sun: false,
  });

  const handleCreateEvent = async () => {
    const eventData: Event = {
      title: title.trim(),
      description: description.trim(),
      date: date,
      time: time,
      category: selectedCategory || "General",
      createdAt: new Date(),
      isOneTime: isOneTime,
    };
    if (isOneTime) {
      eventData.isOneTime = isOneTime;
    } else {
      eventData.isOneTime = false;
      if (repeatType === "Daily") {
        eventData.repeatType = "Daily";
        eventData.interval = parseInt(interval) || 1;
      } else if (repeatType === "Weekly") {
        eventData.repeatType = "Weekly";
        eventData.interval = parseInt(interval) || 1;
        eventData.weekDays = Object.entries(weekDays)
          .filter(([_, selected]) => selected)
          .map(([day]) => day);
      } else if (repeatType === "Monthly") {
        eventData.repeatType = "Monthly";
        eventData.interval = parseInt(interval) || 1;
      }
    }

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      const eventId = await createEvent(eventData);
      if (eventId) {
        router.push({
          pathname: "/calender",
          params: { id: eventId },
        });
      }
    } catch (error) {
      console.error("Failed to create Event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setDate(new Date());
    setTime(new Date());
    setRepeatType("");
  };

  const formatDateTime = (date: Date, type: string) => {
    if (type == "Date") {
      return date.toLocaleDateString();
    }
    if (type == "Time") {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const handleWeekDaySelection = (day: string) => {
    setWeekDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const renderDaily = () => (
    <View>
      <Text style={styles.label}>Frequency</Text>
      <CustomTextInput
        name="interval"
        keyboardType="numeric"
        value={interval}
        onChangeText={setInterval}
        placeholder="Enter interval in days"
      />
      <Text style={styles.helper}>
        * Task will repeat every{" "}
        {interval == "1" || interval == "" ? "day" : interval + " days"}
      </Text>
    </View>
  );

  const renderWeekly = () => (
    <View>
      <Text style={styles.label}>Every</Text>
      <CustomTextInput
        name="interval"
        keyboardType="numeric"
        value={interval}
        placeholder="Enter interval in weeks"
        onChangeText={setInterval}
      />
      <Text style={styles.label}>week(s) on:</Text>
      <View style={styles.weekContainer}>
        {weekdaysList.map((day) => (
          <Pressable
            key={day}
            style={[styles.dayBox, weekDays[day] && styles.dayBoxSelected]}
            onPress={() => handleWeekDaySelection(day)}
          >
            <Text style={styles.dayText}>{day}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderMonthly = () => (
    <View>
      <Text style={styles.label}>Every</Text>
      <CustomTextInput
        name="interval"
        keyboardType="numeric"
        value={interval}
        onChangeText={setInterval}
        placeholder="Enter interval in months"
      />
      <Text style={styles.helper}>
        * Task will repeat every{" "}
        {interval == "1" || interval == "" ? "month" : interval + " months"}
      </Text>
    </View>
  );

  return (
    <PageLayout style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View>
          <BackButtonHeader title="Create Reminder" />

          <Text style={styles.label}>Title</Text>
          <CustomTextInput
            name="title"
            placeholder="Name of task"
            value={title}
            onChangeText={setTitle}
            maxLength={30}
          />
          <Text style={styles.charCount}>{title.length}/30</Text>

          <Text style={styles.label}>Description</Text>
          <CustomTextArea
            placeholder="Details about task"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>Category</Text>
          <TouchableOpacity
            style={[styles.input, { flexDirection: "row" }]}
            onPress={() => setCategoryModalVisible(true)}
          >
            <Text
              style={{ color: selectedCategory ? "#333" : "#999", flex: 1 }}
            >
              {selectedCategory || "Select a category"}
            </Text>
            <Icon name="arrow-drop-down" size={24} color="#333" />
          </TouchableOpacity>

          <Modal
            visible={categoryModalVisible}
            transparent
            animationType="slide"
          >
            <TouchableWithoutFeedback
              onPress={() => setCategoryModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <FlatList
                    data={categories}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.categoryItem}
                        onPress={() => {
                          setSelectedCategory(item);
                          setCategoryModalVisible(false);
                        }}
                      >
                        <Text style={styles.categoryText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          <View style={styles.dateTimeWrapper}>
            <View style={styles.dateTimeField}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  { flexDirection: "row", justifyContent: "space-between" },
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: date ? "#333" : "#999" }}>
                  {formatDateTime(date, "Date")}
                </Text>
                <Icon name="calendar-today" size={18} color="#555" />
              </TouchableOpacity>
            </View>
            <View style={styles.dateTimeField}>
              <Text style={styles.label}>Time</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  { flexDirection: "row", justifyContent: "space-between" },
                ]}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={{ color: time ? "#333" : "#999" }}>
                  {formatDateTime(time, "Time")}
                </Text>
                <Icon name="access-time" size={20} color="#555" />
              </TouchableOpacity>
            </View>
          </View>
          {showDatePicker && Platform.OS === "android" && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}

          {Platform.OS === "ios" && (
            <Modal
              transparent
              animationType="slide"
              visible={showDatePicker}
              onRequestClose={() => setShowDatePicker(false)}
            >
              <TouchableWithoutFeedback
                onPress={() => setShowDatePicker(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.pickerContainer}>
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="spinner"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) setDate(selectedDate);
                      }}
                    />
                    <TouchableOpacity
                      style={styles.doneButton}
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Text style={styles.doneText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}

          {showTimePicker && Platform.OS === "android" && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  setTime(selectedTime);
                }
              }}
            />
          )}

          {Platform.OS === "ios" && (
            <Modal
              transparent
              animationType="slide"
              visible={showTimePicker}
              onRequestClose={() => setShowTimePicker(false)}
            >
              <TouchableWithoutFeedback
                onPress={() => setShowTimePicker(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.pickerContainer}>
                    <DateTimePicker
                      value={time}
                      mode="time"
                      display="spinner"
                      onChange={(event, selectedTime) => {
                        if (selectedTime) setTime(selectedTime);
                      }}
                    />
                    <TouchableOpacity
                      style={styles.doneButton}
                      onPress={() => setShowTimePicker(false)}
                    >
                      <Text style={styles.doneText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}

          <Text style={styles.label}>Task Type</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              onPress={() => setIsOneTime(true)}
              style={[styles.toggleOption, isOneTime && styles.selectedOption]}
            >
              <Text>One-time</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsOneTime(false)}
              style={[styles.toggleOption, !isOneTime && styles.selectedOption]}
            >
              <Text>Repeat</Text>
            </TouchableOpacity>
          </View>

          {!isOneTime && (
            <>
              <Text style={styles.label}>Repeat Type</Text>
              <View style={styles.repeatTypeContainer}>
                {repeatOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.repeatTypeButton,
                      repeatType === option && styles.selectedRepeatType,
                    ]}
                    onPress={() => setRepeatType(option)}
                  >
                    <Text style={styles.repeatTypeText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {repeatType == "Daily" && renderDaily()}
              {repeatType == "Weekly" && renderWeekly()}
              {repeatType == "Monthly" && renderMonthly()}
            </>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.createButton,
                title
                  ? { backgroundColor: CrimsonLuxe.primary400 }
                  : { backgroundColor: CrimsonLuxe.primary500 },
              ]}
              onPress={handleCreateEvent}
            >
              <Text style={styles.createText}>✓ Create Reminder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#333",
    height: 48,
    justifyContent: "center",
    paddingVertical: 14,
    marginVertical: 5,
  },
  charCount: {
    alignSelf: "flex-end",
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  dateTimeWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    marginHorizontal: 5,
  },
  selectedOption: {
    backgroundColor: CrimsonLuxe.primary100,
    borderColor: CrimsonLuxe.primary300,
  },
  dateTimeField: {
    width: "45%",
    maxWidth: 300,
  },
  repeatTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  repeatTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDD",
    marginRight: 8,
    marginBottom: 8,
  },
  selectedRepeatType: {
    backgroundColor: CrimsonLuxe.primary100,
    borderColor: CrimsonLuxe.primary300,
  },
  repeatTypeText: {
    color: "#333",
    fontSize: 14,
  },
  weekContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  dayBox: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginRight: 6,
  },
  dayBoxSelected: {
    backgroundColor: CrimsonLuxe.primary100,
    borderColor: CrimsonLuxe.primary300,
  },
  dayText: { color: "#000" },
  helper: { fontSize: 12, color: "#777" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  cancelButton: {
    flex: 0.48,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelText: {
    color: "#333",
    fontSize: 16,
  },
  createButton: {
    flex: 0.48,
    backgroundColor: "#4F46E5",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  createText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 10,
    padding: 20,
    maxHeight: 300,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  doneButton: {
    alignItems: "center",
    marginTop: 10,
  },
  doneText: {
    color: CrimsonLuxe.primary400,
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
  },
});

export default CreateEventScreen;
