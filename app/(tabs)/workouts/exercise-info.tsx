import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Card } from '@/src/components/ui/Card';
import { getMuscleVisual, CATEGORY_VISUALS } from '@/src/constants/muscleIcons';
import { useT } from '@/src/hooks/useT';
import { translateMuscle, translateEquipment } from '@/src/i18n/helpers';
import { getExerciseName, getExerciseInstructions } from '@/src/i18n/exerciseTranslations';
import { useSettingsStore } from '@/src/store/settingsStore';

export default function ExerciseInfo() {
  const router = useRouter();
  const t = useT();
  const locale = useSettingsStore((s) => s.locale);
  const params = useLocalSearchParams<{
    name: string;
    category: string;
    primaryMuscle: string;
    secondaryMuscles: string;
    equipment: string;
    instructions: string;
  }>();

  const visual = getMuscleVisual(params.primaryMuscle || '');
  const categoryVisual = CATEGORY_VISUALS[params.category || 'strength'];
  const secondary = params.secondaryMuscles?.split(',').filter(Boolean) || [];
  const equipment = params.equipment?.split(',').filter(Boolean) || [];
  const displayName = getExerciseName(params.name || '', locale);
  const displayInstructions = getExerciseInstructions(
    params.name || '',
    locale,
    params.instructions || '',
  );
  const categoryLabel = t(`exercises.${params.category || 'strength'}`);

  return (
    <SafeAreaView className="flex-1 bg-dark-50">
      <View className="flex-row items-center px-5 py-3 bg-white border-b border-dark-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#334155" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-dark-900 ml-3 flex-1" numberOfLines={1}>
          {displayName}
        </Text>
      </View>

      <ScrollView contentContainerClassName="p-5 pb-24">
        {/* Hero */}
        <View className="rounded-3xl p-6 mb-5 items-center" style={{ backgroundColor: visual.bg }}>
          <View className="w-20 h-20 rounded-3xl items-center justify-center mb-3 bg-white">
            <MaterialCommunityIcons name={visual.icon} size={44} color={visual.color} />
          </View>
          <Text className="text-xl font-bold text-dark-900 text-center">{displayName}</Text>
          <View className="flex-row items-center gap-2 mt-2">
            <View
              className="flex-row items-center px-3 py-1 rounded-full"
              style={{ backgroundColor: categoryVisual?.bg || '#F1F5F9' }}
            >
              <MaterialCommunityIcons
                name={categoryVisual?.icon || 'dumbbell'}
                size={12}
                color={categoryVisual?.color || '#64748B'}
              />
              <Text
                className="text-xs font-semibold ml-1 capitalize"
                style={{ color: categoryVisual?.color || '#64748B' }}
              >
                {categoryLabel}
              </Text>
            </View>
          </View>
        </View>

        {/* Targeted muscles */}
        <Text className="text-sm font-bold text-dark-500 uppercase mb-2">
          {t('exercises.targetsMuscles')}
        </Text>
        <Card className="mb-5">
          <View className="flex-row items-center mb-3">
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: visual.bg }}
            >
              <MaterialCommunityIcons name={visual.icon} size={20} color={visual.color} />
            </View>
            <View>
              <Text className="font-bold text-dark-900">{translateMuscle(params.primaryMuscle || '')}</Text>
              <Text className="text-xs text-dark-400">{t('exercises.primary')}</Text>
            </View>
          </View>
          {secondary.length > 0 && (
            <View className="border-t border-dark-100 pt-3">
              <Text className="text-xs text-dark-400 mb-2">{t('exercises.alsoWorks')}</Text>
              <View className="flex-row flex-wrap gap-2">
                {secondary.map((m) => {
                  const v = getMuscleVisual(m);
                  return (
                    <View
                      key={m}
                      className="flex-row items-center px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: v.bg }}
                    >
                      <MaterialCommunityIcons name={v.icon} size={12} color={v.color} />
                      <Text className="text-xs font-semibold ml-1" style={{ color: v.color }}>
                        {translateMuscle(m)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </Card>

        {/* Equipment */}
        {equipment.length > 0 && (
          <>
            <Text className="text-sm font-bold text-dark-500 uppercase mb-2">
              {t('exercises.needsEquipment')}
            </Text>
            <Card className="mb-5">
              <View className="flex-row flex-wrap gap-2">
                {equipment.map((e) => (
                  <View
                    key={e}
                    className="flex-row items-center bg-dark-100 px-3 py-1.5 rounded-full"
                  >
                    <Ionicons name="construct-outline" size={14} color="#64748B" />
                    <Text className="text-xs font-semibold text-dark-700 ml-1">
                      {translateEquipment(e)}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          </>
        )}

        {/* Instructions */}
        {displayInstructions && (
          <>
            <Text className="text-sm font-bold text-dark-500 uppercase mb-2">
              {t('exercises.howToDo')}
            </Text>
            <Card>
              <Text className="text-dark-700 leading-6">{displayInstructions}</Text>
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
