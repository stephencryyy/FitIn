import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/src/components/ui/Input';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { useFoodSearch } from '@/src/hooks/useFoodSearch';
import { useDebounce } from '@/src/hooks/useDebounce';
import { useAddFoodToMeal, todayString } from '@/src/hooks/useNutrition';
import { useAuth } from '@/src/providers/AuthProvider';
import { MealType } from '@/src/types/nutrition';

export default function FoodSearch() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mealType?: MealType }>();
  const mealType = (params.mealType || 'snack') as MealType;
  const { user, profile } = useAuth();
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 400);
  const { data, isLoading, error } = useFoodSearch(debounced, debounced.length >= 2);
  const addFood = useAddFoodToMeal(user?.uid);

  const handleSelect = async (food: NonNullable<typeof data>['foods'][number]) => {
    if (!profile) return;
    try {
      await addFood.mutateAsync({
        date: todayString(),
        mealType,
        food: {
          foodId: food.foodId,
          name: food.name,
          servingSize: food.servingSize,
          servingUnit: food.servingUnit,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          fiber: food.fiber,
          source: 'openfoodfacts',
        },
        profile: profile.profile,
      });
      router.back();
    } catch (err) {
      console.error('Failed to add food:', err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-50">
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-dark-100 bg-white">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#334155" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-dark-900 ml-3">Search Food</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/(tabs)/nutrition/quick-add', params: { mealType } })}
          className="flex-row items-center bg-primary-50 px-3 py-1.5 rounded-full"
        >
          <Ionicons name="add" size={16} color="#3B82F6" />
          <Text className="text-primary-600 font-semibold text-sm ml-1">Quick Add</Text>
        </TouchableOpacity>
      </View>

      <View className="px-5 pt-4 bg-white">
        <Input
          placeholder="e.g. chicken, banana, oats..."
          value={query}
          onChangeText={setQuery}
          icon="search-outline"
          autoCapitalize="none"
        />
      </View>

      {isLoading && query.length >= 2 ? (
        <View className="pt-8">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : error ? (
        <EmptyState icon="cloud-offline-outline" title="Search failed" description="Check your connection and try again" />
      ) : !data || data.foods.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title={query.length < 2 ? 'Search for food' : 'No results'}
          description={query.length < 2 ? 'Type at least 2 characters' : 'Try a different search'}
        />
      ) : (
        <FlashList
          data={data.foods}
          keyExtractor={(item) => item.foodId}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelect(item)}
              disabled={addFood.isPending}
              className="px-5 py-3 border-b border-dark-100 bg-white flex-row items-center"
            >
              <View className="w-10 h-10 bg-accent-50 rounded-full items-center justify-center mr-3">
                <Ionicons name="restaurant" size={18} color="#F97316" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-dark-900" numberOfLines={1}>
                  {item.name}
                </Text>
                {item.brand && (
                  <Text className="text-xs text-dark-400 mt-0.5" numberOfLines={1}>
                    {item.brand}
                  </Text>
                )}
                <Text className="text-xs text-dark-500 mt-0.5">
                  {item.calories} kcal • P {item.protein}g • C {item.carbs}g • F {item.fat}g / 100{item.servingUnit}
                </Text>
              </View>
              <Ionicons name="add-circle-outline" size={22} color="#3B82F6" />
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
