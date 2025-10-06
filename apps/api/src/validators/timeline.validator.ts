import { z } from 'zod';
import { TimelineStatus } from '@prisma/client';

// Create timeline schema
export const createTimelineSchema = z.object({
  recipeId: z.string().cuid('Invalid recipe ID format'),
  targetTime: z
    .string()
    .datetime('Target time must be a valid ISO 8601 datetime')
    .refine(
      (time) => new Date(time) > new Date(),
      'Target time must be in the future'
    ),
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

// Update timeline status schema
export const updateTimelineStatusSchema = z.object({
  status: z.nativeEnum(TimelineStatus, {
    errorMap: () => ({
      message: 'Status must be one of: ACTIVE, PAUSED, COMPLETED, CANCELLED',
    }),
  }),
  stepId: z.string().optional(), // Optional step ID to mark as completed
});

// Query parameters for listing timelines
export const listTimelinesQuerySchema = z.object({
  status: z.nativeEnum(TimelineStatus).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// Export types
export type CreateTimelineInput = z.infer<typeof createTimelineSchema>;
export type UpdateTimelineStatusInput = z.infer<
  typeof updateTimelineStatusSchema
>;
export type ListTimelinesQuery = z.infer<typeof listTimelinesQuerySchema>;
