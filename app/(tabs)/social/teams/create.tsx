import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { useAuth } from '@/src/providers/AuthProvider';
import { useCreateTeam } from '@/src/hooks/useTeams';
import { useT } from '@/src/hooks/useT';

export default function CreateTeam() {
  const router = useRouter();
  const t = useT();
  const { user, profile } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const createMutation = useCreateTeam(
    user
      ? {
          uid: user.uid,
          displayName: profile?.displayName || user.email?.split('@')[0] || 'User',
          photoURL: profile?.photoURL ?? null,
        }
      : null,
  );

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert(t('common.error'), t('teams.teamName'));
      return;
    }
    try {
      const teamId = await createMutation.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        isPublic,
      });
      router.replace({ pathname: '/(tabs)/social/teams/[teamId]', params: { teamId } });
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message || t('profile.failedToSave'));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-5 py-3 border-b border-dark-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#122033" />
        </TouchableOpacity>
        <Text className="text-lg font-extrabold text-dark-900 ml-3">
          {t('teams.createTeam')}
        </Text>
      </View>

      <ScrollView contentContainerClassName="px-5 py-6 pb-24" keyboardShouldPersistTaps="handled">
        <Input
          label={t('teams.teamName')}
          placeholder={t('teams.teamNamePlaceholder')}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Input
          label={t('teams.description')}
          placeholder={t('teams.descriptionPlaceholder')}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity
          onPress={() => setIsPublic(!isPublic)}
          className="flex-row items-center justify-between py-4 border-t border-b border-dark-200 my-4"
        >
          <View className="flex-1">
            <Text className="font-extrabold text-dark-900">{t('teams.isPublic')}</Text>
            <Text className="text-xs font-semibold text-dark-400 mt-0.5">
              {t('teams.isPublicDesc')}
            </Text>
          </View>
          <View
            className={`w-12 h-7 rounded-full p-1 ${isPublic ? 'bg-primary-500' : 'bg-dark-200'}`}
          >
            <View className={`w-5 h-5 bg-white rounded-full ${isPublic ? 'ml-auto' : ''}`} />
          </View>
        </TouchableOpacity>

        <Button
          title={t('teams.create')}
          onPress={handleCreate}
          loading={createMutation.isPending}
          disabled={!name.trim()}
          fullWidth
          size="lg"
        />

        <View className="mt-3">
          <Button title={t('common.cancel')} onPress={() => router.back()} variant="ghost" fullWidth />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
