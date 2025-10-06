import { PrismaClient, Recipe, Bake } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

const prisma = new PrismaClient();

export interface DiscoverRecipesParams {
  page?: number;
  limit?: number;
  ingredients?: string[];
  tags?: string[];
  excludeIngredients?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  maxTime?: number;
  sortBy?: 'relevance' | 'rating' | 'recent' | 'popular';
}

export interface RecommendationParams {
  limit?: number;
  type?: 'similar' | 'new' | 'seasonal' | 'personalized';
  excludeBaked?: boolean;
}

export interface RecipeWithScore extends Recipe {
  score?: number;
  matchScore?: number;
  reason?: string;
}

type UserSkillLevel = 'beginner' | 'intermediate' | 'advanced';

export class RecipeDiscoveryService {
  /**
   * Detect user's skill level based on baking history
   */
  private async detectUserSkillLevel(userId: string): Promise<UserSkillLevel> {
    const bakes = await prisma.bake.findMany({
      where: { userId },
      select: { rating: true },
    });

    const bakeCount = bakes.length;
    const avgRating =
      bakes.length > 0
        ? bakes.reduce((sum, b) => sum + (b.rating || 0), 0) / bakes.length
        : 0;

    if (bakeCount < 5 || avgRating < 3.5) {
      return 'beginner';
    } else if (bakeCount <= 20 || avgRating < 4.5) {
      return 'intermediate';
    } else {
      return 'advanced';
    }
  }

  /**
   * Get user's most baked recipes
   */
  private async getMostBakedRecipes(
    userId: string,
    limit: number = 5
  ): Promise<string[]> {
    const result = await prisma.bake.groupBy({
      by: ['recipeId'],
      where: { userId },
      _count: { recipeId: true },
      orderBy: { _count: { recipeId: 'desc' } },
      take: limit,
    });

    return result.map((r) => r.recipeId);
  }

  /**
   * Get user's highest rated bakes
   */
  private async getHighestRatedRecipes(
    userId: string,
    limit: number = 5
  ): Promise<string[]> {
    const bakes = await prisma.bake.findMany({
      where: {
        userId,
        rating: { gte: 4 },
      },
      orderBy: { rating: 'desc' },
      take: limit,
      select: { recipeId: true },
    });

    return [...new Set(bakes.map((b) => b.recipeId))];
  }

  /**
   * Extract ingredients from recipes
   */
  private extractIngredients(recipe: Recipe): string[] {
    const ingredients = recipe.ingredients as any;
    if (Array.isArray(ingredients)) {
      return ingredients.map((ing: any) =>
        typeof ing === 'string' ? ing : ing.name || ''
      );
    }
    return [];
  }

