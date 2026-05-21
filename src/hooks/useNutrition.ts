import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNutritionDay, saveNutritionDay } from '@/src/lib/firebase/firestore';
import { NutritionDayDocument, FoodEntry, MealType } from '@/src/types/nutrition';
import { Timestamp } from 'firebase/firestore';
import { calculateBMR, calculateTDEE, calculateTargetCalories, calculateMacros, calculateAge } from '@/src/lib/utils/calculations';
import { UserProfile } from '@/src/types/user';

export function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function useNutritionDay(userId: string | undefined, date: string = todayString()) {
  return useQuery({
    queryKey: ['nutrition', userId, date],
    queryFn: () => (userId ? getNutritionDay(userId, date) : Promise.resolve(null)),
    enabled: !!userId,
  });
}

export function useAddFoodToMeal(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      date,
      mealType,
      food,
      profile,
    }: {
      date: string;
      mealType: MealType;
      food: FoodEntry;
      profile: UserProfile;
    }) => {
      if (!userId) throw new Error('Not signed in');

      const existing = await getNutritionDay(userId, date);
      const targets = computeTargets(profile);

      const baseDay: NutritionDayDocument = existing || {
        date,
        ...targets,
        meals: [],
        totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
        waterMl: 0,
      };

      // Find or create meal
      let meal = baseDay.meals.find((m) => m.type === mealType);
      if (!meal) {
        meal = {
          id: `${mealType}_${Date.now()}`,
          name: mealType.charAt(0).toUpperCase() + mealType.slice(1),
          type: mealType,
          time: Timestamp.now(),
          foods: [],
        };
        baseDay.meals.push(meal);
      }
      meal.foods.push(food);

      // Recalculate totals
      baseDay.totals = baseDay.meals.reduce(
        (acc, m) => {
          m.foods.forEach((f) => {
            acc.calories += f.calories;
            acc.protein += f.protein;
            acc.carbs += f.carbs;
            acc.fat += f.fat;
            acc.fiber += f.fiber;
          });
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
      );

      await saveNutritionDay(userId, date, baseDay);
      return baseDay;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['nutrition', userId, variables.date] });
    },
  });
}

export function useUpdateWater(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      date,
      amountMl,
      profile,
    }: {
      date: string;
      amountMl: number;
      profile: UserProfile;
    }) => {
      if (!userId) throw new Error('Not signed in');

      const existing = await getNutritionDay(userId, date);
      const targets = computeTargets(profile);

      const baseDay: NutritionDayDocument = existing || {
        date,
        ...targets,
        meals: [],
        totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
        waterMl: 0,
      };

      baseDay.waterMl = Math.max(0, baseDay.waterMl + amountMl);
      await saveNutritionDay(userId, date, baseDay);
      return baseDay;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['nutrition', userId, variables.date] });
    },
  });
}

function computeTargets(profile: UserProfile) {
  const age = profile.dateOfBirth ? calculateAge(profile.dateOfBirth) : 25;
  const bmr = calculateBMR(profile.weightKg || 70, profile.heightCm || 170, age, profile.gender);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const targetCalories = calculateTargetCalories(tdee, profile.fitnessGoal);
  const macros = calculateMacros(targetCalories, profile.fitnessGoal);
  return {
    targetCalories,
    targetProtein: macros.protein,
    targetCarbs: macros.carbs,
    targetFat: macros.fat,
  };
}
