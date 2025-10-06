import { Request, Response, NextFunction } from 'express';
import { timelineService } from '../services/timeline.service';
import {
  createTimelineSchema,
  updateTimelineStatusSchema,
  listTimelinesQuerySchema,
} from '../validators/timeline.validator';
import { AppError } from '../middleware/error.middleware';

export class TimelineController {
  /**
   * POST /api/v1/timelines
   * Create a new timeline
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      // Validate request body
      const data = createTimelineSchema.parse(req.body);

      // Create timeline (convert targetTime string to Date)
      const timeline = await timelineService.createTimeline(userId, {
        ...data,
        targetTime: new Date(data.targetTime),
      });

      res.status(201).json({ data: timeline });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/timelines
   * List user's timelines
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      // Validate and parse query parameters
      const query = listTimelinesQuerySchema.parse(req.query);

      // Get timelines
      const result = await timelineService.listTimelines(userId, query);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/timelines/:id
   * Get a single timeline by ID
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const timelineId = req.params.id;

      const timeline = await timelineService.getTimeline(userId, timelineId);

      // Get current and next steps
      const currentStep = timelineService.getCurrentStep(timeline);
      const nextStep = timelineService.getNextStep(timeline);

      res.json({
        data: {
          ...timeline,
          currentStep,
          nextStep,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/timelines/:id/status
   * Update timeline status
   */
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const timelineId = req.params.id;

      // Validate request body
      const data = updateTimelineStatusSchema.parse(req.body);

      // Update timeline status
      const timeline = await timelineService.updateTimelineStatus(
        userId,
        timelineId,
        data
      );

      res.json({ data: timeline });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/timelines/:id
   * Delete a timeline
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const timelineId = req.params.id;

      await timelineService.deleteTimeline(userId, timelineId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const timelineController = new TimelineController();
