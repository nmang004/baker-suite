import { Router } from 'express';
import recipeRoutes from './recipe.routes';
import weatherRoutes from './weather.routes';
import timelineRoutes from './timeline.routes';
import bakeRoutes from './bake.routes';
import starterRoutes from './starter.routes';
import flavorRoutes from './flavor.routes';
import discoveryRoutes from './discovery.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Recipe routes
router.use('/recipes', recipeRoutes);

// Weather routes
router.use('/weather', weatherRoutes);

// Timeline routes
router.use('/timelines', timelineRoutes);

// Bake routes
router.use('/bakes', bakeRoutes);

// Starter routes
router.use('/starters', starterRoutes);

// Flavor pairing routes
router.use('/flavor', flavorRoutes);

// Discovery routes
router.use('/discovery', discoveryRoutes);

export default router;
