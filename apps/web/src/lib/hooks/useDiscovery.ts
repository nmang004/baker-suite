/**
 * React Query hooks for recipe discovery operations
 */

import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  discoverRecipes,
  searchRecipesByIngredients,
  getRecommendations,
  getWhatToMakeNext,
  getSimilarRecipes,
  getTrendingRecipes,
  getDiscoveryFeed,
  type DiscoverRecipesParams,
  type SearchRecipesParams,
  type RecommendationsParams,
} from '../api/discovery';
import { apiClient } from '../api/client';

/**
 * Hook to discover recipes with filters
 */
export function useDiscoverRecipes(params: DiscoverRecipesParams) {
  return useQuery({
    queryKey: ['discover-recipes', params],
    queryFn: () => discoverRecipes(params),
  });
}

/**
 * Hook to search recipes by ingredients
 */
export function useSearchRecipes(params: SearchRecipesParams) {
  return useQuery({
    queryKey: ['search-recipes', params],
    queryFn: () => searchRecipesByIngredients(params),
    enabled: !!params.ingredients,
  });
}

/**
 * Hook to get personalized recommendations
 */
export function useRecommendations(params: RecommendationsParams = {}) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  return useQuery({
    queryKey: ['recommendations', params],
    queryFn: () => getRecommendations(params),
    enabled: isSignedIn,
  });
}

/**
 * Hook to get "What to bake next" suggestion
 */
export function useWhatToMakeNext() {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  return useQuery({
    queryKey: ['what-to-make-next'],
    queryFn: getWhatToMakeNext,
    enabled: isSignedIn,
  });
}

/**
 * Hook to find similar recipes
 */
export function useSimilarRecipes(recipeId?: string, limit?: number) {
  return useQuery({
    queryKey: ['similar-recipes', recipeId, limit],
    queryFn: () => getSimilarRecipes(recipeId!, limit),
    enabled: !!recipeId,
  });
}

/**
 * Hook to get trending recipes
 */
export function useTrendingRecipes(limit?: number) {
  return useQuery({
    queryKey: ['trending-recipes', limit],
    queryFn: () => getTrendingRecipes(limit),
  });
}

/**
 * Hook to get personalized discovery feed
 */
export function useDiscoveryFeed(limit?: number) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  return useQuery({
    queryKey: ['discovery-feed', limit],
    queryFn: () => getDiscoveryFeed(limit),
    enabled: isSignedIn,
  });
}
