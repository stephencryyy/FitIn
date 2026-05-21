import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  searchUsers,
  getPublicUser,
  getUserWorkouts,
  getFollowerCount,
  getFollowingCount,
  getFeedWorkouts,
  getSuggestedUsers,
  type FeedPage,
} from '@/src/lib/firebase/social';

export function useUserSearch(query: string, currentUserId?: string) {
  return useQuery({
    queryKey: ['user-search', query],
    queryFn: () => searchUsers(query, currentUserId),
    enabled: query.length >= 2,
  });
}

export function usePublicUser(userId: string | undefined) {
  return useQuery({
    queryKey: ['public-user', userId],
    queryFn: () => (userId ? getPublicUser(userId) : Promise.resolve(null)),
    enabled: !!userId,
  });
}

export function useUserWorkouts(userId: string | undefined) {
  return useQuery({
    queryKey: ['user-workouts', userId],
    queryFn: () => (userId ? getUserWorkouts(userId) : Promise.resolve([])),
    enabled: !!userId,
  });
}

export function useFollowCounts(userId: string | undefined) {
  return useQuery({
    queryKey: ['follow-counts', userId],
    queryFn: async () => {
      if (!userId) return { followers: 0, following: 0 };
      const [followers, following] = await Promise.all([
        getFollowerCount(userId),
        getFollowingCount(userId),
      ]);
      return { followers, following };
    },
    enabled: !!userId,
  });
}

export function useFeed(userId: string | undefined) {
  return useInfiniteQuery<FeedPage, Error>({
    queryKey: ['feed', userId],
    initialPageParam: null as number | null,
    queryFn: ({ pageParam }) => {
      if (!userId) return Promise.resolve({ items: [], nextCursor: null });
      return getFeedWorkouts(userId, { cursorMs: pageParam as number | null });
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useSuggestedUsers(userId: string | undefined) {
  return useQuery({
    queryKey: ['suggested-users', userId],
    queryFn: () => (userId ? getSuggestedUsers(userId) : Promise.resolve([])),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}
