import { Timestamp } from 'firebase/firestore';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: Timestamp;
}

export interface AssistantChatDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  title: string;
  messages: ChatMessage[];
}

export interface AssistantContext {
  profile: {
    age: number;
    gender: string;
    weightKg: number;
    heightCm: number;
    fitnessGoal: string;
    experienceLevel: string;
    dietaryPreferences: string[];
  };
  recentWorkouts: {
    title: string;
    date: string;
    exercises: string[];
    totalVolume: number;
  }[];
  todayNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    targetCalories: number;
  } | null;
  personalRecords: {
    exercise: string;
    maxWeight: number;
    estimated1RM: number;
  }[];
}
