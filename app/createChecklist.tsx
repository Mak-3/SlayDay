import BackButtonHeader from "@/components/backButtonHeader";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import PageLayout from "@/components/pageLayout";
import { CrimsonLuxe } from "@/constants/Colors";
import CustomTextInput from "@/components/textInput";
import CustomTextArea from "@/components/textArea";
import { router } from "expo-router";
import { createChecklist } from "@/db/service/ChecklistService";

const CreateChecklist = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isOneTime, setIsOneTime] = useState(true);

  const handleCreateEvent = async () => {
    try {
      const checklistId = await createChecklist({
        title: title,
        Description: description,
        taskType: "OneTime",
        category: "General",
        createdAt: Date.now(),
        endAt: 0,
        tasks: [],
      });

      if (checklistId) {
        router.push({
          pathname: "/checklistScreen",
          params: {
            id: checklistId,
          },
        });
      }
    } catch (error) {
      console.error("Failed to create Checklist:", error);
      alert("Something went wrong while creating the Checklist.");
    }
  };

  return (
    <PageLayout style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View>
          <BackButtonHeader title="Create Checklist" />
          <Text style={styles.label}>Title</Text>
          <CustomTextInput
            placeholder="Name of Checklist"
            value={title}
            onChangeText={setTitle}
            maxLength={30}
          />
          <Text style={styles.charCount}>{title.length}/30</Text>

          <Text style={styles.label}>Description</Text>
          <CustomTextArea
            placeholder="Details about Checklist"
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Checklist Type</Text>
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
              <Text>Reusable</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.createButton,
                title
                  ? { backgroundColor: CrimsonLuxe.primary400 }
                  : { backgroundColor: CrimsonLuxe.primary600 },
              ]}
              disabled={!title}
              onPress={handleCreateEvent}
            >
              <Text style={styles.createText}>✓ Create New Checklist</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#FFFFFF" },
  label: { fontSize: 16, color: "#333", marginBottom: 5, marginTop: 15 },
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  createButton: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  createText: { color: "#FFF", fontWeight: "bold" },
});

export default CreateChecklist;
