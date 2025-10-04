import { Router } from 'express';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// TODO: Add recipe routes
// router.use('/recipes', recipeRoutes);

// TODO: Add bake routes
// router.use('/bakes', bakeRoutes);

// TODO: Add starter routes
// router.use('/starters', starterRoutes);

// TODO: Add timeline routes
// router.use('/timelines', timelineRoutes);

// TODO: Add weather routes
// router.use('/weather', weatherRoutes);

export default router;
