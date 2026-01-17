import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const COLORS = ['#8B5CF6', '#EC4899', '#84CC16', '#FFD700', '#4ECDC4', '#FF6B6B'];

interface ConfettiPieceProps {
  index: number;
  onComplete?: () => void;
  isLast?: boolean;
}

function ConfettiPiece({ index, onComplete, isLast }: ConfettiPieceProps) {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(Math.random() * width);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  const color = COLORS[index % COLORS.length];
  const size = 8 + Math.random() * 8;
  const delay = index * 30;
  const duration = 1500 + Math.random() * 500;

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(height + 50, {
        duration,
        easing: Easing.out(Easing.quad),
      })
    );

    translateX.value = withDelay(
      delay,
      withTiming(translateX.value + (Math.random() - 0.5) * 100, {
        duration,
        easing: Easing.inOut(Easing.ease),
      })
    );

    rotate.value = withDelay(
      delay,
      withTiming(360 * (2 + Math.random() * 2), {
        duration,
        easing: Easing.linear,
      })
    );

    opacity.value = withDelay(
      delay + duration * 0.7,
      withTiming(0, {
        duration: duration * 0.3,
      }, (finished) => {
        if (finished && isLast && onComplete) {
          runOnJS(onComplete)();
        }
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        animatedStyle,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: Math.random() > 0.5 ? size / 2 : 2,
        },
      ]}
    />
  );
}

interface ConfettiProps {
  count?: number;
  onComplete?: () => void;
}

export function Confetti({ count = 30, onComplete }: ConfettiProps) {
  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: count }).map((_, i) => (
        <ConfettiPiece
          key={i}
          index={i}
          onComplete={onComplete}
          isLast={i === count - 1}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  piece: {
    position: 'absolute',
  },
});
