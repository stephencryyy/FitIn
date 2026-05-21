import { beforeUserCreated } from 'firebase-functions/v2/identity';
import * as admin from 'firebase-admin';

export const onUserCreate = beforeUserCreated(async (event) => {
  const user = event.data;
  if (!user) return;

  const db = admin.firestore();
  const userRef = db.collection('users').doc(user.uid);
  const existing = await userRef.get();
  if (existing.exists) return;

  await userRef.set({
    email: user.email || '',
    displayName: user.displayName || '',
    photoURL: user.photoURL || null,
    role: 'user',
    onboardingComplete: false,
    isPublic: true,
    profile: {
      heightCm: 0,
      weightKg: 0,
      dateOfBirth: '',
      gender: 'prefer_not_to_say',
      fitnessGoal: 'general_fitness',
      experienceLevel: 'beginner',
      dietaryPreferences: [],
      activityLevel: 'moderate',
    },
    stats: {
      totalWorkouts: 0,
      totalVolume: 0,
      currentStreak: 0,
      longestStreak: 0,
    },
    settings: {
      unitSystem: 'metric',
      notifications: true,
      healthSyncEnabled: false,
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});
