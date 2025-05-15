import { useEffect } from 'react';
import { Slot, useSegments, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { useAuth } from '../hooks/useAuth';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default function RootLayout() {
  useFrameworkReady();
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded, fontError] = useFonts({
    Inter: Inter_400Regular,
    InterSemiBold: Inter_600SemiBold,
    InterBold: Inter_700Bold,
  });

  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();

        if (fontsLoaded || fontError) {
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        console.warn(e);
      }
    };

    prepare();
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (isLoading || !fontsLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    if (!isAuthenticated && !inAuthGroup && segments[0] !== 'welcome') {
      router.replace('/welcome');
    } else if (isAuthenticated && (inAuthGroup || segments[0] === 'welcome')) {
      router.replace('/(app)/(tabs)');
    }
  }, [isAuthenticated, segments, isLoading, fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <Slot />
      <StatusBar style="auto" />
    </>
  );
}
