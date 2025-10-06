import { Router } from 'express';
import { recipeController } from '../controllers/recipe.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// All recipe routes require authentication
router.use(requireAuth);

/**
 * GET /api/v1/recipes
 * List user's recipes with pagination and filtering
 * Query params: page, limit, search, tags, sortBy, sortOrder
 */
router.get('/', (req, res, next) => recipeController.list(req, res, next));

/**
 * POST /api/v1/recipes
 * Create a new recipe
 * Body: { name, description, ingredients, instructions, tags, ratios }
 */
router.post('/', (req, res, next) => recipeController.create(req, res, next));

/**
 * GET /api/v1/recipes/:id
 * Get a single recipe by ID
 */
router.get('/:id', (req, res, next) =>
  recipeController.getById(req, res, next)
);

/**
 * PUT /api/v1/recipes/:id
 * Update an existing recipe
 * Body: { name?, description?, ingredients?, instructions?, tags?, ratios? }
 */
router.put('/:id', (req, res, next) =>
  recipeController.update(req, res, next)
);

/**
 * DELETE /api/v1/recipes/:id
 * Delete a recipe
 */
router.delete('/:id', (req, res, next) =>
  recipeController.delete(req, res, next)
);

export default router;
