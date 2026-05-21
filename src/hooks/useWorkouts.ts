import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWorkouts, saveWorkout } from '@/src/lib/firebase/firestore';
import { WorkoutDocument } from '@/src/types/workout';

export function useWorkoutHistory(userId: string | undefined) {
  return useQuery({
    queryKey: ['workouts', userId],
    queryFn: () => (userId ? getWorkouts(userId) : Promise.resolve([])),
    enabled: !!userId,
  });
}

export function useCompleteWorkout(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workout: Omit<WorkoutDocument, 'id'>) => {
      if (!userId) throw new Error('Not signed in');
      return saveWorkout(userId, workout);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });
}
