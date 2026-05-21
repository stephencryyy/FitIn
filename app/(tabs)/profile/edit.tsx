import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/src/components/ui/Input';
import { UsernameInput } from '@/src/components/ui/UsernameInput';
import { Button } from '@/src/components/ui/Button';
import { useAuth } from '@/src/providers/AuthProvider';
import { updateUserDoc, reserveUsername } from '@/src/lib/firebase/firestore';
import { FitnessGoal, ExperienceLevel, ActivityLevel } from '@/src/types/user';
import { useT } from '@/src/hooks/useT';

const LEVELS: ExperienceLevel[] = ['beginner', 'intermediate', 'advanced'];

export default function EditProfile() {
  const router = useRouter();
  const t = useT();
  const { user, profile, refreshProfile } = useAuth();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [usernameValid, setUsernameValid] = useState(true);
  const [height, setHeight] = useState(String(profile?.profile?.heightCm || ''));
  const [weight, setWeight] = useState(String(profile?.profile?.weightKg || ''));
  const [goal, setGoal] = useState<FitnessGoal>(profile?.profile?.fitnessGoal || 'general_fitness');
  const [level, setLevel] = useState<ExperienceLevel>(profile?.profile?.experienceLevel || 'beginner');
  const [activity, setActivity] = useState<ActivityLevel>(profile?.profile?.activityLevel || 'moderate');
  const [isPublic, setIsPublic] = useState(profile?.isPublic ?? true);
  const [saving, setSaving] = useState(false);

  const GOALS: { value: FitnessGoal; label: string }[] = [
    { value: 'lose_weight', label: t('onboarding.loseWeight') },
    { value: 'build_muscle', label: t('onboarding.buildMuscle') },
    { value: 'maintain', label: t('onboarding.stayFit') },
    { value: 'improve_endurance', label: t('onboarding.endurance') },
    { value: 'general_fitness', label: t('onboarding.generalFitness') },
  ];

  const ACTIVITIES: { value: ActivityLevel; label: string; desc: string }[] = [
    { value: 'sedentary', label: t('profile.activitySedentary'), desc: t('profile.activitySedentaryDesc') },
    { value: 'light', label: t('profile.activityLight'), desc: t('profile.activityLightDesc') },
    { value: 'moderate', label: t('profile.activityModerate'), desc: t('profile.activityModerateDesc') },
    { value: 'active', label: t('profile.activityActive'), desc: t('profile.activityActiveDesc') },
    { value: 'very_active', label: t('profile.activityVeryActive'), desc: t('profile.activityVeryActiveDesc') },
  ];

  const usernameChanged = username !== (profile?.username || '');

  const handleSave = async () => {
    if (!user || !profile) return;
    if (usernameChanged && username && !usernameValid) {
      Alert.alert(t('common.error'), t('onboarding.usernameTaken'));
      return;
    }

    setSaving(true);
    try {
      // Reserve new username if changed
      if (usernameChanged && username) {
        await reserveUsername(user.uid, username);
      }

      await updateUserDoc(user.uid, {
        displayName,
        isPublic,
        profile: {
          ...profile.profile,
          heightCm: Number(height) || 0,
          weightKg: Number(weight) || 0,
          fitnessGoal: goal,
          experienceLevel: level,
          activityLevel: activity,
        },
      });
      await refreshProfile();
      router.back();
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message || t('profile.failedToSave'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-5 py-3 border-b border-dark-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#122033" />
        </TouchableOpacity>
        <Text className="text-lg font-extrabold text-dark-900 ml-3">
          {t('profile.editProfile')}
        </Text>
      </View>

      <ScrollView contentContainerClassName="px-5 py-6 pb-24" keyboardShouldPersistTaps="handled">
        <Input
          label={t('profile.displayName')}
          placeholder={t('auth.name')}
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
        />

        <UsernameInput
          label={t('onboarding.username')}
          value={username}
          onChangeText={setUsername}
          onValidityChange={setUsernameValid}
          currentUserId={user?.uid}
        />

        <Input
          label={t('onboarding.height')}
          placeholder="175"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />

        <Input
          label={t('onboarding.weight')}
          placeholder="70"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />

        <Text className="text-sm font-extrabold text-dark-700 mb-2 mt-2">
          {t('onboarding.yourGoals')}
        </Text>
        <View className="flex-row flex-wrap gap-2 mb-5">
          {GOALS.map((g) => (
            <TouchableOpacity
              key={g.value}
              onPress={() => setGoal(g.value)}
              className={`px-4 py-2 rounded-full border-2 ${
                goal === g.value ? 'border-primary-500 bg-primary-50' : 'border-dark-200'
              }`}
            >
              <Text
                className={`text-sm font-bold ${
                  goal === g.value ? 'text-primary-600' : 'text-dark-600'
                }`}
              >
                {g.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-sm font-extrabold text-dark-700 mb-2">
          {t('onboarding.experienceLevel')}
        </Text>
        <View className="flex-row gap-2 mb-5">
          {LEVELS.map((l) => (
            <TouchableOpacity
              key={l}
              onPress={() => setLevel(l)}
              className={`flex-1 py-3 rounded-xl border-2 items-center ${
                level === l ? 'border-primary-500 bg-primary-50' : 'border-dark-200'
              }`}
            >
              <Text
                className={`text-sm font-extrabold capitalize ${
                  level === l ? 'text-primary-600' : 'text-dark-600'
                }`}
              >
                {t(`onboarding.${l}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-sm font-extrabold text-dark-700 mb-2">
          {t('profile.activityLevel')}
        </Text>
        <View className="gap-2 mb-5">
          {ACTIVITIES.map((a) => (
            <TouchableOpacity
              key={a.value}
              onPress={() => setActivity(a.value)}
              className={`flex-row items-center px-4 py-3 rounded-xl border-2 ${
                activity === a.value ? 'border-primary-500 bg-primary-50' : 'border-dark-200'
              }`}
            >
              <View className="flex-1">
                <Text
                  className={`text-sm font-extrabold ${
                    activity === a.value ? 'text-primary-600' : 'text-dark-700'
                  }`}
                >
                  {a.label}
                </Text>
                <Text className="text-xs font-semibold text-dark-400 mt-0.5">{a.desc}</Text>
              </View>
              {activity === a.value && (
                <Ionicons name="checkmark-circle" size={22} color="#ff6b3d" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => setIsPublic(!isPublic)}
          className="flex-row items-center justify-between py-3 border-t border-dark-200 mb-6"
        >
          <View className="flex-1">
            <Text className="font-extrabold text-dark-900">{t('profile.publicProfile')}</Text>
            <Text className="text-xs font-semibold text-dark-400 mt-0.5">
              {t('profile.publicProfileDesc')}
            </Text>
          </View>
          <View
            className={`w-12 h-7 rounded-full p-1 ${isPublic ? 'bg-primary-500' : 'bg-dark-200'}`}
          >
            <View className={`w-5 h-5 bg-white rounded-full ${isPublic ? 'ml-auto' : ''}`} />
          </View>
        </TouchableOpacity>

        <Button
          title={t('profile.saveChanges')}
          onPress={handleSave}
          loading={saving}
          fullWidth
          size="lg"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
