import { Router } from 'express';
import { bakeController } from '../controllers/bake.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// All bake routes require authentication
router.use(requireAuth);

/**
 * GET /api/v1/bakes/stats
 * Get user's baking statistics
 * Note: This must come before /:id to avoid matching "stats" as an ID
 */
router.get('/stats', (req, res, next) => bakeController.getStats(req, res, next));

/**
 * GET /api/v1/bakes/recipe/:recipeId
 * Get bakes for a specific recipe with stats
 */
router.get('/recipe/:recipeId', (req, res, next) =>
  bakeController.getByRecipe(req, res, next)
);

/**
 * GET /api/v1/bakes
 * List user's bakes with pagination and filtering
 * Query params: page, limit, recipeId, minRating, sortBy, sortOrder
 */
router.get('/', (req, res, next) => bakeController.list(req, res, next));

/**
 * POST /api/v1/bakes
 * Create a new bake log
 * Body: { recipeId, rating?, notes?, photos?, issues?, weather? }
 */
router.post('/', (req, res, next) => bakeController.create(req, res, next));

/**
 * GET /api/v1/bakes/:id
 * Get a single bake by ID
 */
router.get('/:id', (req, res, next) => bakeController.getById(req, res, next));

/**
 * PATCH /api/v1/bakes/:id
 * Update an existing bake
 * Body: { rating?, notes?, photos?, issues?, weather? }
 */
router.patch('/:id', (req, res, next) => bakeController.update(req, res, next));

/**
 * DELETE /api/v1/bakes/:id
 * Delete a bake
 */
router.delete('/:id', (req, res, next) => bakeController.delete(req, res, next));

export default router;
