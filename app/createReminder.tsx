import BackButtonHeader from "@/components/backButtonHeader";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import PageLayout from "@/components/pageLayout";

const CreateEventScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("#1E90FF");
  const [startDateTime, setStartDateTime] = useState(new Date());

  const [repeat, setRepeat] = useState(false);
  const [repeatType, setRepeatType] = useState(""); // daily, weekly, etc.
  const [customInterval, setCustomInterval] = useState(""); // in days

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagsText, setTagsText] = useState("");

  const colorOptions = [
    "#1E90FF",
    "#8A2BE2",
    "#FFD700",
    "#FF6347",
    "#FF4500",
    "#3CB371",
  ];

  const repeatOptions = ["Daily", "Weekly", "Monthly", "Yearly", "Custom"];

  const handleCreateEvent = () => {
    console.log({
      title,
      selectedColor,
      description,
      startDateTime: startDateTime.toISOString(),
      repeat,
      repeatType,
      customInterval,
      tags,
    });
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setSelectedColor("");
    setStartDateTime(new Date());
    setRepeat(false);
    setRepeatType("");
    setCustomInterval("");
    setTags([]);
    setTagsText("");
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString();
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
      <BackButtonHeader title="Create Reminder" />

      <Text style={styles.label}>Title</Text>
      <TextInput
        placeholder="Name of event"
        value={title}
        onChangeText={setTitle}
        maxLength={30}
        style={styles.input}
      />
      <Text style={styles.charCount}>{title.length}/30</Text>

      <Text style={styles.label}>Color</Text>
      <View style={styles.colorContainer}>
        {colorOptions.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.colorCircle,
              { backgroundColor: color },
              selectedColor === color && styles.selectedColor,
            ]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>

      <Text style={styles.label}>Description</Text>
      <View style={styles.descriptionBox}>
        <TextInput
          placeholder="Details about event"
          value={description}
          onChangeText={setDescription}
          style={styles.descriptionInput}
          multiline
        />
      </View>

      <Text style={styles.label}>Start Date & Time</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowStartPicker(true)}
      >
        <Text style={{ color: startDateTime ? "#333" : "#999" }}>
          {formatDateTime(startDateTime)}
        </Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={startDateTime}
          mode="datetime"
          display={"default"}
          onChange={(event, selectedDate) => {
            setShowStartPicker(Platform.OS === "ios");
            if (selectedDate) setStartDateTime(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Tags</Text>
      <TextInput
        style={styles.input}
        placeholder="Comma-separated tags, e.g. Finance, Credit Card"
        value={tagsText}
        onChangeText={handleTagsChange}
      />

      <View style={styles.repeatContainer}>
        <Switch value={repeat} onValueChange={setRepeat} />
        <Text style={styles.repeatLabel}>Repeat</Text>
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
                <Text
                  style={[
                    styles.repeatTypeText,
                    repeatType === option && styles.selectedRepeatTypeText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {repeatType === "Custom" && (
            <TextInput
              placeholder="Enter custom interval in days"
              value={customInterval}
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9]/g, "");
                setCustomInterval(numericValue);
              }}
              style={styles.input}
              keyboardType="numeric"
            />
          )}
        </>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateEvent}
        >
          <Text style={styles.createText}>✓ Create Reminder</Text>
        </TouchableOpacity>
      </View>
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
  colorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedColor: {
    borderColor: "#333",
  },
  descriptionBox: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    marginVertical: 5,
  },
  descriptionInput: {
    minHeight: 80,
    paddingHorizontal: 12,
    paddingTop: 10,
    textAlignVertical: "top",
    color: "#333",
  },
  repeatContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  repeatLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
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
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  repeatTypeText: {
    color: "#333",
    fontSize: 14,
  },
  selectedRepeatTypeText: {
    color: "#FFF",
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
});

export default CreateEventScreen;