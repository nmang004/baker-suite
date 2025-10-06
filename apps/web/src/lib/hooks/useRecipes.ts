/**
 * React Query hooks for recipe operations
 */

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  listRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  type Recipe,
  type CreateRecipeInput,
  type UpdateRecipeInput,
  type ListRecipesParams,
} from '../api/recipes';
import { apiClient } from '../api/client';

/**
 * Hook to list recipes with pagination and filtering
 */
export function useRecipes(params?: ListRecipesParams) {
  const { getToken, isSignedIn } = useAuth();

  // Set token getter for API client
  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  return useQuery({
    queryKey: ['recipes', params],
    queryFn: async () => {
      const response = await listRecipes(params);
      return response.data || [];
    },
    enabled: isSignedIn,
  });
}

/**
 * Hook to get a single recipe
 */
export function useRecipe(id: string) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  return useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      const response = await getRecipe(id);
      return response.data;
    },
    enabled: isSignedIn && !!id,
  });
}

/**
 * Hook to create a recipe
 */
export function useCreateRecipe() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  return useMutation({
    mutationFn: async (input: CreateRecipeInput) => {
      const response = await createRecipe(input);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate recipes list to refetch
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}

/**
 * Hook to update a recipe
 */
export function useUpdateRecipe() {
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
      input: UpdateRecipeInput;
    }) => {
      const response = await updateRecipe(id, input);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific recipe
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipe', variables.id] });
    },
  });
}

/**
 * Hook to delete a recipe
 */
export function useDeleteRecipe() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteRecipe(id);
      return id;
    },
    onSuccess: () => {
      // Invalidate recipes list
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}
