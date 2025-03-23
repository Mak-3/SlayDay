import React from 'react';
import { View, StyleSheet } from 'react-native';

const FancyCard = () => {
  return (
    <View style={styles.container}>
      {/* Main Purple Card */}
      <View style={styles.purpleBox} />

      {/* Floating White Section */}
      <View style={styles.floatingBox}>
        <View style={styles.innerBlueCircle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  purpleBox: {
    width: 340,
    height: 280,
    backgroundColor: 'purple',
    borderRadius: 30, // slightly reduced for a smoother corner
  },
  floatingBox: {
    width: 140,
    height: 140,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0, // moved up to give spacing
    right: 20,
    borderTopLeftRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerBlueCircle: {
    width: 90,
    height: 90,
    backgroundColor: 'blue',
    borderRadius: 45
  },
});

export default FancyCard;
