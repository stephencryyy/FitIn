import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  collectionGroup,
} from 'firebase/firestore';
import { db } from './config';
import { UserDocument } from '@/src/types/user';
import { WorkoutDocument } from '@/src/types/workout';

export interface PublicUser {
  id: string;
  displayName: string;
  username: string | null;
  photoURL: string | null;
  stats: UserDocument['stats'];
  profile: Pick<UserDocument['profile'], 'fitnessGoal' | 'experienceLevel'>;
}

export async function searchUsers(searchQuery: string, currentUserId?: string): Promise<PublicUser[]> {
  if (searchQuery.length < 2) return [];

  const term = searchQuery.toLowerCase().replace(/^@/, '');

  // Try direct username lookup first
  const usernameMatch = await getDoc(doc(db, 'usernames', term));
  const directMatchId = usernameMatch.exists() ? (usernameMatch.data().userId as string) : null;

  // Fetch public users and filter client-side
  const q = query(
    collection(db, 'users'),
    where('isPublic', '==', true),
    limit(50),
  );
  const snap = await getDocs(q);
  const results = snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as UserDocument) }))
    .filter((u) => {
      if (u.id === currentUserId) return false;
      const nameMatch = u.displayName?.toLowerCase().includes(term);
      const usernameMatches = u.username?.toLowerCase().includes(term);
      return nameMatch || usernameMatches;
    });

  // Make sure direct username match is first if present
  if (directMatchId && !results.find((u) => u.id === directMatchId)) {
    const direct = await getDoc(doc(db, 'users', directMatchId));
    if (direct.exists()) {
      const data = direct.data() as UserDocument;
      if (data.isPublic) {
        results.unshift({ id: direct.id, ...data });
      }
    }
  }

  return results.slice(0, 20).map((u) => ({
    id: u.id,
    displayName: u.displayName,
    username: u.username ?? null,
    photoURL: u.photoURL,
    stats: u.stats,
    profile: { fitnessGoal: u.profile.fitnessGoal, experienceLevel: u.profile.experienceLevel },
  }));
}

export async function getPublicUser(userId: string): Promise<PublicUser | null> {
  const snap = await getDoc(doc(db, 'users', userId));
  if (!snap.exists()) return null;
  const data = snap.data() as UserDocument;
  if (!data.isPublic) return null;
  return {
    id: snap.id,
    displayName: data.displayName,
    username: data.username ?? null,
    photoURL: data.photoURL,
    stats: data.stats,
    profile: { fitnessGoal: data.profile.fitnessGoal, experienceLevel: data.profile.experienceLevel },
  };
}

export async function getSuggestedUsers(currentUserId: string, excludeIds: string[] = []): Promise<PublicUser[]> {
  const q = query(
    collection(db, 'users'),
    where('isPublic', '==', true),
    limit(20),
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as UserDocument) }))
    .filter((u) => u.id !== currentUserId && !excludeIds.includes(u.id))
    .slice(0, 10)
    .map((u) => ({
      id: u.id,
      displayName: u.displayName,
      username: u.username ?? null,
      photoURL: u.photoURL,
      stats: u.stats,
      profile: { fitnessGoal: u.profile.fitnessGoal, experienceLevel: u.profile.experienceLevel },
    }));
}

export async function getUserWorkouts(userId: string, limitCount = 10): Promise<WorkoutDocument[]> {
  const q = query(
    collection(db, 'users', userId, 'workouts'),
    where('status', '==', 'completed'),
    orderBy('startedAt', 'desc'),
    limit(limitCount),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as WorkoutDocument);
}

export async function getFollowingIds(userId: string): Promise<string[]> {
  const q = query(collection(db, 'follows'), where('followerId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data().followingId as string);
}

export async function getFollowerCount(userId: string): Promise<number> {
  const q = query(collection(db, 'follows'), where('followingId', '==', userId));
  const snap = await getDocs(q);
  return snap.size;
}

export async function getFollowingCount(userId: string): Promise<number> {
  const q = query(collection(db, 'follows'), where('followerId', '==', userId));
  const snap = await getDocs(q);
  return snap.size;
}

export type FeedItem = WorkoutDocument & {
  userId: string;
  userName: string;
  userPhotoURL: string | null;
};

export interface FeedPage {
  items: FeedItem[];
  /** Millis of the oldest workout returned; pass to next call as `cursorMs` to load more. Null = end. */
  nextCursor: number | null;
}

export interface FeedQueryOptions {
  pageSize?: number;
  /** Return only workouts strictly older than this millis. */
  cursorMs?: number | null;
  /** Max number of followed users to fan-out to per page. */
  maxFollowedFanOut?: number;
}

/**
 * Feed of recent workouts from people the user follows.
 *
 * Cursor pagination: items are merged from per-followed-user queries,
 * sorted by `startedAt` desc, then sliced to `pageSize`. The oldest
 * returned timestamp becomes `nextCursor` — pass it back to fetch
 * the next page.
 *
 * Per-user fetches run in parallel (Promise.all) instead of serial.
 */
export async function getFeedWorkouts(
  userId: string,
  options: FeedQueryOptions = {},
): Promise<FeedPage> {
  const pageSize = options.pageSize ?? 15;
  const maxFanOut = options.maxFollowedFanOut ?? 20;
  const cursorMs = options.cursorMs ?? null;
  const perUserLimit = Math.max(3, Math.ceil(pageSize / 5));

  const followingIds = await getFollowingIds(userId);
  if (followingIds.length === 0) return { items: [], nextCursor: null };

  const sample = followingIds.slice(0, maxFanOut);

  const perUserResults = await Promise.all(
    sample.map(async (followedId): Promise<FeedItem[]> => {
      const userDoc = await getDoc(doc(db, 'users', followedId));
      if (!userDoc.exists()) return [];
      const userData = userDoc.data() as UserDocument;
      if (!userData.isPublic) return [];

      const constraints = [
        where('status', '==', 'completed'),
        orderBy('startedAt', 'desc'),
        limit(perUserLimit),
      ];
      const workoutsQ = query(
        collection(db, 'users', followedId, 'workouts'),
        ...constraints,
      );
      const workoutsSnap = await getDocs(workoutsQ);
      return workoutsSnap.docs.map((wd) => ({
        id: wd.id,
        ...(wd.data() as Omit<WorkoutDocument, 'id'>),
        userId: followedId,
        userName: userData.displayName,
        userPhotoURL: userData.photoURL,
      }));
    }),
  );

  let merged: FeedItem[] = perUserResults.flat();

  if (cursorMs !== null) {
    merged = merged.filter((w) => (w.startedAt?.toMillis?.() ?? 0) < cursorMs);
  }

  merged.sort((a, b) => {
    const aTime = a.startedAt?.toMillis?.() || 0;
    const bTime = b.startedAt?.toMillis?.() || 0;
    return bTime - aTime;
  });

  const items = merged.slice(0, pageSize);
  const oldestMs = items.length > 0
    ? items[items.length - 1].startedAt?.toMillis?.() ?? null
    : null;
  // Only return a nextCursor if we actually filled the page — otherwise we're at the end.
  const nextCursor = items.length === pageSize ? oldestMs : null;

  return { items, nextCursor };
}
