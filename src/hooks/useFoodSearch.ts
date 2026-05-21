import { useQuery } from '@tanstack/react-query';
import { searchFood } from '@/src/lib/api/food';

export function useFoodSearch(query: string, enabled: boolean) {
  return useQuery({
    queryKey: ['food-search', query],
    queryFn: () => searchFood(query),
    enabled: enabled && query.length >= 2,
    staleTime: 10 * 60 * 1000,
  });
}
