import { Timestamp } from 'firebase/firestore';

export type ExerciseCategory = 'strength' | 'cardio' | 'flexibility' | 'bodyweight';
export type SetType = 'working' | 'warmup' | 'dropset' | 'failure';
export type WorkoutStatus = 'in_progress' | 'completed' | 'cancelled';

export interface ExerciseDocument {
  id: string;
  name: string;
  category: ExerciseCategory;
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment: string[];
  instructions: string;
  imageURL: string | null;
  isCustom: boolean;
}

export interface ExerciseSet {
  setNumber: number;
  type: SetType;
  weightKg: number | null;
  reps: number | null;
  durationSeconds: number | null;
  distanceMeters: number | null;
  isPersonalRecord: boolean;
  completed: boolean;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  category: ExerciseCategory;
  order: number;
  sets: ExerciseSet[];
}

export interface WorkoutDocument {
  id: string;
  title: string;
  startedAt: Timestamp;
  completedAt: Timestamp | null;
  durationSeconds: number;
  status: WorkoutStatus;
  totalVolume: number;
  exercises: WorkoutExercise[];
  notes: string;
  createdBy: string;
}

export interface PersonalRecordEntry {
  value: number;
  date: Timestamp;
  workoutId: string;
  weightKg?: number;
}

export interface PersonalRecordDocument {
  exerciseId: string;
  exerciseName: string;
  records: {
    maxWeight: PersonalRecordEntry;
    maxReps: PersonalRecordEntry;
    maxVolume: PersonalRecordEntry;
    estimated1RM: PersonalRecordEntry;
  };
  history: {
    date: Timestamp;
    maxWeight: number;
    estimated1RM: number;
  }[];
}
