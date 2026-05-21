import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { useT } from '@/src/hooks/useT';

export default function WorkoutComplete() {
  const router = useRouter();
  const t = useT();
  const params = useLocalSearchParams<{
    title?: string;
    duration?: string;
    volume?: string;
    exercises?: string;
    sets?: string;
  }>();

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, []);

  const duration = Number(params.duration || 0);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-8">
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-success-50 rounded-full items-center justify-center mb-4">
            <Ionicons name="trophy" size={48} color="#1fc98a" />
          </View>
          <Text className="text-3xl font-extrabold text-dark-900 mb-2">
            {t('complete.greatWork')}
          </Text>
          <Text className="text-sm font-semibold text-dark-400 text-center">
            {t('complete.youCrushed')} «{params.title || ''}»
          </Text>
        </View>

        <View className="gap-3 mb-8">
          <Card>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-primary-50 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="time-outline" size={20} color="#ff6b3d" />
                </View>
                <Text className="text-dark-700 font-semibold">{t('complete.duration')}</Text>
              </View>
              <Text className="font-extrabold text-dark-900">
                {minutes}m {seconds}s
              </Text>
            </View>
          </Card>

          <Card>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-workout-50 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="trending-up-outline" size={20} color="#ff7a59" />
                </View>
                <Text className="text-dark-700 font-semibold">{t('complete.totalVolume')}</Text>
              </View>
              <Text className="font-extrabold text-dark-900">{params.volume || '0'} kg</Text>
            </View>
          </Card>

          <Card>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-success-50 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="barbell-outline" size={20} color="#1fc98a" />
                </View>
                <Text className="text-dark-700 font-semibold">{t('complete.exercisesDone')}</Text>
              </View>
              <Text className="font-extrabold text-dark-900">{params.exercises || '0'}</Text>
            </View>
          </Card>

          <Card>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-dark-100 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="checkmark-circle-outline" size={20} color="#607085" />
                </View>
                <Text className="text-dark-700 font-semibold">{t('complete.setsDone')}</Text>
              </View>
              <Text className="font-extrabold text-dark-900">{params.sets || '0'}</Text>
            </View>
          </Card>
        </View>

        <Button
          title={t('complete.done')}
          onPress={() => router.replace('/(tabs)/workouts')}
          fullWidth
          size="lg"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
