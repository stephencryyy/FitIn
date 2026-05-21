import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/src/components/ui/Card';
import { Avatar } from '@/src/components/ui/Avatar';
import { Button } from '@/src/components/ui/Button';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { useAuth } from '@/src/providers/AuthProvider';
import { usePublicUser, useUserWorkouts, useFollowCounts } from '@/src/hooks/useSocial';
import { useIsFollowing, useFollowMutation } from '@/src/hooks/useFollows';
import { format } from 'date-fns';

export default function UserProfile() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const { data: publicUser, isLoading } = usePublicUser(userId);
  const { data: workouts } = useUserWorkouts(userId);
  const { data: counts } = useFollowCounts(userId);
  const { data: followingStatus } = useIsFollowing(user?.uid, userId || '');
  const followMutation = useFollowMutation(user?.uid);

  const isOwnProfile = user?.uid === userId;

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!publicUser) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-dark-500">User not found or private</Text>
      </SafeAreaView>
    );
  }

  const handleFollowToggle = () => {
    if (!userId) return;
    followMutation.mutate({ followingId: userId, shouldFollow: !followingStatus });
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-50">
      <View className="flex-row items-center px-5 py-3 bg-white border-b border-dark-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#334155" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-dark-900 ml-3">Profile</Text>
      </View>

      <ScrollView contentContainerClassName="pb-24">
        <View className="px-5 pt-6 pb-4 items-center bg-white">
          <Avatar uri={publicUser.photoURL} name={publicUser.displayName} size="xl" />
          <Text className="text-xl font-bold text-dark-900 mt-3">{publicUser.displayName}</Text>
          <Text className="text-dark-400 text-sm capitalize mt-0.5">
            {publicUser.profile.experienceLevel} • {publicUser.profile.fitnessGoal.replace('_', ' ')}
          </Text>

          <View className="flex-row gap-8 mt-4">
            <View className="items-center">
              <Text className="text-xl font-bold text-dark-900">{publicUser.stats?.totalWorkouts ?? 0}</Text>
              <Text className="text-xs text-dark-400">Workouts</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold text-dark-900">{counts?.followers ?? 0}</Text>
              <Text className="text-xs text-dark-400">Followers</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold text-dark-900">{counts?.following ?? 0}</Text>
              <Text className="text-xs text-dark-400">Following</Text>
            </View>
          </View>

          {!isOwnProfile && (
            <View className="mt-5 w-full px-6">
              <Button
                title={followingStatus ? 'Following' : 'Follow'}
                onPress={handleFollowToggle}
                variant={followingStatus ? 'outline' : 'primary'}
                loading={followMutation.isPending}
                fullWidth
              />
            </View>
          )}
        </View>

        <View className="px-5 mt-6">
          <Text className="text-lg font-semibold text-dark-900 mb-3">Recent Workouts</Text>
          {!workouts || workouts.length === 0 ? (
            <Card>
              <Text className="text-center text-dark-400 py-4">No workouts yet</Text>
            </Card>
          ) : (
            workouts.slice(0, 10).map((w) => {
              const date = w.startedAt?.toDate?.() || new Date();
              return (
                <Card key={w.id} className="mb-3">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="font-bold text-dark-900">{w.title}</Text>
                    <Text className="text-xs text-dark-400">{format(date, 'MMM d')}</Text>
                  </View>
                  <View className="flex-row gap-4">
                    <Text className="text-xs text-dark-500">{w.exercises.length} exercises</Text>
                    <Text className="text-xs text-dark-500">
                      {Math.round(w.totalVolume)} kg volume
                    </Text>
                  </View>
                </Card>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
