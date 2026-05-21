import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/src/components/ui/Card';
import { MealType } from '@/src/types/nutrition';

const MEAL_TYPES: { type: MealType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { type: 'breakfast', label: 'Breakfast', icon: 'sunny' },
  { type: 'lunch', label: 'Lunch', icon: 'restaurant' },
  { type: 'dinner', label: 'Dinner', icon: 'moon' },
  { type: 'snack', label: 'Snack', icon: 'cafe' },
];

export default function AddMeal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mealType?: MealType }>();

  const openSearch = (type: MealType) => {
    router.push({ pathname: '/(tabs)/nutrition/food-search', params: { mealType: type } });
  };

  // If mealType is pre-selected, go straight to search
  React.useEffect(() => {
    if (params.mealType) {
      router.replace({ pathname: '/(tabs)/nutrition/food-search', params: { mealType: params.mealType } });
    }
  }, [params.mealType]);

  return (
    <SafeAreaView className="flex-1 bg-white px-5 pt-4">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#334155" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-dark-900 ml-3">Add Meal</Text>
      </View>

      <Text className="text-dark-400 mb-4">Choose a meal to add food to</Text>

      <View className="gap-3">
        {MEAL_TYPES.map((m) => (
          <Card key={m.type} onPress={() => openSearch(m.type)}>
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-accent-50 rounded-xl items-center justify-center mr-3">
                <Ionicons name={m.icon} size={24} color="#F97316" />
              </View>
              <Text className="text-base font-semibold text-dark-900 flex-1">{m.label}</Text>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            </View>
          </Card>
        ))}
      </View>
    </SafeAreaView>
  );
}
