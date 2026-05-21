import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/src/components/ui/Card';
import { Avatar } from '@/src/components/ui/Avatar';
import { Input } from '@/src/components/ui/Input';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { useAuth } from '@/src/providers/AuthProvider';
import { useFeed, useUserSearch, useSuggestedUsers } from '@/src/hooks/useSocial';
import { useDebounce } from '@/src/hooks/useDebounce';
import { format } from 'date-fns';
import { useT } from '@/src/hooks/useT';

export default function SocialScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const t = useT();
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 300);
  const {
    data: feedData,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeed(user?.uid);
  const feed = feedData?.pages.flatMap((p) => p.items) ?? [];
  const { data: searchResults, isLoading: searching } = useUserSearch(debounced, user?.uid);
  const { data: suggested } = useSuggestedUsers(user?.uid);

  const isSearching = debounced.length >= 2;

  const UserRow = ({ u }: { u: NonNullable<typeof suggested>[number] }) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/(tabs)/social/profile/[userId]', params: { userId: u.id } })}
      className="flex-row items-center py-3"
    >
      <Avatar uri={u.photoURL} name={u.displayName} size="md" />
      <View className="flex-1 ml-3">
        <Text className="font-semibold text-dark-900" numberOfLines={1}>
          {u.displayName}
        </Text>
        {u.username && (
          <Text className="text-xs text-primary-500">@{u.username}</Text>
        )}
        <Text className="text-xs text-dark-400 capitalize" numberOfLines={1}>
          {u.profile.experienceLevel} • {u.profile.fitnessGoal.replace('_', ' ')}
        </Text>
      </View>
      <Text className="text-xs text-dark-500">
        {u.stats?.totalWorkouts ?? 0} {t('social.workoutsLabel')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-dark-50">
      <View className="px-5 pt-4 pb-2 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-dark-900">{t('social.title')}</Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/social/teams')}
          className="flex-row items-center bg-primary-50 px-3 py-2 rounded-xl"
        >
          <Ionicons name="people" size={18} color="#3B82F6" />
          <Text className="text-primary-600 font-medium ml-1.5">{t('social.teams')}</Text>
        </TouchableOpacity>
      </View>

      <View className="px-5 pb-2">
        <Input
          placeholder={t('social.searchUsers')}
          value={query}
          onChangeText={setQuery}
          icon="search-outline"
          autoCapitalize="none"
        />
      </View>

      {isSearching ? (
        searching ? (
          <LoadingSpinner />
        ) : !searchResults || searchResults.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8 py-12">
            <View className="w-16 h-16 bg-dark-100 rounded-full items-center justify-center mb-3">
              <Ionicons name="search-outline" size={28} color="#94A3B8" />
            </View>
            <Text className="text-lg font-bold text-dark-900">{t('social.noUsersFound')}</Text>
            <Text className="text-sm text-dark-400 mt-1">
              {t('social.noUsersMatch')} &ldquo;{debounced}&rdquo;
            </Text>
          </View>
        ) : (
          <ScrollView contentContainerClassName="px-5 pb-24">
            {searchResults.map((u) => (
              <Card
                key={u.id}
                className="mb-3"
                onPress={() => router.push({ pathname: '/(tabs)/social/profile/[userId]', params: { userId: u.id } })}
              >
                <View className="flex-row items-center">
                  <Avatar uri={u.photoURL} name={u.displayName} size="md" />
                  <View className="flex-1 ml-3">
                    <Text className="font-semibold text-dark-900">{u.displayName}</Text>
                    {u.username && (
                      <Text className="text-xs text-primary-500">@{u.username}</Text>
                    )}
                    <Text className="text-xs text-dark-400 capitalize">
                      {u.profile.experienceLevel} • {u.profile.fitnessGoal.replace('_', ' ')}
                    </Text>
                  </View>
                  <Text className="text-xs text-dark-500">
                    {u.stats?.totalWorkouts ?? 0}
                  </Text>
                </View>
              </Card>
            ))}
          </ScrollView>
        )
      ) : isLoading ? (
        <LoadingSpinner />
      ) : !feed || feed.length === 0 ? (
        <ScrollView
          contentContainerClassName="pb-24"
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        >
          <View className="items-center py-8 px-8">
            <View className="w-20 h-20 rounded-full bg-primary-50 items-center justify-center mb-4">
              <Ionicons name="people-outline" size={36} color="#3B82F6" />
            </View>
            <Text className="text-xl font-bold text-dark-900 text-center mb-2">
              {t('social.feedEmpty')}
            </Text>
            <Text className="text-base text-dark-400 text-center">
              {t('social.feedEmptyDesc')}
            </Text>
          </View>

          {suggested && suggested.length > 0 && (
            <View className="px-5">
              <Text className="text-sm font-bold text-dark-500 uppercase mb-2">
                {t('social.findUsers')}
              </Text>
              <Card>
                {suggested.map((u, i) => (
                  <View
                    key={u.id}
                    className={i < suggested.length - 1 ? 'border-b border-dark-100' : ''}
                  >
                    <UserRow u={u} />
                  </View>
                ))}
              </Card>
            </View>
          )}
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerClassName="px-5 pb-24"
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        >
          {feed.map((item) => {
            const date = item.startedAt?.toDate?.() || new Date();
            return (
              <Card
                key={`${item.userId}-${item.id}`}
                className="mb-3"
                onPress={() => router.push({ pathname: '/(tabs)/social/profile/[userId]', params: { userId: item.userId } })}
              >
                <View className="flex-row items-center mb-3">
                  <Avatar uri={item.userPhotoURL} name={item.userName} size="md" />
                  <View className="flex-1 ml-3">
                    <Text className="font-semibold text-dark-900">{item.userName}</Text>
                    <Text className="text-xs text-dark-400">
                      {format(date, 'MMM d • HH:mm')}
                    </Text>
                  </View>
                </View>
                <View className="bg-dark-50 rounded-xl p-3">
                  <Text className="font-semibold text-dark-900">{item.title}</Text>
                  <View className="flex-row gap-4 mt-2">
                    <View className="flex-row items-center">
                      <Ionicons name="barbell-outline" size={14} color="#64748B" />
                      <Text className="text-xs text-dark-500 ml-1">
                        {item.exercises.length} {t('workouts.exercises').toLowerCase()}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="trending-up-outline" size={14} color="#64748B" />
                      <Text className="text-xs text-dark-500 ml-1">
                        {Math.round(item.totalVolume)} kg
                      </Text>
                    </View>
                  </View>
                </View>
              </Card>
            );
          })}
          {hasNextPage && (
            <TouchableOpacity
              onPress={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              accessibilityRole="button"
              accessibilityLabel={t('common.loadMore') || 'Load more'}
              className="mt-2 mb-6 items-center justify-center bg-primary-50 rounded-xl py-3"
            >
              {isFetchingNextPage ? (
                <LoadingSpinner />
              ) : (
                <Text className="text-primary-500 font-bold">
                  {t('common.loadMore') || 'Load more'}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
