/**
 * Recipe Discovery API functions
 */

import { apiClient, ApiResponse } from './client';

// Types matching backend
export interface RecipeWithScore {
  id: string;
  userId: string;
  name: string;
  description?: string;
  ingredients: any[];
  instructions: any;
  tags: string[];
  ratios: any;
  createdAt: string;
  updatedAt: string;
  score?: number;
  matchScore?: number;
  reason?: string;
  feedType?: string;
}

export interface DiscoverRecipesParams {
  page?: number;
  limit?: number;
  ingredients?: string;
  tags?: string;
  excludeIngredients?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  maxTime?: number;
  sortBy?: 'relevance' | 'rating' | 'recent' | 'popular';
}

export interface SearchRecipesParams {
  ingredients: string;
  excludeIngredients?: string;
  limit?: number;
}

export interface RecommendationsParams {
  limit?: number;
  type?: 'similar' | 'new' | 'seasonal' | 'personalized';
  excludeBaked?: boolean;
}

/**
 * Discover recipes with filters
 */
export async function discoverRecipes(
  params: DiscoverRecipesParams
): Promise<ApiResponse<RecipeWithScore[]>> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.ingredients) searchParams.append('ingredients', params.ingredients);
  if (params.tags) searchParams.append('tags', params.tags);
  if (params.excludeIngredients)
    searchParams.append('excludeIngredients', params.excludeIngredients);
  if (params.difficulty) searchParams.append('difficulty', params.difficulty);
  if (params.maxTime) searchParams.append('maxTime', params.maxTime.toString());
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);

  return apiClient.get<RecipeWithScore[]>(`/discovery/recipes?${searchParams}`);
}

/**
 * Search recipes by ingredients
 */
export async function searchRecipesByIngredients(
  params: SearchRecipesParams
): Promise<RecipeWithScore[]> {
  const searchParams = new URLSearchParams();
  searchParams.append('ingredients', params.ingredients);

  if (params.excludeIngredients)
    searchParams.append('excludeIngredients', params.excludeIngredients);
  if (params.limit) searchParams.append('limit', params.limit.toString());

  const response = await apiClient.get<RecipeWithScore[]>(
    `/discovery/search?${searchParams}`
  );
  return response.data || [];
}

/**
 * Get personalized recipe recommendations
 */
export async function getRecommendations(
  params: RecommendationsParams = {}
): Promise<RecipeWithScore[]> {
  const searchParams = new URLSearchParams();

  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.type) searchParams.append('type', params.type);
  if (params.excludeBaked !== undefined)
    searchParams.append('excludeBaked', params.excludeBaked.toString());

  const response = await apiClient.get<RecipeWithScore[]>(
    `/discovery/recommendations${searchParams.toString() ? `?${searchParams}` : ''}`
  );
  return response.data || [];
}

/**
 * Get "What to bake next" suggestion
 */
export async function getWhatToMakeNext(): Promise<RecipeWithScore | null> {
  const response = await apiClient.get<RecipeWithScore | null>(
    '/discovery/next'
  );
  return response.data || null;
}

/**
 * Find similar recipes to a given recipe
 */
export async function getSimilarRecipes(
  recipeId: string,
  limit?: number
): Promise<RecipeWithScore[]> {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());

  const response = await apiClient.get<RecipeWithScore[]>(
    `/discovery/similar/${recipeId}${params.toString() ? `?${params}` : ''}`
  );
  return response.data || [];
}

/**
 * Get trending recipes
 */
export async function getTrendingRecipes(
  limit?: number
): Promise<RecipeWithScore[]> {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());

  const response = await apiClient.get<RecipeWithScore[]>(
    `/discovery/trending${params.toString() ? `?${params}` : ''}`
  );
  return response.data || [];
}

/**
 * Get personalized discovery feed
 */
export async function getDiscoveryFeed(
  limit?: number
): Promise<RecipeWithScore[]> {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());

  const response = await apiClient.get<RecipeWithScore[]>(
    `/discovery/feed${params.toString() ? `?${params}` : ''}`
  );
  return response.data || [];
}
