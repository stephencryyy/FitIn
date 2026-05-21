import { httpsCallable } from 'firebase/functions';
import { functions } from '@/src/lib/firebase/config';

interface SearchFoodResult {
  foods: {
    foodId: string;
    name: string;
    brand: string | null;
    servingSize: number;
    servingUnit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    source: 'openfoodfacts';
  }[];
  page: number;
  totalPages: number;
}

const searchFoodFn = httpsCallable<{ query: string; page?: number }, SearchFoodResult>(
  functions,
  'searchFood',
);

export async function searchFood(query: string, page = 1): Promise<SearchFoodResult> {
  const result = await searchFoodFn({ query, page });
  return result.data;
}
