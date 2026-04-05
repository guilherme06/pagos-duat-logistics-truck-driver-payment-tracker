import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, TripCategory, TripRecord, OtrosEntry, MonthlyBreakdown } from '../backend';

// User Profile Queries
export function useUserProfile(userId?: string) {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!actor || !userId) return null;
      return actor.getUserProfile(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useCreateUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, name, companyName, salary, language, monthlyGoal }: { userId: string; name: string; companyName: string; salary: bigint; language: string; monthlyGoal: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createUserProfile(userId, name, companyName, salary, language, monthlyGoal);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] });
    },
  });
}

export function useUpdateUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, name, companyName, salary, language, monthlyGoal }: { userId: string; name: string; companyName: string; salary: bigint; language: string; monthlyGoal: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateUserProfile(userId, name, companyName, salary, language, monthlyGoal);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] });
    },
  });
}

// Trip Categories Queries
export function useTripCategories(userId?: string) {
  const { actor, isFetching } = useActor();

  return useQuery<TripCategory[]>({
    queryKey: ['tripCategories', userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getTripCategories(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useAddTripCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, name, defaultAmount }: { userId: string; name: string; defaultAmount: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTripCategory(userId, name, defaultAmount);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tripCategories', variables.userId] });
    },
  });
}

export function useUpdateTripCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ categoryId, name, defaultAmount }: { categoryId: string; name: string; defaultAmount: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTripCategory(categoryId, name, defaultAmount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tripCategories'] });
    },
  });
}

export function useDeleteTripCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTripCategory(categoryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tripCategories'] });
    },
  });
}

// Trip Records Queries
export function useTripRecords(userId?: string) {
  const { actor, isFetching } = useActor();

  return useQuery<TripRecord[]>({
    queryKey: ['tripRecords', userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getTripRecords(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useAddTripRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, categoryId, amount, date }: { userId: string; categoryId: string; amount: bigint; date: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTripRecord(userId, categoryId, amount, date);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tripRecords', variables.userId] });
    },
  });
}

export function useUpdateTripRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recordId, categoryId, amount, date }: { recordId: string; categoryId: string; amount: bigint; date: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTripRecord(recordId, categoryId, amount, date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tripRecords'] });
    },
  });
}

export function useDeleteTripRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recordId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTripRecord(recordId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tripRecords'] });
    },
  });
}

// Otros Entries Queries
export function useOtrosEntries(userId?: string) {
  const { actor, isFetching } = useActor();

  return useQuery<OtrosEntry[]>({
    queryKey: ['otrosEntries', userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getOtrosEntries(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useAddOtrosEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, description, amount, date, entryType }: { userId: string; description: string; amount: bigint; date: bigint; entryType: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addOtrosEntry(userId, description, amount, date, entryType);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['otrosEntries', variables.userId] });
    },
  });
}

export function useUpdateOtrosEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ entryId, description, amount, date, entryType }: { entryId: string; description: string; amount: bigint; date: bigint; entryType: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOtrosEntry(entryId, description, amount, date, entryType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['otrosEntries'] });
    },
  });
}

export function useDeleteOtrosEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteOtrosEntry(entryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['otrosEntries'] });
    },
  });
}

// Monthly Breakdown Queries
export function useMonthlyBreakdown(userId?: string, month?: number) {
  const { actor, isFetching } = useActor();

  return useQuery<MonthlyBreakdown>({
    queryKey: ['monthlyBreakdown', userId, month],
    queryFn: async () => {
      if (!actor || !userId || month === undefined) {
        return {
          categorySummaries: [],
          entryTypeSummaries: [],
          totalTrips: BigInt(0),
          totalExtras: BigInt(0),
          totalExpenses: BigInt(0),
          netBalance: BigInt(0),
        };
      }
      return actor.getMonthlyBreakdown(userId, BigInt(month));
    },
    enabled: !!actor && !isFetching && !!userId && month !== undefined,
  });
}

// Positive Phrases Queries
export function useRandomPositivePhrase() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['randomPositivePhrase'],
    queryFn: async () => {
      if (!actor) return 'Este es mi resumen mensual';
      return actor.getRandomPositivePhrase();
    },
    enabled: !!actor && !isFetching,
  });
}
