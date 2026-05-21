import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { useAuth } from '@/src/providers/AuthProvider';
import { useMyTeams, usePublicTeams } from '@/src/hooks/useTeams';
import { useT } from '@/src/hooks/useT';
import { TeamDocument } from '@/src/types/social';

export default function TeamsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const t = useT();
  const [tab, setTab] = useState<'mine' | 'public'>('mine');

  const myTeams = useMyTeams(user?.uid);
  const publicTeams = usePublicTeams();

  const isLoading = tab === 'mine' ? myTeams.isLoading : publicTeams.isLoading;
  const isRefetching = tab === 'mine' ? myTeams.isRefetching : publicTeams.isRefetching;
  const teams = tab === 'mine' ? myTeams.data : publicTeams.data;

  const refetch = async () => {
    if (tab === 'mine') await myTeams.refetch();
    else await publicTeams.refetch();
  };

  // After creating/joining/leaving a team, the user lands back here.
  // Force a refetch on focus so the membership change shows up.
  useFocusEffect(
    useCallback(() => {
      myTeams.refetch();
    }, [myTeams]),
  );

  const renderTeam = (team: TeamDocument) => (
    <Card
      key={team.id}
      onPress={() => router.push({ pathname: '/(tabs)/social/teams/[teamId]', params: { teamId: team.id } })}
      className="mb-3"
    >
      <View className="flex-row items-start gap-3">
        <View className="w-14 h-14 bg-social-50 rounded-2xl items-center justify-center">
          <Ionicons name="people" size={26} color="#8b5cf6" />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-base font-extrabold text-dark-900 flex-1" numberOfLines={1}>
              {team.name}
            </Text>
            {!team.isPublic && (
              <Ionicons name="lock-closed-outline" size={14} color="#607085" />
            )}
          </View>
          {team.description ? (
            <Text className="text-[13px] font-semibold text-dark-400 mt-0.5" numberOfLines={2}>
              {team.description}
            </Text>
          ) : null}
          <View className="flex-row items-center gap-3 mt-2">
            <View className="flex-row items-center">
              <Ionicons name="people-outline" size={14} color="#607085" />
              <Text className="text-xs font-bold text-dark-400 ml-1">
                {team.memberCount} {t('teams.members').toLowerCase()}
              </Text>
            </View>
            {team.goal ? (
              <View className="bg-accent-50 px-2 py-0.5 rounded-full">
                <Text className="text-xs font-extrabold text-accent-500">
                  🎯 {team.goal}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView className="flex-1 bg-dark-50">
      <View className="flex-row items-center justify-between px-5 py-3 bg-white border-b border-dark-200">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#122033" />
          </TouchableOpacity>
          <Text className="text-lg font-extrabold text-dark-900 ml-3">{t('teams.title')}</Text>
        </View>
        <Button
          title={t('teams.create')}
          onPress={() => router.push('/(tabs)/social/teams/create')}
          size="sm"
          icon={<Ionicons name="add" size={16} color="#fff" />}
        />
      </View>

      {/* Tabs */}
      <View className="px-5 pt-4">
        <View className="flex-row bg-dark-100 rounded-xl p-1">
          <TouchableOpacity
            onPress={() => setTab('mine')}
            className={`flex-1 py-2.5 rounded-lg items-center ${tab === 'mine' ? 'bg-white' : ''}`}
          >
            <Text
              className={`text-sm font-extrabold ${tab === 'mine' ? 'text-dark-900' : 'text-dark-400'}`}
            >
              {t('teams.myTeams')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab('public')}
            className={`flex-1 py-2.5 rounded-lg items-center ${tab === 'public' ? 'bg-white' : ''}`}
          >
            <Text
              className={`text-sm font-extrabold ${tab === 'public' ? 'text-dark-900' : 'text-dark-400'}`}
            >
              {t('teams.publicTeams')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <LoadingSpinner fullScreen />
      ) : !teams || teams.length === 0 ? (
        <EmptyState
          icon="people-outline"
          title={tab === 'mine' ? t('teams.noTeamsYet') : t('teams.noPublicTeams')}
          description={tab === 'mine' ? t('teams.noTeamsDesc') : t('teams.noPublicTeamsDesc')}
          actionTitle={t('teams.create')}
          onAction={() => router.push('/(tabs)/social/teams/create')}
        />
      ) : (
        <ScrollView
          contentContainerClassName="px-5 pt-4 pb-28"
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        >
          {teams.map(renderTeam)}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
