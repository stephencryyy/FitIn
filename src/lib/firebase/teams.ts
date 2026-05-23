import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
  increment,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './config';
import { TeamDocument, TeamMemberDocument } from '@/src/types/social';

export interface CreateTeamInput {
  name: string;
  description: string;
  isPublic: boolean;
  goal?: string | null;
}

export async function createTeam(
  user: { uid: string; displayName: string; photoURL: string | null },
  input: CreateTeamInput,
): Promise<string> {
  const teamRef = doc(collection(db, 'teams'));
  const memberRef = doc(db, 'teams', teamRef.id, 'members', user.uid);

  const batch = writeBatch(db);
  batch.set(teamRef, {
    name: input.name,
    description: input.description,
    photoURL: null,
    createdBy: user.uid,
    createdAt: serverTimestamp(),
    memberCount: 1,
    goal: input.goal ?? null,
    isPublic: input.isPublic,
  });
  batch.set(memberRef, {
    userId: user.uid,
    displayName: user.displayName,
    photoURL: user.photoURL,
    role: 'owner',
    joinedAt: serverTimestamp(),
    stats: { weeklyWorkouts: 0, weeklyVolume: 0 },
  });
  // Mirror membership on the user doc so getMyTeams works without a
  // collectionGroup index (which has to be deployed separately).
  batch.set(doc(db, 'users', user.uid), { teamIds: arrayUnion(teamRef.id) }, { merge: true });

  await batch.commit();
  return teamRef.id;
}

export async function getPublicTeams(limitCount = 30): Promise<TeamDocument[]> {
  const q = query(
    collection(db, 'teams'),
    where('isPublic', '==', true),
    orderBy('memberCount', 'desc'),
    limit(limitCount),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TeamDocument);
}

export async function getMyTeams(userId: string): Promise<TeamDocument[]> {
  // Primary path: the user doc carries a `teamIds` array, maintained by
  // create/join/leave. No special index required.
  const userSnap = await getDoc(doc(db, 'users', userId));
  let ids: string[] = (userSnap.data()?.teamIds as string[] | undefined) ?? [];

  // Fallback for memberships created before `teamIds` existed: collectionGroup
  // query (requires the members.userId collectionGroup index to be deployed).
  if (ids.length === 0) {
    try {
      const q = query(collectionGroup(db, 'members'), where('userId', '==', userId));
      const memberDocs = await getDocs(q);
      ids = memberDocs.docs
        .map((d) => d.ref.parent.parent?.id)
        .filter((id): id is string => !!id);
    } catch {
      // collectionGroup index not deployed — degrade to whatever teamIds had.
      ids = [];
    }
  }

  const uniqueIds = [...new Set(ids)];
  if (uniqueIds.length === 0) return [];

  const teams = await Promise.all(uniqueIds.map((id) => getDoc(doc(db, 'teams', id))));
  return teams
    .filter((t) => t.exists())
    .map((t) => ({ id: t.id, ...t.data() }) as TeamDocument)
    .sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0));
}

export async function getTeam(teamId: string): Promise<TeamDocument | null> {
  const snap = await getDoc(doc(db, 'teams', teamId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as TeamDocument;
}

export async function getTeamMembers(teamId: string): Promise<(TeamMemberDocument & { id: string })[]> {
  const snap = await getDocs(collection(db, 'teams', teamId, 'members'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TeamMemberDocument & { id: string });
}

export async function isTeamMember(teamId: string, userId: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'teams', teamId, 'members', userId));
  return snap.exists();
}

export async function joinTeam(
  teamId: string,
  user: { uid: string; displayName: string; photoURL: string | null },
): Promise<void> {
  const batch = writeBatch(db);
  batch.set(doc(db, 'teams', teamId, 'members', user.uid), {
    userId: user.uid,
    displayName: user.displayName,
    photoURL: user.photoURL,
    role: 'member',
    joinedAt: serverTimestamp(),
    stats: { weeklyWorkouts: 0, weeklyVolume: 0 },
  });
  batch.update(doc(db, 'teams', teamId), { memberCount: increment(1) });
  batch.set(doc(db, 'users', user.uid), { teamIds: arrayUnion(teamId) }, { merge: true });
  await batch.commit();
}

export async function leaveTeam(teamId: string, userId: string): Promise<void> {
  // Don't allow owner to leave (they'd have to delete the team or transfer ownership)
  const memberSnap = await getDoc(doc(db, 'teams', teamId, 'members', userId));
  if (!memberSnap.exists()) return;
  if (memberSnap.data().role === 'owner') {
    throw new Error('Owner cannot leave team');
  }

  const batch = writeBatch(db);
  batch.delete(doc(db, 'teams', teamId, 'members', userId));
  batch.update(doc(db, 'teams', teamId), { memberCount: increment(-1) });
  batch.set(doc(db, 'users', userId), { teamIds: arrayRemove(teamId) }, { merge: true });
  await batch.commit();
}

/**
 * Delete a team and all of its subcollections. Owner-only.
 *
 * NOTE: Firestore batch is capped at 500 ops. For very large teams we'd need
 * to chunk the deletes; this implementation assumes < ~200 members and
 * < ~200 messages (the common case). For full-scale teardown a Cloud Function
 * trigger on team-deletion would be more robust.
 */
export async function deleteTeam(teamId: string): Promise<void> {
  const teamRef = doc(db, 'teams', teamId);
  const [teamSnap, membersSnap, messagesSnap] = await Promise.all([
    getDoc(teamRef),
    getDocs(collection(db, 'teams', teamId, 'members')),
    getDocs(collection(db, 'teams', teamId, 'messages')),
  ]);

  const batch = writeBatch(db);
  membersSnap.docs.forEach((m) => batch.delete(m.ref));
  messagesSnap.docs.forEach((m) => batch.delete(m.ref));
  batch.delete(teamRef);
  // Clean the creator's mirrored teamIds so the deleted team disappears from
  // their "My teams" list immediately. Other members' stale ids are harmless —
  // getMyTeams filters out teams that no longer exist.
  const createdBy = teamSnap.data()?.createdBy as string | undefined;
  if (createdBy) {
    batch.set(doc(db, 'users', createdBy), { teamIds: arrayRemove(teamId) }, { merge: true });
  }
  await batch.commit();
}
