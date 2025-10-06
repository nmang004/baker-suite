/**
 * React Query hooks for timeline operations
 */

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  listTimelines,
  getTimeline,
  createTimeline,
  updateTimelineStatus,
  deleteTimeline,
  getWeather,
  type Timeline,
  type CreateTimelineInput,
  type UpdateTimelineStatusInput,
  type ListTimelinesParams,
} from '../api/timelines';
import { apiClient } from '../api/client';

/**
 * Hook to list timelines with optional filtering
 */
export function useTimelines(params?: ListTimelinesParams) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  return useQuery({
    queryKey: ['timelines', params],
    queryFn: async () => {
      const response = await listTimelines(params);
      return response.data || [];
    },
    enabled: isSignedIn,
  });
}

/**
 * Hook to get a single timeline
 */
export function useTimeline(id: string) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  return useQuery({
    queryKey: ['timeline', id],
    queryFn: async () => {
      const response = await getTimeline(id);
      return response.data;
    },
    enabled: isSignedIn && !!id,
    refetchInterval: (query) => {
      // Auto-refetch every 30 seconds if timeline is active
      const timeline = query.state.data;
      if (timeline?.status === 'ACTIVE') {
        return 30000;
      }
      return false;
    },
  });
}

/**
 * Hook to create a timeline
 */
export function useCreateTimeline() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  return useMutation({
    mutationFn: async (input: CreateTimelineInput) => {
      const response = await createTimeline(input);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelines'] });
    },
  });
}

/**
 * Hook to update timeline status
 */
export function useUpdateTimelineStatus() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateTimelineStatusInput;
    }) => {
      const response = await updateTimelineStatus(id, input);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['timelines'] });
      queryClient.invalidateQueries({ queryKey: ['timeline', variables.id] });
    },
  });
}

/**
 * Hook to delete a timeline
 */
export function useDeleteTimeline() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteTimeline(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelines'] });
    },
  });
}

/**
 * Hook to get weather data for a location
 */
export function useWeather(location: string, enabled = true) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  return useQuery({
    queryKey: ['weather', location],
    queryFn: async () => {
      const response = await getWeather(location);
      return response.data;
    },
    enabled: isSignedIn && enabled && !!location,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}
