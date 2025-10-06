import { z } from 'zod';

// Flour type enum for validation
const flourTypeValues = [
  'white',
  'whole-wheat',
  'rye',
  'spelt',
  'mixed',
  'other',
] as const;

// Feeding ratio validation (pattern: "1:1:1" - starter:flour:water)
const feedingRatioRegex = /^\d+:\d+:\d+$/;

// Create starter schema
export const createStarterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  flourType: z.enum(flourTypeValues, {
    errorMap: () => ({ message: 'Invalid flour type' }),
  }),
  createdDate: z.coerce.date().optional().default(() => new Date()),
  feedingRatio: z.string().regex(feedingRatioRegex, 'Feeding ratio must be in format "X:Y:Z" (e.g., "1:1:1")'),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
});

// Update starter schema (all fields optional)
export const updateStarterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters').optional(),
  feedingRatio: z.string().regex(feedingRatioRegex, 'Feeding ratio must be in format "X:Y:Z" (e.g., "1:1:1")').optional(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
  health: z.number().int().min(1).max(5).optional(),
  lastFed: z.coerce.date().optional(),
});

// Create feeding schema
export const createFeedingSchema = z.object({
  ratio: z.string().regex(feedingRatioRegex, 'Feeding ratio must be in format "X:Y:Z" (e.g., "1:1:1")'),
  observations: z.string().max(500, 'Observations cannot exceed 500 characters').optional(),
  riseHeight: z.number().positive('Rise height must be positive').optional(),
  fedAt: z.coerce.date().optional().default(() => new Date()),
});

// Update feeding schema (observations and rise height only)
export const updateFeedingSchema = z.object({
  observations: z.string().max(500, 'Observations cannot exceed 500 characters').optional(),
  riseHeight: z.number().positive('Rise height must be positive').optional(),
});

// Query parameters for listing starters
export const listStartersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['name', 'createdDate', 'lastFed', 'health']).default('lastFed'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  active: z.coerce.boolean().optional(),
});

// Query parameters for listing feedings
export const listFeedingsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// Export types
export type CreateStarterInput = z.infer<typeof createStarterSchema>;
export type UpdateStarterInput = z.infer<typeof updateStarterSchema>;
export type CreateFeedingInput = z.infer<typeof createFeedingSchema>;
export type UpdateFeedingInput = z.infer<typeof updateFeedingSchema>;
export type ListStartersQuery = z.infer<typeof listStartersQuerySchema>;
export type ListFeedingsQuery = z.infer<typeof listFeedingsQuerySchema>;
export type FlourType = typeof flourTypeValues[number];
