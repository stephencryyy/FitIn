import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createTeam,
  getPublicTeams,
  getMyTeams,
  getTeam,
  getTeamMembers,
  isTeamMember,
  joinTeam,
  leaveTeam,
  deleteTeam,
  CreateTeamInput,
} from '@/src/lib/firebase/teams';

export function usePublicTeams() {
  return useQuery({
    queryKey: ['teams', 'public'],
    queryFn: () => getPublicTeams(),
    staleTime: 60 * 1000,
  });
}

export function useMyTeams(userId: string | undefined) {
  return useQuery({
    queryKey: ['teams', 'mine', userId],
    queryFn: () => (userId ? getMyTeams(userId) : Promise.resolve([])),
    enabled: !!userId,
    // Membership changes (create/join/leave) need to be visible immediately
    // when the user navigates back to the teams list — keep this query lively.
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useTeam(teamId: string | undefined) {
  return useQuery({
    queryKey: ['team', teamId],
    queryFn: () => (teamId ? getTeam(teamId) : Promise.resolve(null)),
    enabled: !!teamId,
  });
}

export function useTeamMembers(teamId: string | undefined) {
  return useQuery({
    queryKey: ['team-members', teamId],
    queryFn: () => (teamId ? getTeamMembers(teamId) : Promise.resolve([])),
    enabled: !!teamId,
  });
}

export function useIsTeamMember(teamId: string | undefined, userId: string | undefined) {
  return useQuery({
    queryKey: ['team-membership', teamId, userId],
    queryFn: () => (teamId && userId ? isTeamMember(teamId, userId) : Promise.resolve(false)),
    enabled: !!teamId && !!userId,
  });
}

export function useCreateTeam(user: {
  uid: string;
  displayName: string;
  photoURL: string | null;
} | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTeamInput) => {
      if (!user) throw new Error('Not signed in');
      return createTeam(user, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

export function useJoinTeam(user: {
  uid: string;
  displayName: string;
  photoURL: string | null;
} | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamId: string) => {
      if (!user) throw new Error('Not signed in');
      return joinTeam(teamId, user);
    },
    onSuccess: (_, teamId) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['team', teamId] });
      queryClient.invalidateQueries({ queryKey: ['team-members', teamId] });
      queryClient.invalidateQueries({ queryKey: ['team-membership', teamId, user?.uid] });
    },
  });
}

export function useLeaveTeam(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamId: string) => {
      if (!userId) throw new Error('Not signed in');
      return leaveTeam(teamId, userId);
    },
    onSuccess: (_, teamId) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['team', teamId] });
      queryClient.invalidateQueries({ queryKey: ['team-members', teamId] });
      queryClient.invalidateQueries({ queryKey: ['team-membership', teamId, userId] });
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamId: string) => deleteTeam(teamId),
    onSuccess: (_, teamId) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.removeQueries({ queryKey: ['team', teamId] });
      queryClient.removeQueries({ queryKey: ['team-members', teamId] });
    },
  });
}
