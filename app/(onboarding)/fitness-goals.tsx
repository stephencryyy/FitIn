import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/src/components/ui/Button';
import { FitnessGoal, ExperienceLevel } from '@/src/types/user';
import { useT } from '@/src/hooks/useT';

export default function FitnessGoals() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const t = useT();
  const [goal, setGoal] = useState<FitnessGoal | ''>('');
  const [level, setLevel] = useState<ExperienceLevel | ''>('');

  const goals: { value: FitnessGoal; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { value: 'lose_weight', label: t('onboarding.loseWeight'), icon: 'trending-down' },
    { value: 'build_muscle', label: t('onboarding.buildMuscle'), icon: 'barbell' },
    { value: 'maintain', label: t('onboarding.stayFit'), icon: 'heart' },
    { value: 'improve_endurance', label: t('onboarding.endurance'), icon: 'speedometer' },
    { value: 'general_fitness', label: t('onboarding.generalFitness'), icon: 'fitness' },
  ];

  const levels: { value: ExperienceLevel; label: string; desc: string }[] = [
    { value: 'beginner', label: t('onboarding.beginner'), desc: t('onboarding.beginnerDesc') },
    { value: 'intermediate', label: t('onboarding.intermediate'), desc: t('onboarding.intermediateDesc') },
    { value: 'advanced', label: t('onboarding.advanced'), desc: t('onboarding.advancedDesc') },
  ];

  const canContinue = goal && level;

  const handleNext = () => {
    router.push({
      pathname: '/(onboarding)/dietary-preferences',
      params: { ...params, goal, level },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="px-6 py-8 flex-grow">
        <Text className="text-2xl font-bold text-dark-900 mb-2">{t('onboarding.yourGoals')}</Text>
        <Text className="text-dark-400 mb-6">{t('onboarding.whatAchieve')}</Text>

        <View className="gap-3 mb-8">
          {goals.map((g) => (
            <TouchableOpacity
              key={g.value}
              onPress={() => setGoal(g.value)}
              className={`flex-row items-center p-4 rounded-xl border-2 ${
                goal === g.value ? 'border-primary-500 bg-primary-50' : 'border-dark-200'
              }`}
            >
              <View
                className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                  goal === g.value ? 'bg-primary-500' : 'bg-dark-100'
                }`}
              >
                <Ionicons name={g.icon} size={20} color={goal === g.value ? '#fff' : '#64748B'} />
              </View>
              <Text
                className={`text-base font-medium ${
                  goal === g.value ? 'text-primary-700' : 'text-dark-700'
                }`}
              >
                {g.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-lg font-semibold text-dark-900 mb-3">{t('onboarding.experienceLevel')}</Text>
        <View className="flex-row gap-3 mb-8">
          {levels.map((l) => (
            <TouchableOpacity
              key={l.value}
              onPress={() => setLevel(l.value)}
              className={`flex-1 py-4 px-2 rounded-xl border-2 items-center ${
                level === l.value ? 'border-primary-500 bg-primary-50' : 'border-dark-200'
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  level === l.value ? 'text-primary-600' : 'text-dark-700'
                }`}
              >
                {l.label}
              </Text>
              <Text className="text-xs text-dark-400 mt-1">{l.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-1 min-h-[20px]" />

        <Button
          title={t('common.continue')}
          onPress={handleNext}
          disabled={!canContinue}
          fullWidth
          size="lg"
        />
        <View className="flex-row justify-center mt-4 gap-1.5">
          <View className="w-8 h-1.5 rounded-full bg-primary-500" />
          <View className="w-8 h-1.5 rounded-full bg-primary-500" />
          <View className="w-8 h-1.5 rounded-full bg-primary-500" />
          <View className="w-8 h-1.5 rounded-full bg-dark-200" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
