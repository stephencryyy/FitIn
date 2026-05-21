import { FitnessGoal, ActivityLevel } from '@/src/types/user';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calculateBMR(weightKg: number, heightCm: number, age: number, gender: string): number {
  if (gender === 'female') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

export function calculateTargetCalories(tdee: number, goal: FitnessGoal): number {
  switch (goal) {
    case 'lose_weight':
      return tdee - 500;
    case 'build_muscle':
      return tdee + 300;
    default:
      return tdee;
  }
}

export function calculateMacros(calories: number, goal: FitnessGoal) {
  const splits: Record<FitnessGoal, { protein: number; carbs: number; fat: number }> = {
    lose_weight: { protein: 0.4, carbs: 0.3, fat: 0.3 },
    build_muscle: { protein: 0.3, carbs: 0.45, fat: 0.25 },
    maintain: { protein: 0.3, carbs: 0.4, fat: 0.3 },
    improve_endurance: { protein: 0.25, carbs: 0.5, fat: 0.25 },
    general_fitness: { protein: 0.3, carbs: 0.4, fat: 0.3 },
  };
  const split = splits[goal];
  return {
    protein: Math.round((calories * split.protein) / 4),
    carbs: Math.round((calories * split.carbs) / 4),
    fat: Math.round((calories * split.fat) / 9),
  };
}

export function calculateAge(dateOfBirth: string): number {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function calculate1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}
