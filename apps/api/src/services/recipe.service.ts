import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';
import {
  CreateRecipeInput,
  UpdateRecipeInput,
  ListRecipesQuery,
  BakerRatios,
} from '../validators/recipe.validator';

const prisma = new PrismaClient();

export class RecipeService {
  /**
   * Calculate and validate baker's percentages
   * Ensures flour is always 100% and other ingredients are relative to flour
   */
  private validateRatios(ratios: BakerRatios): void {
    // Flour must always be 100%
    if (ratios.flour !== 100) {
      throw new AppError(400, "Flour percentage must be 100 in baker's ratios");
    }

    // Calculate hydration (water percentage relative to flour)
    if (ratios.water < 30 || ratios.water > 150) {
      throw new AppError(
        400,
        'Hydration (water percentage) must be between 30% and 150%'
      );
    }

    // Validate salt range (typically 1-3%)
    if (ratios.salt < 0.5 || ratios.salt > 5) {
      throw new AppError(400, 'Salt percentage must be between 0.5% and 5%');
    }

    // Validate yeast if present (typically 0.1-3%)
    if (ratios.yeast && (ratios.yeast < 0.1 || ratios.yeast > 5)) {
      throw new AppError(400, 'Yeast percentage must be between 0.1% and 5%');
    }

    // Validate starter if present (typically 10-50%)
    if (ratios.starter && (ratios.starter < 5 || ratios.starter > 100)) {
      throw new AppError(400, 'Starter percentage must be between 5% and 100%');
    }
  }

  /**
   * Calculate hydration percentage
   * Hydration = (water / flour) * 100
   */
  private calculateHydration(ratios: BakerRatios): number {
    return (ratios.water / ratios.flour) * 100;
  }

  /**
   * Calculate total dough weight for given flour weight
   */
  private calculateDoughWeight(ratios: BakerRatios): number {
    const total = Object.values(ratios).reduce<number>((sum, val) => {
      return typeof val === 'number' ? sum + val : sum;
    }, 0);
    return total;
  }

  /**
   * List user's recipes with pagination and filtering
   */
  async listRecipes(userId: string, query: ListRecipesQuery) {
    const { page, limit, search, tags, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { userId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tags) {
      const tagArray = tags.split(',').map((t) => t.trim());
      where.tags = { hasSome: tagArray };
    }

    // Execute query with pagination
    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
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
   * Get a single recipe by ID
   */
  async getRecipe(userId: string, recipeId: string) {
    const recipe = await prisma.recipe.findFirst({
      where: { id: recipeId, userId },
    });

    if (!recipe) {
      throw new AppError(404, 'Recipe not found');
    }

    return recipe;
  }

  /**
   * Create a new recipe
   */
  async createRecipe(userId: string, data: CreateRecipeInput) {
    // Validate ratios
    this.validateRatios(data.ratios);

    // Calculate hydration for metadata
    const hydration = this.calculateHydration(data.ratios);
    const doughWeight = this.calculateDoughWeight(data.ratios);

    // Create recipe
    const recipe = await prisma.recipe.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        ingredients: data.ingredients as any,
        instructions: data.instructions,
        tags: data.tags,
        ratios: {
          ...data.ratios,
          hydration, // Store calculated hydration
          totalPercentage: doughWeight, // Store total percentage
        } as any,
      },
    });

    return recipe;
  }

  /**
   * Update an existing recipe
   */
  async updateRecipe(
    userId: string,
    recipeId: string,
    data: UpdateRecipeInput
  ) {
    // Check if recipe exists and belongs to user
    await this.getRecipe(userId, recipeId);

    // If ratios are being updated, validate them
    if (data.ratios) {
      this.validateRatios(data.ratios);
    }

    // Prepare update data
    const updateData: any = {};

    if (data.name) updateData.name = data.name;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.ingredients) updateData.ingredients = data.ingredients;
    if (data.instructions) updateData.instructions = data.instructions;
    if (data.tags) updateData.tags = data.tags;

    if (data.ratios) {
      const hydration = this.calculateHydration(data.ratios);
      const doughWeight = this.calculateDoughWeight(data.ratios);
      updateData.ratios = {
        ...data.ratios,
        hydration,
        totalPercentage: doughWeight,
      };
    }

    // Update recipe
    const recipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: updateData,
    });

    return recipe;
  }

  /**
   * Delete a recipe
   */
  async deleteRecipe(userId: string, recipeId: string) {
    // Check if recipe exists and belongs to user
    await this.getRecipe(userId, recipeId);

    // Delete recipe (cascades to related bakes and timelines)
    await prisma.recipe.delete({
      where: { id: recipeId },
    });

    return { success: true };
  }
}

// Export singleton instance
export const recipeService = new RecipeService();
