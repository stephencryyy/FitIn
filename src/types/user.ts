import { Timestamp } from 'firebase/firestore';

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';
export type FitnessGoal = 'lose_weight' | 'build_muscle' | 'maintain' | 'improve_endurance' | 'general_fitness';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type UserRole = 'user' | 'trainer';
export type UnitSystem = 'metric' | 'imperial';

export interface UserProfile {
  heightCm: number;
  weightKg: number;
  dateOfBirth: string;
  gender: Gender;
  fitnessGoal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  dietaryPreferences: string[];
  activityLevel: ActivityLevel;
}

export interface UserStats {
  totalWorkouts: number;
  totalVolume: number;
  currentStreak: number;
  longestStreak: number;
}

export interface UserSettings {
  unitSystem: UnitSystem;
  notifications: boolean;
  healthSyncEnabled: boolean;
}

export interface UserDocument {
  email: string;
  displayName: string;
  username: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  onboardingComplete: boolean;
  profile: UserProfile;
  isPublic: boolean;
  stats: UserStats;
  settings: UserSettings;
  /** Team ids the user belongs to. Maintained by create/join/leave. */
  teamIds?: string[];
}

export interface OnboardingData {
  heightCm: number;
  weightKg: number;
  dateOfBirth: string;
  gender: Gender;
  fitnessGoal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  dietaryPreferences: string[];
  activityLevel: ActivityLevel;
}
