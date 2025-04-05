import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import BackButtonHeader from "@/components/backButtonHeader";
import PageLayout from "@/components/pageLayout";
import { cardColors, Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const initialCategories = [
  {
    id: "1",
    name: "Essentials",
    completed: 0,
    icon: "diamond",
    items: [],
  },
  {
    id: "2",
    name: "Airplane",
    completed: 0,
    icon: "airplane",
    items: [],
  },
  {
    id: "3",
    name: "Bus",
    completed: 0,
    icon: "bus",
    items: [
      { title: "Bus Ticket", isCompleted: false },
      { title: "Neck Pillow", isCompleted: false },
      { title: "Headphone", isCompleted: false },
    ],
  },
];

const checkList = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [expanded, setExpanded] = useState<any>({});
  const [newCategory, setNewCategory] = useState("");

  const toggleExpand = (id: any) => {
    setExpanded((prev: any) => ({ ...prev, [id]: !prev[id] }));
  };

  const addCategory = () => {
    if (newCategory.trim()) {
      const newCat = {
        id: Date.now().toString(),
        name: newCategory,
        completed: 0,
        total: 0,
        icon: "folder",
        items: [],
      };
      setCategories([...categories, newCat]);
      setNewCategory("");
    }
  };

  const addItem = (categoryId: any) => {
    const newItem = `New Item ${Date.now().toString().slice(-3)}`;
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: [...cat.items, { title: newItem, isCompleted: false }],
            }
          : cat
      )
    );
  };

  const toggleComplete = (categoryId: string, index: number) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((item, i) =>
                i === index ? { ...item, isCompleted: !item.isCompleted } : item
              ),
              completed: cat.items.filter((item, i) =>
                i === index ? !item.isCompleted : item.isCompleted
              ).length,
            }
          : cat
      )
    );
  };

  return (
    <PageLayout style={styles.container}>
      <BackButtonHeader title="Checklists" />

      <View style={styles.addCategoryContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Category"
          value={newCategory}
          onChangeText={setNewCategory}
        />
        <TouchableOpacity style={styles.addButton} onPress={addCategory}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.taskSection}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.category,
                { backgroundColor: cardColors[index % categories.length].light },
              ]}
            >
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => toggleExpand(item.id)}
              >
                <Text style={styles.categoryText}>{item.name}</Text>
                <Text style={styles.categoryStatus}>
                  {item.completed}/{categories[index].items.length}
                </Text>
                <Icon
                  name={expanded[item.id] ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#7B61FF"
                />
              </TouchableOpacity>
              {/* <ProgressBar
                progress={categories[index].items.length > 0 ? Math.round((item.completed / categories[index].items.length) * 100) : 0}
                showStatus={false}
                activeColor={colors[index].dark}
              /> */}

              {expanded[item.id] && (
                <View style={styles.itemList}>
                  {item.items.map((task: any, index: any) => (
                    <View key={index} style={styles.itemRow}>
                    <TouchableOpacity
                      onPress={() => toggleComplete(item.id, index)}
                      style={styles.checkbox}
                    >
                      <Ionicons
                        name={task.isCompleted ? "checkbox" : "square-outline"}
                        size={24}
                        color={task.isCompleted ? "green" : "black"}
                      />
                    </TouchableOpacity>
                    <Text style={styles.itemText}>{task.title}</Text>
                  </View>
                  ))}
                  <TouchableOpacity
                    style={styles.addItem}
                    onPress={() => addItem(item.id)}
                  >
                    <Text style={styles.addItemText}>+ Add Item</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#F8F8F8" },
  category: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  categoryText: { fontSize: 16, fontWeight: "bold", flex: 1 },
  categoryStatus: { fontSize: 14, color: "#7B61FF", fontWeight: "bold" },
  taskSection: { marginVertical: 20 },
  itemList: { marginTop: 10 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  itemText: { fontSize: 14, flex: 1, marginLeft: 10 },
  addItem: { paddingVertical: 5 },
  addItemText: { color: "#7B61FF", fontSize: 14, fontWeight: "bold" },
  addCategoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#FFF",
  },
  addButton: {
    backgroundColor: "#7B61FF",
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  addButtonText: { color: "#FFF", fontWeight: "bold" },
  checkbox: { paddingRight: 10 },
});

export default checkList;
