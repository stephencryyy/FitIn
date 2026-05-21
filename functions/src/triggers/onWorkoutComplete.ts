import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

export const onWorkoutComplete = onDocumentWritten(
  'users/{userId}/workouts/{workoutId}',
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!after) return;

    // Only process newly completed workouts
    if (before?.status === 'completed' || after.status !== 'completed') return;

    const userId = event.params.userId;
    const db = admin.firestore();
    const userRef = db.collection('users').doc(userId);

    // Update user stats
    await db.runTransaction(async (tx) => {
      const userDoc = await tx.get(userRef);
      if (!userDoc.exists) return;

      const stats = userDoc.data()?.stats || {
        totalWorkouts: 0,
        totalVolume: 0,
        currentStreak: 0,
        longestStreak: 0,
      };

      stats.totalWorkouts += 1;
      stats.totalVolume += after.totalVolume || 0;

      tx.update(userRef, { stats, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    });

    // Detect personal records
    for (const exercise of after.exercises || []) {
      for (const set of exercise.sets || []) {
        if (!set.completed || !set.weightKg || !set.reps) continue;

        const prRef = db
          .collection('users')
          .doc(userId)
          .collection('personalRecords')
          .doc(exercise.exerciseId);

        const prDoc = await prRef.get();
        const existing = prDoc.exists ? prDoc.data() : null;

        const estimated1RM = Math.round(set.weightKg * (1 + set.reps / 30));
        const isNewPR = !existing || set.weightKg > (existing.records?.maxWeight?.value || 0);

        if (isNewPR) {
          await prRef.set(
            {
              exerciseId: exercise.exerciseId,
              exerciseName: exercise.exerciseName,
              records: {
                maxWeight: {
                  value: set.weightKg,
                  date: admin.firestore.Timestamp.now(),
                  workoutId: event.params.workoutId,
                },
                estimated1RM: {
                  value: estimated1RM,
                  date: admin.firestore.Timestamp.now(),
                  workoutId: event.params.workoutId,
                },
              },
            },
            { merge: true },
          );
        }
      }
    }
  },
);
