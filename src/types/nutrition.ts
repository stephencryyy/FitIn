import { Timestamp } from 'firebase/firestore';

export type FoodSource = 'openfoodfacts' | 'usda' | 'custom';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface FoodEntry {
  foodId: string | null;
  name: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  source: FoodSource;
}

export interface Meal {
  id: string;
  name: string;
  type: MealType;
  time: Timestamp;
  foods: FoodEntry[];
}

export interface NutritionDayDocument {
  date: string;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  meals: Meal[];
  totals: Macros;
  waterMl: number;
}

export interface FoodSearchResult {
  foods: FoodEntry[];
  page: number;
  totalPages: number;
}
