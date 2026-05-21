import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/src/components/ui/Button';
import { useAuth } from '@/src/providers/AuthProvider';
import { saveOnboardingData } from '@/src/lib/firebase/firestore';
import { useT } from '@/src/hooks/useT';

export default function Welcome() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const [skipping, setSkipping] = useState(false);
  const t = useT();

  const handleSkip = async () => {
    if (!user) return;
    setSkipping(true);
    try {
      await saveOnboardingData(user.uid, {
        heightCm: 0,
        weightKg: 0,
        dateOfBirth: '',
        gender: 'prefer_not_to_say',
        fitnessGoal: 'general_fitness',
        experienceLevel: 'beginner',
        dietaryPreferences: [],
        activityLevel: 'moderate',
      });
      await refreshProfile();
    } catch (err) {
      console.error('Skip failed:', err);
    } finally {
      setSkipping(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 justify-between py-8">
      <View className="flex-row justify-end">
        <TouchableOpacity onPress={handleSkip} disabled={skipping} className="px-3 py-2">
          <Text className="text-dark-400 font-medium">{t('onboarding.skipForNow')}</Text>
        </TouchableOpacity>
      </View>

      <View className="items-center">
        <View className="w-24 h-24 bg-primary-500 rounded-3xl items-center justify-center mb-6">
          <Ionicons name="fitness" size={48} color="#fff" />
        </View>
        <Text className="text-3xl font-bold text-dark-900 mb-3 text-center">
          {t('onboarding.welcome')}
        </Text>
        <Text className="text-base text-dark-400 text-center leading-6 px-4">
          {t('onboarding.welcomeDesc')}
        </Text>
      </View>

      <View>
        <Button
          title={t('onboarding.letsGo')}
          onPress={() => router.push('/(onboarding)/personal-info')}
          fullWidth
          size="lg"
        />

        <View className="flex-row justify-center mt-4 gap-1.5">
          <View className="w-8 h-1.5 rounded-full bg-primary-500" />
          <View className="w-8 h-1.5 rounded-full bg-dark-200" />
          <View className="w-8 h-1.5 rounded-full bg-dark-200" />
          <View className="w-8 h-1.5 rounded-full bg-dark-200" />
        </View>
      </View>
    </SafeAreaView>
  );
}
