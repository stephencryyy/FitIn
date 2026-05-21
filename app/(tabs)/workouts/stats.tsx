import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ProgressChart } from '@/src/components/workout/ProgressChart';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { useAuth } from '@/src/providers/AuthProvider';
import { useWorkoutHistory } from '@/src/hooks/useWorkouts';
import { useT } from '@/src/hooks/useT';

export default function WorkoutStats() {
  const router = useRouter();
  const { user } = useAuth();
  const t = useT();
  const { data: workouts, isLoading } = useWorkoutHistory(user?.uid);

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView className="flex-1 bg-dark-50">
      <View className="flex-row items-center px-5 py-3 bg-white border-b border-dark-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#122033" />
        </TouchableOpacity>
        <Text className="text-lg font-extrabold text-dark-900 ml-3">
          {t('workouts.progressTitle')}
        </Text>
      </View>

      {!workouts || workouts.length === 0 ? (
        <EmptyState
          icon="stats-chart-outline"
          title={t('workouts.noDataYet')}
          description={t('workouts.completeWorkoutsForProgress')}
        />
      ) : (
        <ScrollView contentContainerClassName="p-5 pb-24 gap-4">
          <ProgressChart workouts={workouts} metric="volume" />
          <ProgressChart workouts={workouts} metric="count" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
