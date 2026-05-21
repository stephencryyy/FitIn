export const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Forearms',
  'Quadriceps',
  'Hamstrings',
  'Glutes',
  'Calves',
  'Abs',
  'Obliques',
  'Traps',
  'Lats',
  'Lower Back',
  'Hip Flexors',
  'Full Body',
  'Cardio',
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export const EQUIPMENT = [
  'Barbell',
  'Dumbbell',
  'Kettlebell',
  'Machine',
  'Cable',
  'Bodyweight',
  'Resistance Band',
  'Smith Machine',
  'EZ Bar',
  'Pull-up Bar',
  'Bench',
  'Cardio Machine',
  'None',
] as const;

export type Equipment = (typeof EQUIPMENT)[number];
