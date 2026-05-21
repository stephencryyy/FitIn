import { useMemo } from 'react';
import { WorkoutDocument } from '@/src/types/workout';

export interface Achievements {
  totalWorkouts: number;
  totalVolume: number;      // kg (weight × reps)
  totalReps: number;        // all reps across all exercises
  totalDurationMin: number; // minutes of timed exercises
  totalDistanceKm: number;  // km from cardio
  longestWorkoutMin: number;
  bestVolumeSingle: number; // best volume in a single workout
}

export function useAchievements(workouts: WorkoutDocument[] | undefined): Achievements {
  return useMemo(() => {
    if (!workouts || workouts.length === 0) {
      return {
        totalWorkouts: 0,
        totalVolume: 0,
        totalReps: 0,
        totalDurationMin: 0,
        totalDistanceKm: 0,
        longestWorkoutMin: 0,
        bestVolumeSingle: 0,
      };
    }

    let totalVolume = 0;
    let totalReps = 0;
    let totalDurationSec = 0;
    let totalDistanceM = 0;
    let longestWorkoutSec = 0;
    let bestVolumeSingle = 0;

    for (const w of workouts) {
      if (w.durationSeconds > longestWorkoutSec) {
        longestWorkoutSec = w.durationSeconds;
      }
      if (w.totalVolume > bestVolumeSingle) {
        bestVolumeSingle = w.totalVolume;
      }

      for (const ex of w.exercises || []) {
        for (const set of ex.sets || []) {
          if (!set.completed) continue;

          if (set.reps != null) {
            totalReps += set.reps;
          }
          if (set.weightKg != null && set.reps != null) {
            totalVolume += set.weightKg * set.reps;
          }
          if (set.durationSeconds != null) {
            totalDurationSec += set.durationSeconds;
          }
          if (set.distanceMeters != null) {
            totalDistanceM += set.distanceMeters;
          }
        }
      }
    }

    return {
      totalWorkouts: workouts.length,
      totalVolume: Math.round(totalVolume),
      totalReps,
      totalDurationMin: Math.round(totalDurationSec / 60),
      totalDistanceKm: Math.round(totalDistanceM / 100) / 10,
      longestWorkoutMin: Math.round(longestWorkoutSec / 60),
      bestVolumeSingle: Math.round(bestVolumeSingle),
    };
  }, [workouts]);
}
