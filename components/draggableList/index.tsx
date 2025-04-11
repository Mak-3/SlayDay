import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";
import ProgressBar from "../progressBar";
import { updateChecklist } from "@/db/service/ChecklistService";
import { ObjectId } from "bson";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
interface TodoProps {
  item: any;
  drag: any;
  isActive: boolean;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
}
interface DraggableListProps {
  checkboxStyles: ViewStyle;
  checkedStyles: ViewStyle;
  items: Task[];
  checklistID: any;
}

const DraggableList: React.FC<DraggableListProps> = ({
  items,
  checkboxStyles,
  checkedStyles,
  checklistID,
}) => {
  const [tasks, setTasks] = useState<Task[]>(Array.isArray(items) ? items : []);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const toggleComplete = (id: string) => {
    setTasks((prev) => {
      setEditingTaskId(null);
      return prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
    });
  };

  const addTask = () => {
    const newTask = {
      id: Date.now().toString(),
      title: "",
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setEditingTaskId(newTask.id);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleEdit = (id: string) => {
    setEditingTaskId((prev) => (prev === id ? null : id));
  };

  const updateTaskText = (id: string, title: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));
  };

  const handleOutsideClick = () => {
    setEditingTaskId(null);
    setTasks((prev) => prev.filter((t) => t.title != ""));
  };

  const handleSave = async () => {
    try {
      await updateChecklist(new ObjectId(checklistID), {
        tasks: tasks.map((task) => ({
          title: task.title,
          isCompleted: task.completed,
        })),
      });
      router.push("/checklistOverview");
    } catch (error) {
      console.error("Failed to update checklist:", error);
    }
  };

  const handleShowToast = () => {
    Toast.show({
      type: "success",
      text1: `checklist updated successfully`,
    });
  };

  const renderItem: React.FC<TodoProps> = ({ item, drag, isActive }) => {
    const isEditing = editingTaskId === item.id;
    return (
      <ScaleDecorator>
        <TouchableOpacity
          style={[styles.taskItem, isActive && styles.activeTask]}
          onLongPress={drag}
          activeOpacity={1}
        >
          <MaterialIcons name="drag-indicator" size={24} color="grey" />
          <TouchableOpacity
            onPress={() => toggleComplete(item.id)}
            style={[
              styles.checkbox,
              checkboxStyles,
              item.completed && styles.checked,
              item.completed && checkedStyles,
            ]}
          >
            {item.completed && (
              <MaterialIcons name="check" size={14} color="white" />
            )}
          </TouchableOpacity>

          {isEditing ? (
            <TextInput
              style={styles.input}
              value={item.title}
              onChangeText={(text) => updateTaskText(item.id, text)}
              onBlur={() => toggleEdit(item.id)}
              autoFocus
            />
          ) : (
            <Text
              style={[styles.taskText, item.completed && styles.completedText]}
            >
              {item.title}
            </Text>
          )}

          <TouchableOpacity
            onPress={() => toggleEdit(item.id)}
            style={styles.icons}
          >
            <MaterialIcons name="edit" size={20} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteTask(item.id)}
            style={styles.icons}
          >
            <MaterialIcons name="delete" size={20} color="red" />
          </TouchableOpacity>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={handleOutsideClick}>
        <View style={{ flex: 1 }}>
          <View style={styles.headerContainer}>
            <View style={styles.actions}>
              <TouchableOpacity onPress={addTask}>
                <Icon name="add" size={26} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon
                  name="settings"
                  size={26}
                  color="#333"
                  style={styles.settingsIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ProgressBar activeColor="#F4A261" showStatus={false} progress={70} />
          {tasks && Array.isArray(tasks) && (
            <DraggableFlatList
              scrollEnabled={false}
              data={tasks}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              onDragEnd={({ data }) => setTasks(data)}
              containerStyle={{ flex: 1 }}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',

  },
  settingsIcon: {
    marginLeft: 16,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 10,
  },
  activeTask: { backgroundColor: "#e0e0e0" },
  taskText: { flex: 1, fontSize: 16, marginLeft: 10 },
  completedText: { textDecorationLine: "line-through", color: "gray" },
  checked: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 6,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },
  icons: {
    marginHorizontal: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "gray",
    padding: 2,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    margin: 16,
  },

  saveText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DraggableList;
