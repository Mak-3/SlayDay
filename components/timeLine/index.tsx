import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const Timeline = (total: number) => {
  const isDone = false
  return (
    <View style={styles.container}>
      {Array.from({ length: 3 }).map((_, index) => {
        return (
          <View style={styles.stepContainer} key={index}>
            <Animated.View style={[isDone ? styles.activeCircle: styles.inactiveCircle]}></Animated.View>
            <Animated.View style={[isDone ? styles.activeLine: styles.inactiveLine]}></Animated.View>
          </View>
        )
      })}
    </View>
  );
};

export default Timeline;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 20,
  },

  stepContainer: {
    alignItems: 'center',
  },

  activeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#F59E0B',
    backgroundColor: 'white',
    marginBottom: 4,
  },

  inactiveCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
    marginBottom: 4,
  },

  activeLine: {
    width: 2,
    height: 40,
    backgroundColor: '#F59E0B',
    marginBottom: 4,
  },

  inactiveLine: {
    width: 2,
    height: 40,
    backgroundColor: '#D1D5DB',
    marginBottom: 4,
  },
});