import { Stack } from 'expo-router';

export default function SocialLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile/[userId]" />
      <Stack.Screen name="teams/index" />
      <Stack.Screen name="teams/[teamId]" />
      <Stack.Screen name="teams/create" />
    </Stack>
  );
}
