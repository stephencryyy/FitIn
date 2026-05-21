import { Timestamp } from 'firebase/firestore';

export type TrainerRelationStatus = 'pending' | 'active' | 'revoked';
export type TeamMemberRole = 'owner' | 'admin' | 'member';
export type TeamMessageType = 'text' | 'workout_share' | 'achievement';

export interface FollowDocument {
  followerId: string;
  followingId: string;
  createdAt: Timestamp;
}

export interface FollowCounts {
  followers: number;
  following: number;
}

export interface TrainerPermissions {
  viewWorkouts: boolean;
  modifyWorkoutPlans: boolean;
  viewNutrition: boolean;
}

export interface TrainerRelationDocument {
  trainerId: string;
  clientId: string;
  status: TrainerRelationStatus;
  permissions: TrainerPermissions;
  requestedAt: Timestamp;
  approvedAt: Timestamp | null;
}

export interface TeamDocument {
  id: string;
  name: string;
  description: string;
  photoURL: string | null;
  createdBy: string;
  createdAt: Timestamp;
  memberCount: number;
  goal: string | null;
  isPublic: boolean;
}

export interface TeamMemberDocument {
  userId: string;
  displayName: string;
  photoURL: string | null;
  role: TeamMemberRole;
  joinedAt: Timestamp;
  stats: {
    weeklyWorkouts: number;
    weeklyVolume: number;
  };
}

export interface TeamMessageDocument {
  senderId: string;
  senderName: string;
  text: string;
  createdAt: Timestamp;
  type: TeamMessageType;
  metadata: Record<string, unknown> | null;
}
