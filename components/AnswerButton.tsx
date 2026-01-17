import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface AnswerButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  state?: 'default' | 'correct' | 'wrong' | 'revealed';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AnswerButton({ text, onPress, disabled = false, state = 'default' }: AnswerButtonProps) {
  const scale = useSharedValue(1);
  const shakeX = useSharedValue(0);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withTiming(0.97, { duration: 100 });
      runOnJS(triggerHaptic)();
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withTiming(1, { duration: 100 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: shakeX.value },
      ],
    };
  });

  const getBackgroundColor = () => {
    switch (state) {
      case 'correct':
        return '#84CC16';
      case 'wrong':
        return '#FF4B4B';
      case 'revealed':
        return '#84CC16';
      default:
        return '#FFFFFF';
    }
  };

  const getTextColor = () => {
    switch (state) {
      case 'correct':
      case 'wrong':
      case 'revealed':
        return '#FFFFFF';
      default:
        return '#374151';
    }
  };

  React.useEffect(() => {
    if (state === 'wrong') {
      shakeX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [state, shakeX]);

  return (
    <AnimatedPressable
      style={[
        styles.button,
        animatedStyle,
        { backgroundColor: getBackgroundColor() },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Text style={[styles.text, { color: getTextColor() }]}>{text}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.7,
  },
});
