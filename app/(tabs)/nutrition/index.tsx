import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/src/components/ui/Card';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { Button } from '@/src/components/ui/Button';
import { useAuth } from '@/src/providers/AuthProvider';
import { useNutritionDay, useUpdateWater, todayString } from '@/src/hooks/useNutrition';
import { MealType } from '@/src/types/nutrition';
import { useT } from '@/src/hooks/useT';

export default function NutritionScreen() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const t = useT();
  const { data: day } = useNutritionDay(user?.uid);
  const updateWater = useUpdateWater(user?.uid);

  const totals = day?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  const targets = day || { targetCalories: 2000, targetProtein: 150, targetCarbs: 250, targetFat: 70 };
  const waterMl = day?.waterMl ?? 0;
  const calorieProgress = targets.targetCalories > 0 ? totals.calories / targets.targetCalories : 0;

  const addWater = async (ml: number) => {
    if (!profile) return;
    await updateWater.mutateAsync({ date: todayString(), amountMl: ml, profile: profile.profile });
  };

  const openMeal = (type: MealType) => {
    router.push({ pathname: '/(tabs)/nutrition/food-search', params: { mealType: type } });
  };

  const getMealFoods = (type: MealType) => day?.meals.find((m) => m.type === type)?.foods || [];
  const getMealCalories = (type: MealType) => getMealFoods(type).reduce((s, f) => s + f.calories, 0);
  const getMealMacros = (type: MealType) => {
    const foods = getMealFoods(type);
    return {
      p: Math.round(foods.reduce((s, f) => s + f.protein, 0)),
      f: Math.round(foods.reduce((s, f) => s + f.fat, 0)),
      c: Math.round(foods.reduce((s, f) => s + f.carbs, 0)),
    };
  };

  const MEALS = [
    { type: 'breakfast' as MealType, label: t('nutrition.breakfast'), time: '08:00' },
    { type: 'lunch' as MealType, label: t('nutrition.lunch'), time: '13:00' },
    { type: 'dinner' as MealType, label: t('nutrition.dinner'), time: '19:00' },
    { type: 'snack' as MealType, label: t('nutrition.snack'), time: '16:00' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-dark-50">
      <ScrollView contentContainerClassName="pb-28">
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <Text className="text-xs font-extrabold uppercase tracking-wide text-nutrition-500">
            Nutrition
          </Text>
          <Text className="text-[34px] font-extrabold text-dark-900 tracking-tight mt-1">
            {t('nutrition.title')}
          </Text>
        </View>

        {/* Calorie Hero */}
        <View className="px-5 mb-5">
          <Card variant="green">
            <Text className="text-xs font-extrabold uppercase tracking-wide text-nutrition-500">
              Daily Calories
            </Text>
            <View className="flex-row items-end justify-between mt-2">
              <View>
                <Text className="text-[42px] font-extrabold text-dark-900"
                  style={{ lineHeight: 44 }}
                >
                  {Math.round(totals.calories)}
                </Text>
                <Text className="text-[13px] font-bold text-dark-400">
                  {t('nutrition.of')} {targets.targetCalories} {t('nutrition.calories')}
                </Text>
              </View>
              <View className="w-24 h-24 rounded-3xl bg-white border border-dark-200 items-center justify-center">
                <Text className="text-[28px] font-extrabold text-nutrition-500">
                  {Math.round(calorieProgress * 100)}%
                </Text>
                <Text className="text-xs font-extrabold text-dark-400">
                  {t('common.done') === 'Готово' ? 'закрыто' : 'done'}
                </Text>
              </View>
            </View>
            <View className="mt-4">
              <ProgressBar progress={calorieProgress} color="bg-nutrition-500" tall />
            </View>
          </Card>
        </View>

        {/* Macros */}
        <View className="px-5 mb-5">
          <Card>
            <View className="flex-row justify-between items-end mb-4">
              <Text className="text-lg font-extrabold text-dark-900">{t('nutrition.protein')}/{t('nutrition.carbs')}/{t('nutrition.fat')}</Text>
            </View>
            <View className="gap-3">
              <View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm font-extrabold text-dark-900">{t('nutrition.protein')}</Text>
                  <Text className="text-[13px] font-bold text-dark-400">{Math.round(totals.protein)} / {targets.targetProtein}g</Text>
                </View>
                <ProgressBar progress={targets.targetProtein > 0 ? totals.protein / targets.targetProtein : 0} color="bg-nutrition-500" tall />
              </View>
              <View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm font-extrabold text-dark-900">{t('nutrition.carbs')}</Text>
                  <Text className="text-[13px] font-bold text-dark-400">{Math.round(totals.carbs)} / {targets.targetCarbs}g</Text>
                </View>
                <ProgressBar progress={targets.targetCarbs > 0 ? totals.carbs / targets.targetCarbs : 0} color="bg-accent-500" tall />
              </View>
              <View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm font-extrabold text-dark-900">{t('nutrition.fat')}</Text>
                  <Text className="text-[13px] font-bold text-dark-400">{Math.round(totals.fat)} / {targets.targetFat}g</Text>
                </View>
                <ProgressBar progress={targets.targetFat > 0 ? totals.fat / targets.targetFat : 0} color="bg-warning-500" tall />
              </View>
            </View>
          </Card>
        </View>

        {/* Action Buttons */}
        <View className="px-5 mb-5">
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => addWater(250)}
              disabled={updateWater.isPending}
              className="flex-1 bg-dark-100 py-3.5 rounded-xl items-center"
            >
              <Text className="font-extrabold text-dark-900">💧 {waterMl} ml</Text>
            </TouchableOpacity>
            <View className="flex-1">
              <Button title={`🥗 ${t('home.logMeal')}`} onPress={() => router.push('/(tabs)/nutrition/add-meal')} fullWidth />
            </View>
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/(tabs)/nutrition/quick-add', params: { mealType: 'snack' } })}
              className="flex-1 bg-transparent py-3.5 rounded-xl items-center border border-dark-200"
            >
              <Text className="font-extrabold text-dark-400">{t('nutrition.quickAdd')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Meals */}
        <View className="px-5 mb-5">
          <Text className="text-lg font-extrabold text-dark-900 mb-3">{t('nutrition.meals')}</Text>
          {MEALS.map((meal) => {
            const foods = getMealFoods(meal.type);
            const cals = getMealCalories(meal.type);
            const macros = getMealMacros(meal.type);

            return (
              <Card key={meal.type} className="mb-3" onPress={() => openMeal(meal.type)}>
                <View className="flex-row items-center justify-between mb-2">
                  <View>
                    <Text className="text-base font-extrabold text-dark-900">{meal.label}</Text>
                    <Text className="text-[13px] font-bold text-dark-400">{meal.time}</Text>
                  </View>
                  {cals > 0 && (
                    <View className="bg-nutrition-50 px-3 py-1.5 rounded-2xl">
                      <Text className="text-sm font-extrabold text-nutrition-500">{Math.round(cals)} {t('nutrition.calories')}</Text>
                    </View>
                  )}
                </View>
                {foods.length > 0 ? (
                  <>
                    <View className="flex-row flex-wrap gap-2 mb-2">
                      {foods.map((f, i) => (
                        <View key={i} className="bg-dark-100 px-3 py-1.5 rounded-full">
                          <Text className="text-[13px] font-extrabold text-dark-900">{f.name}</Text>
                        </View>
                      ))}
                    </View>
                    <Text className="text-[13px] font-bold text-dark-400">
                      {t('nutrition.protein').charAt(0)} {macros.p}g • {t('nutrition.fat').charAt(0)} {macros.f}g • {t('nutrition.carbs').charAt(0)} {macros.c}g
                    </Text>
                  </>
                ) : (
                  <Text className="text-[13px] font-semibold text-dark-400">{t('nutrition.tapToAdd')}</Text>
                )}
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
