import { Router } from 'express';
import { discoveryController } from '../controllers/discovery.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

/**
 * GET /api/v1/discovery/trending
 * Get trending recipes
 * Query params: limit?
 * Public endpoint
 */
router.get('/trending', (req, res, next) =>
  discoveryController.getTrendingRecipes(req, res, next)
);

/**
 * GET /api/v1/discovery/search
 * Search recipes by ingredients
 * Query params: ingredients (required, comma-separated), excludeIngredients?, limit?
 * Public endpoint
 */
router.get('/search', (req, res, next) =>
  discoveryController.searchRecipes(req, res, next)
);

/**
 * GET /api/v1/discovery/recipes
 * Discover recipes with filters
 * Query params: page?, limit?, ingredients?, tags?, excludeIngredients?, difficulty?, maxTime?, sortBy?
 * Public endpoint
 */
router.get('/recipes', (req, res, next) =>
  discoveryController.discoverRecipes(req, res, next)
);

/**
 * GET /api/v1/discovery/similar/:recipeId
 * Find similar recipes to a given recipe
 * Query params: limit?
 * Public endpoint
 */
router.get('/similar/:recipeId', (req, res, next) =>
  discoveryController.getSimilarRecipes(req, res, next)
);

/**
 * GET /api/v1/discovery/recommendations
 * Get personalized recipe recommendations
 * Query params: limit?, type?, excludeBaked?
 * Requires authentication
 */
router.get('/recommendations', requireAuth, (req, res, next) =>
  discoveryController.getRecommendations(req, res, next)
);

/**
 * GET /api/v1/discovery/next
 * Get "What to bake next" suggestion
 * Requires authentication
 */
router.get('/next', requireAuth, (req, res, next) =>
  discoveryController.getWhatToMakeNext(req, res, next)
);

/**
 * GET /api/v1/discovery/feed
 * Get personalized discovery feed (40-30-20-10 algorithm)
 * Query params: limit?
 * Requires authentication
 */
router.get('/feed', requireAuth, (req, res, next) =>
  discoveryController.getDiscoveryFeed(req, res, next)
);

export default router;
