import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { useAuth } from '@/src/providers/AuthProvider';
import { saveOnboardingData, reserveUsername } from '@/src/lib/firebase/firestore';
import { ActivityLevel, Gender, FitnessGoal, ExperienceLevel } from '@/src/types/user';
import { useT } from '@/src/hooks/useT';

export default function Summary() {
  const params = useLocalSearchParams<{
    username: string;
    height: string;
    weight: string;
    birthDate: string;
    gender: string;
    goal: string;
    level: string;
    dietary: string;
  }>();

  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const t = useT();

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (params.username) {
        await reserveUsername(user.uid, params.username);
      }
      await saveOnboardingData(user.uid, {
        heightCm: Number(params.height) || 0,
        weightKg: Number(params.weight) || 0,
        dateOfBirth: params.birthDate || '',
        gender: (params.gender as Gender) || 'prefer_not_to_say',
        fitnessGoal: (params.goal as FitnessGoal) || 'general_fitness',
        experienceLevel: (params.level as ExperienceLevel) || 'beginner',
        dietaryPreferences: params.dietary?.split(',').filter(Boolean) || [],
        activityLevel: 'moderate' as ActivityLevel,
      });
      await refreshProfile();
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message || t('profile.failedToSave'));
    } finally {
      setLoading(false);
    }
  };

  const items: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }[] = [
    { icon: 'at', label: t('onboarding.username'), value: `@${params.username || '-'}` },
    { icon: 'body', label: t('onboarding.height'), value: `${params.height} cm` },
    { icon: 'scale', label: t('onboarding.weight'), value: `${params.weight} kg` },
    { icon: 'calendar', label: t('onboarding.dateOfBirth'), value: params.birthDate || '-' },
    { icon: 'person', label: t('onboarding.gender'), value: params.gender || '-' },
    { icon: 'trophy', label: t('onboarding.yourGoals'), value: params.goal?.replace('_', ' ') || '-' },
    { icon: 'bar-chart', label: t('onboarding.experienceLevel'), value: params.level || '-' },
    { icon: 'restaurant', label: t('onboarding.dietaryPreferences'), value: params.dietary?.replace(/,/g, ', ') || '-' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="px-6 py-8 flex-grow">
        <Text className="text-2xl font-bold text-dark-900 mb-2">{t('onboarding.reviewProfile')}</Text>
        <Text className="text-dark-400 mb-6">{t('onboarding.everythingLooks')}</Text>

        <Card>
          {items.map((item, i) => (
            <View
              key={item.label}
              className={`flex-row items-center py-3 ${i < items.length - 1 ? 'border-b border-dark-100' : ''}`}
            >
              <Ionicons name={item.icon} size={20} color="#3B82F6" />
              <Text className="text-dark-500 ml-3 flex-1">{item.label}</Text>
              <Text className="text-dark-900 font-medium capitalize">{item.value}</Text>
            </View>
          ))}
        </Card>

        <View className="flex-1 min-h-[20px]" />

        <View className="mt-6">
          <Button
            title={t('onboarding.completeSetup')}
            onPress={handleComplete}
            loading={loading}
            fullWidth
            size="lg"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
