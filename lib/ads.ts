import { Platform } from 'react-native';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// Use test IDs in development, replace with real IDs in production
const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : Platform.select({
      ios: 'ca-app-pub-2520446622474776/XXXXXXXXXX', // Replace with your iOS banner ID
      android: 'ca-app-pub-2520446622474776/XXXXXXXXXX', // Replace with your Android banner ID
    }) || TestIds.BANNER;

const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.select({
      ios: 'ca-app-pub-2520446622474776/XXXXXXXXXX', // Replace with your iOS interstitial ID
      android: 'ca-app-pub-2520446622474776/XXXXXXXXXX', // Replace with your Android interstitial ID
    }) || TestIds.INTERSTITIAL;

export { BANNER_AD_UNIT_ID };

// Interstitial ad instance
let interstitialAd: InterstitialAd | null = null;
let isInterstitialLoaded = false;

// Load interstitial ad
export function loadInterstitialAd(): void {
  try {
    interstitialAd = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      isInterstitialLoaded = true;
      console.log('Interstitial ad loaded');
    });

    interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('Interstitial ad error:', error);
      isInterstitialLoaded = false;
    });

    interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      isInterstitialLoaded = false;
      // Reload the ad for next time
      loadInterstitialAd();
    });

    interstitialAd.load();
  } catch (error) {
    console.log('Error loading interstitial:', error);
  }
}

// Show interstitial ad
export async function showInterstitialAd(): Promise<boolean> {
  try {
    if (interstitialAd && isInterstitialLoaded) {
      await interstitialAd.show();
      return true;
    }
    return false;
  } catch (error) {
    console.log('Error showing interstitial:', error);
    return false;
  }
}

// Check if interstitial is ready
export function isInterstitialReady(): boolean {
  return isInterstitialLoaded;
}
