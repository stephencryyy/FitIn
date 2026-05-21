import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  writeBatch,
  runTransaction,
} from 'firebase/firestore';
import { db } from './config';
import { UserDocument, OnboardingData } from '@/src/types/user';
import { WorkoutDocument } from '@/src/types/workout';
import { NutritionDayDocument } from '@/src/types/nutrition';

// User operations
export async function getUserDoc(userId: string) {
  const snap = await getDoc(doc(db, 'users', userId));
  return snap.exists() ? { id: snap.id, ...snap.data() } as UserDocument & { id: string } : null;
}

export async function createUserDoc(userId: string, data: Partial<UserDocument>) {
  await setDoc(doc(db, 'users', userId), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserDoc(userId: string, data: Partial<UserDocument>) {
  await updateDoc(doc(db, 'users', userId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function saveOnboardingData(userId: string, data: OnboardingData) {
  await setDoc(
    doc(db, 'users', userId),
    {
      profile: data,
      onboardingComplete: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function isUsernameAvailable(username: string, excludeUserId?: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'usernames', username.toLowerCase()));
  if (!snap.exists()) return true;
  return snap.data().userId === excludeUserId;
}

export async function reserveUsername(userId: string, username: string): Promise<void> {
  const normalized = username.toLowerCase();
  await runTransaction(db, async (tx) => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await tx.get(userRef);
    const currentUsername = userSnap.exists() ? (userSnap.data().username as string | null) : null;

    const nameRef = doc(db, 'usernames', normalized);
    const nameSnap = await tx.get(nameRef);

    if (nameSnap.exists() && nameSnap.data().userId !== userId) {
      throw new Error('Username already taken');
    }

    // Free previous username if exists
    if (currentUsername && currentUsername !== normalized) {
      tx.delete(doc(db, 'usernames', currentUsername));
    }

    tx.set(nameRef, { userId, createdAt: serverTimestamp() });
    tx.set(userRef, { username: normalized, updatedAt: serverTimestamp() }, { merge: true });
  });
}

export async function findUserByUsername(username: string): Promise<string | null> {
  const snap = await getDoc(doc(db, 'usernames', username.toLowerCase()));
  return snap.exists() ? (snap.data().userId as string) : null;
}

// Assistant chat history helpers
export async function getLatestAssistantChat(userId: string) {
  const q = query(
    collection(db, 'users', userId, 'assistantChats'),
    orderBy('updatedAt', 'desc'),
    limit(1),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as any;
}

export async function getAssistantChats(userId: string) {
  const q = query(
    collection(db, 'users', userId, 'assistantChats'),
    orderBy('updatedAt', 'desc'),
    limit(30),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as any);
}

export async function ensureUserDoc(
  userId: string,
  defaults: {
    email: string;
    displayName: string;
    photoURL?: string | null;
  },
) {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as UserDocument;

  const initial: Omit<UserDocument, 'createdAt' | 'updatedAt'> = {
    email: defaults.email,
    displayName: defaults.displayName,
    username: null,
    photoURL: defaults.photoURL ?? null,
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
  };

  await setDoc(ref, {
    ...initial,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const newSnap = await getDoc(ref);
  return newSnap.data() as UserDocument;
}

// Workout operations
export async function getWorkouts(userId: string, limitCount = 20) {
  const q = query(
    collection(db, 'users', userId, 'workouts'),
    where('status', '==', 'completed'),
    orderBy('startedAt', 'desc'),
    limit(limitCount),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as WorkoutDocument);
}

export async function saveWorkout(userId: string, workout: Omit<WorkoutDocument, 'id'>) {
  const ref = await addDoc(collection(db, 'users', userId, 'workouts'), workout);
  return ref.id;
}

// Nutrition operations
export async function getNutritionDay(userId: string, date: string) {
  const snap = await getDoc(doc(db, 'users', userId, 'nutritionDays', date));
  return snap.exists() ? (snap.data() as NutritionDayDocument) : null;
}

export async function saveNutritionDay(userId: string, date: string, data: NutritionDayDocument) {
  await setDoc(doc(db, 'users', userId, 'nutritionDays', date), data);
}

// Follow operations
export async function followUser(followerId: string, followingId: string) {
  const docId = `${followerId}_${followingId}`;
  await setDoc(doc(db, 'follows', docId), {
    followerId,
    followingId,
    createdAt: serverTimestamp(),
  });
}

export async function unfollowUser(followerId: string, followingId: string) {
  const docId = `${followerId}_${followingId}`;
  await deleteDoc(doc(db, 'follows', docId));
}

export async function isFollowing(followerId: string, followingId: string) {
  const docId = `${followerId}_${followingId}`;
  const snap = await getDoc(doc(db, 'follows', docId));
  return snap.exists();
}
