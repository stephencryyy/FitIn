import { Redirect } from 'expo-router';
import { useAuth } from '@/src/providers/AuthProvider';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';

export default function Index() {
  const { user, loading, isOnboarded } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (!isOnboarded) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  return <Redirect href="/(tabs)" />;
}
