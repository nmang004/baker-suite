import { z } from 'zod';

// Issue tags enum for validation
const issueTagValues = [
  // Crumb issues
  'dense-crumb',
  'open-crumb',
  'uneven-crumb',

  // Proofing issues
  'over-proofed',
  'under-proofed',
  'perfect-proof',

  // Crust issues
  'burnt-crust',
  'pale-crust',
  'perfect-crust',

  // Oven spring
  'good-oven-spring',
  'poor-oven-spring',

  // Flavor
  'too-sour',
  'bland',
  'perfect-flavor',

  // Other
  'sticky-dough',
  'dry-dough',
  'shaping-issues',
  'scoring-issues',
] as const;

// Weather data schema (matches what comes from timeline)
export const weatherDataSchema = z.object({
  temperature: z.number().optional(),
  humidity: z.number().optional(),
  pressure: z.number().optional(),
  location: z.string().optional(),
  timestamp: z.string().datetime().optional(),
}).optional();

// Create bake schema
export const createBakeSchema = z.object({
  recipeId: z.string().cuid('Invalid recipe ID format'),
  rating: z.number().int().min(1).max(5).optional(),
  notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),
  photos: z.array(z.string().url('Invalid photo URL')).max(10, 'Maximum 10 photos allowed').default([]),
  issues: z.array(z.enum(issueTagValues)).default([]),
  weather: weatherDataSchema,
});

// Update bake schema (all fields optional)
export const updateBakeSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),
  photos: z.array(z.string().url('Invalid photo URL')).max(10, 'Maximum 10 photos allowed').optional(),
  issues: z.array(z.enum(issueTagValues)).optional(),
  weather: weatherDataSchema,
});

// Query parameters for listing bakes
export const listBakesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  recipeId: z.string().cuid().optional(),
  minRating: z.coerce.number().int().min(1).max(5).optional(),
  sortBy: z.enum(['createdAt', 'rating']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Export types
export type CreateBakeInput = z.infer<typeof createBakeSchema>;
export type UpdateBakeInput = z.infer<typeof updateBakeSchema>;
export type ListBakesQuery = z.infer<typeof listBakesQuerySchema>;
export type WeatherData = z.infer<typeof weatherDataSchema>;
export type IssueTag = typeof issueTagValues[number];
