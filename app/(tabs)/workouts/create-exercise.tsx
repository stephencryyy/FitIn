import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { useAuth } from '@/src/providers/AuthProvider';
import { useCreateCustomExercise } from '@/src/hooks/useExercises';
import { MUSCLE_GROUPS } from '@/src/constants/muscles';
import { ExerciseCategory } from '@/src/types/workout';
import { useT } from '@/src/hooks/useT';

const CATEGORIES: { value: ExerciseCategory; labelKey: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'strength', labelKey: 'exercises.strength', icon: 'barbell' },
  { value: 'cardio', labelKey: 'exercises.cardio', icon: 'heart' },
  { value: 'bodyweight', labelKey: 'exercises.bodyweight', icon: 'person' },
  { value: 'flexibility', labelKey: 'exercises.flexibility', icon: 'body' },
];

export default function CreateExercise() {
  const router = useRouter();
  const { user } = useAuth();
  const t = useT();
  const createMutation = useCreateCustomExercise(user?.uid);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ExerciseCategory>('strength');
  const [primaryMuscle, setPrimaryMuscle] = useState<string>('Chest');
  const [equipment, setEquipment] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(t('common.error'), t('exercises.exerciseName'));
      return;
    }
    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        category,
        primaryMuscle,
        secondaryMuscles: [],
        equipment: equipment.split(',').map((e) => e.trim()).filter(Boolean),
        instructions: instructions.trim(),
        imageURL: null,
      });
      router.back();
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message || t('profile.failedToSave'));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-5 py-3 border-b border-dark-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#334155" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-dark-900 ml-3">
          {t('exercises.createCustom')}
        </Text>
      </View>

      <ScrollView contentContainerClassName="px-5 py-6 pb-24" keyboardShouldPersistTaps="handled">
        <Input
          label={t('exercises.exerciseName')}
          placeholder="e.g. Cable Pullover"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Text className="text-sm font-medium text-dark-700 mb-2">{t('exercises.category')}</Text>
        <View className="flex-row flex-wrap gap-2 mb-5">
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c.value}
              onPress={() => setCategory(c.value)}
              className={`flex-row items-center px-4 py-2.5 rounded-xl border-2 ${
                category === c.value ? 'border-primary-500 bg-primary-50' : 'border-dark-200'
              }`}
            >
              <Ionicons
                name={c.icon}
                size={16}
                color={category === c.value ? '#3B82F6' : '#64748B'}
              />
              <Text
                className={`text-sm font-medium ml-2 ${
                  category === c.value ? 'text-primary-600' : 'text-dark-600'
                }`}
              >
                {t(c.labelKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-sm font-medium text-dark-700 mb-2">
          {t('exercises.primaryMuscle')}
        </Text>
        <View className="flex-row flex-wrap gap-2 mb-5">
          {MUSCLE_GROUPS.map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setPrimaryMuscle(m)}
              className={`px-3 py-2 rounded-full border ${
                primaryMuscle === m ? 'bg-primary-500 border-primary-500' : 'border-dark-200'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  primaryMuscle === m ? 'text-white' : 'text-dark-600'
                }`}
              >
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label={t('exercises.equipment')}
          placeholder="Barbell, Bench"
          value={equipment}
          onChangeText={setEquipment}
        />

        <Input
          label={t('exercises.instructions')}
          placeholder={t('exercises.instructionsPlaceholder')}
          value={instructions}
          onChangeText={setInstructions}
          multiline
          numberOfLines={4}
        />

        <View className="mt-4">
          <Button
            title={t('common.save')}
            onPress={handleSave}
            loading={createMutation.isPending}
            fullWidth
            size="lg"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
