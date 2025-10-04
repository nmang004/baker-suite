import { z } from 'zod';

export const ingredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  percentage: z.number().optional(),
});

export const recipeSchema = z.object({
  name: z.string().min(1, 'Recipe name is required').max(100),
  description: z.string().optional(),
  ingredients: z.array(ingredientSchema).min(1, 'At least one ingredient required'),
  instructions: z.array(z.string()).min(1, 'At least one step required'),
  tags: z.array(z.string()).optional(),
});

export type Ingredient = z.infer<typeof ingredientSchema>;
export type Recipe = z.infer<typeof recipeSchema>;
