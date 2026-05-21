import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { useAuth } from '@/src/providers/AuthProvider';
import { useAddFoodToMeal, todayString } from '@/src/hooks/useNutrition';
import { MealType } from '@/src/types/nutrition';

export default function QuickAdd() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mealType?: MealType }>();
  const mealType = (params.mealType || 'snack') as MealType;
  const { user, profile } = useAuth();
  const addFood = useAddFoodToMeal(user?.uid);

  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [fiber, setFiber] = useState('');
  const [servingSize, setServingSize] = useState('100');

  const handleSave = async () => {
    if (!profile) return;
    if (!name.trim() || !calories) {
      Alert.alert('Missing fields', 'Name and calories are required');
      return;
    }

    try {
      await addFood.mutateAsync({
        date: todayString(),
        mealType,
        food: {
          foodId: null,
          name: name.trim(),
          servingSize: Number(servingSize) || 100,
          servingUnit: 'g',
          calories: Number(calories) || 0,
          protein: Number(protein) || 0,
          carbs: Number(carbs) || 0,
          fat: Number(fat) || 0,
          fiber: Number(fiber) || 0,
          source: 'custom',
        },
        profile: profile.profile,
      });
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to add food');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-5 py-3 border-b border-dark-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#334155" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-dark-900 ml-3 capitalize">Quick Add to {mealType}</Text>
      </View>

      <ScrollView contentContainerClassName="px-5 py-6 pb-24" keyboardShouldPersistTaps="handled">
        <Input label="Food Name" placeholder="e.g. Chicken breast" value={name} onChangeText={setName} autoCapitalize="sentences" />
        <Input label="Serving Size (g)" placeholder="100" value={servingSize} onChangeText={setServingSize} keyboardType="numeric" />
        <Input label="Calories (kcal)" placeholder="165" value={calories} onChangeText={setCalories} keyboardType="numeric" />

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Input label="Protein (g)" placeholder="31" value={protein} onChangeText={setProtein} keyboardType="numeric" />
          </View>
          <View className="flex-1">
            <Input label="Carbs (g)" placeholder="0" value={carbs} onChangeText={setCarbs} keyboardType="numeric" />
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Input label="Fat (g)" placeholder="3.6" value={fat} onChangeText={setFat} keyboardType="numeric" />
          </View>
          <View className="flex-1">
            <Input label="Fiber (g)" placeholder="0" value={fiber} onChangeText={setFiber} keyboardType="numeric" />
          </View>
        </View>

        <View className="mt-4">
          <Button title="Add to Meal" onPress={handleSave} loading={addFood.isPending} fullWidth size="lg" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
