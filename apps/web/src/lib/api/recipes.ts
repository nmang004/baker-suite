/**
 * Recipe API functions
 */

import { apiClient, ApiResponse } from './client';

// Types matching backend
export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  percentage?: number;
}

export interface BakerRatios {
  flour: number;
  water: number;
  salt: number;
  yeast?: number;
  starter?: number;
  [key: string]: number | undefined;
}

export interface Recipe {
  id: string;
  userId: string;
  name: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string[];
  tags: string[];
  ratios: BakerRatios;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipeInput {
  name: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string[];
  tags?: string[];
  ratios: BakerRatios;
}

export interface UpdateRecipeInput {
  name?: string;
  description?: string;
  ingredients?: Ingredient[];
  instructions?: string[];
  tags?: string[];
  ratios?: BakerRatios;
}

export interface ListRecipesParams {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

/**
 * List user's recipes
 */
export async function listRecipes(
  params?: ListRecipesParams
): Promise<ApiResponse<Recipe[]>> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.tags) queryParams.append('tags', params.tags);
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const query = queryParams.toString();
  const endpoint = `/recipes${query ? `?${query}` : ''}`;

  return apiClient.get<Recipe[]>(endpoint);
}

/**
 * Get a single recipe by ID
 */
export async function getRecipe(id: string): Promise<ApiResponse<Recipe>> {
  return apiClient.get<Recipe>(`/recipes/${id}`);
}

/**
 * Create a new recipe
 */
export async function createRecipe(
  input: CreateRecipeInput
): Promise<ApiResponse<Recipe>> {
  return apiClient.post<Recipe>('/recipes', input);
}

/**
 * Update an existing recipe
 */
export async function updateRecipe(
  id: string,
  input: UpdateRecipeInput
): Promise<ApiResponse<Recipe>> {
  return apiClient.put<Recipe>(`/recipes/${id}`, input);
}

/**
 * Delete a recipe
 */
export async function deleteRecipe(id: string): Promise<ApiResponse<void>> {
  return apiClient.delete<void>(`/recipes/${id}`);
}
