import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, G, Ellipse, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

export type SkullExpression = 'neutral' | 'happy' | 'cringe' | 'crown' | 'clown' | 'glasses' | 'sunglasses';

interface SkullMascotProps {
  expression?: SkullExpression;
  size?: number;
  animate?: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function SkullMascot({ expression = 'neutral', size = 120, animate = false }: SkullMascotProps) {
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (animate) {
      // Floating animation
      translateY.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      // Subtle rotation
      rotation.value = withRepeat(
        withSequence(
          withTiming(3, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(-3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, [animate, translateY, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const renderEyes = () => {
    switch (expression) {
      case 'happy':
        // Sparkle/happy eyes (^_^)
        return (
          <G>
            {/* Left happy eye */}
            <Path
              d="M35 45 Q40 35 45 45"
              stroke="#1a1a1a"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            {/* Right happy eye */}
            <Path
              d="M55 45 Q60 35 65 45"
              stroke="#1a1a1a"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            {/* Sparkles */}
            <Path d="M30 30 L32 35 L27 33 L32 31 Z" fill="#FFD700" />
            <Path d="M70 30 L68 35 L73 33 L68 31 Z" fill="#FFD700" />
          </G>
        );
      case 'cringe':
        // Worried/cringe eyes (X_X style)
        return (
          <G>
            {/* Left cringe eye */}
            <Circle cx="40" cy="42" r="8" fill="#1a1a1a" />
            <Circle cx="42" cy="40" r="2" fill="#ffffff" />
            {/* Right cringe eye */}
            <Circle cx="60" cy="42" r="8" fill="#1a1a1a" />
            <Circle cx="62" cy="40" r="2" fill="#ffffff" />
            {/* Sweat drop */}
            <Ellipse cx="75" cy="35" rx="4" ry="6" fill="#87CEEB" />
          </G>
        );
      case 'glasses':
        // Nerd glasses
        return (
          <G>
            {/* Eyes behind glasses */}
            <Circle cx="40" cy="42" r="6" fill="#1a1a1a" />
            <Circle cx="60" cy="42" r="6" fill="#1a1a1a" />
            {/* Glasses frames */}
            <Circle cx="40" cy="42" r="12" stroke="#4a4a4a" strokeWidth="2" fill="none" />
            <Circle cx="60" cy="42" r="12" stroke="#4a4a4a" strokeWidth="2" fill="none" />
            <Path d="M52 42 L48 42" stroke="#4a4a4a" strokeWidth="2" />
            <Path d="M28 42 L20 40" stroke="#4a4a4a" strokeWidth="2" />
            <Path d="M72 42 L80 40" stroke="#4a4a4a" strokeWidth="2" />
          </G>
        );
      case 'sunglasses':
        // Cool sunglasses
        return (
          <G>
            <Defs>
              <LinearGradient id="shadeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#1a1a1a" />
                <Stop offset="100%" stopColor="#4a4a4a" />
              </LinearGradient>
            </Defs>
            {/* Left lens */}
            <Rect x="28" y="35" width="18" height="14" rx="3" fill="url(#shadeGrad)" />
            {/* Right lens */}
            <Rect x="54" y="35" width="18" height="14" rx="3" fill="url(#shadeGrad)" />
            {/* Bridge */}
            <Path d="M46 42 L54 42" stroke="#1a1a1a" strokeWidth="2" />
            {/* Arms */}
            <Path d="M28 40 L18 38" stroke="#1a1a1a" strokeWidth="2" />
            <Path d="M72 40 L82 38" stroke="#1a1a1a" strokeWidth="2" />
            {/* Shine */}
            <Path d="M32 38 L36 38" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
            <Path d="M58 38 L62 38" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
          </G>
        );
      default:
        // Normal eyes
        return (
          <G>
            <Circle cx="40" cy="42" r="7" fill="#1a1a1a" />
            <Circle cx="60" cy="42" r="7" fill="#1a1a1a" />
          </G>
        );
    }
  };

  const renderMouth = () => {
    switch (expression) {
      case 'happy':
        // Big smile
        return (
          <Path
            d="M35 62 Q50 75 65 62"
            stroke="#1a1a1a"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        );
      case 'cringe':
        // Wavy/worried mouth
        return (
          <Path
            d="M35 65 Q40 60 45 65 Q50 70 55 65 Q60 60 65 65"
            stroke="#1a1a1a"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        );
      default:
        // Cute smile
        return (
          <Path
            d="M40 60 Q50 68 60 60"
            stroke="#1a1a1a"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        );
    }
  };

  const renderAccessory = () => {
    switch (expression) {
      case 'crown':
        // Crown on top
        return (
          <G>
            {/* Crown base */}
            <Path
              d="M25 15 L30 5 L40 12 L50 0 L60 12 L70 5 L75 15 L75 22 L25 22 Z"
              fill="#FFD700"
              stroke="#DAA520"
              strokeWidth="1"
            />
            {/* Jewels */}
            <Circle cx="50" cy="10" r="3" fill="#FF4B4B" />
            <Circle cx="35" cy="14" r="2" fill="#4ECDC4" />
            <Circle cx="65" cy="14" r="2" fill="#4ECDC4" />
          </G>
        );
      case 'clown':
        // Clown nose
        return (
          <Circle cx="50" cy="55" r="8" fill="#FF4B4B" />
        );
      default:
        return null;
    }
  };

  const renderBlush = () => {
    if (expression === 'happy') {
      return (
        <G>
          <Ellipse cx="30" cy="55" rx="6" ry="4" fill="#FFB6C1" opacity="0.6" />
          <Ellipse cx="70" cy="55" rx="6" ry="4" fill="#FFB6C1" opacity="0.6" />
        </G>
      );
    }
    return null;
  };

  return (
    <AnimatedView style={[styles.container, animate && animatedStyle, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="skullGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#F5F5F5" />
          </LinearGradient>
        </Defs>

        {/* Main skull shape - round cranium, no jaw */}
        <Ellipse
          cx="50"
          cy="50"
          rx="40"
          ry="42"
          fill="url(#skullGrad)"
          stroke="#E0E0E0"
          strokeWidth="1"
        />

        {/* Render accessory (crown goes on top) */}
        {renderAccessory()}

        {/* Eyes */}
        {renderEyes()}

        {/* Blush for happy expression */}
        {renderBlush()}

        {/* Nose area (small heart shape for kawaii) */}
        {expression !== 'clown' && (
          <Path
            d="M48 52 Q50 50 52 52 Q50 55 48 52"
            fill="#E8E8E8"
          />
        )}

        {/* Mouth */}
        {renderMouth()}
      </Svg>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
