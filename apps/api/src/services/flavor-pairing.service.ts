import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

const prisma = new PrismaClient();

export interface PairingResult {
  id: string;
  ingredient1: string;
  ingredient2: string;
  confidence: number;
  compounds: string[];
  cuisine: string[];
  category: string;
}

export interface SearchPairingsParams {
  ingredient?: string;
  category?: 'sweet' | 'savory';
  cuisine?: string;
  minConfidence?: number;
  limit?: number;
}

export class FlavorPairingService {
  /**
   * Get all compatible ingredients for a given ingredient
   */
  async getPairingsForIngredient(
    ingredient: string,
    limit: number = 20
  ): Promise<PairingResult[]> {
    const normalizedIngredient = ingredient.toLowerCase().trim();

    const pairings = await prisma.flavorPairing.findMany({
      where: {
        OR: [
          { ingredient1: { equals: normalizedIngredient, mode: 'insensitive' } },
          { ingredient2: { equals: normalizedIngredient, mode: 'insensitive' } },
        ],
      },
      take: limit,
      orderBy: { confidence: 'desc' },
    });

    return pairings;
  }

  /**
   * Find pairings by confidence score range
   */
  async getPairingsByConfidence(
    minConfidence: number,
    maxConfidence: number = 1.0,
    limit: number = 50
  ): Promise<PairingResult[]> {
    if (minConfidence < 0 || minConfidence > 1 || maxConfidence < 0 || maxConfidence > 1) {
      throw new AppError(400, 'Confidence values must be between 0 and 1');
    }

    if (minConfidence > maxConfidence) {
      throw new AppError(400, 'Min confidence cannot be greater than max confidence');
    }

    const pairings = await prisma.flavorPairing.findMany({
      where: {
        confidence: {
          gte: minConfidence,
          lte: maxConfidence,
        },
      },
      take: limit,
      orderBy: { confidence: 'desc' },
    });

    return pairings;
  }

  /**
   * Filter pairings by category (sweet/savory)
   */
  async getPairingsByCategory(
    category: 'sweet' | 'savory',
    limit: number = 50
  ): Promise<PairingResult[]> {
    const pairings = await prisma.flavorPairing.findMany({
      where: { category },
      take: limit,
      orderBy: { confidence: 'desc' },
    });

    return pairings;
  }

  /**
   * Filter pairings by cuisine type
   */
  async getPairingsByCuisine(
    cuisine: string,
    limit: number = 50
  ): Promise<PairingResult[]> {
    const normalizedCuisine = cuisine.toLowerCase().trim();

    const pairings = await prisma.flavorPairing.findMany({
      where: {
        cuisine: {
          has: normalizedCuisine,
        },
      },
      take: limit,
      orderBy: { confidence: 'desc' },
    });

    return pairings;
  }

  /**
   * Get shared flavor compounds between two ingredients
   */
  async getSharedCompounds(
    ingredient1: string,
    ingredient2: string
  ): Promise<{ pairing: PairingResult | null; compounds: string[] }> {
    const normalizedIng1 = ingredient1.toLowerCase().trim();
    const normalizedIng2 = ingredient2.toLowerCase().trim();

    // Try to find the pairing in both directions
    const pairing = await prisma.flavorPairing.findFirst({
      where: {
        OR: [
          {
            ingredient1: { equals: normalizedIng1, mode: 'insensitive' },
            ingredient2: { equals: normalizedIng2, mode: 'insensitive' },
          },
          {
            ingredient1: { equals: normalizedIng2, mode: 'insensitive' },
            ingredient2: { equals: normalizedIng1, mode: 'insensitive' },
          },
        ],
      },
    });

    return {
      pairing,
      compounds: pairing?.compounds || [],
    };
  }

  /**
   * Search pairings by compound name
   */
  async searchByCompound(
    compound: string,
    limit: number = 50
  ): Promise<PairingResult[]> {
    const normalizedCompound = compound.toLowerCase().trim();

    const pairings = await prisma.flavorPairing.findMany({
      where: {
        compounds: {
          has: normalizedCompound,
        },
      },
      take: limit,
      orderBy: { confidence: 'desc' },
    });

    return pairings;
  }

