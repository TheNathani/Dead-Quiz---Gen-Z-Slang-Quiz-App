import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

// Only import AdMob on native platforms
let BannerAd: any = null;
let BannerAdSize: any = null;
let BANNER_AD_UNIT_ID: string = '';

if (Platform.OS !== 'web') {
  try {
    const GoogleMobileAds = require('react-native-google-mobile-ads');
    BannerAd = GoogleMobileAds.BannerAd;
    BannerAdSize = GoogleMobileAds.BannerAdSize;
    const Ads = require('../lib/ads');
    BANNER_AD_UNIT_ID = Ads.BANNER_AD_UNIT_ID;
  } catch (e) {
    console.log('AdMob not available');
  }
}

interface AdBannerProps {
  style?: object;
  showMock?: boolean; // Set to true to always show mock ad for preview
}

// Mock ad component for preview/development
function MockAdBanner() {
  return (
    <View style={styles.mockAd}>
      <View style={styles.mockAdContent}>
        <View style={styles.adLabel}>
          <Text style={styles.adLabelText}>AD</Text>
        </View>
        <View style={styles.mockAdBody}>
          <View style={styles.mockAdIcon} />
          <View style={styles.mockAdText}>
            <Text style={styles.mockAdTitle}>Sponsored Content</Text>
            <Text style={styles.mockAdSubtitle}>Your ad will appear here</Text>
          </View>
          <View style={styles.mockAdCta}>
            <Text style={styles.mockAdCtaText}>Learn More</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export function AdBanner({ style, showMock = false }: AdBannerProps) {
  // Show mock ad on web or when showMock is true
  if (Platform.OS === 'web' || !BannerAd || showMock) {
    return (
      <View style={[styles.container, style]}>
        <MockAdBanner />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error: any) => {
          console.log('Banner ad failed to load:', error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  mockAd: {
    width: '100%',
    backgroundColor: '#FFFBEB',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
    // Neubrutalist shadow
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  mockAdContent: {
    padding: 12,
  },
  adLabel: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FCD34D',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#0F172A',
    zIndex: 1,
  },
  adLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 1,
  },
  mockAdBody: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
    paddingLeft: 36,
  },
  mockAdIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0F172A',
  },
  mockAdText: {
    flex: 1,
    marginLeft: 12,
  },
  mockAdTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  mockAdSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  mockAdCta: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  mockAdCtaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
