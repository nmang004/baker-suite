/**
 * Baker's Suite - Ratio Calculator Utilities
 *
 * Core functions for baker's percentage calculations and recipe scaling
 */

export interface Ingredient {
  id: string;
  name: string;
  weight: number;
  unit: 'g' | 'oz' | 'lb';
  percentage: number;
}

export interface Recipe {
  id?: string;
  name: string;
  ingredients: Ingredient[];
  totalWeight?: number;
  flourWeight?: number;
}

export type ScaleBy = 'flour' | 'yield' | 'percentage';

export interface HydrationContributor {
  ingredient: string;
  weight: number;
  hydrationFactor: number;
  contribution: number;
}

export interface HydrationBreakdown {
  totalHydration: number;
  contributors: HydrationContributor[];
}

/**
 * Hydration factors for common baking ingredients
 * Represents the % of water content in each ingredient
 */
export const HYDRATION_FACTORS: Record<string, number> = {
  // Direct liquids
  water: 100,
  milk: 87,
  'whole milk': 87,
  'skim milk': 91,
  buttermilk: 90,
  cream: 64,
  'heavy cream': 58,
  'sour cream': 71,

  // Eggs
  egg: 75,
  eggs: 75,
  'whole egg': 75,
  'whole eggs': 75,
  'egg white': 88,
  'egg whites': 88,
  'egg yolk': 50,
  'egg yolks': 50,

  // Other liquids
  yogurt: 85,
  'greek yogurt': 80,
  oil: 0,
  'olive oil': 0,
  'vegetable oil': 0,
  butter: 16,
  honey: 17,
  'maple syrup': 32,
  molasses: 22,

  // Beer/alcohol
  beer: 95,
  wine: 85,

  // Juices
  'orange juice': 88,
  'apple juice': 88,
  juice: 88,
};

/**
 * Calculate baker's percentage for an ingredient
 * Formula: (ingredient_weight / flour_weight) × 100
 */
export function calculatePercentage(
  ingredientWeight: number,
  flourWeight: number
): number {
  if (flourWeight === 0) return 0;
  return Math.round((ingredientWeight / flourWeight) * 100 * 10) / 10; // Round to 1 decimal
}

/**
 * Find the flour ingredient(s) in the recipe
 * Flour should be marked or is the first ingredient
 */
export function getFlourWeight(ingredients: Ingredient[]): number {
  // Look for ingredient named "flour" or first ingredient
  const flourIngredient = ingredients.find(
    (ing) => ing.name.toLowerCase().includes('flour') || ing.percentage === 100
  ) || ingredients[0];

  return flourIngredient?.weight || 0;
}

/**
 * Calculate all percentages based on flour weight
 */
export function calculateAllPercentages(
  ingredients: Ingredient[]
): Ingredient[] {
  const flourWeight = getFlourWeight(ingredients);

  return ingredients.map((ingredient) => ({
    ...ingredient,
    percentage:
      ingredient.name.toLowerCase().includes('flour')
        ? 100
        : calculatePercentage(ingredient.weight, flourWeight),
  }));
}

/**
 * Calculate total recipe weight
 */
export function calculateTotalWeight(ingredients: Ingredient[]): number {
  return ingredients.reduce((total, ing) => {
    const weightInGrams = convertToGrams(ing.weight, ing.unit);
    return total + weightInGrams;
  }, 0);
}

/**
 * Scale recipe by flour weight
 */
export function scaleByFlourWeight(
  ingredients: Ingredient[],
  targetFlourWeight: number
): Ingredient[] {
  const currentFlourWeight = getFlourWeight(ingredients);
  const scaleFactor = targetFlourWeight / currentFlourWeight;

  return ingredients.map((ing) => ({
    ...ing,
    weight: Math.round(ing.weight * scaleFactor * 10) / 10,
  }));
}

/**
 * Scale recipe by total yield
 */
export function scaleByYield(
  ingredients: Ingredient[],
  targetYield: number,
  unit: 'g' | 'oz' | 'lb' = 'g'
): Ingredient[] {
  const currentTotalGrams = calculateTotalWeight(ingredients);
  const targetTotalGrams = convertToGrams(targetYield, unit);
  const scaleFactor = targetTotalGrams / currentTotalGrams;

  return ingredients.map((ing) => ({
    ...ing,
    weight: Math.round(ing.weight * scaleFactor * 10) / 10,
  }));
}

/**
 * Scale recipe by percentage
 */
export function scaleByPercentage(
  ingredients: Ingredient[],
  percentage: number
): Ingredient[] {
  const scaleFactor = percentage / 100;

  return ingredients.map((ing) => ({
    ...ing,
    weight: Math.round(ing.weight * scaleFactor * 10) / 10,
  }));
}

