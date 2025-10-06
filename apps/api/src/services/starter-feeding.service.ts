import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';
import {
  CreateFeedingInput,
  UpdateFeedingInput,
  ListFeedingsQuery,
} from '../validators/starter.validator';
import { starterService } from './starter.service';

const prisma = new PrismaClient();

export class StarterFeedingService {
  /**
   * Log a feeding for a starter
   */
  async logFeeding(userId: string, starterId: string, data: CreateFeedingInput) {
    // Verify starter exists and belongs to user
    await starterService.getStarter(userId, starterId);

    // Prevent future feeding dates
    if (data.fedAt && data.fedAt > new Date()) {
      throw new AppError(400, 'Feeding date cannot be in the future');
    }

    // Create feeding
    const feeding = await prisma.starterFeeding.create({
      data: {
        starterId,
        ratio: data.ratio,
        observations: data.observations,
        riseHeight: data.riseHeight,
        fedAt: data.fedAt,
      },
    });

    // Update starter's lastFed timestamp
    await prisma.starter.update({
      where: { id: starterId },
      data: { lastFed: data.fedAt },
    });

    // Recalculate and update health score
    const healthScore = await starterService.calculateHealthScore(starterId);
    await prisma.starter.update({
      where: { id: starterId },
      data: { health: healthScore },
    });

    return feeding;
  }

  /**
   * Get feeding history for a starter
   */
  async getFeedingHistory(userId: string, starterId: string, query: ListFeedingsQuery) {
    // Verify starter exists and belongs to user
    await starterService.getStarter(userId, starterId);

    const { page, limit } = query;
    const skip = (page - 1) * limit;

    // Get feedings with pagination
    const [feedings, total] = await Promise.all([
      prisma.starterFeeding.findMany({
        where: { starterId },
        skip,
        take: limit,
        orderBy: { fedAt: 'desc' },
      }),
      prisma.starterFeeding.count({ where: { starterId } }),
    ]);

    return {
      data: feedings,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single feeding by ID
   */
  async getFeeding(userId: string, starterId: string, feedingId: string) {
    // Verify starter exists and belongs to user
    await starterService.getStarter(userId, starterId);

    const feeding = await prisma.starterFeeding.findFirst({
      where: { id: feedingId, starterId },
    });

    if (!feeding) {
      throw new AppError(404, 'Feeding not found');
    }

    return feeding;
  }

  /**
   * Update a feeding
   */
  async updateFeeding(
    userId: string,
    starterId: string,
    feedingId: string,
    data: UpdateFeedingInput
  ) {
    // Check if feeding exists and belongs to starter
    await this.getFeeding(userId, starterId, feedingId);

    // Update feeding
    const feeding = await prisma.starterFeeding.update({
      where: { id: feedingId },
      data: {
        observations: data.observations,
        riseHeight: data.riseHeight,
      },
    });

    // Recalculate health score if rise height changed
    if (data.riseHeight !== undefined) {
      const healthScore = await starterService.calculateHealthScore(starterId);
      await prisma.starter.update({
        where: { id: starterId },
        data: { health: healthScore },
      });
    }

    return feeding;
  }

  /**
   * Delete a feeding
   */
  async deleteFeeding(userId: string, starterId: string, feedingId: string) {
    // Check if feeding exists and belongs to starter
    await this.getFeeding(userId, starterId, feedingId);

    // Delete feeding
    await prisma.starterFeeding.delete({
      where: { id: feedingId },
    });

    // Recalculate health score
    const healthScore = await starterService.calculateHealthScore(starterId);

    // Update starter's lastFed to the most recent feeding (if any)
    const mostRecentFeeding = await prisma.starterFeeding.findFirst({
      where: { starterId },
      orderBy: { fedAt: 'desc' },
    });

    await prisma.starter.update({
      where: { id: starterId },
      data: {
        health: healthScore,
        lastFed: mostRecentFeeding?.fedAt || null,
      },
    });

    return { success: true };
  }

  /**
   * Calculate feeding statistics for a starter
   */
  async getFeedingStatistics(userId: string, starterId: string) {
    // Verify starter exists and belongs to user
    await starterService.getStarter(userId, starterId);

    const feedings = await prisma.starterFeeding.findMany({
      where: { starterId },
      orderBy: { fedAt: 'desc' },
    });

    if (feedings.length === 0) {
      return {
        totalFeedings: 0,
        avgRiseHeight: null,
        maxRiseHeight: null,
        minRiseHeight: null,
        feedingConsistency: 0,
        avgFeedingInterval: null,
      };
    }

    // Calculate average rise height
    const feedingsWithRise = feedings.filter(f => f.riseHeight !== null);
    let avgRiseHeight = null;
    let maxRiseHeight = null;
    let minRiseHeight = null;

    if (feedingsWithRise.length > 0) {
      const riseHeights = feedingsWithRise.map(f => f.riseHeight!);
      avgRiseHeight = riseHeights.reduce((sum, h) => sum + h, 0) / riseHeights.length;
      maxRiseHeight = Math.max(...riseHeights);
      minRiseHeight = Math.min(...riseHeights);
    }

    // Calculate feeding consistency (on-time percentage)
    let feedingConsistency = 0;
    let avgFeedingInterval = null;

    if (feedings.length >= 2) {
      const intervals = [];
      let onTimeCount = 0;

      for (let i = 0; i < feedings.length - 1; i++) {
        const hoursDiff = (feedings[i].fedAt.getTime() - feedings[i + 1].fedAt.getTime()) / (1000 * 60 * 60);
        intervals.push(hoursDiff);

        // Consider "on-time" if within 12-36 hours
        if (hoursDiff >= 12 && hoursDiff <= 36) {
          onTimeCount++;
        }
      }

      feedingConsistency = (onTimeCount / (feedings.length - 1)) * 100;
      avgFeedingInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
    }

    return {
      totalFeedings: feedings.length,
      avgRiseHeight: avgRiseHeight ? Math.round(avgRiseHeight * 10) / 10 : null,
      maxRiseHeight: maxRiseHeight ? Math.round(maxRiseHeight * 10) / 10 : null,
      minRiseHeight: minRiseHeight ? Math.round(minRiseHeight * 10) / 10 : null,
      feedingConsistency: Math.round(feedingConsistency),
      avgFeedingInterval: avgFeedingInterval ? Math.round(avgFeedingInterval * 10) / 10 : null,
    };
  }
}

// Export singleton instance
export const starterFeedingService = new StarterFeedingService();
