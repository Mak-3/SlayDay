// components/DrawingCanvas.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';

interface DrawingCanvasProps {
  onSave: (signature: string) => void;
  onCancel: () => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onSave, onCancel }) => {
  const handleOK = (signature: string) => {
    console.log('Signature saved:', signature);
    onSave(signature); // Returns base64 encoded png
  };

  const handleEmpty = () => {
    console.log('No drawing detected');
  };

  const handleClear = () => {
    console.log('Canvas cleared');
  };

  return (
    <View style={styles.container}>
      <SignatureScreen
        onOK={handleOK}
        onEmpty={handleEmpty}
        onClear={handleClear}
        descriptionText="Draw your note!"
        clearText="Clear"
        confirmText="Save"
        webStyle={`.m-signature-pad--footer {display: none; margin: 0px;}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 400
  },
});

export default DrawingCanvas;