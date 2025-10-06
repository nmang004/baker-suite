/**
 * React Query hooks for starter operations
 */

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listStarters,
  getStarter,
  createStarter,
  updateStarter,
  deleteStarter,
  getStarterHealth,
  logFeeding,
  getFeedingHistory,
  updateFeeding,
  deleteFeeding,
  getFeedingStatistics,
  type Starter,
  type CreateStarterInput,
  type UpdateStarterInput,
  type ListStartersParams,
  type CreateFeedingInput,
  type UpdateFeedingInput,
  type ListFeedingsParams,
} from '../api/starters';

/**
 * Hook to list starters with pagination and filtering
 */
export function useStarters(params?: ListStartersParams) {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['starters', params],
    queryFn: async () => {
      const response = await listStarters(params);
      return response.data || [];
    },
    enabled: isSignedIn,
  });
}

/**
 * Hook to get a single starter
 */
export function useStarter(id: string) {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['starter', id],
    queryFn: async () => {
      const response = await getStarter(id);
      return response.data;
    },
    enabled: isSignedIn && !!id,
  });
}

/**
 * Hook to create a starter
 */
export function useCreateStarter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateStarterInput) => {
      const response = await createStarter(input);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate starters list to refetch
      queryClient.invalidateQueries({ queryKey: ['starters'] });
    },
  });
}

/**
 * Hook to update a starter
 */
export function useUpdateStarter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateStarterInput;
    }) => {
      const response = await updateStarter(id, input);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific starter
      queryClient.invalidateQueries({ queryKey: ['starters'] });
      queryClient.invalidateQueries({ queryKey: ['starter', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['starter-health', variables.id] });
    },
  });
}

/**
 * Hook to delete a starter
 */
export function useDeleteStarter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteStarter(id);
      return id;
    },
    onSuccess: () => {
      // Invalidate starters list
      queryClient.invalidateQueries({ queryKey: ['starters'] });
    },
  });
}

/**
 * Hook to get starter health metrics
 */
export function useStarterHealth(starterId: string) {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['starter-health', starterId],
    queryFn: async () => {
      const response = await getStarterHealth(starterId);
      return response.data;
    },
    enabled: isSignedIn && !!starterId,
  });
}

/**
 * Hook to log a feeding
 */
export function useLogFeeding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      starterId,
      input,
    }: {
      starterId: string;
      input: CreateFeedingInput;
    }) => {
      const response = await logFeeding(starterId, input);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate starter data, feedings, health, and starters list
      queryClient.invalidateQueries({ queryKey: ['starter', variables.starterId] });
      queryClient.invalidateQueries({ queryKey: ['starter-feedings', variables.starterId] });
      queryClient.invalidateQueries({ queryKey: ['starter-health', variables.starterId] });
      queryClient.invalidateQueries({ queryKey: ['starter-statistics', variables.starterId] });
      queryClient.invalidateQueries({ queryKey: ['starters'] });
    },
  });
}

/**
 * Hook to get feeding history
 */
export function useStarterFeedings(starterId: string, params?: ListFeedingsParams) {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['starter-feedings', starterId, params],
    queryFn: async () => {
      const response = await getFeedingHistory(starterId, params);
      return response.data || [];
    },
    enabled: isSignedIn && !!starterId,
  });
}

/**
 * Hook to update a feeding
 */
export function useUpdateFeeding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      starterId,
      feedingId,
      input,
    }: {
      starterId: string;
      feedingId: string;
      input: UpdateFeedingInput;
    }) => {
      const response = await updateFeeding(starterId, feedingId, input);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate feedings, health, and statistics
      queryClient.invalidateQueries({ queryKey: ['starter-feedings', variables.starterId] });
      queryClient.invalidateQueries({ queryKey: ['starter-health', variables.starterId] });
      queryClient.invalidateQueries({ queryKey: ['starter-statistics', variables.starterId] });
      queryClient.invalidateQueries({ queryKey: ['starter', variables.starterId] });
    },
  });
}

/**
 * Hook to delete a feeding
 */
export function useDeleteFeeding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      starterId,
      feedingId,
    }: {
      starterId: string;
      feedingId: string;
    }) => {
      await deleteFeeding(starterId, feedingId);
      return { starterId, feedingId };
    },
    onSuccess: (data) => {
      // Invalidate feedings, health, statistics, and starter data
      queryClient.invalidateQueries({ queryKey: ['starter-feedings', data.starterId] });
      queryClient.invalidateQueries({ queryKey: ['starter-health', data.starterId] });
      queryClient.invalidateQueries({ queryKey: ['starter-statistics', data.starterId] });
      queryClient.invalidateQueries({ queryKey: ['starter', data.starterId] });
      queryClient.invalidateQueries({ queryKey: ['starters'] });
    },
  });
}

/**
 * Hook to get feeding statistics
 */
export function useStarterStatistics(starterId: string) {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['starter-statistics', starterId],
    queryFn: async () => {
      const response = await getFeedingStatistics(starterId);
      return response.data;
    },
    enabled: isSignedIn && !!starterId,
  });
}
