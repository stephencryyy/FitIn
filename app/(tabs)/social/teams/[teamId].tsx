import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/src/components/ui/Card';
import { Avatar } from '@/src/components/ui/Avatar';
import { Button } from '@/src/components/ui/Button';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { useAuth } from '@/src/providers/AuthProvider';
import {
  useTeam,
  useTeamMembers,
  useIsTeamMember,
  useJoinTeam,
  useLeaveTeam,
  useDeleteTeam,
} from '@/src/hooks/useTeams';
import { useT } from '@/src/hooks/useT';

export default function TeamDetail() {
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  const router = useRouter();
  const { user, profile } = useAuth();
  const t = useT();

  const team = useTeam(teamId);
  const members = useTeamMembers(teamId);
  const membership = useIsTeamMember(teamId, user?.uid);

  const joinMutation = useJoinTeam(
    user
      ? {
          uid: user.uid,
          displayName: profile?.displayName || user.email?.split('@')[0] || 'User',
          photoURL: profile?.photoURL ?? null,
        }
      : null,
  );
  const leaveMutation = useLeaveTeam(user?.uid);
  const deleteMutation = useDeleteTeam();

  const onRefresh = async () => {
    await Promise.all([team.refetch(), members.refetch(), membership.refetch()]);
  };

  if (team.isLoading) return <LoadingSpinner fullScreen />;
  if (!team.data) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-dark-500 font-bold">{t('teams.teamNotFound')}</Text>
      </SafeAreaView>
    );
  }

  const isMember = membership.data ?? false;
  const owner = members.data?.find((m) => m.role === 'owner');
  const isOwner = owner?.userId === user?.uid;
  const sortedMembers = (members.data || [])
    .slice()
    .sort((a, b) => (b.stats?.weeklyVolume || 0) - (a.stats?.weeklyVolume || 0));

  const handleJoin = async () => {
    if (!teamId) return;
    try {
      await joinMutation.mutateAsync(teamId);
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message);
    }
  };

  const handleLeave = () => {
    if (!teamId) return;
    if (isOwner) {
      Alert.alert(t('common.error'), 'Owner cannot leave team');
      return;
    }
    Alert.alert(t('teams.leaveConfirm'), t('teams.leaveConfirmDesc'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('teams.leave'),
        style: 'destructive',
        onPress: async () => {
          try {
            await leaveMutation.mutateAsync(teamId);
            router.back();
          } catch (err: any) {
            Alert.alert(t('common.error'), err.message);
          }
        },
      },
    ]);
  };

  const handleDelete = () => {
    if (!teamId) return;
    Alert.alert(
      t('teams.deleteConfirm') || 'Delete team?',
      t('teams.deleteConfirmDesc') ||
        'This permanently removes the team, all members, and all messages. This cannot be undone.',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete') || 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(teamId);
              router.back();
            } catch (err: any) {
              Alert.alert(t('common.error'), err.message);
            }
          },
        },
      ],
    );
  };

  const roleLabel = (role: string) => {
    if (role === 'owner') return t('teams.owner');
    if (role === 'admin') return t('teams.admin');
    return t('teams.member');
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-50">
      <View className="flex-row items-center px-5 py-3 bg-white border-b border-dark-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#122033" />
        </TouchableOpacity>
        <Text className="text-lg font-extrabold text-dark-900 ml-3 flex-1" numberOfLines={1}>
          {team.data.name}
        </Text>
      </View>

      <ScrollView
        contentContainerClassName="pb-28"
        refreshControl={
          <RefreshControl
            refreshing={team.isRefetching || members.isRefetching}
            onRefresh={onRefresh}
          />
        }
      >
        {/* Hero */}
        <View className="px-5 pt-4 mb-4">
          <Card variant="blue">
            <View className="flex-row items-start gap-3 mb-3">
              <View className="w-16 h-16 bg-white rounded-2xl items-center justify-center">
                <Ionicons name="people" size={30} color="#8b5cf6" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-extrabold text-dark-900">{team.data.name}</Text>
                <View className="flex-row items-center gap-2 mt-1">
                  <Ionicons name="people-outline" size={14} color="#607085" />
                  <Text className="text-[13px] font-bold text-dark-400">
                    {team.data.memberCount} {t('teams.members').toLowerCase()}
                  </Text>
                  {!team.data.isPublic && (
                    <>
                      <Text className="text-dark-400">•</Text>
                      <Ionicons name="lock-closed-outline" size={14} color="#607085" />
                    </>
                  )}
                </View>
              </View>
            </View>
            {team.data.description ? (
              <Text className="text-sm font-semibold text-dark-700 mb-3">
                {team.data.description}
              </Text>
            ) : null}
            {!isMember ? (
              <Button
                title={t('teams.join')}
                onPress={handleJoin}
                loading={joinMutation.isPending}
                fullWidth
              />
            ) : !isOwner ? (
              <Button
                title={t('teams.leave')}
                onPress={handleLeave}
                loading={leaveMutation.isPending}
                variant="outline"
                fullWidth
              />
            ) : (
              <View>
                <View className="bg-accent-50 px-3 py-2 rounded-xl items-center mb-2">
                  <Text className="text-sm font-extrabold text-accent-500">
                    ⭐ {t('teams.owner')}
                  </Text>
                </View>
                <Button
                  title={t('teams.deleteTeam') || 'Delete team'}
                  onPress={handleDelete}
                  loading={deleteMutation.isPending}
                  variant="danger"
                  fullWidth
                />
              </View>
            )}
          </Card>
        </View>

        {/* Leaderboard */}
        <View className="px-5">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-extrabold text-dark-900">{t('teams.leaderboard')}</Text>
            <Text className="text-xs font-bold text-dark-400">{t('teams.weeklyVolume')}</Text>
          </View>

          {members.isLoading ? (
            <LoadingSpinner />
          ) : (
            <Card padded={false}>
              {sortedMembers.map((m, i) => {
                const isMe = m.userId === user?.uid;
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null;
                return (
                  <TouchableOpacity
                    key={m.id}
                    onPress={() =>
                      !isMe && router.push({ pathname: '/(tabs)/social/profile/[userId]', params: { userId: m.userId } })
                    }
                    className={`flex-row items-center px-4 py-3 ${
                      i < sortedMembers.length - 1 ? 'border-b border-dark-100' : ''
                    } ${isMe ? 'bg-primary-50' : ''}`}
                  >
                    <Text className="w-7 text-base font-extrabold text-dark-400">
                      {medal || `#${i + 1}`}
                    </Text>
                    <Avatar uri={m.photoURL} name={m.displayName} size="sm" />
                    <View className="flex-1 ml-3">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-sm font-extrabold text-dark-900">
                          {m.displayName}
                        </Text>
                        {isMe && (
                          <View className="bg-primary-500 px-1.5 py-0.5 rounded">
                            <Text className="text-[10px] font-bold text-white">
                              {t('teams.you').toUpperCase()}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-xs font-semibold text-dark-400">
                        {roleLabel(m.role)}
                      </Text>
                    </View>
                    <Text className="text-sm font-extrabold text-primary-500">
                      {Math.round(m.stats?.weeklyVolume || 0)} kg
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
