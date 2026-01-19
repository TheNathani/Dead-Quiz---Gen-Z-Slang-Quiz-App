import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { SkullMascot, Button, AdBanner, MockInterstitialAd } from '../components';

export default function HomeScreen() {
  const [showInterstitial, setShowInterstitial] = useState(false);

  const handleStartQuiz = () => {
    router.push('/quiz');
  };

  const handlePreviewAds = () => {
    setShowInterstitial(true);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FAF9F6', '#F3E8FF']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* Title Card */}
            <Animated.View
              style={styles.titleCard}
              entering={FadeInDown.delay(200).duration(500)}
            >
              <Text style={styles.deadBadge}>DEAD</Text>
              <Text style={styles.title}>How Gen Z{'\n'}Are You?</Text>
              <Text style={styles.subtitle}>10 questions. No cap.</Text>
            </Animated.View>

            {/* Mascot */}
            <Animated.View
              style={styles.mascotContainer}
              entering={FadeInUp.delay(400).duration(500)}
            >
              <SkullMascot expression="neutral" size={140} animate />
            </Animated.View>

            {/* Info Card */}
            <Animated.View
              style={styles.infoCard}
              entering={FadeInUp.delay(600).duration(500)}
            >
              <Text style={styles.infoTitle}>For Parents</Text>
              <Text style={styles.infoText}>
                Learn the slang your kids use. Each answer explains what it means so you can keep up.
              </Text>
            </Animated.View>

            {/* Button */}
            <Animated.View
              style={styles.buttonContainer}
              entering={FadeInUp.delay(800).duration(500)}
            >
              <Button title="Start Quiz" onPress={handleStartQuiz} />

              {/* Preview Ads Button */}
              <TouchableOpacity
                style={styles.previewAdsButton}
                onPress={handlePreviewAds}
              >
                <Text style={styles.previewAdsText}>Preview Interstitial Ad</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Banner Ad at bottom */}
          <AdBanner style={styles.bannerAd} />
        </SafeAreaView>
      </LinearGradient>

      {/* Mock Interstitial Ad Modal */}
      <MockInterstitialAd
        visible={showInterstitial}
        onClose={() => setShowInterstitial(false)}
        countdownSeconds={5}
      />
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
  titleCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    // Neubrutalist shadow
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  deadBadge: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: '#FFFFFF',
    backgroundColor: '#EC4899',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0F172A',
    marginBottom: 16,
    overflow: 'hidden',
    letterSpacing: 2,
  },
  title: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 36,
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 44,
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  mascotContainer: {
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#8B5CF6',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    width: '100%',
    // Neubrutalist shadow
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  infoTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  infoText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  bannerAd: {
    marginBottom: 8,
  },
  previewAdsButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 2,
    borderColor: '#8B5CF6',
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  previewAdsText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    color: '#8B5CF6',
    textAlign: 'center',
  },
});
