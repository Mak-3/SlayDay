import BackButtonHeader from "@/components/backButtonHeader";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  FlatList,
} from "react-native";
import PageLayout from "@/components/pageLayout";
import { CrimsonLuxe } from "@/constants/Colors";
import CustomTextInput from "@/components/textInput";
import CustomTextArea from "@/components/textArea";
import { router } from "expo-router";
import { createChecklist } from "@/db/service/ChecklistService";
import { MaterialIcons as Icon } from "@expo/vector-icons";

const CreateChecklist = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isOneTime, setIsOneTime] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Work");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const categories = [
    "Work",
    "Study",
    "Coding",
    "Learning",
    "Reading",
    "Writing",
    "Self-Improvement",
    "Personal",
    "Meditation",
    "Travel",
    "Health",
    "Exercise",
    "Creativity",
    "Hobbies",
    "Music",
    "Food & Cooking",
    "Social",
    "Gaming",
    "Other",
  ];

  const handleCreateEvent = async () => {
    try {
      const checklistId = await createChecklist({
        title: title,
        description: description,
        taskType: "OneTime",
        category: selectedCategory,
        createdAt: new Date(),
        lastSaved: new Date(),
        isCompleted: false,
        tasks: [],
      });

      if (checklistId) {
        router.replace({
          pathname: "/checklistScreen",
          params: {
            id: checklistId,
          },
        });
      }
    } catch (error) {
      console.error("Failed to create Checklist:", error);
    }
  };

  return (
    <PageLayout style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <BackButtonHeader title="Create Checklist" />
          <Text style={styles.label}>Title</Text>
          <CustomTextInput
            placeholder="Name of Checklist"
            value={title}
            onChangeText={setTitle}
            maxLength={30}
            name="Name"
            required
          />
          <Text style={styles.charCount}>{title.length}/30</Text>

          <Text style={styles.label}>Description</Text>
          <CustomTextArea
            placeholder="Details about Checklist"
            value={description}
            onChangeText={setDescription}
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
  categoryItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
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
