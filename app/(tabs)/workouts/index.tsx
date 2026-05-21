import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { useAuth } from '@/src/providers/AuthProvider';
import { useWorkoutHistory } from '@/src/hooks/useWorkouts';
import { format } from 'date-fns';
import { useT } from '@/src/hooks/useT';

export default function WorkoutsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const t = useT();
  const { data: workouts, isLoading, refetch, isRefetching } = useWorkoutHistory(user?.uid);

  return (
    <SafeAreaView className="flex-1 bg-dark-50">
      <View className="px-5 pt-4 pb-2 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-dark-900">{t('workouts.title')}</Text>
        <View className="flex-row gap-2">
          <Button
            title=""
            onPress={() => router.push('/(tabs)/workouts/stats')}
            size="sm"
            variant="outline"
            icon={<Ionicons name="stats-chart" size={16} color="#3B82F6" />}
          />
          <Button
            title={t('workouts.start')}
            onPress={() => router.push('/(tabs)/workouts/new')}
            size="sm"
            icon={<Ionicons name="add" size={18} color="#fff" />}
          />
        </View>
      </View>

      {isLoading ? (
        <LoadingSpinner fullScreen message={t('common.loading')} />
      ) : !workouts || workouts.length === 0 ? (
        <EmptyState
          icon="barbell-outline"
          title={t('workouts.noWorkoutsYet')}
          description={t('workouts.startFirst')}
          actionTitle={t('home.startWorkout')}
          onAction={() => router.push('/(tabs)/workouts/new')}
        />
      ) : (
        <ScrollView
          contentContainerClassName="px-5 pt-2 pb-24"
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        >
          {workouts.map((workout) => {
            const date = workout.startedAt?.toDate?.() || new Date();
            const duration = Math.floor(workout.durationSeconds / 60);
            return (
              <Card
                key={workout.id}
                className="mb-3"
                onPress={() => router.push({ pathname: '/(tabs)/workouts/[id]', params: { id: workout.id } })}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-bold text-dark-900 text-base">{workout.title}</Text>
                  <Text className="text-xs text-dark-400">{format(date, 'MMM d, yyyy')}</Text>
                </View>
                <View className="flex-row items-center gap-4 mt-1">
                  <View className="flex-row items-center">
                    <Ionicons name="barbell-outline" size={14} color="#64748B" />
                    <Text className="text-xs text-dark-500 ml-1">
                      {workout.exercises.length} {t('home.exercisesShort')}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={14} color="#64748B" />
                    <Text className="text-xs text-dark-500 ml-1">{duration} min</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="trending-up-outline" size={14} color="#64748B" />
                    <Text className="text-xs text-dark-500 ml-1">
                      {Math.round(workout.totalVolume)} kg
                    </Text>
                  </View>
                </View>
              </Card>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
