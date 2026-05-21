import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/lib/firebase/config';
import { ExerciseDocument } from '@/src/types/workout';
import { SEED_EXERCISES } from '@/src/constants/exercises';

export function useCustomExercises(userId: string | undefined) {
  return useQuery({
    queryKey: ['custom-exercises', userId],
    queryFn: async () => {
      if (!userId) return [];
      const snap = await getDocs(collection(db, 'users', userId, 'customExercises'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data(), isCustom: true }) as ExerciseDocument);
    },
    enabled: !!userId,
  });
}

export function useAllExercises(userId: string | undefined) {
  const { data: customExercises = [] } = useCustomExercises(userId);

  const seedWithIds: ExerciseDocument[] = SEED_EXERCISES.map((ex) => ({
    ...ex,
    id: ex.name.toLowerCase().replace(/\s+/g, '-'),
  }));

  return { customExercises, seedExercises: seedWithIds, all: [...customExercises, ...seedWithIds] };
}

export function useCreateCustomExercise(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (exercise: Omit<ExerciseDocument, 'id' | 'isCustom'>) => {
      if (!userId) throw new Error('Not signed in');
      const ref = await addDoc(collection(db, 'users', userId, 'customExercises'), {
        ...exercise,
        isCustom: true,
        createdAt: serverTimestamp(),
      });
      return ref.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-exercises', userId] });
    },
  });
}

export function useDeleteCustomExercise(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (exerciseId: string) => {
      if (!userId) throw new Error('Not signed in');
      await deleteDoc(doc(db, 'users', userId, 'customExercises', exerciseId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-exercises', userId] });
    },
  });
}
