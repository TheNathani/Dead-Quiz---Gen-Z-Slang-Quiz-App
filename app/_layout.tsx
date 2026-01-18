import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding with error handling
SplashScreen.preventAutoHideAsync().catch((error) => {
  console.warn('SplashScreen.preventAutoHideAsync error:', error);
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (fontError) {
      console.error('Font loading error:', fontError);
    }
  }, [fontError]);

  useEffect(() => {
    const hideSplash = async () => {
      if (fontsLoaded || fontError) {
        try {
          await SplashScreen.hideAsync();
        } catch (error) {
          console.warn('SplashScreen.hideAsync error:', error);
        }
      }
    };
    hideSplash();
  }, [fontsLoaded, fontError]);

  // Show loading state if fonts haven't loaded and there's no error
  if (!fontsLoaded && !fontError) {
    return <View style={{ flex: 1, backgroundColor: '#FAF9F6' }} />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FAF9F6' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="quiz" />
        <Stack.Screen name="results" />
      </Stack>
    </>
  );
}