  /**
   * Get frequently used ingredients by user
   */
  private async getFrequentIngredients(
    userId: string,
    limit: number = 10
  ): Promise<string[]> {
    const bakes = await prisma.bake.findMany({
      where: { userId },
      include: { recipe: true },
    });

    const ingredientCounts = new Map<string, number>();

    for (const bake of bakes) {
      const ingredients = this.extractIngredients(bake.recipe);
      ingredients.forEach((ing) => {
        const normalized = ing.toLowerCase().trim();
        ingredientCounts.set(
          normalized,
          (ingredientCounts.get(normalized) || 0) + 1
        );
      });
    }

    return Array.from(ingredientCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map((entry) => entry[0]);
  }

  /**
   * Calculate ingredient overlap between two recipes
   */
  private calculateIngredientOverlap(
    ingredients1: string[],
    ingredients2: string[]
  ): number {
    const set1 = new Set(ingredients1.map((i) => i.toLowerCase().trim()));
    const set2 = new Set(ingredients2.map((i) => i.toLowerCase().trim()));

    const intersection = [...set1].filter((i) => set2.has(i));
    const union = new Set([...set1, ...set2]);

    return union.size > 0 ? intersection.length / union.size : 0;
  }

  /**
   * Calculate tag similarity between two recipes
   */
  private calculateTagSimilarity(tags1: string[], tags2: string[]): number {
    const set1 = new Set(tags1.map((t) => t.toLowerCase()));
    const set2 = new Set(tags2.map((t) => t.toLowerCase()));

    const intersection = [...set1].filter((t) => set2.has(t));
    const union = new Set([...set1, ...set2]);

    return union.size > 0 ? intersection.length / union.size : 0;
  }

  /**
   * Get seasonal ingredients based on current month
   */
  private getSeasonalIngredients(): string[] {
    const month = new Date().getMonth(); // 0-11

    const seasonalMap: Record<string, string[]> = {
      spring: ['lemon', 'strawberry', 'rhubarb', 'lavender', 'mint'],
      summer: ['blueberry', 'peach', 'cherry', 'raspberry', 'apricot'],
      fall: ['apple', 'pumpkin', 'cinnamon', 'nutmeg', 'maple', 'pear'],
      winter: ['chocolate', 'orange', 'ginger', 'cranberry', 'hazelnut'],
    };

    if (month >= 2 && month <= 4) return seasonalMap.spring; // Mar-May
    if (month >= 5 && month <= 7) return seasonalMap.summer; // Jun-Aug
    if (month >= 8 && month <= 10) return seasonalMap.fall; // Sep-Nov
    return seasonalMap.winter; // Dec-Feb
  }

  /**
   * Search recipes by ingredients
   */
  async searchRecipesByIngredients(
    ingredients: string[],
    excludeIngredients: string[] = [],
    limit: number = 20
  ): Promise<RecipeWithScore[]> {
    if (!ingredients || ingredients.length === 0) {
      throw new AppError(400, 'At least one ingredient is required');
    }

    const normalizedIngredients = ingredients.map((i) => i.toLowerCase().trim());
    const normalizedExclude = excludeIngredients.map((i) => i.toLowerCase().trim());

    // Get all recipes
    const allRecipes = await prisma.recipe.findMany({
      include: {
        _count: {
          select: { bakes: true },
        },
      },
    });

    // Filter and score recipes
    const scoredRecipes: RecipeWithScore[] = [];

    for (const recipe of allRecipes) {
      const recipeIngredients = this.extractIngredients(recipe).map((i) =>
        i.toLowerCase().trim()
      );

      // Check for excluded ingredients
      const hasExcluded = normalizedExclude.some((exc) =>
        recipeIngredients.some((ing) => ing.includes(exc))
      );
      if (hasExcluded) continue;

      // Calculate match score
      const matches = normalizedIngredients.filter((searchIng) =>
        recipeIngredients.some((recipeIng) => recipeIng.includes(searchIng))
      );

      if (matches.length > 0) {
        const matchScore = matches.length / normalizedIngredients.length;
        scoredRecipes.push({
          ...recipe,
          matchScore,
          score: matchScore * 10 + (recipe._count?.bakes || 0) * 0.1,
        });
      }
    }

    // Sort by score and return top results
    return scoredRecipes
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, limit);
  }

  /**
   * Discover recipes with advanced filters
   */
  async discoverRecipes(
    params: DiscoverRecipesParams
  ): Promise<{ data: RecipeWithScore[]; meta: any }> {
    const {
      page = 1,
      limit = 20,
      ingredients,
      tags,
      excludeIngredients,
      difficulty,
      maxTime,
      sortBy = 'relevance',
    } = params;

    const skip = (page - 1) * limit;

    // If ingredients are specified, use ingredient-based search
    if (ingredients && ingredients.length > 0) {
      const results = await this.searchRecipesByIngredients(
        ingredients,
        excludeIngredients,
        limit * 2 // Get more to allow for filtering
      );

      // Apply additional filters
      let filtered = results;

      if (tags && tags.length > 0) {
        filtered = filtered.filter((r) =>
          tags.some((tag) => r.tags.includes(tag))
        );
      }

      if (difficulty) {
        filtered = filtered.filter((r) => r.tags.includes(difficulty));
      }

      // Pagination
      const paged = filtered.slice(skip, skip + limit);

      return {
        data: paged,
        meta: {
          page,
          limit,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / limit),
        },
      };
    }

