import { PrismaClient, Recipe } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';
import { flavorPairingService } from './flavor-pairing.service';

const prisma = new PrismaClient();

export interface IngredientAnalysis {
  ingredients: string[];
  pairings: Array<{
    ingredient1: string;
    ingredient2: string;
    confidence: number;
    compounds: string[];
  }>;
  flavorProfile: {
    dominant: string[];
    supporting: string[];
    compounds: string[];
  };
  complexity: number;
  suggestions: Array<{
    ingredient: string;
    reason: string;
    confidence: number;
  }>;
}

export interface SubstitutionSuggestion {
  original: string;
  substitutes: Array<{
    ingredient: string;
    reason: string;
    confidence: number;
  }>;
}

type RecipeContext = 'bread' | 'pastry' | 'cake' | 'cookie' | 'other';

export class IngredientAnalyzerService {
  /**
   * Extract ingredients from a recipe
   */
  extractIngredients(recipe: Recipe): string[] {
    const ingredients = recipe.ingredients as any;
    if (Array.isArray(ingredients)) {
      return ingredients.map((ing: any) =>
        typeof ing === 'string' ? ing : ing.name || ''
      );
    }
    return [];
  }

  /**
   * Analyze ingredient combinations in a recipe
   */
  async analyzeIngredientCombination(
    ingredients: string[],
    recipeContext?: RecipeContext
  ): Promise<IngredientAnalysis> {
    if (!ingredients || ingredients.length < 2) {
      throw new AppError(400, 'At least 2 ingredients are required for analysis');
    }

    const normalizedIngredients = ingredients.map((i) => i.toLowerCase().trim());

    // Find all pairings between the ingredients
    const pairings: Array<{
      ingredient1: string;
      ingredient2: string;
      confidence: number;
      compounds: string[];
    }> = [];

    const allCompounds = new Set<string>();
    const compoundCounts = new Map<string, number>();

    for (let i = 0; i < normalizedIngredients.length; i++) {
      for (let j = i + 1; j < normalizedIngredients.length; j++) {
        const result = await flavorPairingService.getSharedCompounds(
          normalizedIngredients[i],
          normalizedIngredients[j]
        );

        if (result.pairing) {
          pairings.push({
            ingredient1: result.pairing.ingredient1,
            ingredient2: result.pairing.ingredient2,
            confidence: result.pairing.confidence,
            compounds: result.pairing.compounds,
          });

          // Track compounds
          result.pairing.compounds.forEach((compound) => {
            allCompounds.add(compound);
            compoundCounts.set(compound, (compoundCounts.get(compound) || 0) + 1);
          });
        }
      }
    }

    // Determine flavor profile
    const sortedCompounds = Array.from(compoundCounts.entries()).sort(
      (a, b) => b[1] - a[1]
    );

    const dominantCompounds = sortedCompounds
      .slice(0, 3)
      .map((entry) => entry[0]);
    const supportingCompounds = sortedCompounds
      .slice(3, 6)
      .map((entry) => entry[0]);

    const flavorProfile = {
      dominant: dominantCompounds,
      supporting: supportingCompounds,
      compounds: Array.from(allCompounds),
    };

    // Calculate complexity score
    const complexity = this.calculateComplexityScore(
      normalizedIngredients.length,
      pairings.length,
      allCompounds.size,
      recipeContext
    );

    // Get ingredient suggestions
    const suggestions = await flavorPairingService.suggestComplementaryIngredients(
      normalizedIngredients,
      5
    );

    return {
      ingredients: normalizedIngredients,
      pairings,
      flavorProfile,
      complexity,
      suggestions,
    };
  }

  /**
   * Calculate recipe complexity score
   * Score from 1-10 based on:
   * - Number of ingredients
   * - Number of successful pairings
   * - Diversity of flavor compounds
   * - Recipe context
   */
  private calculateComplexityScore(
    ingredientCount: number,
    pairingCount: number,
    compoundCount: number,
    recipeContext?: RecipeContext
  ): number {
    let score = 0;

    // Ingredient count factor (0-3 points)
    if (ingredientCount <= 5) {
      score += 1;
    } else if (ingredientCount <= 10) {
      score += 2;
    } else {
      score += 3;
    }

    // Pairing density factor (0-3 points)
    const maxPairings = (ingredientCount * (ingredientCount - 1)) / 2;
    const pairingDensity = pairingCount / maxPairings;
    if (pairingDensity >= 0.7) {
      score += 3;
    } else if (pairingDensity >= 0.4) {
      score += 2;
    } else if (pairingDensity >= 0.2) {
      score += 1;
    }

    // Compound diversity factor (0-3 points)
    if (compoundCount >= 10) {
      score += 3;
    } else if (compoundCount >= 5) {
      score += 2;
    } else if (compoundCount >= 2) {
      score += 1;
    }

    // Recipe context modifier (0-1 points)
    if (recipeContext === 'pastry' || recipeContext === 'cake') {
      score += 1; // These tend to be more complex
    }

    return Math.min(10, score);
  }

