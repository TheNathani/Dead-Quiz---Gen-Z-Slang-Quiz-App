import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

import { SkullMascot, Button, ShareCard } from '../components';
import { SkullExpression } from '../components/SkullMascot';
import { getTier, getPercentage, saveScore, generateDeviceId } from '../lib/scoring';

export default function ResultsScreen() {
  const params = useLocalSearchParams<{ score: string; total: string }>();
  const viewShotRef = useRef<ViewShot>(null);
  const [isSaving, setIsSaving] = useState(false);

  const score = parseInt(params.score || '0', 10);
  const total = parseInt(params.total || '10', 10);
  const percentage = getPercentage(score, total);
  const { tier, accessory, description } = getTier(score, total);

  useEffect(() => {
    // Save score to database
    const saveScoreAsync = async () => {
      const deviceId = generateDeviceId();
      await saveScore(deviceId, score, tier);
    };
    saveScoreAsync();

    // Celebration haptic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [score, tier]);

  const handleShare = async () => {
    try {
      setIsSaving(true);

      if (viewShotRef.current?.capture) {
        const uri = await viewShotRef.current.capture();

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: 'Share your Dead Quiz results!',
          });
        } else {
          Alert.alert('Sharing not available', 'Sharing is not available on this device.');
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share your results. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePlayAgain = () => {
    router.replace('/quiz');
  };

  const handleGoHome = () => {
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* Skull with accessory */}
            <Animated.View entering={FadeInDown.delay(200).duration(500)}>
              <SkullMascot expression={accessory as SkullExpression} size={120} />
            </Animated.View>

            {/* Percentage */}
            <Animated.Text
              style={styles.percentage}
              entering={FadeInUp.delay(400).duration(500)}
            >
              {percentage}%
            </Animated.Text>

            {/* Tier Badge */}
            <Animated.View
              style={styles.tierBadge}
              entering={FadeInUp.delay(600).duration(500)}
            >
              <Text style={styles.tierText}>{tier}</Text>
            </Animated.View>

            {/* Description */}
            <Animated.Text
              style={styles.description}
              entering={FadeInUp.delay(800).duration(500)}
            >
              {description}
            </Animated.Text>

            {/* Buttons */}
            <Animated.View
              style={styles.buttonsContainer}
              entering={FadeInUp.delay(1000).duration(500)}
            >
              <Button
                title={isSaving ? 'Saving...' : 'Share Results'}
                onPress={handleShare}
                variant="secondary"
                style={styles.shareButton}
              />
              <Button
                title="Play Again"
                onPress={handlePlayAgain}
                variant="ghost"
              />
            </Animated.View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Hidden share card for capturing */}
      <View style={styles.hiddenShareCard}>
        <ViewShot
          ref={viewShotRef}
          options={{ format: 'png', quality: 1.0 }}
        >
          <ShareCard
            percentage={percentage}
            tier={tier}
            accessory={accessory as SkullExpression}
          />
        </ViewShot>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  percentage: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 80,
    color: '#FFFFFF',
    marginTop: 24,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tierBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 16,
  },
  tierText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  description: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  buttonsContainer: {
    marginTop: 48,
    alignItems: 'center',
    gap: 16,
  },
  shareButton: {
    minWidth: 200,
  },
  hiddenShareCard: {
    position: 'absolute',
    left: -1000,
    top: -1000,
  },
});
