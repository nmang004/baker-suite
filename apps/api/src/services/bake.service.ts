import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';
import {
  CreateBakeInput,
  UpdateBakeInput,
  ListBakesQuery,
} from '../validators/bake.validator';

const prisma = new PrismaClient();

export class BakeService {
  /**
   * Create a new bake log
   */
  async createBake(userId: string, data: CreateBakeInput) {
    // Verify recipe exists and belongs to user
    const recipe = await prisma.recipe.findFirst({
      where: { id: data.recipeId, userId },
    });

    if (!recipe) {
      throw new AppError(404, 'Recipe not found');
    }

    // Create bake
    const bake = await prisma.bake.create({
      data: {
        userId,
        recipeId: data.recipeId,
        rating: data.rating,
        notes: data.notes,
        photos: data.photos,
        issues: data.issues,
        weather: data.weather as any,
      },
      include: {
        recipe: {
          select: {
            id: true,
            name: true,
            tags: true,
          },
        },
      },
    });

    return bake;
  }

  /**
   * List user's bakes with pagination and filtering
   */
  async listBakes(userId: string, query: ListBakesQuery) {
    const { page, limit, recipeId, minRating, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { userId };

    if (recipeId) {
      where.recipeId = recipeId;
    }

    if (minRating) {
      where.rating = { gte: minRating };
    }

    // Execute query with pagination
    const [bakes, total] = await Promise.all([
      prisma.bake.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          recipe: {
            select: {
              id: true,
              name: true,
              tags: true,
            },
          },
        },
      }),
      prisma.bake.count({ where }),
    ]);

    return {
      data: bakes,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single bake by ID
   */
  async getBake(userId: string, bakeId: string) {
    const bake = await prisma.bake.findFirst({
      where: { id: bakeId, userId },
      include: {
        recipe: {
          select: {
            id: true,
            name: true,
            description: true,
            tags: true,
            ratios: true,
          },
        },
      },
    });

    if (!bake) {
      throw new AppError(404, 'Bake not found');
    }

    return bake;
  }

  /**
   * Update an existing bake
   */
  async updateBake(userId: string, bakeId: string, data: UpdateBakeInput) {
    // Check if bake exists and belongs to user
    await this.getBake(userId, bakeId);

    // Update bake
    const bake = await prisma.bake.update({
      where: { id: bakeId },
      data: {
        rating: data.rating,
        notes: data.notes,
        photos: data.photos,
        issues: data.issues,
        weather: data.weather as any,
      },
      include: {
        recipe: {
          select: {
            id: true,
            name: true,
            tags: true,
          },
        },
      },
    });

    return bake;
  }

  /**
   * Delete a bake
   */
  async deleteBake(userId: string, bakeId: string) {
    // Check if bake exists and belongs to user
    await this.getBake(userId, bakeId);

    // Delete bake
    await prisma.bake.delete({
      where: { id: bakeId },
    });

    return { success: true };
  }

  /**
   * Get bakes grouped by recipe (for tracking improvements)
   */
  async getBakesByRecipe(userId: string, recipeId: string) {
    // Verify recipe exists and belongs to user
    const recipe = await prisma.recipe.findFirst({
      where: { id: recipeId, userId },
    });

    if (!recipe) {
      throw new AppError(404, 'Recipe not found');
    }

    // Get all bakes for this recipe
    const bakes = await prisma.bake.findMany({
      where: { userId, recipeId },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate statistics
    const ratings = bakes.filter((b) => b.rating).map((b) => b.rating!);
    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : null;

    // Count issue occurrences
    const issueCount: Record<string, number> = {};
    bakes.forEach((bake) => {
      bake.issues.forEach((issue) => {
        issueCount[issue] = (issueCount[issue] || 0) + 1;
      });
    });

    return {
      recipe: {
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
      },
      bakes,
      stats: {
        totalBakes: bakes.length,
        averageRating: avgRating,
        commonIssues: Object.entries(issueCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([issue, count]) => ({ issue, count })),
      },
    };
  }

  /**
   * Get user's baking statistics
   */
  async getBakeStats(userId: string) {
    // Get all user's bakes
    const bakes = await prisma.bake.findMany({
      where: { userId },
      include: {
        recipe: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (bakes.length === 0) {
      return {
        totalBakes: 0,
        averageRating: null,
        mostCommonIssues: [],
        mostBakedRecipe: null,
        bakingStreak: 0,
        ratingTrend: [],
      };
    }

    // Calculate average rating
    const ratings = bakes.filter((b) => b.rating).map((b) => b.rating!);
    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : null;

    // Count issue occurrences
    const issueCount: Record<string, number> = {};
    bakes.forEach((bake) => {
      bake.issues.forEach((issue) => {
        issueCount[issue] = (issueCount[issue] || 0) + 1;
      });
    });

    // Find most baked recipe
    const recipeCount: Record<string, { id: string; name: string; count: number }> = {};
    bakes.forEach((bake) => {
      const recipeId = bake.recipe.id;
      if (!recipeCount[recipeId]) {
        recipeCount[recipeId] = {
          id: recipeId,
          name: bake.recipe.name,
          count: 0,
        };
      }
      recipeCount[recipeId].count++;
    });

    const mostBakedRecipe = Object.values(recipeCount).sort((a, b) => b.count - a.count)[0];

    // Calculate baking streak (consecutive days with bakes)
    const bakeDates = bakes.map((b) => b.createdAt).sort((a, b) => b.getTime() - a.getTime());
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const bakeDate of bakeDates) {
      const bakeDay = new Date(bakeDate);
      bakeDay.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((currentDate.getTime() - bakeDay.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0 || diffDays === 1) {
        streak++;
        currentDate = bakeDay;
      } else {
        break;
      }
    }

    // Calculate rating trend over time (last 10 bakes with ratings)
    const ratedBakes = bakes
      .filter((b) => b.rating)
      .slice(0, 10)
      .reverse();

    const ratingTrend = ratedBakes.map((bake) => ({
      date: bake.createdAt,
      rating: bake.rating!,
      recipeName: bake.recipe.name,
    }));

    return {
      totalBakes: bakes.length,
      averageRating: avgRating,
      mostCommonIssues: Object.entries(issueCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([issue, count]) => ({ issue, count })),
      mostBakedRecipe,
      bakingStreak: streak,
      ratingTrend,
    };
  }
}

// Export singleton instance
export const bakeService = new BakeService();
