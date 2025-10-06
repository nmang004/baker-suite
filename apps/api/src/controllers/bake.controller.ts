import { Request, Response, NextFunction } from 'express';
import { bakeService } from '../services/bake.service';
import {
  createBakeSchema,
  updateBakeSchema,
  listBakesQuerySchema,
} from '../validators/bake.validator';
import { AppError } from '../middleware/error.middleware';

export class BakeController {
  /**
   * GET /api/v1/bakes
   * List user's bakes with pagination and filtering
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      // Validate and parse query parameters
      const query = listBakesQuerySchema.parse(req.query);

      // Get bakes
      const result = await bakeService.listBakes(userId, query);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/bakes/:id
   * Get a single bake by ID
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const bakeId = req.params.id;

      const bake = await bakeService.getBake(userId, bakeId);

      res.json({ data: bake });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/bakes
   * Create a new bake log
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      // Validate request body
      const data = createBakeSchema.parse(req.body);

      // Create bake
      const bake = await bakeService.createBake(userId, data);

      res.status(201).json({ data: bake });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/bakes/:id
   * Update an existing bake
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const bakeId = req.params.id;

      // Validate request body
      const data = updateBakeSchema.parse(req.body);

      // Update bake
      const bake = await bakeService.updateBake(userId, bakeId, data);

      res.json({ data: bake });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/bakes/:id
   * Delete a bake
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const bakeId = req.params.id;

      await bakeService.deleteBake(userId, bakeId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/bakes/stats
   * Get user's baking statistics
   */
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const stats = await bakeService.getBakeStats(userId);

      res.json({ data: stats });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/bakes/recipe/:recipeId
   * Get bakes for a specific recipe with stats
   */
  async getByRecipe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const recipeId = req.params.recipeId;

      const result = await bakeService.getBakesByRecipe(userId, recipeId);

      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const bakeController = new BakeController();
