/**
 * Flavor Pairing API functions
 */

import { apiClient, ApiResponse } from './client';

// Types matching backend
export interface FlavorPairing {
  id: string;
  ingredient1: string;
  ingredient2: string;
  confidence: number;
  compounds: string[];
  cuisine: string[];
  category: string;
  createdAt: string;
}

export interface SearchPairingsParams {
  ingredient?: string;
  category?: 'sweet' | 'savory';
  cuisine?: string;
  minConfidence?: number;
  limit?: number;
}

export interface AnalyzeIngredientsInput {
  ingredients: string[];
  recipeContext?: 'bread' | 'pastry' | 'cake' | 'cookie' | 'other';
}

export interface IngredientAnalysis {
  ingredients: string[];
  pairings: Array<{
    ingredient1: string;
    ingredient2: string;
    confidence: number;
    compounds: string[];
  }>;
  flavorProfile: {
    dominant: string[];
    supporting: string[];
    compounds: string[];
  };
  complexity: number;
  suggestions: Array<{
    ingredient: string;
    reason: string;
    confidence: number;
  }>;
}

export interface EnhancementSuggestion {
  ingredient: string;
  reason: string;
  type: 'flavor' | 'texture' | 'visual';
  confidence: number;
}

export interface RecipeInsights {
  analysis: IngredientAnalysis;
  flavorProfiles: {
    profiles: Array<{ type: string; strength: number }>;
    category: string;
  };
  enhancements: EnhancementSuggestion[];
}

/**
 * Get pairings for a specific ingredient
 */
export async function getPairingsForIngredient(
  ingredient: string,
  limit?: number
): Promise<FlavorPairing[]> {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());

  const response = await apiClient.get<FlavorPairing[]>(
    `/flavor/pairings/${encodeURIComponent(ingredient)}${params.toString() ? `?${params}` : ''}`
  );
  return response.data || [];
}

/**
 * Search pairings with filters
 */
export async function searchPairings(
  params: SearchPairingsParams
): Promise<FlavorPairing[]> {
  const searchParams = new URLSearchParams();

  if (params.ingredient) searchParams.append('ingredient', params.ingredient);
  if (params.category) searchParams.append('category', params.category);
  if (params.cuisine) searchParams.append('cuisine', params.cuisine);
  if (params.minConfidence !== undefined)
    searchParams.append('minConfidence', params.minConfidence.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());

  const response = await apiClient.get<FlavorPairing[]>(
    `/flavor/pairings?${searchParams}`
  );
  return response.data || [];
}

/**
 * Get pairings by flavor compound
 */
export async function getPairingsByCompound(
  compound: string,
  limit?: number
): Promise<FlavorPairing[]> {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());

  const response = await apiClient.get<FlavorPairing[]>(
    `/flavor/compounds/${encodeURIComponent(compound)}${params.toString() ? `?${params}` : ''}`
  );
  return response.data || [];
}

/**
 * Analyze ingredient combination
 */
export async function analyzeIngredients(
  input: AnalyzeIngredientsInput
): Promise<IngredientAnalysis> {
  const response = await apiClient.post<IngredientAnalysis>(
    '/flavor/analyze',
    input
  );
  return response.data!;
}

/**
 * Suggest ingredients for a recipe
 */
export async function suggestIngredientsForRecipe(
  recipeId: string,
  limit?: number
): Promise<EnhancementSuggestion[]> {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());

  const response = await apiClient.get<EnhancementSuggestion[]>(
    `/flavor/suggest/${recipeId}${params.toString() ? `?${params}` : ''}`
  );
  return response.data || [];
}

/**
 * Get trending pairings
 */
export async function getTrendingPairings(
  limit?: number
): Promise<FlavorPairing[]> {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());

  const response = await apiClient.get<FlavorPairing[]>(
    `/flavor/trending${params.toString() ? `?${params}` : ''}`
  );
  return response.data || [];
}

/**
 * Get all available ingredients
 */
export async function getAllIngredients(): Promise<string[]> {
  const response = await apiClient.get<string[]>('/flavor/ingredients');
  return response.data || [];
}

/**
 * Get all available cuisines
 */
export async function getAllCuisines(): Promise<string[]> {
  const response = await apiClient.get<string[]>('/flavor/cuisines');
  return response.data || [];
}

/**
 * Get all flavor compounds
 */
export async function getAllCompounds(): Promise<string[]> {
  const response = await apiClient.get<string[]>('/flavor/compounds');
  return response.data || [];
}

/**
 * Get comprehensive flavor insights for a recipe
 */
export async function getRecipeInsights(
  recipeId: string
): Promise<RecipeInsights> {
  const response = await apiClient.get<RecipeInsights>(
    `/flavor/insights/${recipeId}`
  );
  return response.data!;
}
