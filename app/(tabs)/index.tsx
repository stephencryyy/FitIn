import React from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/src/components/ui/Card';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { Button } from '@/src/components/ui/Button';
import { useAuth } from '@/src/providers/AuthProvider';
import { useNutritionDay } from '@/src/hooks/useNutrition';
import { useWorkoutHistory } from '@/src/hooks/useWorkouts';
import { format } from 'date-fns';
import { useT } from '@/src/hooks/useT';

export default function HomeScreen() {
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const t = useT();
  const { data: nutritionDay, refetch: refetchNutrition } = useNutritionDay(user?.uid);
  const { data: workouts, refetch: refetchWorkouts } = useWorkoutHistory(user?.uid);

  const firstName = profile?.displayName?.split(' ')[0] || 'there';
  const totals = nutritionDay?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  const targetCalories = nutritionDay?.targetCalories || 2000;
  const calorieProgress = targetCalories > 0 ? totals.calories / targetCalories : 0;
  const lastWorkout = workouts?.[0];
  const streak = profile?.stats?.currentStreak ?? 0;

  const onRefresh = async () => {
    await Promise.all([refetchNutrition(), refetchWorkouts(), refreshProfile()]);
  };

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.goodMorning');
    if (hour < 18) return t('home.goodAfternoon');
    return t('home.goodEvening');
  })();

  const dayOfWeek = format(new Date(), 'EEEE');
  const dateStr = format(new Date(), 'd MMM');

  return (
    <SafeAreaView className="flex-1 bg-dark-50 dark:bg-dark-900">
      <ScrollView
        contentContainerClassName="pb-28"
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-5">
          <Text className="text-xs font-extrabold uppercase tracking-wide text-accent-500 dark:text-accent-300">
            {dayOfWeek} • {dateStr}
          </Text>
          <Text className="text-[34px] font-extrabold text-dark-900 dark:text-white tracking-tight mt-2">
            {greeting}, {firstName}
          </Text>
        </View>

        {/* Hero Card — Daily Momentum */}
        <View className="px-5 mb-5">
          <Card variant="peach">
            <Text className="text-xs font-extrabold uppercase tracking-wide text-primary-500">
              Daily Momentum
            </Text>
            <Text className="text-lg font-extrabold text-dark-900 mt-1">
              {Math.round(calorieProgress * 100)}% {t('home.todayProgress').toLowerCase()}
            </Text>
            <View className="mt-4">
              <ProgressBar progress={calorieProgress} color="bg-primary-500" tall />
              <View className="flex-row justify-between mt-2.5">
                <Text className="text-[13px] font-bold text-dark-400">
                  {Math.round(totals.calories)} / {targetCalories} {t('nutrition.calories')}
                </Text>
              </View>
            </View>
            <View className="flex-row gap-3 mt-4">
              <View className="flex-1 bg-white p-4 rounded-2xl border border-dark-200">
                <Text className="text-xs font-extrabold uppercase text-nutrition-500">
                  {t('nutrition.protein')}
                </Text>
                <Text className="text-[28px] font-extrabold text-dark-900 mt-1">
                  {Math.round(totals.protein)}g
                </Text>
                <Text className="text-[13px] font-bold text-dark-400">
                  / {nutritionDay?.targetProtein || 150}g
                </Text>
              </View>
              <View className="flex-1 bg-white p-4 rounded-2xl border border-dark-200">
                <Text className="text-xs font-extrabold uppercase text-accent-500">
                  {t('nutrition.carbs')}
                </Text>
                <Text className="text-[28px] font-extrabold text-dark-900 mt-1">
                  {Math.round(totals.carbs)}g
                </Text>
                <Text className="text-[13px] font-bold text-dark-400">
                  / {nutritionDay?.targetCarbs || 250}g
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Quick Actions */}
        <View className="px-5 mb-5">
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/workouts/new')}
              className="flex-1 bg-workout-50 p-5 rounded-3xl"
              activeOpacity={0.7}
            >
              <View className="w-12 h-12 bg-white rounded-xl items-center justify-center mb-3"
                style={{ shadowColor: '#183558', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 3 }}
              >
                <Text className="text-[22px]">🏋️</Text>
              </View>
              <Text className="text-base font-extrabold text-dark-900">{t('home.startWorkout')}</Text>
              <Text className="text-[13px] font-semibold text-dark-400 mt-1">{t('home.logTraining')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/nutrition')}
              className="flex-1 bg-nutrition-50 p-5 rounded-3xl"
              activeOpacity={0.7}
            >
              <View className="w-12 h-12 bg-white rounded-xl items-center justify-center mb-3"
                style={{ shadowColor: '#183558', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 3 }}
              >
                <Text className="text-[22px]">🥗</Text>
              </View>
              <Text className="text-base font-extrabold text-dark-900">{t('home.logMeal')}</Text>
              <Text className="text-[13px] font-semibold text-dark-400 mt-1">{t('home.trackNutrition')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/assistant')}
              className="flex-1 bg-accent-50 p-5 rounded-3xl"
              activeOpacity={0.7}
            >
              <View className="w-12 h-12 bg-white rounded-xl items-center justify-center mb-3"
                style={{ shadowColor: '#183558', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 3 }}
              >
                <Text className="text-[22px]">🧠</Text>
              </View>
              <Text className="text-base font-extrabold text-dark-900">AI</Text>
              <Text className="text-[13px] font-semibold text-dark-400 mt-1">{t('assistant.title')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="px-5 mb-5">
          <View className="flex-row justify-between items-end mb-3">
            <View>
              <Text className="text-lg font-extrabold text-dark-900">{t('home.yourStats')}</Text>
            </View>
          </View>
          <View className="flex-row gap-3">
            <View className="flex-1 bg-workout-50 p-4 rounded-2xl min-h-[108px] justify-between">
              <Text className="text-xs font-extrabold uppercase text-dark-400">
                {t('home.workoutsCount')}
              </Text>
              <Text className="text-2xl font-extrabold text-dark-900 mt-2">
                {profile?.stats?.totalWorkouts ?? 0}
              </Text>
            </View>
            <View className="flex-1 bg-accent-50 p-4 rounded-2xl min-h-[108px] justify-between">
              <Text className="text-xs font-extrabold uppercase text-dark-400">
                {t('home.dayStreak')}
              </Text>
              <Text className="text-2xl font-extrabold text-dark-900 mt-2">
                {streak}
              </Text>
            </View>
            <View className="flex-1 bg-nutrition-50 p-4 rounded-2xl min-h-[108px] justify-between">
              <Text className="text-xs font-extrabold uppercase text-dark-400">
                {t('home.tonsLifted')}
              </Text>
              <Text className="text-2xl font-extrabold text-dark-900 mt-2">
                {Math.round((profile?.stats?.totalVolume ?? 0) / 1000)}
              </Text>
            </View>
          </View>
        </View>

        {/* Last Workout */}
        {lastWorkout && (
          <View className="px-5 mb-5">
            <View className="flex-row justify-between items-end mb-3">
              <View>
                <Text className="text-lg font-extrabold text-dark-900">{t('home.lastWorkout')}</Text>
                <Text className="text-sm font-semibold text-dark-400">
                  {format(lastWorkout.startedAt?.toDate?.() || new Date(), 'MMM d, HH:mm')}
                </Text>
              </View>
            </View>
            <Card onPress={() => router.push({ pathname: '/(tabs)/workouts/[id]', params: { id: lastWorkout.id } })}>
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-extrabold text-dark-900">{lastWorkout.title}</Text>
                <View className="w-14 h-14 bg-workout-50 rounded-xl items-center justify-center">
                  <Text className="text-2xl">💪</Text>
                </View>
              </View>
              <Text className="text-sm font-semibold text-dark-400 mb-3">
                {lastWorkout.exercises.length} {t('home.exercisesShort')} • {Math.floor(lastWorkout.durationSeconds / 60)} min • {Math.round(lastWorkout.totalVolume)} kg
              </Text>
              <View className="flex-row gap-2">
                <View className="flex-1 bg-workout-50 p-3 rounded-2xl items-center">
                  <Text className="text-xs font-extrabold uppercase text-dark-400">
                    {t('workouts.exercises')}
                  </Text>
                  <Text className="text-xl font-extrabold text-dark-900 mt-1">
                    {lastWorkout.exercises.length}
                  </Text>
                </View>
                <View className="flex-1 bg-accent-50 p-3 rounded-2xl items-center">
                  <Text className="text-xs font-extrabold uppercase text-dark-400">
                    {t('workouts.volume')}
                  </Text>
                  <Text className="text-xl font-extrabold text-dark-900 mt-1">
                    {Math.round(lastWorkout.totalVolume)}
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* AI Coach dark card */}
        <View className="px-5 mb-5">
          <Card variant="dark" onPress={() => router.push('/assistant')}>
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-xs font-extrabold uppercase tracking-wide text-accent-300">
                  FitIn AI Coach
                </Text>
                <Text className="text-lg font-extrabold text-white mt-1">
                  {t('assistant.howCanIHelp')}
                </Text>
                <Text className="text-sm font-semibold text-white/70 mt-1">
                  {t('assistant.accessDesc')}
                </Text>
              </View>
              <View className="w-14 h-14 bg-white/10 rounded-2xl items-center justify-center">
                <Text className="text-2xl">✦</Text>
              </View>
            </View>
            <View className="mt-4">
              <Button title={`🧠 ${t('assistant.title')}`} onPress={() => router.push('/assistant')} fullWidth />
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
