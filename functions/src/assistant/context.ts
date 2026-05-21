import * as admin from 'firebase-admin';

export async function buildUserContext(userId: string): Promise<string> {
  const db = admin.firestore();
  const userDoc = await db.collection('users').doc(userId).get();
  const user = userDoc.data();

  if (!user) {
    return 'No user profile available.';
  }

  const profile = user.profile || {};
  const stats = user.stats || {};

  // Get recent workouts
  const workoutsSnap = await db
    .collection('users')
    .doc(userId)
    .collection('workouts')
    .where('status', '==', 'completed')
    .orderBy('startedAt', 'desc')
    .limit(5)
    .get();

  const recentWorkouts = workoutsSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      title: data.title,
      date: data.startedAt?.toDate().toISOString().split('T')[0] || 'unknown',
      exercises: (data.exercises || []).map((e: any) => e.exerciseName).join(', '),
      volume: data.totalVolume || 0,
    };
  });

  // Get today's nutrition
  const today = new Date().toISOString().split('T')[0];
  const nutritionDoc = await db
    .collection('users')
    .doc(userId)
    .collection('nutritionDays')
    .doc(today)
    .get();
  const nutrition = nutritionDoc.exists ? nutritionDoc.data() : null;

  const age = profile.dateOfBirth
    ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()
    : 'unknown';

  return `
# User Profile
- Name: ${user.displayName}
- Age: ${age}
- Gender: ${profile.gender || 'unknown'}
- Height: ${profile.heightCm || 'unknown'} cm
- Weight: ${profile.weightKg || 'unknown'} kg
- Fitness Goal: ${profile.fitnessGoal || 'unknown'}
- Experience Level: ${profile.experienceLevel || 'unknown'}
- Activity Level: ${profile.activityLevel || 'moderate'}
- Dietary Preferences: ${(profile.dietaryPreferences || []).join(', ') || 'none'}

# Stats
- Total workouts: ${stats.totalWorkouts || 0}
- Current streak: ${stats.currentStreak || 0} days
- Total volume lifted: ${stats.totalVolume || 0} kg

# Recent Workouts (last 5)
${recentWorkouts.map((w) => `- ${w.date}: ${w.title} (${w.volume} kg volume) — ${w.exercises}`).join('\n') || 'No recent workouts'}

# Today's Nutrition
${nutrition ? `- Calories: ${nutrition.totals?.calories || 0} / ${nutrition.targetCalories || 2000}
- Protein: ${nutrition.totals?.protein || 0}g / ${nutrition.targetProtein || 150}g
- Carbs: ${nutrition.totals?.carbs || 0}g / ${nutrition.targetCarbs || 250}g
- Fat: ${nutrition.totals?.fat || 0}g / ${nutrition.targetFat || 70}g` : 'No nutrition logged today'}
  `.trim();
}