/**
 * Main scaling function
 */
export function scaleRecipe(
  ingredients: Ingredient[],
  scaleBy: ScaleBy,
  targetValue: number,
  unit?: 'g' | 'oz' | 'lb'
): Ingredient[] {
  switch (scaleBy) {
    case 'flour':
      return scaleByFlourWeight(ingredients, targetValue);
    case 'yield':
      return scaleByYield(ingredients, targetValue, unit);
    case 'percentage':
      return scaleByPercentage(ingredients, targetValue);
    default:
      return ingredients;
  }
}

/**
 * Unit conversion functions
 */
export function convertToGrams(value: number, fromUnit: 'g' | 'oz' | 'lb'): number {
  switch (fromUnit) {
    case 'g':
      return value;
    case 'oz':
      return value * 28.3495;
    case 'lb':
      return value * 453.592;
    default:
      return value;
  }
}

export function convertFromGrams(
  grams: number,
  toUnit: 'g' | 'oz' | 'lb'
): number {
  switch (toUnit) {
    case 'g':
      return Math.round(grams * 10) / 10;
    case 'oz':
      return Math.round((grams / 28.3495) * 10) / 10;
    case 'lb':
      return Math.round((grams / 453.592) * 100) / 100;
    default:
      return grams;
  }
}

export function convertUnits(
  value: number,
  fromUnit: 'g' | 'oz' | 'lb',
  toUnit: 'g' | 'oz' | 'lb'
): number {
  const grams = convertToGrams(value, fromUnit);
  return convertFromGrams(grams, toUnit);
}

/**
 * Get the hydration factor for an ingredient name
 * Returns the percentage of water content (0-100)
 */
export function getHydrationFactor(ingredientName: string): number {
  const normalizedName = ingredientName.toLowerCase().trim();

  // Exact match
  if (HYDRATION_FACTORS[normalizedName] !== undefined) {
    return HYDRATION_FACTORS[normalizedName];
  }

  // Partial match - check if any key is contained in the ingredient name
  for (const [key, factor] of Object.entries(HYDRATION_FACTORS)) {
    if (normalizedName.includes(key)) {
      return factor;
    }
  }

  // No match found
  return 0;
}

/**
 * Calculate detailed hydration breakdown showing each ingredient's contribution
 */
export function calculateHydrationBreakdown(
  ingredients: Ingredient[]
): HydrationBreakdown {
  const flourWeight = getFlourWeight(ingredients);

  if (flourWeight === 0) {
    return { totalHydration: 0, contributors: [] };
  }

  const contributors: HydrationContributor[] = [];
  let totalLiquidWeight = 0;

  ingredients.forEach((ingredient) => {
    const hydrationFactor = getHydrationFactor(ingredient.name);

    if (hydrationFactor > 0) {
      const weightInGrams = convertToGrams(ingredient.weight, ingredient.unit);
      const liquidContribution = (weightInGrams * hydrationFactor) / 100;
      totalLiquidWeight += liquidContribution;

      contributors.push({
        ingredient: ingredient.name,
        weight: weightInGrams,
        hydrationFactor,
        contribution: Math.round((liquidContribution / flourWeight) * 100 * 10) / 10,
      });
    }
  });

  const flourWeightInGrams = convertToGrams(flourWeight, ingredients[0].unit);
  const totalHydration = Math.round((totalLiquidWeight / flourWeightInGrams) * 100 * 10) / 10;

  return {
    totalHydration,
    contributors: contributors.sort((a, b) => b.contribution - a.contribution),
  };
}

/**
 * Calculate total hydration percentage (all liquids/flour ratio)
 * This is more accurate than just water, accounting for milk, eggs, etc.
 */
export function calculateHydration(ingredients: Ingredient[]): number {
  return calculateHydrationBreakdown(ingredients).totalHydration;
}

/**
 * Validate recipe data
 */
export function validateRecipe(ingredients: Ingredient[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (ingredients.length === 0) {
    errors.push('Recipe must have at least one ingredient');
  }

  const flourWeight = getFlourWeight(ingredients);
  if (flourWeight === 0) {
    errors.push('Recipe must include flour');
  }

  ingredients.forEach((ing, index) => {
    if (!ing.name.trim()) {
      errors.push(`Ingredient ${index + 1} must have a name`);
    }
    if (ing.weight <= 0) {
      errors.push(`${ing.name || 'Ingredient'} weight must be greater than 0`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generate a unique ID for ingredients
 */
export function generateIngredientId(): string {
  return `ing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new empty ingredient
 */
export function createEmptyIngredient(): Ingredient {
  return {
    id: generateIngredientId(),
    name: '',
    weight: 0,
    unit: 'g',
    percentage: 0,
  };
}
