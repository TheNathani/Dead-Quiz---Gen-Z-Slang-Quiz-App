import { Platform } from 'react-native';
import {
  InterstitialAd,
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// Use test IDs in development, real IDs in production
const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : Platform.select({
      ios: 'ca-app-pub-2520446622474776/1210343495',
      android: 'ca-app-pub-2520446622474776/1210343495',
    }) || TestIds.BANNER;

const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.select({
      ios: 'ca-app-pub-2520446622474776/7480238374',
      android: 'ca-app-pub-2520446622474776/7480238374',
    }) || TestIds.INTERSTITIAL;

const REWARDED_AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : Platform.select({
      ios: 'ca-app-pub-2520446622474776/1916425660',
      android: 'ca-app-pub-2520446622474776/1916425660',
    }) || TestIds.REWARDED;

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

// Rewarded ad instance
let rewardedAd: RewardedAd | null = null;
let isRewardedLoaded = false;

// Load rewarded ad
export function loadRewardedAd(): void {
  try {
    rewardedAd = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      isRewardedLoaded = true;
      console.log('Rewarded ad loaded');
    });

    rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      console.log('User earned reward:', reward);
    });

    rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('Rewarded ad error:', error);
      isRewardedLoaded = false;
    });

    rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
      isRewardedLoaded = false;
      // Reload the ad for next time
      loadRewardedAd();
    });

    rewardedAd.load();
  } catch (error) {
    console.log('Error loading rewarded ad:', error);
  }
}

// Show rewarded ad and return promise that resolves when user earns reward
export async function showRewardedAd(): Promise<boolean> {
  try {
    if (rewardedAd && isRewardedLoaded) {
      await rewardedAd.show();
      return true;
    }
    return false;
  } catch (error) {
    console.log('Error showing rewarded ad:', error);
    return false;
  }
}

// Check if rewarded ad is ready
export function isRewardedReady(): boolean {
  return isRewardedLoaded;
}
