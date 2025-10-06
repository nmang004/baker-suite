import { z } from 'zod';

// Category enum for validation
const categoryValues = ['sweet', 'savory'] as const;

// Recipe context enum
const recipeContextValues = [
  'bread',
  'pastry',
  'cake',
  'cookie',
  'other',
] as const;

// Search pairings query schema
export const searchPairingsQuerySchema = z.object({
  ingredient: z.string().min(1).optional(),
  category: z.enum(categoryValues).optional(),
  cuisine: z.string().min(1).optional(),
  minConfidence: z.coerce.number().min(0).max(1).optional(),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

// Get pairings for ingredient query schema
export const getPairingsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// Search by compound query schema
export const searchByCompoundQuerySchema = z.object({
  compound: z.string().min(1, 'Compound name is required'),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

// Analyze ingredients schema
export const analyzeIngredientsSchema = z.object({
  ingredients: z
    .array(z.string().min(1))
    .min(2, 'At least 2 ingredients are required for analysis'),
  recipeContext: z.enum(recipeContextValues).optional(),
});

// Suggest for recipe query schema
export const suggestForRecipeQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(20).default(10),
});

// Get shared compounds params schema
export const sharedCompoundsParamsSchema = z.object({
  ingredient1: z.string().min(1, 'First ingredient is required'),
  ingredient2: z.string().min(1, 'Second ingredient is required'),
});

// Export types
export type SearchPairingsQuery = z.infer<typeof searchPairingsQuerySchema>;
export type GetPairingsQuery = z.infer<typeof getPairingsQuerySchema>;
export type SearchByCompoundQuery = z.infer<typeof searchByCompoundQuerySchema>;
export type AnalyzeIngredientsInput = z.infer<typeof analyzeIngredientsSchema>;
export type SuggestForRecipeQuery = z.infer<typeof suggestForRecipeQuerySchema>;
export type SharedCompoundsParams = z.infer<typeof sharedCompoundsParamsSchema>;
export type PairingCategory = (typeof categoryValues)[number];
export type RecipeContext = (typeof recipeContextValues)[number];
