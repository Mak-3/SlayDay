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
import { MaterialIcons as Icon } from "@expo/vector-icons";
import {
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/db/service/EventService";
import { router, useLocalSearchParams } from "expo-router";
import {
  scheduleEventNotification,
  cancelAllEventNotifications,
} from "@/constants/notificationService";
import { ObjectId } from "bson";
import ConfirmDialog from "@/components/confirmDialog";

type Params = {
  selectedDate?: string;
  editMode?: string;
  eventId?: string;
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  category?: string;
  isOneTime?: string;
  repeatType?: string;
  interval?: string;
  weekDays?: string;
  customInterval?: string;
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
  const {
    selectedDate,
    editMode,
    eventId,
    title: editTitle,
    description: editDescription,
    date: editDate,
    time: editTime,
    category: editCategory,
    isOneTime: editIsOneTime,
    repeatType: editRepeatType,
    interval: editInterval,
    weekDays: editWeekDays,
    customInterval: editCustomInterval,
  } = useLocalSearchParams<Params>();

  const isEditMode = editMode === "true";

  const [title, setTitle] = useState(editTitle || "");
  const [description, setDescription] = useState(editDescription || "");
  const [date, setDate] = useState(() => {
    if (editDate) {
      return new Date(editDate);
    }
    if (selectedDate) {
      const parsedDate = new Date(selectedDate);
      return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    }
    return new Date();
  });
  const [time, setTime] = useState(() => {
    if (editTime) {
      return new Date(editTime);
    }
    return new Date();
  });
  const [selectedCategory, setSelectedCategory] = useState(
    editCategory || "Work"
  );

  const [repeatType, setRepeatType] = useState(editRepeatType || "");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [interval, setInterval] = useState(editInterval || "1");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [isOneTime, setIsOneTime] = useState(
    editIsOneTime ? editIsOneTime === "true" : true
  );
  const categories = [
    "Work",
    "Study",
    "Coding",
    "Learning",
    "Finance",
    "Celebration",
    "Anniversary",
    "Reading",
    "Writing",
    "Travel",
    "Health",
    "Self-Improvement",
    "Personal",
    "Meditation",
    "Exercise",
    "Creativity",
    "Hobbies",
    "Food & Cooking",
    "Social",
    "Gaming",
    "Other",
  ];
  const repeatOptions = ["Daily", "Weekly", "Monthly", "Yearly"];
  const weekdaysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [weekDays, setWeekDays] = useState<Record<string, boolean>>(() => {
    if (editWeekDays) {
      try {
        const parsedWeekDays = JSON.parse(editWeekDays);
        const weekDaysObj: Record<string, boolean> = {
          Mon: false,
          Tue: false,
          Wed: false,
          Thu: false,
          Fri: false,
          Sat: false,
          Sun: false,
        };
        parsedWeekDays.forEach((day: string) => {
          if (weekDaysObj.hasOwnProperty(day)) {
            weekDaysObj[day] = true;
          }
        });
        return weekDaysObj;
      } catch {}
    }
    return {
      Mon: false,
      Tue: true,
      Wed: false,
      Thu: false,
      Fri: false,
      Sat: false,
      Sun: false,
    };
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
      } else if (repeatType === "Yearly") {
        eventData.repeatType = "Yearly";
      }
    }

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      if (isEditMode && eventId) {
        const updateData: any = {
          title: eventData.title,
          description: eventData.description || "",
          date: eventData.date,
          time: eventData.time,
          category: eventData.category,
          isOneTime: eventData.isOneTime,
        };

        if (eventData.repeatType) {
          updateData.repeatType = eventData.repeatType;
        }
        if (eventData.interval) {
          updateData.interval = eventData.interval;
        }
        if (eventData.weekDays && eventData.weekDays.length > 0) {
          updateData.weekDays = eventData.weekDays;
        }

        await updateEvent(new ObjectId(eventId), updateData);

        await scheduleEventNotification(
          eventId,
          eventData.title,
          eventData.description,
          eventData.date,
          eventData.time,
          eventData.repeatType,
          eventData.interval,
          eventData.weekDays
        );

        router.replace({
          pathname: "/drawer/reminder",
        });
      } else {
        const newEventId = await createEvent({
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          time: eventData.time,
          category: eventData.category,
          isOneTime: eventData.isOneTime,
          repeatType: eventData.repeatType,
          interval: eventData.interval,
          weekDays: eventData.weekDays,
          createdAt: eventData.createdAt,
          customInterval: undefined, // We don't use customInterval in this form
        });
        if (newEventId) {
          await scheduleEventNotification(
            newEventId,
            eventData.title,
            eventData.description,
            eventData.date,
            eventData.time,
            eventData.repeatType,
            eventData.interval,
            eventData.weekDays
          );
          router.replace({
            pathname: "/drawer/calender",
            params: { id: newEventId },
          });
        }
      }
    } catch (error) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} Event:`,
        error
      );
      alert(
        `Failed to ${isEditMode ? "update" : "create"} event. Please try again.`
      );
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventId) return;

    try {
      await cancelAllEventNotifications(eventId);

      const success = await deleteEvent(new ObjectId(eventId));

      if (success) {
        setShowDeleteDialog(false);
        router.replace({
          pathname: "/drawer/reminder",
        });
      } else {
        alert("Failed to delete event. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again.");
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
          <BackButtonHeader
            title={isEditMode ? "Edit Reminder" : "Create Reminder"}
          />

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
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  const now = new Date();
                  // If user selects past date, force it to now
                  if (selectedDate < now) {
                    setDate(now);
                  } else {
                    setDate(selectedDate);
                  }
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
                      minimumDate={new Date()}
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          const now = new Date();
                          // If user selects past date, force it to now
                          if (selectedDate < now) {
                            setDate(now);
                          } else {
                            setDate(selectedDate);
                          }
                        }
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
              minimumDate={new Date()}
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  const now = new Date();
                  const picked = new Date(date); // base on chosen date
                  picked.setHours(selectedTime.getHours());
                  picked.setMinutes(selectedTime.getMinutes());

                  // Only allow "now or later"
                  if (picked < now) {
                    setTime(now);
                    alert("Please pick a future time");
                  } else {
                    setTime(selectedTime);
                  }
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
                      minimumDate={new Date()}
                      onChange={(event, selectedTime) => {
                        setShowTimePicker(false);
                        if (selectedTime) {
                          const now = new Date();
                          const picked = new Date(date);
                          picked.setHours(selectedTime.getHours());
                          picked.setMinutes(selectedTime.getMinutes());

                          if (picked < now) {
                            setTime(now);
                            alert("Please pick a future time");
                          } else {
                            setTime(selectedTime);
                          }
                        }
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

          {isEditMode ? (
            <View style={styles.editButtonContainer}>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelButtonHalf}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelText}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.createButtonHalf,
                    title
                      ? { backgroundColor: CrimsonLuxe.primary400 }
                      : { backgroundColor: CrimsonLuxe.primary500 },
                  ]}
                  onPress={handleCreateEvent}
                >
                  <Text style={styles.createText}>Update</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.deleteButtonFull}
                onPress={() => setShowDeleteDialog(true)}
              >
                <Text style={styles.deleteText}> Delete</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelText}>Clear</Text>
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
          )}
        </View>
      </TouchableWithoutFeedback>

      <ConfirmDialog
        visible={showDeleteDialog}
        title="Delete Reminder"
        message="Are you sure you want to delete this reminder? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteEvent}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
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
    gap: 8,
  },
  editButtonContainer: {
    flexDirection: "column",
    marginTop: 50,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelButtonHalf: {
    flex: 1,
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
    flex: 1,
    backgroundColor: "#4F46E5",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  createButtonHalf: {
    flex: 1,
    backgroundColor: "#4F46E5",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  createText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  deleteButtonFull: {
    width: "100%",
    backgroundColor: CrimsonLuxe.primary400,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  deleteText: {
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
