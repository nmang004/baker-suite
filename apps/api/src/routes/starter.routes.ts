import { Router } from 'express';
import { starterController } from '../controllers/starter.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// All starter routes require authentication
router.use(requireAuth);

// Starter CRUD routes
router.get('/', starterController.list.bind(starterController));
router.get('/:id', starterController.getById.bind(starterController));
router.post('/', starterController.create.bind(starterController));
router.patch('/:id', starterController.update.bind(starterController));
router.delete('/:id', starterController.delete.bind(starterController));

// Starter health and statistics
router.get('/:id/health', starterController.getHealth.bind(starterController));
router.get('/:id/statistics', starterController.getStatistics.bind(starterController));

// Feeding routes
router.post('/:id/feed', starterController.feed.bind(starterController));
router.get('/:id/feedings', starterController.getFeedings.bind(starterController));
router.patch('/:id/feedings/:feedingId', starterController.updateFeeding.bind(starterController));
router.delete('/:id/feedings/:feedingId', starterController.deleteFeeding.bind(starterController));

export default router;
