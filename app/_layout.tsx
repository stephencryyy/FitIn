import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '@/global.css';

import { AuthProvider, useAuth } from '@/src/providers/AuthProvider';
import { QueryProvider } from '@/src/providers/QueryProvider';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryProvider>
          <AuthProvider>
            <RootNavigator />
            <StatusBar style="auto" />
          </AuthProvider>
        </QueryProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
