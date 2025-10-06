import { Request, Response, NextFunction } from 'express';
import { starterService } from '../services/starter.service';
import { starterFeedingService } from '../services/starter-feeding.service';
import {
  createStarterSchema,
  updateStarterSchema,
  listStartersQuerySchema,
  createFeedingSchema,
  updateFeedingSchema,
  listFeedingsQuerySchema,
} from '../validators/starter.validator';
import { AppError } from '../middleware/error.middleware';

export class StarterController {
  /**
   * GET /api/v1/starters
   * List user's starters with pagination and filtering
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      // Validate and parse query parameters
      const query = listStartersQuerySchema.parse(req.query);

      // Get starters
      const result = await starterService.listStarters(userId, query);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/starters/:id
   * Get a single starter by ID with recent feedings
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const starterId = req.params.id;

      const starter = await starterService.getStarter(userId, starterId);

      res.json({ data: starter });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/starters
   * Create a new starter
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      // Validate request body
      const data = createStarterSchema.parse(req.body);

      // Create starter
      const starter = await starterService.createStarter(userId, data);

      res.status(201).json({ data: starter });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/starters/:id
   * Update an existing starter
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const starterId = req.params.id;

      // Validate request body
      const data = updateStarterSchema.parse(req.body);

      // Update starter
      const starter = await starterService.updateStarter(userId, starterId, data);

      res.json({ data: starter });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/starters/:id
   * Delete a starter
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const starterId = req.params.id;

      await starterService.deleteStarter(userId, starterId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/starters/:id/health
   * Get starter health metrics
   */
  async getHealth(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const starterId = req.params.id;

      const health = await starterService.getStarterHealth(userId, starterId);

      res.json({ data: health });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/starters/:id/feed
   * Log a feeding for a starter
   */
  async feed(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const starterId = req.params.id;

      // Validate request body
      const data = createFeedingSchema.parse(req.body);

      // Log feeding
      const feeding = await starterFeedingService.logFeeding(userId, starterId, data);

      res.status(201).json({ data: feeding });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/starters/:id/feedings
   * Get feeding history for a starter
   */
  async getFeedings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const starterId = req.params.id;

      // Validate and parse query parameters
      const query = listFeedingsQuerySchema.parse(req.query);

      // Get feeding history
      const result = await starterFeedingService.getFeedingHistory(userId, starterId, query);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/starters/:id/feedings/:feedingId
   * Update a feeding
   */
  async updateFeeding(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const starterId = req.params.id;
      const feedingId = req.params.feedingId;

      // Validate request body
      const data = updateFeedingSchema.parse(req.body);

      // Update feeding
      const feeding = await starterFeedingService.updateFeeding(
        userId,
        starterId,
        feedingId,
        data
      );

      res.json({ data: feeding });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/starters/:id/feedings/:feedingId
   * Delete a feeding
   */
  async deleteFeeding(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const starterId = req.params.id;
      const feedingId = req.params.feedingId;

      await starterFeedingService.deleteFeeding(userId, starterId, feedingId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/starters/:id/statistics
   * Get feeding statistics for a starter
   */
  async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const starterId = req.params.id;

      const stats = await starterFeedingService.getFeedingStatistics(userId, starterId);

      res.json({ data: stats });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const starterController = new StarterController();
