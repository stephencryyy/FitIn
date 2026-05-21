import { FitnessGoal, ExperienceLevel, ActivityLevel } from '@/src/types/user';

export const FITNESS_GOALS: { value: FitnessGoal; label: string }[] = [
  { value: 'lose_weight', label: 'Lose Weight' },
  { value: 'build_muscle', label: 'Build Muscle' },
  { value: 'maintain', label: 'Stay Fit' },
  { value: 'improve_endurance', label: 'Improve Endurance' },
  { value: 'general_fitness', label: 'General Fitness' },
];

export const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; description: string }[] = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
  { value: 'light', label: 'Light', description: '1-3 days/week' },
  { value: 'moderate', label: 'Moderate', description: '3-5 days/week' },
  { value: 'active', label: 'Active', description: '6-7 days/week' },
  { value: 'very_active', label: 'Very Active', description: 'Twice/day or physical job' },
];

export const DIETARY_PREFERENCES = [
  'No restrictions',
  'Vegetarian',
  'Vegan',
  'Gluten-free',
  'Lactose-free',
  'Keto',
  'Paleo',
  'Halal',
  'Kosher',
  'Low-carb',
  'High-protein',
] as const;
