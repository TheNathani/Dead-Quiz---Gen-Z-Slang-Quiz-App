import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = current / total;

  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(`${progress * 100}%`, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    }),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <Animated.View style={[styles.fill, animatedStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  barContainer: {
    flex: 1,
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#0F172A',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
  },
});
