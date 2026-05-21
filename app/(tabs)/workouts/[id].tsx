import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase/config';
import { Card } from '@/src/components/ui/Card';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { useAuth } from '@/src/providers/AuthProvider';
import { WorkoutDocument } from '@/src/types/workout';
import { format } from 'date-fns';
import { useT } from '@/src/hooks/useT';
import { translateMuscle } from '@/src/i18n/helpers';
import { getExerciseName } from '@/src/i18n/exerciseTranslations';
import { useSettingsStore } from '@/src/store/settingsStore';

export default function WorkoutDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const t = useT();
  const locale = useSettingsStore((s) => s.locale);

  const { data: workout, isLoading } = useQuery({
    queryKey: ['workout', user?.uid, id],
    queryFn: async () => {
      if (!user || !id) return null;
      const snap = await getDoc(doc(db, 'users', user.uid, 'workouts', id));
      return snap.exists() ? ({ id: snap.id, ...snap.data() } as WorkoutDocument) : null;
    },
    enabled: !!user && !!id,
  });

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!workout) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-dark-500">{t('common.error')}</Text>
      </SafeAreaView>
    );
  }

  const date = workout.startedAt?.toDate?.() || new Date();
  const duration = Math.floor(workout.durationSeconds / 60);

  return (
    <SafeAreaView className="flex-1 bg-dark-50">
      <View className="flex-row items-center px-5 py-3 border-b border-dark-100 bg-white">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#334155" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-dark-900 ml-3">{workout.title}</Text>
      </View>

      <ScrollView contentContainerClassName="p-5 pb-24">
        <View className="flex-row gap-3 mb-5">
          <Card className="flex-1 items-center">
            <Text className="text-2xl font-bold text-dark-900">{workout.exercises.length}</Text>
            <Text className="text-xs text-dark-400">{t('workouts.exercises')}</Text>
          </Card>
          <Card className="flex-1 items-center">
            <Text className="text-2xl font-bold text-primary-500">{duration}</Text>
            <Text className="text-xs text-dark-400">мин</Text>
          </Card>
          <Card className="flex-1 items-center">
            <Text className="text-2xl font-bold text-success-500">
              {Math.round(workout.totalVolume)}
            </Text>
            <Text className="text-xs text-dark-400">{t('workouts.volume')}</Text>
          </Card>
        </View>

        <Text className="text-dark-400 text-sm mb-3">
          {format(date, 'EEEE, MMMM d, yyyy • HH:mm')}
        </Text>

        {workout.exercises.map((ex, i) => {
          const displayName = getExerciseName(ex.exerciseName, locale);
          return (
            <Card key={i} className="mb-3">
              <Text className="font-bold text-dark-900 mb-1">{displayName}</Text>
              <Text className="text-xs text-dark-400 mb-3">{translateMuscle(ex.muscleGroup)}</Text>
              {ex.sets.map((set, si) => (
                <View
                  key={si}
                  className="flex-row items-center py-2 border-t border-dark-100"
                >
                  <Text className="w-8 text-dark-500 font-semibold">{set.setNumber}</Text>
                  <Text className="flex-1 text-dark-700">
                    {set.weightKg ?? 0} kg × {set.reps ?? 0}
                  </Text>
                  {set.isPersonalRecord && (
                    <View className="bg-accent-100 px-2 py-0.5 rounded-full">
                      <Text className="text-xs font-bold text-accent-600">PR</Text>
                    </View>
                  )}
                </View>
              ))}
            </Card>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