    // Standard search without ingredients
    const where: any = {};

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    if (difficulty) {
      where.tags = { has: difficulty };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'popular') {
      // Would need to join with bakes count - simplified for now
      orderBy = { createdAt: 'desc' };
    }

    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          _count: {
            select: { bakes: true },
          },
        },
      }),
      prisma.recipe.count({ where }),
    ]);

    return {
      data: recipes,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get personalized recipe recommendations
   */
  async getRecommendations(
    userId: string,
    params: RecommendationParams
  ): Promise<RecipeWithScore[]> {
    const { limit = 10, type = 'personalized', excludeBaked = true } = params;

    // Get user's baked recipes to exclude
    const bakedRecipes = excludeBaked
      ? await prisma.bake
          .findMany({
            where: { userId },
            select: { recipeId: true },
          })
          .then((bakes) => new Set(bakes.map((b) => b.recipeId)))
      : new Set();

    // Get user preferences
    const [
      skillLevel,
      mostBaked,
      highestRated,
      frequentIngredients,
    ] = await Promise.all([
      this.detectUserSkillLevel(userId),
      this.getMostBakedRecipes(userId),
      this.getHighestRatedRecipes(userId),
      this.getFrequentIngredients(userId),
    ]);

    const favoriteRecipes = await prisma.recipe.findMany({
      where: {
        id: { in: [...mostBaked, ...highestRated] },
      },
    });

    // Get all available recipes
    const allRecipes = await prisma.recipe.findMany({
      where: {
        id: { notIn: Array.from(bakedRecipes) },
      },
      include: {
        _count: {
          select: { bakes: true },
        },
      },
    });

    // Score each recipe
    const scoredRecipes: RecipeWithScore[] = allRecipes.map((recipe) => {
      let score = 0;
      let reasons: string[] = [];

      // Ingredient overlap with favorites (30%)
      const ingredientScores = favoriteRecipes.map((fav) => {
        const favIngredients = this.extractIngredients(fav);
        const recipeIngredients = this.extractIngredients(recipe);
        return this.calculateIngredientOverlap(favIngredients, recipeIngredients);
      });
      const avgIngredientScore =
        ingredientScores.length > 0
          ? ingredientScores.reduce((a, b) => a + b, 0) / ingredientScores.length
          : 0;
      score += avgIngredientScore * 30;
      if (avgIngredientScore > 0.3) {
        reasons.push('Similar to your favorites');
      }

      // Tag similarity with high-rated bakes (25%)
      const tagScores = favoriteRecipes.map((fav) =>
        this.calculateTagSimilarity(fav.tags, recipe.tags)
      );
      const avgTagScore =
        tagScores.length > 0
          ? tagScores.reduce((a, b) => a + b, 0) / tagScores.length
          : 0;
      score += avgTagScore * 25;

      // Difficulty match to user's skill level (20%)
      const hasDifficultyTag = recipe.tags.includes(skillLevel);
      if (hasDifficultyTag) {
        score += 20;
        reasons.push('Matches your skill level');
      }

      // Trending/popularity factor (10%)
      const popularity = recipe._count?.bakes || 0;
      score += Math.min(10, popularity * 0.5);
      if (popularity > 5) {
        reasons.push('Popular recipe');
      }

      // Uses frequent ingredients (15%)
      const recipeIngredients = this.extractIngredients(recipe).map((i) =>
        i.toLowerCase().trim()
      );
      const usesFrequentIngredients = frequentIngredients.filter((freq) =>
        recipeIngredients.some((ing) => ing.includes(freq))
      );
      if (usesFrequentIngredients.length > 0) {
        score += usesFrequentIngredients.length * 5;
        reasons.push(`Uses ingredients you love`);
      }

      // Seasonal boost (bonus)
      const seasonalIngredients = this.getSeasonalIngredients();
      const isSeasonsal = seasonalIngredients.some((seasonal) =>
        recipeIngredients.some((ing) => ing.includes(seasonal))
      );
      if (isSeasonsal) {
        score += 5;
        reasons.push('Seasonal recipe');
      }

      return {
        ...recipe,
        score,
        reason: reasons.length > 0 ? reasons[0] : 'Recommended for you',
      };
    });

    // Sort by score and return top results
    return scoredRecipes
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, limit);
  }

  /**
   * Get "What to bake next" suggestion
   */
  async getWhatToMakeNext(userId: string): Promise<RecipeWithScore | null> {
    const recommendations = await this.getRecommendations(userId, {
      limit: 5,
      type: 'personalized',
      excludeBaked: true,
    });

    if (recommendations.length === 0) {
      // Fallback to trending if no personalized recommendations
      const trending = await this.getTrendingRecipes(5);
      return trending[0] || null;
    }

    // Get the top recommendation with enhanced reasoning
    const topPick = recommendations[0];

    // Check if user has a starter
    const hasStarter = await prisma.starter.count({ where: { userId } });
    if (hasStarter > 0) {
      const recipeIngredients = this.extractIngredients(topPick);
      const usesStarter = recipeIngredients.some((ing) =>
        ing.toLowerCase().includes('starter')
      );
      if (usesStarter && topPick.reason) {
        topPick.reason = 'Uses your starter! ' + topPick.reason;
      }
    }

    return topPick;
  }

  /**
   * Find similar recipes to a given recipe
   */
  async getSimilarRecipes(
    recipeId: string,
    limit: number = 10
  ): Promise<RecipeWithScore[]> {
    const targetRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!targetRecipe) {
      throw new AppError(404, 'Recipe not found');
    }

    const targetIngredients = this.extractIngredients(targetRecipe);
    const targetTags = targetRecipe.tags;

    const allRecipes = await prisma.recipe.findMany({
      where: {
        id: { not: recipeId },
      },
      include: {
        _count: {
          select: { bakes: true },
        },
      },
    });

    const scoredRecipes: RecipeWithScore[] = allRecipes.map((recipe) => {
      const recipeIngredients = this.extractIngredients(recipe);

      const ingredientSimilarity = this.calculateIngredientOverlap(
        targetIngredients,
        recipeIngredients
      );
      const tagSimilarity = this.calculateTagSimilarity(targetTags, recipe.tags);

      const score = ingredientSimilarity * 60 + tagSimilarity * 40;

      return {
        ...recipe,
        score,
        reason: `${Math.round(ingredientSimilarity * 100)}% similar ingredients`,
      };
    });

    return scoredRecipes
      .filter((r) => (r.score || 0) > 10) // Only return reasonably similar recipes
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, limit);
  }

  /**
   * Get trending recipes
   */
  async getTrendingRecipes(limit: number = 20): Promise<RecipeWithScore[]> {
    // Get recipes with most bakes in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentBakes = await prisma.bake.groupBy({
      by: ['recipeId'],
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: { recipeId: true },
      orderBy: { _count: { recipeId: 'desc' } },
      take: limit,
    });

    const recipeIds = recentBakes.map((b) => b.recipeId);

    if (recipeIds.length === 0) {
      // Fallback to most baked overall
      const allBakes = await prisma.bake.groupBy({
        by: ['recipeId'],
        _count: { recipeId: true },
        orderBy: { _count: { recipeId: 'desc' } },
        take: limit,
      });
      recipeIds.push(...allBakes.map((b) => b.recipeId));
    }

    const recipes = await prisma.recipe.findMany({
      where: { id: { in: recipeIds } },
    });

    // Map with bake counts
    const countMap = new Map(
      recentBakes.map((b) => [b.recipeId, b._count.recipeId])
    );

    return recipes.map((recipe) => ({
      ...recipe,
      score: countMap.get(recipe.id) || 0,
      reason: 'Trending this week',
    }));
  }

  /**
   * Get personalized discovery feed
   * Implements the 40-30-20-10 algorithm
   */
  async getDiscoveryFeed(
    userId: string,
    limit: number = 20
  ): Promise<RecipeWithScore[]> {
    const bakedRecipes = await prisma.bake
      .findMany({
        where: { userId },
        select: { recipeId: true },
      })
      .then((bakes) => new Set(bakes.map((b) => b.recipeId)));

    // 40% based on user preferences
    const personalizedCount = Math.ceil(limit * 0.4);
    const personalized = await this.getRecommendations(userId, {
      limit: personalizedCount,
      type: 'personalized',
      excludeBaked: true,
    });

    // 30% popular recipes
    const popularCount = Math.ceil(limit * 0.3);
    const popular = (await this.getTrendingRecipes(popularCount * 2)).filter(
      (r) => !bakedRecipes.has(r.id)
    ).slice(0, popularCount);

    // 20% complementary to user's skills
    const skillLevel = await this.detectUserSkillLevel(userId);
    const nextLevel: UserSkillLevel =
      skillLevel === 'beginner'
        ? 'intermediate'
        : skillLevel === 'intermediate'
        ? 'advanced'
        : 'advanced';

    const complementaryCount = Math.ceil(limit * 0.2);
    const complementary = await prisma.recipe.findMany({
      where: {
        tags: { has: nextLevel },
        id: { notIn: Array.from(bakedRecipes) },
      },
      take: complementaryCount,
    });

    // 10% random discovery
    const randomCount = Math.ceil(limit * 0.1);
    const random = await prisma.recipe.findMany({
      where: {
        id: { notIn: Array.from(bakedRecipes) },
      },
      take: randomCount * 3,
      orderBy: { createdAt: 'desc' },
    });
    const randomPicks = random
      .sort(() => Math.random() - 0.5)
      .slice(0, randomCount);

    // Combine and shuffle
    const feed = [
      ...personalized.map((r) => ({ ...r, feedType: 'personalized' })),
      ...popular.map((r) => ({ ...r, feedType: 'popular', reason: 'Trending' })),
      ...complementary.map((r) => ({
        ...r,
        feedType: 'skill-building',
        reason: 'Expand your skills',
      })),
      ...randomPicks.map((r) => ({
        ...r,
        feedType: 'discovery',
        reason: 'Something new',
      })),
    ];

    // Shuffle to mix categories
    return feed.sort(() => Math.random() - 0.5).slice(0, limit);
  }
}

// Export singleton instance
export const recipeDiscoveryService = new RecipeDiscoveryService();
