import type { Ingredient, BakerRatios } from '@baker-suite/types';

/**
 * Calculate baker's percentages from ingredients
 */
export function calculateBakerPercentages(
  ingredients: Ingredient[]
): BakerRatios {
  const flourIngredient = ingredients.find((i) =>
    i.name.toLowerCase().includes('flour')
  );

  if (!flourIngredient) {
    throw new Error('Recipe must contain flour');
  }

  const flourWeight = flourIngredient.quantity;
  const ratios: BakerRatios = {
    flour: 100,
    water: 0,
    salt: 0,
  };

  ingredients.forEach((ingredient) => {
    const name = ingredient.name.toLowerCase();
    const percentage = (ingredient.quantity / flourWeight) * 100;

    if (name.includes('water')) {
      ratios.water = percentage;
    } else if (name.includes('salt')) {
      ratios.salt = percentage;
    } else if (name.includes('yeast')) {
      ratios.yeast = percentage;
    } else if (name.includes('starter') || name.includes('levain')) {
      ratios.starter = percentage;
    } else if (!name.includes('flour')) {
      ratios[name] = percentage;
    }
  });

  return ratios;
}

/**
 * Scale recipe based on desired flour weight
 */
export function scaleRecipe(
  ingredients: Ingredient[],
  targetFlourWeight: number
): Ingredient[] {
  const flourIngredient = ingredients.find((i) =>
    i.name.toLowerCase().includes('flour')
  );

  if (!flourIngredient) {
    throw new Error('Recipe must contain flour');
  }

  const scalingFactor = targetFlourWeight / flourIngredient.quantity;

  return ingredients.map((ingredient) => ({
    ...ingredient,
    quantity: Math.round(ingredient.quantity * scalingFactor * 10) / 10,
  }));
}

/**
 * Calculate hydration percentage
 */
export function calculateHydration(ingredients: Ingredient[]): number {
  const flour = ingredients
    .filter((i) => i.name.toLowerCase().includes('flour'))
    .reduce((sum, i) => sum + i.quantity, 0);

  const water = ingredients
    .filter((i) => i.name.toLowerCase().includes('water'))
    .reduce((sum, i) => sum + i.quantity, 0);

  if (flour === 0) return 0;

  return Math.round((water / flour) * 100 * 10) / 10;
}
