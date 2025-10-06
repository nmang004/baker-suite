import { Router } from 'express';
import { timelineController } from '../controllers/timeline.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// All timeline routes require authentication
router.use(requireAuth);

/**
 * GET /api/v1/timelines
 * List user's timelines with optional filtering
 * Query params: status, page, limit
 */
router.get('/', (req, res, next) => timelineController.list(req, res, next));

/**
 * POST /api/v1/timelines
 * Create a new timeline
 * Body: { recipeId, targetTime, location }
 */
router.post('/', (req, res, next) => timelineController.create(req, res, next));

/**
 * GET /api/v1/timelines/:id
 * Get a single timeline by ID
 */
router.get('/:id', (req, res, next) =>
  timelineController.getById(req, res, next)
);

/**
 * PATCH /api/v1/timelines/:id/status
 * Update timeline status (pause, resume, complete, cancel)
 * Body: { status, stepId? }
 */
router.patch('/:id/status', (req, res, next) =>
  timelineController.updateStatus(req, res, next)
);

/**
 * DELETE /api/v1/timelines/:id
 * Delete a timeline
 */
router.delete('/:id', (req, res, next) =>
  timelineController.delete(req, res, next)
);

export default router;
