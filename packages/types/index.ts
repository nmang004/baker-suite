// Common types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

// Recipe types
export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  percentage?: number;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface BakerRatios {
  flour: number; // Always 100%
  water: number; // Hydration percentage
  salt: number;
  yeast?: number;
  starter?: number;
  [key: string]: number | undefined;
}

// Bake types
export interface Bake {
  id: string;
  userId: string;
  recipeId: string;
  rating?: number;
  notes?: string;
  photos: string[];
  issues: string[];
  weather?: WeatherData;
  createdAt: Date;
}

// Weather types
export interface WeatherData {
  temperature: number; // Celsius
  humidity: number; // Percentage
  pressure?: number; // hPa
  location?: string;
  timestamp: Date;
}

// Timeline types
export interface Timeline {
  id: string;
  userId: string;
  recipeId: string;
  targetTime: Date;
  steps: TimelineStep[];
  status: TimelineStatus;
  weather?: WeatherData;
  createdAt: Date;
  completedAt?: Date;
}

export interface TimelineStep {
  id: string;
  name: string;
  description: string;
  startTime: Date;
  duration: number; // minutes
  temperature?: number;
  completed: boolean;
}

export type TimelineStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

// Starter types
export interface Starter {
  id: string;
  userId: string;
  name: string;
  flourType: string;
  createdDate: Date;
  feedingRatio: string;
  lastFed?: Date;
  health?: number;
  notes?: string;
}

export interface StarterFeeding {
  id: string;
  starterId: string;
  fedAt: Date;
  ratio: string;
  observations?: string;
  riseHeight?: number;
}

// Flavor pairing types
export interface FlavorPairing {
  id: string;
  ingredient1: string;
  ingredient2: string;
  confidence: number;
  compounds: string[];
  cuisine: string[];
  category: 'sweet' | 'savory';
}

// User types
export type UserTier = 'FREE' | 'PREMIUM' | 'PRO';

export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  tier: UserTier;
  createdAt: Date;
  updatedAt: Date;
}
