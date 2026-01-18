import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

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
}

export function AdBanner({ style }: AdBannerProps) {
  // Don't render on web
  if (Platform.OS === 'web' || !BannerAd) {
    return (
      <View style={[styles.placeholder, style]}>
        {/* Placeholder for web/dev */}
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
  },
  placeholder: {
    height: 50,
    // Placeholder - no visual on web
  },
});
