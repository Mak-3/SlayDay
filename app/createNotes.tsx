import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  View,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import BackButtonHeader from '@/components/backButtonHeader';
import DrawingCanvas from '@/components/drawingCanvas';
import RichNoteEditor from '@/components/textEditor';

const CreateNotes = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showTextModal, setShowTextModal] = useState(false);
  const [savedDrawing, setSavedDrawing] = useState<string | null>(null);
  const [notes, setNotes] = useState<any[]>([]);

  const handleSelection = (option: string) => {
    setSelectedOption(option);

    switch (option) {
      case 'Draw':
        setShowDrawingModal(true);
        break;
      case 'Text':
        setShowTextModal(true);
        break;
      case 'Speak':
        startRecording();
        break;
    }
  };

  const startRecording = () => {
    console.log('Recording started...');
  };

  const [showDrawingModal, setShowDrawingModal] = useState(false);
  const [drawingData, setDrawingData] = useState<string | null>(null);

  const handleSaveDrawing = (drawingUri: string) => {
    const newNote = { type: 'drawing', content: drawingUri };
    setNotes([...notes, newNote]);
    setDrawingData(drawingUri);
    setShowDrawingModal(false);
    setSelectedOption(null);
  };

  const handleCancelDrawing = () => {
    setShowDrawingModal(false);
    setSelectedOption(null);
  };

  const handleSaveText = (newNote: { id: string; content: string }) => {
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setShowTextModal(false);
    console.log(notes)
  }

  return (
    <View style={styles.container}>
      <BackButtonHeader title='Create Note' />

      <View style={styles.notesOptionWrapper}>
        <Pressable
          style={({ pressed }) => [
            styles.notesOption,
            pressed && styles.notesOptionPressed,
          ]}
          onPress={() => handleSelection('Draw')}
        >
          <FontAwesome5 name="pencil-alt" size={20} color="white" />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.notesOption,
            pressed && styles.notesOptionPressed,
          ]}
          onPress={() => handleSelection('Text')}
        >
          <Text style={styles.textIcon}>T</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.notesOption,
            pressed && styles.notesOptionPressed,
          ]}
          onPress={() => handleSelection('Speak')}
        >
          <FontAwesome5 name="microphone" size={20} color="white" />
        </Pressable>
      </View>
      <Modal visible={showTextModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
        <RichNoteEditor onCancel={() => setShowTextModal(false)} onSave={handleSaveText}/>
            
          </View>
        </View>
      </Modal>

      <Modal visible={showDrawingModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <DrawingCanvas onSave={handleSaveDrawing} onCancel={handleCancelDrawing} />
            <TouchableOpacity style={styles.saveButton} onPress={() => {}}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowDrawingModal(false);
                setDrawingData('');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fef5f2',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  notesContainer: {
    paddingBottom: 100,
  },
  noteItem: {
    padding: 10,
    marginBottom: 10,
  },
  drawingImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  notesOptionWrapper: {
    gap: 10,
    right: 20,
    top: 80,
    position: 'absolute',
    flexDirection: 'column',
  },
  notesOption: {
    width: 48,
    height: 48,
    backgroundColor: '#4A90E2',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  notesOptionPressed: {
    backgroundColor: '#357ABD',
  },
  textIcon: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    height: 500
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#FF6347',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default CreateNotes;