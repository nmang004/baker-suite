/**
 * React Query hooks for flavor pairing operations
 */

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  getPairingsForIngredient,
  searchPairings,
  getPairingsByCompound,
  analyzeIngredients,
  suggestIngredientsForRecipe,
  getTrendingPairings,
  getAllIngredients,
  getAllCuisines,
  getAllCompounds,
  getRecipeInsights,
  type SearchPairingsParams,
  type AnalyzeIngredientsInput,
} from '../api/flavor';
import { apiClient } from '../api/client';

/**
 * Hook to get pairings for a specific ingredient
 */
export function useFlavorPairings(ingredient: string, limit?: number) {
  return useQuery({
    queryKey: ['flavor-pairings', ingredient, limit],
    queryFn: () => getPairingsForIngredient(ingredient, limit),
    enabled: !!ingredient,
  });
}

/**
 * Hook to search pairings with filters
 */
export function useSearchPairings(params: SearchPairingsParams) {
  return useQuery({
    queryKey: ['search-pairings', params],
    queryFn: () => searchPairings(params),
    enabled: !!(params.ingredient || params.category || params.cuisine),
  });
}

/**
 * Hook to get pairings by compound
 */
export function usePairingsByCompound(compound: string, limit?: number) {
  return useQuery({
    queryKey: ['pairings-by-compound', compound, limit],
    queryFn: () => getPairingsByCompound(compound, limit),
    enabled: !!compound,
  });
}

/**
 * Hook to analyze ingredients
 */
export function useAnalyzeIngredients() {
  return useMutation({
    mutationFn: (input: AnalyzeIngredientsInput) => analyzeIngredients(input),
  });
}

/**
 * Hook to suggest ingredients for a recipe
 */
export function useSuggestIngredients(recipeId?: string, limit?: number) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  return useQuery({
    queryKey: ['suggest-ingredients', recipeId, limit],
    queryFn: () => suggestIngredientsForRecipe(recipeId!, limit),
    enabled: isSignedIn && !!recipeId,
  });
}

/**
 * Hook to get trending pairings
 */
export function useTrendingPairings(limit?: number) {
  return useQuery({
    queryKey: ['trending-pairings', limit],
    queryFn: () => getTrendingPairings(limit),
  });
}

/**
 * Hook to get all available ingredients
 */
export function useAllIngredients() {
  return useQuery({
    queryKey: ['all-ingredients'],
    queryFn: getAllIngredients,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
}

/**
 * Hook to get all available cuisines
 */
export function useAllCuisines() {
  return useQuery({
    queryKey: ['all-cuisines'],
    queryFn: getAllCuisines,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
}

/**
 * Hook to get all flavor compounds
 */
export function useAllCompounds() {
  return useQuery({
    queryKey: ['all-compounds'],
    queryFn: getAllCompounds,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
}

/**
 * Hook to get recipe insights
 */
export function useRecipeInsights(recipeId?: string) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  return useQuery({
    queryKey: ['recipe-insights', recipeId],
    queryFn: () => getRecipeInsights(recipeId!),
    enabled: isSignedIn && !!recipeId,
  });
}
