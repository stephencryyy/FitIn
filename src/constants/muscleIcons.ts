import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type McIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

/**
 * Visual icon + color per muscle group / category.
 * Uses MaterialCommunityIcons for better fitness-specific visuals.
 */
export const MUSCLE_VISUALS: Record<string, { icon: McIconName; color: string; bg: string }> = {
  Chest: { icon: 'weight-lifter', color: '#DC2626', bg: '#FEE2E2' },
  Back: { icon: 'human-handsdown', color: '#2563EB', bg: '#DBEAFE' },
  Lats: { icon: 'human-handsdown', color: '#2563EB', bg: '#DBEAFE' },
  Shoulders: { icon: 'arm-flex', color: '#F59E0B', bg: '#FEF3C7' },
  Biceps: { icon: 'arm-flex', color: '#7C3AED', bg: '#EDE9FE' },
  Triceps: { icon: 'arm-flex-outline', color: '#A855F7', bg: '#F3E8FF' },
  Forearms: { icon: 'hand-back-right', color: '#6366F1', bg: '#E0E7FF' },
  Quadriceps: { icon: 'run', color: '#0891B2', bg: '#CFFAFE' },
  Hamstrings: { icon: 'run-fast', color: '#0EA5E9', bg: '#E0F2FE' },
  Glutes: { icon: 'walk', color: '#EC4899', bg: '#FCE7F3' },
  Calves: { icon: 'shoe-sneaker', color: '#14B8A6', bg: '#CCFBF1' },
  Abs: { icon: 'karate', color: '#F97316', bg: '#FFEDD5' },
  Obliques: { icon: 'karate', color: '#EA580C', bg: '#FFEDD5' },
  Traps: { icon: 'human-handsup', color: '#D97706', bg: '#FEF3C7' },
  'Lower Back': { icon: 'human', color: '#4F46E5', bg: '#E0E7FF' },
  'Hip Flexors': { icon: 'run', color: '#8B5CF6', bg: '#EDE9FE' },
  'Full Body': { icon: 'human', color: '#059669', bg: '#D1FAE5' },
  Cardio: { icon: 'heart-pulse', color: '#EF4444', bg: '#FEE2E2' },
};

export function getMuscleVisual(muscle: string) {
  return (
    MUSCLE_VISUALS[muscle] || { icon: 'dumbbell' as McIconName, color: '#64748B', bg: '#F1F5F9' }
  );
}

export const CATEGORY_VISUALS: Record<
  string,
  { icon: McIconName; color: string; bg: string; label: string }
> = {
  strength: { icon: 'dumbbell', color: '#3B82F6', bg: '#DBEAFE', label: 'Strength' },
  cardio: { icon: 'heart-pulse', color: '#EF4444', bg: '#FEE2E2', label: 'Cardio' },
  flexibility: { icon: 'yoga', color: '#8B5CF6', bg: '#EDE9FE', label: 'Flexibility' },
  bodyweight: { icon: 'human-handsup', color: '#059669', bg: '#D1FAE5', label: 'Bodyweight' },
};
