import { z } from 'zod';

export const ingredientSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Ingredient name is required'),
  weight: z.number().positive('Weight must be greater than 0'),
  unit: z.enum(['g', 'oz', 'lb']),
  percentage: z.number().min(0),
});

export const recipeSchema = z.object({
  name: z.string().min(1, 'Recipe name is required'),
  ingredients: z
    .array(ingredientSchema)
    .min(1, 'Recipe must have at least one ingredient'),
});

export const scaleRecipeSchema = z.object({
  scaleBy: z.enum(['flour', 'yield', 'percentage']),
  targetValue: z.number().positive('Target value must be greater than 0'),
  unit: z.enum(['g', 'oz', 'lb']).optional(),
});

export type IngredientInput = z.infer<typeof ingredientSchema>;
export type RecipeInput = z.infer<typeof recipeSchema>;
export type ScaleRecipeInput = z.infer<typeof scaleRecipeSchema>;
