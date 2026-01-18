import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Share, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

import { SkullMascot, Button, ShareCard } from '../components';
import { SkullExpression } from '../components/SkullMascot';
import { getTier, getPercentage, saveScore, generateDeviceId, generateSlangMessage } from '../lib/scoring';

export default function ResultsScreen() {
  const params = useLocalSearchParams<{ score: string; total: string }>();
  const viewShotRef = useRef<ViewShot>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isTexting, setIsTexting] = useState(false);

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

  const handleTextMyKid = async () => {
    try {
      setIsTexting(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const slangMessage = generateSlangMessage(score, total);

      const result = await Share.share({
        message: slangMessage,
      });

      if (result.action === Share.sharedAction) {
        // Shared successfully
      }
    } catch (error) {
      console.error('Error sharing text:', error);
      Alert.alert('Error', 'Failed to open share. Please try again.');
    } finally {
      setIsTexting(false);
    }
  };

  const handlePlayAgain = () => {
    router.replace('/quiz');
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
            {/* Results Card */}
            <Animated.View
              style={styles.resultsCard}
              entering={FadeInDown.delay(200).duration(500)}
            >
              {/* Skull with accessory */}
              <View style={styles.skullContainer}>
                <SkullMascot expression={accessory as SkullExpression} size={100} />
              </View>

              {/* Percentage */}
              <Text style={styles.percentage}>{percentage}%</Text>

              {/* Tier Badge */}
              <View style={styles.tierBadge}>
                <Text style={styles.tierText}>{tier}</Text>
              </View>

              {/* Description */}
              <Text style={styles.description}>{description}</Text>
            </Animated.View>

            {/* Buttons */}
            <Animated.View
              style={styles.buttonsContainer}
              entering={FadeInUp.delay(600).duration(500)}
            >
              {/* Text my Kid Button */}
              <View style={styles.textKidButton}>
                <Button
                  title={isTexting ? 'Opening...' : "Text My Kid"}
                  onPress={handleTextMyKid}
                  variant="secondary"
                  style={styles.fullWidthButton}
                  disabled={isTexting}
                />
                <Text style={styles.textKidHint}>
                  Send a slang-filled message to flex your score
                </Text>
              </View>

              <Button
                title={isSaving ? 'Saving...' : 'Share Screenshot'}
                onPress={handleShare}
                variant="secondary"
                style={styles.fullWidthButton}
                disabled={isSaving}
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
  resultsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    // Neubrutalist shadow
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  skullContainer: {
    marginBottom: 16,
  },
  percentage: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 72,
    color: '#0F172A',
  },
  tierBadge: {
    backgroundColor: '#EC4899',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0F172A',
    marginTop: 8,
    // Neubrutalist shadow
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  tierText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  description: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
  },
  buttonsContainer: {
    marginTop: 32,
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  textKidButton: {
    width: '100%',
    alignItems: 'center',
  },
  textKidHint: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 6,
    textAlign: 'center',
  },
  fullWidthButton: {
    width: '100%',
  },
  hiddenShareCard: {
    position: 'absolute',
    left: -1000,
    top: -1000,
  },
});
