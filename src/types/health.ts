import { Timestamp } from 'firebase/firestore';

export type HealthSource = 'apple_healthkit' | 'google_health_connect';

export interface HealthDataDocument {
  date: string;
  steps: number | null;
  heartRateAvg: number | null;
  heartRateMin: number | null;
  heartRateMax: number | null;
  sleepHours: number | null;
  caloriesBurned: number | null;
  source: HealthSource;
  syncedAt: Timestamp;
}
