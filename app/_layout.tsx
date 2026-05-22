import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import { colorScheme } from 'nativewind';
import '@/global.css';

import { AuthProvider, useAuth } from '@/src/providers/AuthProvider';
import { QueryProvider } from '@/src/providers/QueryProvider';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSettingsStore } from '@/src/store/settingsStore';

function RootNavigator() {
  const { user, loading, isOnboarded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuth = segments[0] === '(auth)';
    const inOnboarding = segments[0] === '(onboarding)';

    if (!user && !inAuth) {
      router.replace('/(auth)/sign-in');
    } else if (user && !isOnboarded && !inOnboarding) {
      router.replace('/(onboarding)/welcome');
    } else if (user && isOnboarded && (inAuth || inOnboarding)) {
      router.replace('/(tabs)');
    }
  }, [user, loading, isOnboarded, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="assistant" options={{ presentation: 'modal' }} />
      <Stack.Screen name="modals" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const darkMode = useSettingsStore((s) => s.darkMode);

  // Sync settings store -> NativeWind color scheme. Runs on mount and whenever
  // the user toggles dark mode in settings. NativeWind v4 exposes `colorScheme.set`
  // (the `setColorScheme` named export only exists on the hook).
  useEffect(() => {
    colorScheme.set(darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 bg-white dark:bg-dark-900">
          <QueryProvider>
            <AuthProvider>
              <RootNavigator />
              <StatusBar style={darkMode ? 'light' : 'auto'} />
            </AuthProvider>
          </QueryProvider>
        </View>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
