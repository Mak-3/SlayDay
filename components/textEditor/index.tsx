import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";

const STORAGE_KEY = "RICH_NOTES_APP";

interface Note {
  id: string;
  content: string;
}

const colors: string[] = [
  "#000000",
  "#FF0000",
  "#008000",
  "#0000FF",
  "#FFA500",
  "#800080",
];

interface RichNoteEditorProps{
    onCancel: () => void;
    onSave: (note: { id: string; content: string }) => void; 
}

const RichNoteEditor: React.FC<RichNoteEditorProps> = ({onCancel, onSave}) => {
  const richText = useRef<any>(null);

  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("#000000");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedNotes) {
        const parsedNotes: Note[] = JSON.parse(savedNotes);
        setNotes(parsedNotes);
      }
    } catch (error) {
      console.log("Error loading notes:", error);
    }
  };

  const saveNotes = async (notesToSave: Note[]) => {
    try {
      const jsonValue = JSON.stringify(notesToSave);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (error) {
      console.log("Error saving notes:", error);
    }
  };

  const handleSaveNote = () => {
    if (!currentNote || currentNote.trim() === "") {
      Alert.alert("Empty note", "Write something!");
      return;
    }
  
    const newNote = {
      id: Date.now().toString(),
      content: currentNote,
    };
  
    onSave(newNote); // Send the saved note back to CreateNotes
    setCurrentNote("");
    richText.current?.setContentHTML("");
  };
  

  const handleDeleteNote = (id: string) => {
    Alert.alert("Delete Note", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: () => {
          const updatedNotes = notes.filter((note) => note.id !== id);
          setNotes(updatedNotes);
          saveNotes(updatedNotes);
        },
      },
    ]);
  };

  const applyTextColor = (color: string) => {
    if (richText.current) {
      richText.current.commandDOM(
        `document.execCommand("foreColor", false, "${color}");`
      );
    }
    setSelectedColor(color);
  };

  return (
    <View style={styles.container}>

      <View style={styles.editorWrapper}>
        <ScrollView style={styles.editorScroll}>
          <RichEditor
            ref={richText}
            onChange={(text: string) => setCurrentNote(text)}
            placeholder="Write your note..."
            style={styles.richEditor}
            initialContentHTML={currentNote}
            editorStyle={{
              backgroundColor: "#ffffff",
              color: "#333",
              placeholderColor: "#aaa",
              contentCSSText: `font-size: 16px; min-height: 200px; color: ${selectedColor};`,
            }}
          />
        </ScrollView>

        {/* Color Palette */}
        <View style={styles.colorPickerContainer}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => applyTextColor(color)}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                selectedColor === color && styles.selectedColor,
              ]}
            />
          ))}
        </View>

        <RichToolbar
          editor={richText}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
          ]}
          iconTint="#333"
          selectedIconTint="#6200ee"
          style={styles.richToolbar}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
        <Text style={styles.saveButtonText}>Save Note</Text>
      </TouchableOpacity>
    <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333",
  },
  editorWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 16,
  },
  editorScroll: {
    maxHeight: 250,
    marginBottom: 12,
  },
  richEditor: {
    borderRadius: 8,
    minHeight: 200,
  },
  colorPickerContainer: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "center",
  },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: "#6200ee",
  },
  richToolbar: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  notesList: {
    flex: 1,
  },
  noteCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  deleteButton: {
    backgroundColor: "#ff5252",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  notePreview: {
    marginTop: 8,
    minHeight: 80,
  },
  emptyText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 16,
    fontStyle: "italic",
  },
  cancelButton: {
    paddingVertical: 14,
    backgroundColor: '#FF6347',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default RichNoteEditor;