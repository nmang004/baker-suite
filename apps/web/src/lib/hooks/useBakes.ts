/**
 * React Query hooks for bake operations
 */

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  listBakes,
  getBake,
  createBake,
  updateBake,
  deleteBake,
  getBakeStats,
  getBakesByRecipe,
  type Bake,
  type CreateBakeInput,
  type UpdateBakeInput,
  type ListBakesParams,
} from '../api/bakes';
import { apiClient } from '../api/client';

/**
 * Hook to list bakes with pagination and filtering
 */
export function useBakes(params?: ListBakesParams) {
  const { getToken, isSignedIn } = useAuth();

  // Set token getter for API client
  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  return useQuery({
    queryKey: ['bakes', params],
    queryFn: async () => {
      const response = await listBakes(params);
      return response.data || [];
    },
    enabled: isSignedIn,
  });
}

/**
 * Hook to get a single bake
 */
export function useBake(id: string) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  return useQuery({
    queryKey: ['bake', id],
    queryFn: async () => {
      const response = await getBake(id);
      return response.data;
    },
    enabled: isSignedIn && !!id,
  });
}

/**
 * Hook to create a bake
 */
export function useCreateBake() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  return useMutation({
    mutationFn: async (input: CreateBakeInput) => {
      const response = await createBake(input);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate bakes list and stats to refetch
      queryClient.invalidateQueries({ queryKey: ['bakes'] });
      queryClient.invalidateQueries({ queryKey: ['bake-stats'] });
    },
  });
}

/**
 * Hook to update a bake
 */
export function useUpdateBake() {
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
      input: UpdateBakeInput;
    }) => {
      const response = await updateBake(id, input);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific bake
      queryClient.invalidateQueries({ queryKey: ['bakes'] });
      queryClient.invalidateQueries({ queryKey: ['bake', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['bake-stats'] });
    },
  });
}

/**
 * Hook to delete a bake
 */
export function useDeleteBake() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteBake(id);
      return id;
    },
    onSuccess: () => {
      // Invalidate bakes list and stats
      queryClient.invalidateQueries({ queryKey: ['bakes'] });
      queryClient.invalidateQueries({ queryKey: ['bake-stats'] });
    },
  });
}

/**
 * Hook to get user's baking statistics
 */
export function useBakeStats() {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  return useQuery({
    queryKey: ['bake-stats'],
    queryFn: async () => {
      const response = await getBakeStats();
      return response.data;
    },
    enabled: isSignedIn,
  });
}

/**
 * Hook to get bakes for a specific recipe
 */
export function useBakesByRecipe(recipeId: string) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  return useQuery({
    queryKey: ['bakes-by-recipe', recipeId],
    queryFn: async () => {
      const response = await getBakesByRecipe(recipeId);
      return response.data;
    },
    enabled: isSignedIn && !!recipeId,
  });
}
