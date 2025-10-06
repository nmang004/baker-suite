import { z } from 'zod';

// Difficulty enum for validation
const difficultyValues = ['beginner', 'intermediate', 'advanced'] as const;

// Sort options for discovery
const sortByValues = ['relevance', 'rating', 'recent', 'popular'] as const;

// Recommendation types
const recommendationTypeValues = [
  'similar',
  'new',
  'seasonal',
  'personalized',
] as const;

// Discover recipes query schema
export const discoverRecipesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  ingredients: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(',').map((i) => i.trim()) : undefined)),
  tags: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(',').map((t) => t.trim()) : undefined)),
  excludeIngredients: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(',').map((i) => i.trim()) : undefined)),
  difficulty: z.enum(difficultyValues).optional(),
  maxTime: z.coerce.number().int().positive().optional(),
  sortBy: z.enum(sortByValues).default('relevance'),
});

// Search recipes query schema (simpler, focused on ingredient search)
export const searchRecipesQuerySchema = z.object({
  ingredients: z
    .string()
    .min(1, 'At least one ingredient is required')
    .transform((val) => val.split(',').map((i) => i.trim())),
  excludeIngredients: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(',').map((i) => i.trim()) : undefined)),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

// Recommendations query schema
export const recommendationsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).default(10),
  type: z.enum(recommendationTypeValues).default('personalized'),
  excludeBaked: z
    .string()
    .optional()
    .transform((val) => val === 'true' || val === '1')
    .pipe(z.boolean())
    .default('true' as any),
});

// Similar recipes query schema
export const similarRecipesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).default(10),
});

// Trending recipes query schema
export const trendingRecipesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).default(20),
});

// Discovery feed query schema
export const discoveryFeedQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).default(20),
});

// Export types
export type DiscoverRecipesQuery = z.infer<typeof discoverRecipesQuerySchema>;
export type SearchRecipesQuery = z.infer<typeof searchRecipesQuerySchema>;
export type RecommendationsQuery = z.infer<typeof recommendationsQuerySchema>;
export type SimilarRecipesQuery = z.infer<typeof similarRecipesQuerySchema>;
export type TrendingRecipesQuery = z.infer<typeof trendingRecipesQuerySchema>;
export type DiscoveryFeedQuery = z.infer<typeof discoveryFeedQuerySchema>;
export type DifficultyLevel = (typeof difficultyValues)[number];
export type SortBy = (typeof sortByValues)[number];
export type RecommendationType = (typeof recommendationTypeValues)[number];
