import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="personal-info" />
      <Stack.Screen name="fitness-goals" />
      <Stack.Screen name="dietary-preferences" />
      <Stack.Screen name="summary" />
    </Stack>
  );
}
