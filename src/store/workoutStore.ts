import { create } from 'zustand';
import { WorkoutExercise, ExerciseSet, ExerciseCategory } from '@/src/types/workout';

interface ActiveWorkout {
  title: string;
  startedAt: Date;
  exercises: WorkoutExercise[];
  restTimerSeconds: number;
  isRestTimerRunning: boolean;
}

interface WorkoutState {
  activeWorkout: ActiveWorkout | null;
  startWorkout: (title: string) => void;
  addExercise: (exercise: Omit<WorkoutExercise, 'order' | 'sets'>) => void;
  removeExercise: (exerciseId: string) => void;
  addSet: (exerciseId: string) => void;
  updateSet: (exerciseId: string, setIndex: number, data: Partial<ExerciseSet>) => void;
  removeSet: (exerciseId: string, setIndex: number) => void;
  completeSet: (exerciseId: string, setIndex: number) => void;
  startRestTimer: (seconds: number) => void;
  stopRestTimer: () => void;
  finishWorkout: () => ActiveWorkout | null;
  cancelWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  activeWorkout: null,

  startWorkout: (title) =>
    set({
      activeWorkout: {
        title,
        startedAt: new Date(),
        exercises: [],
        restTimerSeconds: 0,
        isRestTimerRunning: false,
      },
    }),

  addExercise: (exercise) =>
    set((state) => {
      if (!state.activeWorkout) return state;
      const order = state.activeWorkout.exercises.length;
      return {
        activeWorkout: {
          ...state.activeWorkout,
          exercises: [
            ...state.activeWorkout.exercises,
            { ...exercise, order, sets: [createEmptySet(1)] },
          ],
        },
      };
    }),

  removeExercise: (exerciseId) =>
    set((state) => {
      if (!state.activeWorkout) return state;
      return {
        activeWorkout: {
          ...state.activeWorkout,
          exercises: state.activeWorkout.exercises
            .filter((e) => e.exerciseId !== exerciseId)
            .map((e, i) => ({ ...e, order: i })),
        },
      };
    }),

  addSet: (exerciseId) =>
    set((state) => {
      if (!state.activeWorkout) return state;
      return {
        activeWorkout: {
          ...state.activeWorkout,
          exercises: state.activeWorkout.exercises.map((e) =>
            e.exerciseId === exerciseId
              ? { ...e, sets: [...e.sets, createEmptySet(e.sets.length + 1)] }
              : e,
          ),
        },
      };
    }),

  updateSet: (exerciseId, setIndex, data) =>
    set((state) => {
      if (!state.activeWorkout) return state;
      return {
        activeWorkout: {
          ...state.activeWorkout,
          exercises: state.activeWorkout.exercises.map((e) =>
            e.exerciseId === exerciseId
              ? {
                  ...e,
                  sets: e.sets.map((s, i) =>
                    i === setIndex ? { ...s, ...data } : s,
                  ),
                }
              : e,
          ),
        },
      };
    }),

  removeSet: (exerciseId, setIndex) =>
    set((state) => {
      if (!state.activeWorkout) return state;
      return {
        activeWorkout: {
          ...state.activeWorkout,
          exercises: state.activeWorkout.exercises.map((e) =>
            e.exerciseId === exerciseId
              ? {
                  ...e,
                  sets: e.sets
                    .filter((_, i) => i !== setIndex)
                    .map((s, i) => ({ ...s, setNumber: i + 1 })),
                }
              : e,
          ),
        },
      };
    }),

  completeSet: (exerciseId, setIndex) =>
    set((state) => {
      if (!state.activeWorkout) return state;
      return {
        activeWorkout: {
          ...state.activeWorkout,
          exercises: state.activeWorkout.exercises.map((e) =>
            e.exerciseId === exerciseId
              ? {
                  ...e,
                  sets: e.sets.map((s, i) =>
                    i === setIndex ? { ...s, completed: true } : s,
                  ),
                }
              : e,
          ),
        },
      };
    }),

  startRestTimer: (seconds) =>
    set((state) => {
      if (!state.activeWorkout) return state;
      return {
        activeWorkout: {
          ...state.activeWorkout,
          restTimerSeconds: seconds,
          isRestTimerRunning: true,
        },
      };
    }),

  stopRestTimer: () =>
    set((state) => {
      if (!state.activeWorkout) return state;
      return {
        activeWorkout: {
          ...state.activeWorkout,
          restTimerSeconds: 0,
          isRestTimerRunning: false,
        },
      };
    }),

  finishWorkout: () => {
    const workout = get().activeWorkout;
    set({ activeWorkout: null });
    return workout;
  },

  cancelWorkout: () => set({ activeWorkout: null }),
}));

function createEmptySet(setNumber: number): ExerciseSet {
  return {
    setNumber,
    type: 'working',
    weightKg: null,
    reps: null,
    durationSeconds: null,
    distanceMeters: null,
    isPersonalRecord: false,
    completed: false,
  };
}
