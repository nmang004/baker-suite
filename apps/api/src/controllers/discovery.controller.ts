import { Request, Response, NextFunction } from 'express';
import { recipeDiscoveryService } from '../services/recipe-discovery.service';
import {
  discoverRecipesQuerySchema,
  searchRecipesQuerySchema,
  recommendationsQuerySchema,
  similarRecipesQuerySchema,
  trendingRecipesQuerySchema,
  discoveryFeedQuerySchema,
} from '../validators/discovery.validator';
import { AppError } from '../middleware/error.middleware';

export class DiscoveryController {
  /**
   * GET /api/v1/discovery/recipes
   * Discover recipes with filters
   */
  async discoverRecipes(req: Request, res: Response, next: NextFunction) {
    try {
      const query = discoverRecipesQuerySchema.parse(req.query);

      const result = await recipeDiscoveryService.discoverRecipes({
        page: query.page,
        limit: query.limit,
        ingredients: query.ingredients,
        tags: query.tags,
        excludeIngredients: query.excludeIngredients,
        difficulty: query.difficulty,
        maxTime: query.maxTime,
        sortBy: query.sortBy,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/discovery/search
   * Search recipes by ingredients
   */
  async searchRecipes(req: Request, res: Response, next: NextFunction) {
    try {
      const query = searchRecipesQuerySchema.parse(req.query);

      const recipes = await recipeDiscoveryService.searchRecipesByIngredients(
        query.ingredients,
        query.excludeIngredients,
        query.limit
      );

      res.json({ data: recipes });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/discovery/recommendations
   * Get personalized recipe recommendations
   */
  async getRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const query = recommendationsQuerySchema.parse(req.query);

      const recommendations = await recipeDiscoveryService.getRecommendations(
        userId,
        {
          limit: query.limit,
          type: query.type,
          excludeBaked: query.excludeBaked,
        }
      );

      res.json({ data: recommendations });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/discovery/next
   * Get "What to bake next" suggestion
   */
  async getWhatToMakeNext(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const suggestion = await recipeDiscoveryService.getWhatToMakeNext(userId);

      res.json({ data: suggestion });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/discovery/similar/:recipeId
   * Find similar recipes to a given recipe
   */
  async getSimilarRecipes(req: Request, res: Response, next: NextFunction) {
    try {
      const recipeId = req.params.recipeId;
      const query = similarRecipesQuerySchema.parse(req.query);

      const similarRecipes = await recipeDiscoveryService.getSimilarRecipes(
        recipeId,
        query.limit
      );

      res.json({ data: similarRecipes });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/discovery/trending
   * Get trending recipes
   */
  async getTrendingRecipes(req: Request, res: Response, next: NextFunction) {
    try {
      const query = trendingRecipesQuerySchema.parse(req.query);

      const trendingRecipes = await recipeDiscoveryService.getTrendingRecipes(
        query.limit
      );

      res.json({ data: trendingRecipes });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/discovery/feed
   * Get personalized discovery feed (40-30-20-10 algorithm)
   */
  async getDiscoveryFeed(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const query = discoveryFeedQuerySchema.parse(req.query);

      const feed = await recipeDiscoveryService.getDiscoveryFeed(
        userId,
        query.limit
      );

      res.json({ data: feed });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const discoveryController = new DiscoveryController();
