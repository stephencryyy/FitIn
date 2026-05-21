import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';

const FETCH_TIMEOUT_MS = 7000;

interface SearchRequest {
  query: string;
  page?: number;
}

interface NormalizedFood {
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
}

interface OFFNutriments {
  'energy-kcal_100g'?: number;
  proteins_100g?: number;
  carbohydrates_100g?: number;
  fat_100g?: number;
  fiber_100g?: number;
}

interface OFFProduct {
  code?: string;
  _id?: string;
  product_name?: string;
  brands?: string;
  nutriments?: OFFNutriments;
}

interface OFFResponse {
  products?: OFFProduct[];
  count?: number;
}

function validateRequest(data: unknown): SearchRequest {
  if (!data || typeof data !== 'object') {
    throw new HttpsError('invalid-argument', 'Invalid payload');
  }
  const { query, page } = data as Partial<SearchRequest>;
  if (typeof query !== 'string' || query.length < 2 || query.length > 100) {
    throw new HttpsError('invalid-argument', 'Query must be a string of 2-100 chars');
  }
  if (page !== undefined && (typeof page !== 'number' || page < 1 || page > 100 || !Number.isInteger(page))) {
    throw new HttpsError('invalid-argument', 'Page must be an integer between 1 and 100');
  }
  return { query, page };
}

export const searchFood = onCall({ maxInstances: 10 }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be signed in');
  }

  const { query, page = 1 } = validateRequest(request.data);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&page=${page}&page_size=20&json=true`;
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new HttpsError('unavailable', `Upstream returned ${response.status}`);
    }

    const data = (await response.json()) as OFFResponse;

    const foods: NormalizedFood[] = (data.products || [])
      .filter((p): p is OFFProduct & { nutriments: OFFNutriments; product_name: string } =>
        Boolean(p.nutriments && p.product_name),
      )
      .map((p): NormalizedFood => ({
        foodId: p.code || p._id || '',
        name: p.product_name,
        brand: p.brands || null,
        servingSize: 100,
        servingUnit: 'g',
        calories: Math.round(p.nutriments['energy-kcal_100g'] || 0),
        protein: Math.round((p.nutriments.proteins_100g || 0) * 10) / 10,
        carbs: Math.round((p.nutriments.carbohydrates_100g || 0) * 10) / 10,
        fat: Math.round((p.nutriments.fat_100g || 0) * 10) / 10,
        fiber: Math.round((p.nutriments.fiber_100g || 0) * 10) / 10,
        source: 'openfoodfacts',
      }));

    return {
      foods,
      page,
      totalPages: Math.ceil((data.count || 0) / 20),
    };
  } catch (err: unknown) {
    if (err instanceof HttpsError) throw err;
    if (err instanceof Error && err.name === 'AbortError') {
      logger.warn('foodSearch upstream timeout', { query, page });
      throw new HttpsError('deadline-exceeded', 'Food database is slow, try again');
    }
    logger.error('foodSearch failed', { query, page, error: err instanceof Error ? err.message : String(err) });
    throw new HttpsError('internal', 'Search failed');
  } finally {
    clearTimeout(timeout);
  }
});
