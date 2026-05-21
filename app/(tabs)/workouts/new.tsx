import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { useWorkoutStore } from '@/src/store/workoutStore';
import { useT } from '@/src/hooks/useT';

export default function NewWorkout() {
  const router = useRouter();
  const t = useT();
  const [title, setTitle] = useState('');
  const startWorkout = useWorkoutStore((s) => s.startWorkout);

  const handleStart = () => {
    const name = title.trim() || t('workouts.newWorkout');
    startWorkout(name);
    router.replace('/(tabs)/workouts/active' as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-5 pt-4">
      <Text className="text-2xl font-bold text-dark-900 mb-6">{t('workouts.newWorkout')}</Text>

      <Input
        label={t('workouts.workoutName')}
        placeholder={t('workouts.workoutNamePlaceholder')}
        value={title}
        onChangeText={setTitle}
        autoCapitalize="words"
      />

      <Text className="text-dark-400 text-sm mb-6">{t('workouts.addExercisesAfter')}</Text>

      <Button title={t('home.startWorkout')} onPress={handleStart} fullWidth size="lg" />

      <View className="mt-3">
        <Button title={t('common.cancel')} onPress={() => router.back()} variant="ghost" fullWidth />
      </View>
    </SafeAreaView>
  );
}
