/**
 * Starter API functions
 */

import { apiClient, ApiResponse } from './client';

// Types matching backend
export type FlourType = 'white' | 'whole-wheat' | 'rye' | 'spelt' | 'mixed' | 'other';

export interface StarterFeeding {
  id: string;
  starterId: string;
  fedAt: string;
  ratio: string;
  observations?: string;
  riseHeight?: number;
}

export interface Starter {
  id: string;
  userId: string;
  name: string;
  flourType: FlourType;
  createdDate: string;
  feedingRatio: string;
  lastFed?: string;
  health?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  feedings?: StarterFeeding[];
  _count?: {
    feedings: number;
  };
}

export interface CreateStarterInput {
  name: string;
  flourType: FlourType;
  createdDate?: Date | string;
  feedingRatio: string;
  notes?: string;
}

export interface UpdateStarterInput {
  name?: string;
  feedingRatio?: string;
  notes?: string;
  health?: number;
  lastFed?: Date | string;
}

export interface CreateFeedingInput {
  ratio: string;
  observations?: string;
  riseHeight?: number;
  fedAt?: Date | string;
}

export interface UpdateFeedingInput {
  observations?: string;
  riseHeight?: number;
}

export interface ListStartersParams {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'createdDate' | 'lastFed' | 'health';
  sortOrder?: 'asc' | 'desc';
  active?: boolean;
}

export interface ListFeedingsParams {
  page?: number;
  limit?: number;
}

export interface StarterHealth {
  healthScore: number;
  avgRiseHeight: number | null;
  feedingConsistency: number;
  currentStreak: number;
  nextFeedingTime: string | null;
  totalFeedings: number;
}

export interface FeedingStatistics {
  totalFeedings: number;
  avgRiseHeight: number | null;
  maxRiseHeight: number | null;
  minRiseHeight: number | null;
  feedingConsistency: number;
  avgFeedingInterval: number | null;
}

/**
 * List user's starters
 */
export async function listStarters(
  params?: ListStartersParams
): Promise<ApiResponse<Starter[]>> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  if (params?.active !== undefined) queryParams.append('active', params.active.toString());

  const query = queryParams.toString();
  const endpoint = `/starters${query ? `?${query}` : ''}`;

  return apiClient.get<Starter[]>(endpoint);
}

/**
 * Get a single starter by ID
 */
export async function getStarter(id: string): Promise<ApiResponse<Starter>> {
  return apiClient.get<Starter>(`/starters/${id}`);
}

/**
 * Create a new starter
 */
export async function createStarter(
  input: CreateStarterInput
): Promise<ApiResponse<Starter>> {
  return apiClient.post<Starter>('/starters', input);
}

/**
 * Update an existing starter
 */
export async function updateStarter(
  id: string,
  input: UpdateStarterInput
): Promise<ApiResponse<Starter>> {
  return apiClient.patch<Starter>(`/starters/${id}`, input);
}

/**
 * Delete a starter
 */
export async function deleteStarter(id: string): Promise<ApiResponse<void>> {
  return apiClient.delete<void>(`/starters/${id}`);
}

/**
 * Get starter health metrics
 */
export async function getStarterHealth(
  id: string
): Promise<ApiResponse<StarterHealth>> {
  return apiClient.get<StarterHealth>(`/starters/${id}/health`);
}

/**
 * Log a feeding for a starter
 */
export async function logFeeding(
  starterId: string,
  input: CreateFeedingInput
): Promise<ApiResponse<StarterFeeding>> {
  return apiClient.post<StarterFeeding>(`/starters/${starterId}/feed`, input);
}

/**
 * Get feeding history for a starter
 */
export async function getFeedingHistory(
  starterId: string,
  params?: ListFeedingsParams
): Promise<ApiResponse<StarterFeeding[]>> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const query = queryParams.toString();
  const endpoint = `/starters/${starterId}/feedings${query ? `?${query}` : ''}`;

  return apiClient.get<StarterFeeding[]>(endpoint);
}

/**
 * Update a feeding
 */
export async function updateFeeding(
  starterId: string,
  feedingId: string,
  input: UpdateFeedingInput
): Promise<ApiResponse<StarterFeeding>> {
  return apiClient.patch<StarterFeeding>(
    `/starters/${starterId}/feedings/${feedingId}`,
    input
  );
}

/**
 * Delete a feeding
 */
export async function deleteFeeding(
  starterId: string,
  feedingId: string
): Promise<ApiResponse<void>> {
  return apiClient.delete<void>(`/starters/${starterId}/feedings/${feedingId}`);
}

/**
 * Get feeding statistics for a starter
 */
export async function getFeedingStatistics(
  starterId: string
): Promise<ApiResponse<FeedingStatistics>> {
  return apiClient.get<FeedingStatistics>(`/starters/${starterId}/statistics`);
}

// Export flour types for use in components
export const FLOUR_TYPES: { value: FlourType; label: string }[] = [
  { value: 'white', label: 'White' },
  { value: 'whole-wheat', label: 'Whole Wheat' },
  { value: 'rye', label: 'Rye' },
  { value: 'spelt', label: 'Spelt' },
  { value: 'mixed', label: 'Mixed' },
  { value: 'other', label: 'Other' },
];

// Helper to get feeding status color
export function getFeedingStatus(lastFed?: string): {
  status: 'healthy' | 'soon' | 'overdue' | 'unknown';
  label: string;
  color: string;
} {
  if (!lastFed) {
    return {
      status: 'unknown',
      label: 'Never fed',
      color: 'gray',
    };
  }

  const hoursSinceLastFed =
    (Date.now() - new Date(lastFed).getTime()) / (1000 * 60 * 60);

  if (hoursSinceLastFed < 12) {
    return {
      status: 'healthy',
      label: 'Recently fed',
      color: 'green',
    };
  } else if (hoursSinceLastFed < 24) {
    return {
      status: 'soon',
      label: 'Needs feeding soon',
      color: 'yellow',
    };
  } else {
    return {
      status: 'overdue',
      label: 'Overdue',
      color: 'red',
    };
  }
}

// Helper to format starter age
export function getStarterAge(createdDate: string): string {
  const created = new Date(createdDate);
  const now = new Date();
  const daysDiff = Math.floor(
    (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff < 7) {
    return `${daysDiff} day${daysDiff === 1 ? '' : 's'} old`;
  } else if (daysDiff < 30) {
    const weeks = Math.floor(daysDiff / 7);
    return `${weeks} week${weeks === 1 ? '' : 's'} old`;
  } else if (daysDiff < 365) {
    const months = Math.floor(daysDiff / 30);
    return `${months} month${months === 1 ? '' : 's'} old`;
  } else {
    const years = Math.floor(daysDiff / 365);
    return `${years} year${years === 1 ? '' : 's'} old`;
  }
}

// Helper to validate feeding ratio format
export function isValidFeedingRatio(ratio: string): boolean {
  return /^\d+:\d+:\d+$/.test(ratio);
}

// Helper to parse feeding ratio
export function parseFeedingRatio(ratio: string): {
  starter: number;
  flour: number;
  water: number;
} | null {
  if (!isValidFeedingRatio(ratio)) return null;

  const parts = ratio.split(':').map(Number);
  return {
    starter: parts[0],
    flour: parts[1],
    water: parts[2],
  };
}
