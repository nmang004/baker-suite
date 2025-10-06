/**
 * Bake API functions
 */

import { apiClient, ApiResponse } from './client';

// Types matching backend
export interface WeatherData {
  temperature?: number;
  humidity?: number;
  pressure?: number;
  location?: string;
  timestamp?: string;
}

export interface Bake {
  id: string;
  userId: string;
  recipeId: string;
  rating?: number;
  notes?: string;
  photos: string[];
  issues: string[];
  weather?: WeatherData;
  createdAt: string;
  recipe?: {
    id: string;
    name: string;
    description?: string;
    tags?: string[];
    ratios?: any;
  };
}

export interface CreateBakeInput {
  recipeId: string;
  rating?: number;
  notes?: string;
  photos?: string[];
  issues?: string[];
  weather?: WeatherData;
}

export interface UpdateBakeInput {
  rating?: number;
  notes?: string;
  photos?: string[];
  issues?: string[];
  weather?: WeatherData;
}

export interface ListBakesParams {
  page?: number;
  limit?: number;
  recipeId?: string;
  minRating?: number;
  sortBy?: 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface BakeStats {
  totalBakes: number;
  averageRating: number | null;
  mostCommonIssues: Array<{ issue: string; count: number }>;
  mostBakedRecipe: {
    id: string;
    name: string;
    count: number;
  } | null;
  bakingStreak: number;
  ratingTrend: Array<{
    date: string;
    rating: number;
    recipeName: string;
  }>;
}

export interface RecipeBakesData {
  recipe: {
    id: string;
    name: string;
    description?: string;
  };
  bakes: Bake[];
  stats: {
    totalBakes: number;
    averageRating: number | null;
    commonIssues: Array<{ issue: string; count: number }>;
  };
}

/**
 * List user's bakes
 */
export async function listBakes(
  params?: ListBakesParams
): Promise<ApiResponse<Bake[]>> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.recipeId) queryParams.append('recipeId', params.recipeId);
  if (params?.minRating) queryParams.append('minRating', params.minRating.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const query = queryParams.toString();
  const endpoint = `/bakes${query ? `?${query}` : ''}`;

  return apiClient.get<Bake[]>(endpoint);
}

/**
 * Get a single bake by ID
 */
export async function getBake(id: string): Promise<ApiResponse<Bake>> {
  return apiClient.get<Bake>(`/bakes/${id}`);
}

/**
 * Create a new bake log
 */
export async function createBake(
  input: CreateBakeInput
): Promise<ApiResponse<Bake>> {
  return apiClient.post<Bake>('/bakes', input);
}

/**
 * Update an existing bake
 */
export async function updateBake(
  id: string,
  input: UpdateBakeInput
): Promise<ApiResponse<Bake>> {
  return apiClient.patch<Bake>(`/bakes/${id}`, input);
}

/**
 * Delete a bake
 */
export async function deleteBake(id: string): Promise<ApiResponse<void>> {
  return apiClient.delete<void>(`/bakes/${id}`);
}

/**
 * Get user's baking statistics
 */
export async function getBakeStats(): Promise<ApiResponse<BakeStats>> {
  return apiClient.get<BakeStats>('/bakes/stats');
}

/**
 * Get bakes for a specific recipe with stats
 */
export async function getBakesByRecipe(
  recipeId: string
): Promise<ApiResponse<RecipeBakesData>> {
  return apiClient.get<RecipeBakesData>(`/bakes/recipe/${recipeId}`);
}

// Export issue tags for use in components
export const ISSUE_TAGS = {
  CRUMB: ['dense-crumb', 'open-crumb', 'uneven-crumb'],
  PROOFING: ['over-proofed', 'under-proofed', 'perfect-proof'],
  CRUST: ['burnt-crust', 'pale-crust', 'perfect-crust'],
  OVEN_SPRING: ['good-oven-spring', 'poor-oven-spring'],
  FLAVOR: ['too-sour', 'bland', 'perfect-flavor'],
  OTHER: ['sticky-dough', 'dry-dough', 'shaping-issues', 'scoring-issues'],
} as const;

// Flattened array of all issue tags
export const ALL_ISSUE_TAGS = Object.values(ISSUE_TAGS).flat();

// Helper to get issue tag category
export function getIssueCategory(tag: string): 'problem' | 'success' | 'neutral' {
  const problemTags = [
    'over-proofed',
    'under-proofed',
    'burnt-crust',
    'dense-crumb',
    'poor-oven-spring',
    'too-sour',
    'bland',
    'sticky-dough',
    'dry-dough',
    'uneven-crumb',
    'pale-crust',
    'shaping-issues',
    'scoring-issues',
  ];

  const successTags = [
    'perfect-proof',
    'good-oven-spring',
    'perfect-crust',
    'perfect-flavor',
    'open-crumb',
  ];

  if (problemTags.includes(tag)) return 'problem';
  if (successTags.includes(tag)) return 'success';
  return 'neutral';
}
