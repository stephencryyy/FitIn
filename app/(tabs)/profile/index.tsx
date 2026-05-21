import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { useAuth } from '@/src/providers/AuthProvider';
import { signOut } from '@/src/lib/firebase/auth';
import { useFollowCounts } from '@/src/hooks/useSocial';
import { useWorkoutHistory } from '@/src/hooks/useWorkouts';
import { useAchievements } from '@/src/hooks/useAchievements';
import { useT } from '@/src/hooks/useT';

export default function ProfileScreen() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const t = useT();
  const { data: counts } = useFollowCounts(user?.uid);
  const { data: workouts } = useWorkoutHistory(user?.uid);
  const achievements = useAchievements(workouts);

  const streak = profile?.stats?.currentStreak ?? 0;
  const goal = profile?.profile?.fitnessGoal?.replace('_', ' ') || 'General fitness';

  const menuItems: { icon: keyof typeof Ionicons.glyphMap; label: string; route: Href }[] = [
    { icon: 'create-outline', label: t('profile.editProfile'), route: '/(tabs)/profile/edit' },
    { icon: 'stats-chart-outline', label: t('profile.progressStats'), route: '/(tabs)/workouts/stats' },
    { icon: 'settings-outline', label: t('profile.settings'), route: '/(tabs)/profile/settings' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-dark-50">
      <ScrollView contentContainerClassName="pb-28">
        {/* Profile Hero */}
        <View className="px-5 pt-4 mb-5">
          <Card variant="blue">
            <View className="flex-row items-center gap-4 mb-4">
              <LinearGradient
                colors={['#1fc98a', '#6b7cff', '#ff6b3d']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-20 h-20 rounded-3xl items-center justify-center"
                style={{ shadowColor: '#183558', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 5 }}
              >
                <Text className="text-[28px] font-extrabold text-white">
                  {profile?.displayName?.charAt(0)?.toUpperCase() || '?'}
                </Text>
              </LinearGradient>
              <View className="flex-1">
                <Text className="text-lg font-extrabold text-dark-900">{profile?.displayName}</Text>
                {profile?.username && (
                  <Text className="text-sm font-bold text-dark-400">@{profile.username}</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => router.push('/(tabs)/profile/settings')}>
                <Ionicons name="settings-outline" size={22} color="#607085" />
              </TouchableOpacity>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {streak > 0 && (
                <View className="bg-nutrition-50 px-3 py-1.5 rounded-full">
                  <Text className="text-[13px] font-extrabold text-nutrition-500">
                    ⚡ {streak} {t('home.dayStreak').toLowerCase()}
                  </Text>
                </View>
              )}
              <View className="bg-accent-50 px-3 py-1.5 rounded-full">
                <Text className="text-[13px] font-extrabold text-accent-500 capitalize">
                  🎯 {goal}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Stats — real data from workouts query */}
        <View className="px-5 mb-5">
          <Text className="text-lg font-extrabold text-dark-900 mb-3">{t('home.yourStats')}</Text>
          <View className="flex-row gap-3 mb-3">
            <View className="flex-1 bg-workout-50 p-4 rounded-2xl min-h-[108px] justify-between">
              <Text className="text-xs font-extrabold uppercase text-dark-400">{t('home.workoutsCount')}</Text>
              <Text className="text-2xl font-extrabold text-dark-900 mt-2">{achievements.totalWorkouts}</Text>
            </View>
            <View className="flex-1 bg-accent-50 p-4 rounded-2xl min-h-[108px] justify-between">
              <Text className="text-xs font-extrabold uppercase text-dark-400">{t('home.dayStreak')}</Text>
              <Text className="text-2xl font-extrabold text-dark-900 mt-2">{streak}</Text>
            </View>
          </View>
          <View className="flex-row gap-3 mb-3">
            <View className="flex-1 bg-nutrition-50 p-4 rounded-2xl min-h-[108px] justify-between">
              <Text className="text-xs font-extrabold uppercase text-dark-400">{t('home.tonsLifted')}</Text>
              <Text className="text-2xl font-extrabold text-dark-900 mt-2">
                {achievements.totalVolume >= 1000 ? `${(achievements.totalVolume / 1000).toFixed(1)}t` : `${achievements.totalVolume} kg`}
              </Text>
            </View>
            <View className="flex-1 bg-social-50 p-4 rounded-2xl min-h-[108px] justify-between">
              <Text className="text-xs font-extrabold uppercase text-dark-400">{t('social.followers')}</Text>
              <Text className="text-2xl font-extrabold text-dark-900 mt-2">{counts?.followers ?? 0}</Text>
            </View>
          </View>

          {/* Extended achievements — reps, duration, distance */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-white p-4 rounded-2xl border border-dark-200">
              <Text className="text-xs font-extrabold uppercase text-dark-400">
                {t('workouts.reps')}
              </Text>
              <Text className="text-xl font-extrabold text-dark-900 mt-1">
                {achievements.totalReps.toLocaleString()}
              </Text>
            </View>
            {achievements.totalDurationMin > 0 && (
              <View className="flex-1 bg-white p-4 rounded-2xl border border-dark-200">
                <Text className="text-xs font-extrabold uppercase text-dark-400">
                  {t('workouts.time')}
                </Text>
                <Text className="text-xl font-extrabold text-dark-900 mt-1">
                  {achievements.totalDurationMin >= 60
                    ? `${(achievements.totalDurationMin / 60).toFixed(1)}h`
                    : `${achievements.totalDurationMin}m`}
                </Text>
              </View>
            )}
            {achievements.totalDistanceKm > 0 && (
              <View className="flex-1 bg-white p-4 rounded-2xl border border-dark-200">
                <Text className="text-xs font-extrabold uppercase text-dark-400">
                  {t('workouts.distance')}
                </Text>
                <Text className="text-xl font-extrabold text-dark-900 mt-1">
                  {achievements.totalDistanceKm} km
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Menu */}
        <View className="px-5 mb-5">
          <Card>
            {menuItems.map((item, i) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => router.push(item.route)}
                className={`flex-row items-center py-4 ${i < menuItems.length - 1 ? 'border-b border-dark-200' : ''}`}
              >
                <Ionicons name={item.icon} size={22} color="#607085" />
                <Text className="flex-1 text-dark-900 font-bold ml-3">{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color="#b8c9db" />
              </TouchableOpacity>
            ))}
          </Card>
        </View>

        <View className="px-5">
          <Button title={t('auth.signOut')} onPress={signOut} variant="ghost" fullWidth />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
