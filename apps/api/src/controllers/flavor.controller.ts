import { Request, Response, NextFunction } from 'express';
import { flavorPairingService } from '../services/flavor-pairing.service';
import { ingredientAnalyzerService } from '../services/ingredient-analyzer.service';
import {
  searchPairingsQuerySchema,
  getPairingsQuerySchema,
  searchByCompoundQuerySchema,
  analyzeIngredientsSchema,
  suggestForRecipeQuerySchema,
} from '../validators/flavor.validator';
import { AppError } from '../middleware/error.middleware';

export class FlavorController {
  /**
   * GET /api/v1/flavor/pairings/:ingredient
   * Get pairings for a specific ingredient
   */
  async getPairingsForIngredient(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const ingredient = req.params.ingredient;
      const query = getPairingsQuerySchema.parse(req.query);

      const pairings = await flavorPairingService.getPairingsForIngredient(
        ingredient,
        query.limit
      );

      res.json({ data: pairings });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/flavor/pairings
   * Search pairings with filters
   */
  async searchPairings(req: Request, res: Response, next: NextFunction) {
    try {
      const query = searchPairingsQuerySchema.parse(req.query);

      const pairings = await flavorPairingService.searchPairings({
        ingredient: query.ingredient,
        category: query.category,
        cuisine: query.cuisine,
        minConfidence: query.minConfidence,
        limit: query.limit,
      });

      res.json({ data: pairings });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/flavor/compounds/:compound
   * Get pairings by flavor compound
   */
  async getPairingsByCompound(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const compound = req.params.compound;
      const query = searchByCompoundQuerySchema.parse({
        compound,
        ...req.query,
      });

      const pairings = await flavorPairingService.searchByCompound(
        query.compound,
        query.limit
      );

      res.json({ data: pairings });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/flavor/analyze
   * Analyze ingredient combination
   */
  async analyzeIngredients(req: Request, res: Response, next: NextFunction) {
    try {
      const data = analyzeIngredientsSchema.parse(req.body);

      const analysis = await ingredientAnalyzerService.analyzeIngredientCombination(
        data.ingredients,
        data.recipeContext
      );

      res.json({ data: analysis });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/flavor/suggest/:recipeId
   * Suggest ingredient additions for a recipe
   */
  async suggestForRecipe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const recipeId = req.params.recipeId;
      const query = suggestForRecipeQuerySchema.parse(req.query);

      const suggestions = await ingredientAnalyzerService.suggestEnhancements(
        recipeId,
        query.limit
      );

      res.json({ data: suggestions });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/flavor/trending
   * Get trending/popular pairings
   */
  async getTrendingPairings(req: Request, res: Response, next: NextFunction) {
    try {
      const query = getPairingsQuerySchema.parse(req.query);

      const pairings = await flavorPairingService.getTrendingPairings(
        query.limit
      );

      res.json({ data: pairings });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/flavor/ingredients
   * Get all available ingredients from pairing database
   */
  async getAllIngredients(req: Request, res: Response, next: NextFunction) {
    try {
      const ingredients = await flavorPairingService.getAllIngredients();

      res.json({ data: ingredients });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/flavor/cuisines
   * Get all available cuisines from pairing database
   */
  async getAllCuisines(req: Request, res: Response, next: NextFunction) {
    try {
      const cuisines = await flavorPairingService.getAllCuisines();

      res.json({ data: cuisines });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/flavor/compounds
   * Get all flavor compounds from pairing database
   */
  async getAllCompounds(req: Request, res: Response, next: NextFunction) {
    try {
      const compounds = await flavorPairingService.getAllCompounds();

      res.json({ data: compounds });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/flavor/insights/:recipeId
   * Get comprehensive flavor insights for a recipe
   */
  async getRecipeInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const recipeId = req.params.recipeId;

      const insights = await ingredientAnalyzerService.getRecipeInsights(
        recipeId
      );

      res.json({ data: insights });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const flavorController = new FlavorController();
