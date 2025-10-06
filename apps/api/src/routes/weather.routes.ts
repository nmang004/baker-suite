import { Router, Request, Response, NextFunction } from 'express';
import { weatherService } from '../services/weather.service';
import { requireAuth } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import { z } from 'zod';

const router = Router();

// All weather routes require authentication
router.use(requireAuth);

// Query schema for weather endpoint
const weatherQuerySchema = z.object({
  location: z
    .string()
    .min(1, 'Location is required')
    .refine(
      (loc) => {
        // Validate format: either city name or lat,lon coordinates
        const isCoordinates = /^-?\d+\.?\d*,-?\d+\.?\d*$/.test(loc);
        const isCityName = /^[a-zA-Z\s,]+$/.test(loc);
        return isCoordinates || isCityName;
      },
      {
        message:
          'Location must be a city name or coordinates in format: lat,lon',
      }
    ),
});

/**
 * GET /api/v1/weather
 * Get current weather data for a location
 * Query params: location (city name or "lat,lon")
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      throw new AppError(401, 'Unauthorized');
    }

    // Validate query parameters
    const { location } = weatherQuerySchema.parse(req.query);

    // Get weather data
    const weatherData = await weatherService.getWeather(location);

    // Log weather data for user
    await weatherService.logWeather(userId, weatherData);

    // Calculate adjustments
    const proofingAdjustment =
      weatherService.calculateProofingAdjustment(weatherData.temperature);
    const hydrationAdjustment = weatherService.getHydrationAdjustment(
      weatherData.humidity
    );

    res.json({
      data: {
        ...weatherData,
        adjustments: {
          proofing: proofingAdjustment,
          hydration: hydrationAdjustment,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