  /**
   * Suggest substitutions for an ingredient using flavor pairings
   */
  async suggestSubstitutions(
    ingredient: string,
    recipeIngredients: string[]
  ): Promise<SubstitutionSuggestion> {
    const normalizedIngredient = ingredient.toLowerCase().trim();
    const normalizedRecipeIngredients = recipeIngredients.map((i) =>
      i.toLowerCase().trim()
    );

    // Find ingredients that pair well with the same ingredients
    const originalPairings = await flavorPairingService.getPairingsForIngredient(
      normalizedIngredient,
      20
    );

    // Get ingredients this one pairs with
    const pairedWith = new Set<string>();
    originalPairings.forEach((pairing) => {
      if (pairing.ingredient1.toLowerCase() === normalizedIngredient) {
        pairedWith.add(pairing.ingredient2.toLowerCase());
      } else {
        pairedWith.add(pairing.ingredient1.toLowerCase());
      }
    });

    // Find substitute candidates that pair with the same ingredients
    const substituteCandidates = new Map<
      string,
      { pairCount: number; avgConfidence: number }
    >();

    for (const paired of pairedWith) {
      const pairings = await flavorPairingService.getPairingsForIngredient(
        paired,
        30
      );

      for (const pairing of pairings) {
        const candidate =
          pairing.ingredient1.toLowerCase() === paired
            ? pairing.ingredient2
            : pairing.ingredient1;

        // Skip if it's the original ingredient or already in recipe
        if (
          candidate.toLowerCase() === normalizedIngredient ||
          normalizedRecipeIngredients.includes(candidate.toLowerCase())
        ) {
          continue;
        }

        if (!substituteCandidates.has(candidate)) {
          substituteCandidates.set(candidate, {
            pairCount: 1,
            avgConfidence: pairing.confidence,
          });
        } else {
          const existing = substituteCandidates.get(candidate)!;
          existing.pairCount += 1;
          existing.avgConfidence =
            (existing.avgConfidence * (existing.pairCount - 1) +
              pairing.confidence) /
            existing.pairCount;
        }
      }
    }

    // Convert to sorted array
    const substitutes = Array.from(substituteCandidates.entries())
      .map(([ingredient, data]) => ({
        ingredient,
        reason: `Pairs with ${data.pairCount} of the same ingredients`,
        confidence: data.avgConfidence * (data.pairCount / pairedWith.size),
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);

    return {
      original: ingredient,
      substitutes,
    };
  }

  /**
   * Identify flavor profiles (sweet, savory, umami, etc.)
   */
  async identifyFlavorProfiles(
    ingredients: string[]
  ): Promise<{
    profiles: Array<{ type: string; strength: number }>;
    category: string;
  }> {
    const normalizedIngredients = ingredients.map((i) => i.toLowerCase().trim());

    // Get all pairings to determine category distribution
    const pairings = await prisma.flavorPairing.findMany({
      where: {
        OR: normalizedIngredients.flatMap((ing) => [
          { ingredient1: { equals: ing, mode: 'insensitive' } },
          { ingredient2: { equals: ing, mode: 'insensitive' } },
        ]),
      },
    });

    // Count categories
    const categoryCount = { sweet: 0, savory: 0 };
    pairings.forEach((p) => {
      if (p.category === 'sweet') categoryCount.sweet++;
      else if (p.category === 'savory') categoryCount.savory++;
    });

    const totalPairings = categoryCount.sweet + categoryCount.savory;
    const category =
      categoryCount.sweet > categoryCount.savory ? 'sweet' : 'savory';

    // Define flavor profiles based on common ingredients
    const flavorMap: Record<
      string,
      Array<{ keyword: string; type: string; strength: number }>
    > = {
      sweet: [
        { keyword: 'sugar', type: 'sweet', strength: 1.0 },
        { keyword: 'honey', type: 'sweet', strength: 0.9 },
        { keyword: 'chocolate', type: 'sweet', strength: 0.9 },
        { keyword: 'vanilla', type: 'sweet', strength: 0.8 },
        { keyword: 'caramel', type: 'sweet', strength: 0.9 },
      ],
      savory: [
        { keyword: 'salt', type: 'savory', strength: 1.0 },
        { keyword: 'cheese', type: 'savory', strength: 0.9 },
        { keyword: 'herb', type: 'savory', strength: 0.8 },
        { keyword: 'garlic', type: 'savory', strength: 0.9 },
      ],
      umami: [
        { keyword: 'miso', type: 'umami', strength: 1.0 },
        { keyword: 'soy', type: 'umami', strength: 0.9 },
        { keyword: 'mushroom', type: 'umami', strength: 0.8 },
      ],
      citrus: [
        { keyword: 'lemon', type: 'citrus', strength: 1.0 },
        { keyword: 'orange', type: 'citrus', strength: 0.9 },
        { keyword: 'lime', type: 'citrus', strength: 0.9 },
      ],
      spice: [
        { keyword: 'cinnamon', type: 'spice', strength: 0.9 },
        { keyword: 'ginger', type: 'spice', strength: 0.8 },
        { keyword: 'nutmeg', type: 'spice', strength: 0.7 },
        { keyword: 'cardamom', type: 'spice', strength: 0.8 },
      ],
    };

    const profileScores = new Map<string, number>();

    // Analyze ingredients for flavor profiles
    for (const ingredient of normalizedIngredients) {
      for (const profiles of Object.values(flavorMap)) {
        for (const profile of profiles) {
          if (ingredient.includes(profile.keyword)) {
            profileScores.set(
              profile.type,
              (profileScores.get(profile.type) || 0) + profile.strength
            );
          }
        }
      }
    }

    // Normalize scores
    const maxScore = Math.max(...Array.from(profileScores.values()), 1);
    const profiles = Array.from(profileScores.entries())
      .map(([type, score]) => ({
        type,
        strength: score / maxScore,
      }))
      .filter((p) => p.strength > 0.3) // Only include significant profiles
      .sort((a, b) => b.strength - a.strength);

    return {
      profiles,
      category,
    };
  }

  /**
   * Suggest ingredient additions to enhance flavor
   */
  async suggestEnhancements(
    recipeId: string,
    limit: number = 5
  ): Promise<
    Array<{
      ingredient: string;
      reason: string;
      type: 'flavor' | 'texture' | 'visual';
      confidence: number;
    }>
  > {
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      throw new AppError(404, 'Recipe not found');
    }

    const ingredients = this.extractIngredients(recipe);
    const suggestions = await flavorPairingService.suggestComplementaryIngredients(
      ingredients,
      limit * 2
    );

    // Categorize suggestions by type
    const enhancements = suggestions.map((suggestion) => {
      // Determine enhancement type based on ingredient
      let type: 'flavor' | 'texture' | 'visual' = 'flavor';

      const ingredient = suggestion.ingredient.toLowerCase();
      if (
        ingredient.includes('seed') ||
        ingredient.includes('nut') ||
        ingredient.includes('crunch')
      ) {
        type = 'texture';
      } else if (
        ingredient.includes('color') ||
        ingredient.includes('zest') ||
        ingredient.includes('glaze')
      ) {
        type = 'visual';
      }

      return {
        ingredient: suggestion.ingredient,
        reason: suggestion.reason,
        type,
        confidence: suggestion.confidence,
      };
    });

    return enhancements.slice(0, limit);
  }

  /**
   * Analyze recipe and provide comprehensive insights
   */
  async getRecipeInsights(
    recipeId: string
  ): Promise<{
    analysis: IngredientAnalysis;
    flavorProfiles: {
      profiles: Array<{ type: string; strength: number }>;
      category: string;
    };
    enhancements: Array<{
      ingredient: string;
      reason: string;
      type: 'flavor' | 'texture' | 'visual';
      confidence: number;
    }>;
  }> {
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      throw new AppError(404, 'Recipe not found');
    }

    const ingredients = this.extractIngredients(recipe);

    // Determine recipe context from tags
    let recipeContext: RecipeContext = 'other';
    if (recipe.tags.includes('bread')) recipeContext = 'bread';
    else if (recipe.tags.includes('pastry')) recipeContext = 'pastry';
    else if (recipe.tags.includes('cake')) recipeContext = 'cake';
    else if (recipe.tags.includes('cookie')) recipeContext = 'cookie';

    const [analysis, flavorProfiles, enhancements] = await Promise.all([
      this.analyzeIngredientCombination(ingredients, recipeContext),
      this.identifyFlavorProfiles(ingredients),
      this.suggestEnhancements(recipeId, 5),
    ]);

    return {
      analysis,
      flavorProfiles,
      enhancements,
    };
  }
}

// Export singleton instance
export const ingredientAnalyzerService = new IngredientAnalyzerService();
