import { Request, Response, NextFunction } from 'express';
import { recipeService } from '../services/recipe.service';
import {
  createRecipeSchema,
  updateRecipeSchema,
  listRecipesQuerySchema,
} from '../validators/recipe.validator';
import { AppError } from '../middleware/error.middleware';

export class RecipeController {
  /**
   * GET /api/v1/recipes
   * List user's recipes with pagination and filtering
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      // Validate and parse query parameters
      const query = listRecipesQuerySchema.parse(req.query);

      // Get recipes
      const result = await recipeService.listRecipes(userId, query);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/recipes/:id
   * Get a single recipe by ID
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const recipeId = req.params.id;

      const recipe = await recipeService.getRecipe(userId, recipeId);

      res.json({ data: recipe });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/recipes
   * Create a new recipe
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      // Validate request body
      const data = createRecipeSchema.parse(req.body);

      // Create recipe
      const recipe = await recipeService.createRecipe(userId, data);

      res.status(201).json({ data: recipe });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/recipes/:id
   * Update an existing recipe
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const recipeId = req.params.id;

      // Validate request body
      const data = updateRecipeSchema.parse(req.body);

      // Update recipe
      const recipe = await recipeService.updateRecipe(userId, recipeId, data);

      res.json({ data: recipe });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/recipes/:id
   * Delete a recipe
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const recipeId = req.params.id;

      await recipeService.deleteRecipe(userId, recipeId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const recipeController = new RecipeController();
