import { Router } from 'express';
import { flavorController } from '../controllers/flavor.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

/**
 * GET /api/v1/flavor/trending
 * Get trending/popular pairings
 * Query params: limit?
 */
router.get('/trending', (req, res, next) =>
  flavorController.getTrendingPairings(req, res, next)
);

/**
 * GET /api/v1/flavor/ingredients
 * Get all available ingredients from pairing database
 * Public endpoint for autocomplete
 */
router.get('/ingredients', (req, res, next) =>
  flavorController.getAllIngredients(req, res, next)
);

/**
 * GET /api/v1/flavor/cuisines
 * Get all available cuisines from pairing database
 * Public endpoint for filters
 */
router.get('/cuisines', (req, res, next) =>
  flavorController.getAllCuisines(req, res, next)
);

/**
 * GET /api/v1/flavor/compounds
 * Get all flavor compounds from pairing database
 * Public endpoint for educational content
 */
router.get('/compounds', (req, res, next) =>
  flavorController.getAllCompounds(req, res, next)
);

/**
 * GET /api/v1/flavor/pairings
 * Search pairings with filters
 * Query params: ingredient?, category?, cuisine?, minConfidence?, limit?
 */
router.get('/pairings', (req, res, next) =>
  flavorController.searchPairings(req, res, next)
);

/**
 * POST /api/v1/flavor/analyze
 * Analyze ingredient combination
 * Body: { ingredients: string[], recipeContext?: string }
 */
router.post('/analyze', (req, res, next) =>
  flavorController.analyzeIngredients(req, res, next)
);

/**
 * GET /api/v1/flavor/compounds/:compound
 * Get pairings by flavor compound
 * Query params: limit?
 */
router.get('/compounds/:compound', (req, res, next) =>
  flavorController.getPairingsByCompound(req, res, next)
);

/**
 * GET /api/v1/flavor/pairings/:ingredient
 * Get pairings for a specific ingredient
 * Query params: limit?
 */
router.get('/pairings/:ingredient', (req, res, next) =>
  flavorController.getPairingsForIngredient(req, res, next)
);

/**
 * GET /api/v1/flavor/suggest/:recipeId
 * Suggest ingredient additions for a recipe
 * Query params: limit?
 * Requires authentication
 */
router.get('/suggest/:recipeId', requireAuth, (req, res, next) =>
  flavorController.suggestForRecipe(req, res, next)
);

/**
 * GET /api/v1/flavor/insights/:recipeId
 * Get comprehensive flavor insights for a recipe
 * Requires authentication
 */
router.get('/insights/:recipeId', requireAuth, (req, res, next) =>
  flavorController.getRecipeInsights(req, res, next)
);

export default router;
