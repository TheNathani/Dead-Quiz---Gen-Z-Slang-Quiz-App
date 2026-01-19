import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

interface MockInterstitialAdProps {
  visible: boolean;
  onClose: () => void;
  countdownSeconds?: number;
}

export function MockInterstitialAd({
  visible,
  onClose,
  countdownSeconds = 5,
}: MockInterstitialAdProps) {
  const [countdown, setCountdown] = useState(countdownSeconds);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (visible) {
      setCountdown(countdownSeconds);
      setCanClose(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [visible, countdownSeconds]);

  useEffect(() => {
    if (!visible || countdown <= 0) {
      if (countdown <= 0) setCanClose(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, visible]);

  const handleClose = () => {
    if (canClose) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={['#1E1B4B', '#312E81', '#4C1D95']}
          style={styles.gradient}
        >
          {/* Close button area */}
          <View style={styles.topBar}>
            <View style={styles.adLabel}>
              <Text style={styles.adLabelText}>AD</Text>
            </View>
            <TouchableOpacity
              style={[styles.closeButton, !canClose && styles.closeButtonDisabled]}
              onPress={handleClose}
              disabled={!canClose}
            >
              {canClose ? (
                <Text style={styles.closeButtonText}>X</Text>
              ) : (
                <Text style={styles.countdownText}>{countdown}</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Main ad content */}
          <View style={styles.content}>
            {/* Mock app icon */}
            <View style={styles.appIcon}>
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                style={styles.appIconGradient}
              >
                <Text style={styles.appIconText}>AD</Text>
              </LinearGradient>
            </View>

            {/* Ad headline */}
            <Text style={styles.headline}>Sponsored App</Text>
            <Text style={styles.subheadline}>
              This is where your interstitial ad will appear
            </Text>

            {/* Rating mock */}
            <View style={styles.ratingContainer}>
              <Text style={styles.stars}>★★★★★</Text>
              <Text style={styles.ratingText}>4.8 (10K+ reviews)</Text>
            </View>

            {/* Feature bullets */}
            <View style={styles.features}>
              <Text style={styles.featureText}>• Full-screen ad format</Text>
              <Text style={styles.featureText}>• Shows between quiz and results</Text>
              <Text style={styles.featureText}>• 5 second minimum display</Text>
            </View>

            {/* CTA Button */}
            <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaText}>Install Now</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Disclaimer */}
            <Text style={styles.disclaimer}>
              Mock ad for preview purposes only
            </Text>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  adLabel: {
    backgroundColor: '#FCD34D',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  adLabelText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  countdownText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  appIcon: {
    width: 100,
    height: 100,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  appIconGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headline: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheadline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  stars: {
    fontSize: 18,
    color: '#FCD34D',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  features: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  featureText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    marginVertical: 4,
  },
  ctaButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaGradient: {
    paddingHorizontal: 48,
    paddingVertical: 18,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  disclaimer: {
    marginTop: 24,
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
  },
});