  /**
   * Advanced search with multiple filters
   */
  async searchPairings(params: SearchPairingsParams): Promise<PairingResult[]> {
    const { ingredient, category, cuisine, minConfidence, limit = 50 } = params;

    const where: any = {};

    if (ingredient) {
      const normalizedIngredient = ingredient.toLowerCase().trim();
      where.OR = [
        { ingredient1: { contains: normalizedIngredient, mode: 'insensitive' } },
        { ingredient2: { contains: normalizedIngredient, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (cuisine) {
      where.cuisine = { has: cuisine.toLowerCase().trim() };
    }

    if (minConfidence !== undefined) {
      where.confidence = { gte: minConfidence };
    }

    const pairings = await prisma.flavorPairing.findMany({
      where,
      take: limit,
      orderBy: { confidence: 'desc' },
    });

    return pairings;
  }

  /**
   * Suggest complementary ingredients for a recipe
   * Analyzes existing ingredients and suggests additions
   */
  async suggestComplementaryIngredients(
    recipeIngredients: string[],
    limit: number = 10
  ): Promise<Array<{ ingredient: string; confidence: number; reason: string; pairsWith: string[] }>> {
    if (!recipeIngredients || recipeIngredients.length === 0) {
      throw new AppError(400, 'Recipe must have at least one ingredient');
    }

    // Normalize ingredients
    const normalizedIngredients = recipeIngredients.map((ing) =>
      ing.toLowerCase().trim()
    );

    // Find all pairings for the recipe ingredients
    const pairings = await prisma.flavorPairing.findMany({
      where: {
        OR: normalizedIngredients.flatMap((ing) => [
          { ingredient1: { equals: ing, mode: 'insensitive' } },
          { ingredient2: { equals: ing, mode: 'insensitive' } },
        ]),
      },
      orderBy: { confidence: 'desc' },
    });

    // Track suggested ingredients with their scores
    const suggestions = new Map<
      string,
      { confidence: number; pairsWith: Set<string>; count: number }
    >();

    for (const pairing of pairings) {
      const normalizedIng1 = pairing.ingredient1.toLowerCase();
      const normalizedIng2 = pairing.ingredient2.toLowerCase();

      // Determine which ingredient is the suggestion
      let suggestion: string;
      let pairsWith: string;

      if (normalizedIngredients.includes(normalizedIng1)) {
        suggestion = pairing.ingredient2;
        pairsWith = pairing.ingredient1;
      } else {
        suggestion = pairing.ingredient1;
        pairsWith = pairing.ingredient2;
      }

      // Skip if already in recipe
      if (normalizedIngredients.includes(suggestion.toLowerCase())) {
        continue;
      }

      // Update or create suggestion entry
      if (!suggestions.has(suggestion)) {
        suggestions.set(suggestion, {
          confidence: pairing.confidence,
          pairsWith: new Set([pairsWith]),
          count: 1,
        });
      } else {
        const existing = suggestions.get(suggestion)!;
        existing.pairsWith.add(pairsWith);
        existing.count += 1;
        // Boost confidence based on multiple pairings
        existing.confidence = Math.min(
          1,
          existing.confidence + pairing.confidence * 0.1
        );
      }
    }

    // Convert to array and sort by score
    const results = Array.from(suggestions.entries())
      .map(([ingredient, data]) => ({
        ingredient,
        confidence: data.confidence,
        reason:
          data.count > 1
            ? `Pairs well with ${data.count} ingredients in your recipe`
            : `Pairs well with ${Array.from(data.pairsWith)[0]}`,
        pairsWith: Array.from(data.pairsWith),
      }))
      .sort((a, b) => {
        // Sort by confidence * count (ingredients that pair with multiple items rank higher)
        const scoreA = a.confidence * a.pairsWith.length;
        const scoreB = b.confidence * b.pairsWith.length;
        return scoreB - scoreA;
      })
      .slice(0, limit);

    return results;
  }

  /**
   * Get trending/popular pairings
   * For now, returns high-confidence pairings
   * In the future, could track usage statistics
   */
  async getTrendingPairings(limit: number = 20): Promise<PairingResult[]> {
    const pairings = await prisma.flavorPairing.findMany({
      where: {
        confidence: { gte: 0.7 }, // Only high-confidence pairings
      },
      take: limit,
      orderBy: { confidence: 'desc' },
    });

    return pairings;
  }

  /**
   * Calculate pairing compatibility score between two ingredients
   * Uses compound overlap and database confidence
   */
  calculateCompatibilityScore(
    ingredient1Compounds: string[],
    ingredient2Compounds: string[],
    dbConfidence?: number
  ): number {
    // If we have a database pairing, use that confidence
    if (dbConfidence !== undefined) {
      return dbConfidence;
    }

    // Calculate based on compound overlap
    const compounds1 = new Set(ingredient1Compounds);
    const compounds2 = new Set(ingredient2Compounds);

    const sharedCompounds = [...compounds1].filter((c) => compounds2.has(c));
    const totalUniqueCompounds = new Set([...compounds1, ...compounds2]).size;

    if (totalUniqueCompounds === 0) {
      return 0;
    }

    // Base score from compound overlap
    const overlapScore = sharedCompounds.length / totalUniqueCompounds;

    // Apply confidence factor (reduce for very small overlap)
    const confidenceFactor = sharedCompounds.length >= 2 ? 1 : 0.7;

    return Math.min(1, overlapScore * confidenceFactor);
  }

  /**
   * Get all unique ingredients from the pairing database
   * Useful for autocomplete
   */
  async getAllIngredients(): Promise<string[]> {
    const pairings = await prisma.flavorPairing.findMany({
      select: {
        ingredient1: true,
        ingredient2: true,
      },
    });

    const ingredientSet = new Set<string>();
    pairings.forEach((p) => {
      ingredientSet.add(p.ingredient1);
      ingredientSet.add(p.ingredient2);
    });

    return Array.from(ingredientSet).sort();
  }

  /**
   * Get all unique cuisines from the pairing database
   */
  async getAllCuisines(): Promise<string[]> {
    const pairings = await prisma.flavorPairing.findMany({
      select: { cuisine: true },
    });

    const cuisineSet = new Set<string>();
    pairings.forEach((p) => {
      p.cuisine.forEach((c) => cuisineSet.add(c));
    });

    return Array.from(cuisineSet).sort();
  }

  /**
   * Get all unique compounds from the pairing database
   */
  async getAllCompounds(): Promise<string[]> {
    const pairings = await prisma.flavorPairing.findMany({
      select: { compounds: true },
    });

    const compoundSet = new Set<string>();
    pairings.forEach((p) => {
      p.compounds.forEach((c) => compoundSet.add(c));
    });

    return Array.from(compoundSet).sort();
  }
}

// Export singleton instance
export const flavorPairingService = new FlavorPairingService();
