import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

const ProgressBar = () => {
  const TOTAL_BARS = 5;
  const progress = 70;

  const animatedProgress = useRef(new Animated.Value(0)).current;
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const listenerId = animatedProgress.addListener(({ value }) => {
      setDisplayProgress(Math.round(value));
    });

    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();

    return () => {
      animatedProgress.removeListener(listenerId);
    };
  }, [progress]);

  const getWidthForBar = (index: number, animatedValue: any) => {
    const progressPerBar = 100 / TOTAL_BARS;
    const startThreshold = index * progressPerBar;
    const endThreshold = (index + 1) * progressPerBar;

    return animatedValue.interpolate({
      inputRange: [startThreshold, endThreshold],
      outputRange: [0, BAR_WIDTH],
      extrapolate: 'clamp',
    });
  };

  return (
    <View style={styles.progressBarWrapper}>
      <View style={styles.progressInfoWrapper}>
        <Text style={styles.progress}>Progress</Text>
        <Text style={styles.progressValue}>{displayProgress}%</Text>
      </View>

      <View style={styles.progressBar}>
        {Array.from({ length: TOTAL_BARS }).map((_, index) => {
          const widthAnim = getWidthForBar(index, animatedProgress);

          return (
            <View key={index} style={styles.progressItem}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: widthAnim,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default ProgressBar;

const BAR_HEIGHT = 10;
const BAR_WIDTH = 50;
const BAR_GAP = 10;

const styles = StyleSheet.create({
  progressBarWrapper: {
    width: (BAR_WIDTH + BAR_GAP) * 5,
  },
  progressInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  progressValue: {
    fontSize: 16,
    color: '#4f46e5',
    fontWeight: '600',
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressItem: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#4f46e5',
    height: '100%',
  },
});