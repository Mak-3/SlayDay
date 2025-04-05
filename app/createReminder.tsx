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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import PageLayout from "@/components/pageLayout";
import CustomTextInput from "@/components/textInput";
import CustomTextArea from "@/components/textArea";
import { CrimsonLuxe } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";

const CreateEventScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());

  const [repeat, setRepeat] = useState(false);
  const [repeatType, setRepeatType] = useState("");
  const [customInterval, setCustomInterval] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagsText, setTagsText] = useState("");

  const [isOneTime, setIsOneTime] = useState(true);
  const categories = [
    "Work",
    "Personal",
    "Birthday",
    "Exercise",
    "Meeting",
    "Health",
  ];
  const repeatOptions = ["Daily", "Weekly", "Monthly", "Yearly", "Custom"];

  const handleCreateEvent = () => {
    const combinedDateTime = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      startTime.getHours(),
      startTime.getMinutes()
    );

    console.log({
      title,
      description,
      startDate: startDate.toDateString(),
      startTime: startTime.toTimeString(),
      combinedDateTime: combinedDateTime.toISOString(),
      repeat,
      repeatType,
      customInterval,
      tags,
    });
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setStartDate(new Date());
    setStartTime(new Date());
    setRepeat(false);
    setRepeatType("");
    setCustomInterval("");
    setTags([]);
    setTagsText("");
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

  const handleTagsChange = (text: string) => {
    setTagsText(text);

    const newTags = text
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    setTags(newTags);
  };

  return (
    <PageLayout style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View>
          <BackButtonHeader title="Create Reminder" />

          <Text style={styles.label}>Title</Text>
          <CustomTextInput
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
          </Modal>
          <View style={styles.dateTimeWrapper}>
            <View style={styles.dateTimeField}>
              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  { flexDirection: "row", justifyContent: "space-between" },
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: startDate ? "#333" : "#999" }}>
                  {formatDateTime(startDate, "Date")}
                </Text>
                <Icon name="calendar-today" size={18} color="#555" />
              </TouchableOpacity>
            </View>
            <View style={styles.dateTimeField}>
              <Text style={styles.label}>Start Time</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  { flexDirection: "row", justifyContent: "space-between" },
                ]}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={{ color: startTime ? "#333" : "#999" }}>
                  {formatDateTime(startTime, "Time")}
                </Text>
                <Icon name="access-time" size={20} color="#555" />
              </TouchableOpacity>
            </View>
          </View>
          {showDatePicker && Platform.OS === "android" && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setStartDate(selectedDate);
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
                      value={startDate}
                      mode="date"
                      display="spinner"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) setStartDate(selectedDate);
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
              value={startTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  setStartTime(selectedTime);
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
                      value={startTime}
                      mode="time"
                      display="spinner"
                      onChange={(event, selectedTime) => {
                        if (selectedTime) setStartTime(selectedTime);
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

          <Text style={styles.label}>Tags</Text>
          <CustomTextInput
            placeholder="Comma-separated tags, e.g. Finance, Credit Card"
            value={tagsText}
            onChangeText={handleTagsChange}
          />

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

          {repeat && (
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

              {repeatType === "Custom" && (
                <CustomTextInput
                  placeholder="Enter custom interval in days"
                  value={customInterval}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9]/g, "");
                    setCustomInterval(numericValue);
                  }}
                  keyboardType="numeric"
                />
              )}
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
