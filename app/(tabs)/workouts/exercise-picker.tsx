import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Input } from '@/src/components/ui/Input';
import { useWorkoutStore } from '@/src/store/workoutStore';
import { useAuth } from '@/src/providers/AuthProvider';
import { useAllExercises } from '@/src/hooks/useExercises';
import { MUSCLE_GROUPS } from '@/src/constants/muscles';
import { getMuscleVisual } from '@/src/constants/muscleIcons';
import { ExerciseDocument } from '@/src/types/workout';
import { useT } from '@/src/hooks/useT';
import { translateMuscle, translateEquipment } from '@/src/i18n/helpers';
import { getExerciseName } from '@/src/i18n/exerciseTranslations';
import { useSettingsStore } from '@/src/store/settingsStore';

export default function ExercisePicker() {
  const router = useRouter();
  const { user } = useAuth();
  const t = useT();
  const locale = useSettingsStore((s) => s.locale);
  const addExercise = useWorkoutStore((s) => s.addExercise);
  const { customExercises, seedExercises } = useAllExercises(user?.uid);
  const [search, setSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<string | null>(null);
  const [showCustom, setShowCustom] = useState(false);

  const filtered = useMemo(() => {
    const source = showCustom ? customExercises : [...customExercises, ...seedExercises];
    return source.filter((ex) => {
      const q = search.toLowerCase();
      const displayName = getExerciseName(ex.name, locale);
      const matchSearch =
        !search ||
        ex.name.toLowerCase().includes(q) ||
        displayName.toLowerCase().includes(q);
      const matchMuscle = !muscleFilter || ex.primaryMuscle === muscleFilter;
      return matchSearch && matchMuscle;
    });
  }, [search, muscleFilter, showCustom, customExercises, seedExercises, locale]);

  const handleSelect = (exercise: ExerciseDocument) => {
    addExercise({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      muscleGroup: exercise.primaryMuscle,
      category: exercise.category,
    });
    router.back();
  };

  const handleInfo = (exercise: ExerciseDocument) => {
    router.push({
      pathname: '/(tabs)/workouts/exercise-info',
      params: {
        name: exercise.name,
        category: exercise.category,
        primaryMuscle: exercise.primaryMuscle,
        secondaryMuscles: exercise.secondaryMuscles.join(','),
        equipment: exercise.equipment.join(','),
        instructions: exercise.instructions,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-dark-100">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#334155" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-dark-900 ml-3">
            {t('exercises.addExercise')}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/workouts/create-exercise')}
          className="flex-row items-center bg-primary-50 px-3 py-1.5 rounded-full"
        >
          <Ionicons name="add" size={16} color="#3B82F6" />
          <Text className="text-primary-600 font-semibold text-sm ml-1">{t('common.add')}</Text>
        </TouchableOpacity>
      </View>

      <View className="px-5 pt-4">
        <Input
          placeholder={t('common.search')}
          value={search}
          onChangeText={setSearch}
          icon="search-outline"
          autoCapitalize="none"
        />
      </View>

      {customExercises.length > 0 && (
        <View className="px-5 mb-3">
          <View className="flex-row bg-dark-100 rounded-xl p-1">
            <TouchableOpacity
              onPress={() => setShowCustom(false)}
              className={`flex-1 py-2 rounded-lg items-center ${!showCustom ? 'bg-white' : ''}`}
            >
              <Text
                className={`text-sm font-semibold ${!showCustom ? 'text-dark-900' : 'text-dark-500'}`}
              >
                {t('exercises.builtIn')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowCustom(true)}
              className={`flex-1 py-2 rounded-lg items-center ${showCustom ? 'bg-white' : ''}`}
            >
              <Text
                className={`text-sm font-semibold ${showCustom ? 'text-dark-900' : 'text-dark-500'}`}
              >
                {t('exercises.customExercises')} ({customExercises.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-5 gap-2 mb-3"
      >
        <TouchableOpacity
          onPress={() => setMuscleFilter(null)}
          className={`px-4 py-2 rounded-full border ${
            !muscleFilter ? 'bg-primary-500 border-primary-500' : 'border-dark-200'
          }`}
        >
          <Text className={`text-sm font-medium ${!muscleFilter ? 'text-white' : 'text-dark-600'}`}>
            {t('exercises.all')}
          </Text>
        </TouchableOpacity>
        {MUSCLE_GROUPS.map((m) => {
          const active = m === muscleFilter;
          const visual = getMuscleVisual(m);
          return (
            <TouchableOpacity
              key={m}
              onPress={() => setMuscleFilter(active ? null : m)}
              className={`flex-row items-center px-3 py-2 rounded-full border ${
                active ? 'bg-primary-500 border-primary-500' : 'border-dark-200'
              }`}
            >
              <MaterialCommunityIcons
                name={visual.icon}
                size={16}
                color={active ? '#fff' : visual.color}
                style={{ marginRight: 4 }}
              />
              <Text className={`text-sm font-medium ${active ? 'text-white' : 'text-dark-600'}`}>
                {translateMuscle(m)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlashList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 110 }}
        renderItem={({ item }) => {
          const visual = getMuscleVisual(item.primaryMuscle);
          const displayName = item.isCustom ? item.name : getExerciseName(item.name, locale);
          return (
            <TouchableOpacity
              onPress={() => handleSelect(item)}
              className="mx-5 my-1.5 p-3 border border-dark-100 rounded-2xl flex-row items-center bg-white"
            >
              <View
                className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: visual.bg }}
              >
                <MaterialCommunityIcons name={visual.icon} size={24} color={visual.color} />
              </View>
              <View className="flex-1 mr-2">
                <View className="flex-row items-center">
                  <Text className="font-semibold text-dark-900 flex-1" numberOfLines={1}>
                    {displayName}
                  </Text>
                  {item.isCustom && (
                    <View className="bg-accent-100 px-1.5 py-0.5 rounded">
                      <Text className="text-[10px] font-bold text-accent-700">CUSTOM</Text>
                    </View>
                  )}
                </View>
                <Text className="text-xs text-dark-500 mt-0.5">
                  {translateMuscle(item.primaryMuscle)}
                </Text>
                <Text className="text-xs text-dark-400 mt-0.5" numberOfLines={1}>
                  {item.equipment.map(translateEquipment).join(' • ')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  handleInfo(item);
                }}
                className="w-8 h-8 items-center justify-center"
              >
                <Ionicons name="information-circle-outline" size={22} color="#94A3B8" />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
