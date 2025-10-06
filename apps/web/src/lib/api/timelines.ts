/**
 * Timeline API functions
 */

import { apiClient, ApiResponse } from './client';

export enum TimelineStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface TimelineStep {
  id: string;
  name: string;
  description: string;
  startTime: string;
  duration: number; // minutes
  temperature?: number;
  completed: boolean;
  isProofingStep?: boolean;
}

export interface WeatherSnapshot {
  temperature: number;
  humidity: number;
  location: string;
  timestamp: string;
}

export interface Timeline {
  id: string;
  userId: string;
  recipeId: string;
  targetTime: string;
  steps: TimelineStep[];
  status: TimelineStatus;
  weather: WeatherSnapshot;
  createdAt: string;
  completedAt?: string;
  recipe?: {
    id: string;
    name: string;
    description?: string;
    tags: string[];
  };
  currentStep?: TimelineStep;
  nextStep?: TimelineStep;
}

export interface CreateTimelineInput {
  recipeId: string;
  targetTime: string; // ISO 8601 datetime
  location: string;
}

export interface UpdateTimelineStatusInput {
  status: TimelineStatus;
  stepId?: string;
}

export interface ListTimelinesParams {
  status?: TimelineStatus;
  page?: number;
  limit?: number;
}

/**
 * List user's timelines
 */
export async function listTimelines(
  params?: ListTimelinesParams
): Promise<ApiResponse<Timeline[]>> {
  const queryParams = new URLSearchParams();

  if (params?.status) queryParams.append('status', params.status);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const query = queryParams.toString();
  const endpoint = `/timelines${query ? `?${query}` : ''}`;

  return apiClient.get<Timeline[]>(endpoint);
}

/**
 * Get a single timeline by ID
 */
export async function getTimeline(id: string): Promise<ApiResponse<Timeline>> {
  return apiClient.get<Timeline>(`/timelines/${id}`);
}

/**
 * Create a new timeline
 */
export async function createTimeline(
  input: CreateTimelineInput
): Promise<ApiResponse<Timeline>> {
  return apiClient.post<Timeline>('/timelines', input);
}

/**
 * Update timeline status
 */
export async function updateTimelineStatus(
  id: string,
  input: UpdateTimelineStatusInput
): Promise<ApiResponse<Timeline>> {
  return apiClient.request<Timeline>(`/timelines/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

/**
 * Delete a timeline
 */
export async function deleteTimeline(id: string): Promise<ApiResponse<void>> {
  return apiClient.delete<void>(`/timelines/${id}`);
}

/**
 * Get current weather for a location
 */
export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure?: number;
  location: string;
  description?: string;
  timestamp: string;
  adjustments: {
    proofing: {
      proofingMultiplier: number;
      recommendation: string;
    };
    hydration: {
      adjustment: number;
      recommendation: string;
    };
  };
}

export async function getWeather(
  location: string
): Promise<ApiResponse<WeatherData>> {
  const queryParams = new URLSearchParams({ location });
  return apiClient.get<WeatherData>(`/weather?${queryParams.toString()}`);
}
