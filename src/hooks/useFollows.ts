import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { followUser, unfollowUser, isFollowing } from '@/src/lib/firebase/firestore';

export function useIsFollowing(followerId: string | undefined, followingId: string) {
  return useQuery({
    queryKey: ['following', followerId, followingId],
    queryFn: () => (followerId ? isFollowing(followerId, followingId) : Promise.resolve(false)),
    enabled: !!followerId && !!followingId,
  });
}

export function useFollowMutation(followerId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ followingId, shouldFollow }: { followingId: string; shouldFollow: boolean }) => {
      if (!followerId) throw new Error('Not signed in');
      if (shouldFollow) {
        await followUser(followerId, followingId);
      } else {
        await unfollowUser(followerId, followingId);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['following', followerId, variables.followingId] });
      queryClient.invalidateQueries({ queryKey: ['followers', variables.followingId] });
    },
  });
}
