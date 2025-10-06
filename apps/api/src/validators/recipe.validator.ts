import { z } from 'zod';

// Ingredient schema
export const ingredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  percentage: z.number().optional(),
});

// Baker's ratios schema
export const bakerRatiosSchema = z.object({
  flour: z.number().default(100), // Always 100%
  water: z.number().positive('Water percentage must be positive'),
  salt: z.number().positive('Salt percentage must be positive'),
  yeast: z.number().positive().optional(),
  starter: z.number().positive().optional(),
}).catchall(z.number().optional()); // Allow additional ratio fields

// Create recipe schema
export const createRecipeSchema = z.object({
  name: z.string().min(1, 'Recipe name is required').max(200),
  description: z.string().max(1000).optional(),
  ingredients: z.array(ingredientSchema).min(1, 'At least one ingredient is required'),
  instructions: z.array(z.string().min(1)).min(1, 'At least one instruction is required'),
  tags: z.array(z.string()).default([]),
  ratios: bakerRatiosSchema,
});

// Update recipe schema (all fields optional except what changed)
export const updateRecipeSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  ingredients: z.array(ingredientSchema).min(1).optional(),
  instructions: z.array(z.string().min(1)).min(1).optional(),
  tags: z.array(z.string()).optional(),
  ratios: bakerRatiosSchema.optional(),
});

// Query parameters for listing recipes
export const listRecipesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
  sortBy: z.enum(['createdAt', 'updatedAt', 'name']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Export types
export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
export type ListRecipesQuery = z.infer<typeof listRecipesQuerySchema>;
export type Ingredient = z.infer<typeof ingredientSchema>;
export type BakerRatios = z.infer<typeof bakerRatiosSchema>;
