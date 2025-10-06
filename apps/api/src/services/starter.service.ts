import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';
import {
  CreateStarterInput,
  UpdateStarterInput,
  ListStartersQuery,
} from '../validators/starter.validator';

const prisma = new PrismaClient();

export class StarterService {
  /**
   * Create a new starter
   */
  async createStarter(userId: string, data: CreateStarterInput) {
    const starter = await prisma.starter.create({
      data: {
        userId,
        name: data.name,
        flourType: data.flourType,
        createdDate: data.createdDate,
        feedingRatio: data.feedingRatio,
        notes: data.notes,
        health: 3, // Default health score
      },
    });

    return starter;
  }

  /**
   * List user's starters with pagination and filtering
   */
  async listStarters(userId: string, query: ListStartersQuery) {
    const { page, limit, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { userId };

    // TODO: Add 'archived' field to schema for filtering active vs archived starters
    // if (active !== undefined) {
    //   where.archived = !active;
    // }

    // Build orderBy clause - handle null values for lastFed and health
    let orderBy: any = {};
    if (sortBy === 'lastFed') {
      orderBy = [
        { lastFed: { sort: sortOrder, nulls: 'last' } },
        { createdAt: 'desc' },
      ];
    } else if (sortBy === 'health') {
      orderBy = [
        { health: { sort: sortOrder, nulls: 'last' } },
        { createdAt: 'desc' },
      ];
    } else {
      orderBy = { [sortBy]: sortOrder };
    }

    // Execute query with pagination
    const [starters, total] = await Promise.all([
      prisma.starter.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          feedings: {
            take: 5,
            orderBy: { fedAt: 'desc' },
            select: {
              id: true,
              fedAt: true,
              ratio: true,
              riseHeight: true,
            },
          },
          _count: {
            select: { feedings: true },
          },
        },
      }),
      prisma.starter.count({ where }),
    ]);

    return {
      data: starters,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single starter by ID with recent feedings
   */
  async getStarter(userId: string, starterId: string) {
    const starter = await prisma.starter.findFirst({
      where: { id: starterId, userId },
      include: {
        feedings: {
          take: 10,
          orderBy: { fedAt: 'desc' },
        },
        _count: {
          select: { feedings: true },
        },
      },
    });

    if (!starter) {
      throw new AppError(404, 'Starter not found');
    }

    return starter;
  }

  /**
   * Update an existing starter
   */
  async updateStarter(userId: string, starterId: string, data: UpdateStarterInput) {
    // Check if starter exists and belongs to user
    await this.getStarter(userId, starterId);

    // Update starter
    const starter = await prisma.starter.update({
      where: { id: starterId },
      data: {
        name: data.name,
        feedingRatio: data.feedingRatio,
        notes: data.notes,
        health: data.health,
        lastFed: data.lastFed,
      },
      include: {
        feedings: {
          take: 5,
          orderBy: { fedAt: 'desc' },
        },
        _count: {
          select: { feedings: true },
        },
      },
    });

    return starter;
  }

  /**
   * Delete a starter
   */
  async deleteStarter(userId: string, starterId: string) {
    // Check if starter exists and belongs to user
    await this.getStarter(userId, starterId);

    // Delete starter (cascade will delete feedings)
    await prisma.starter.delete({
      where: { id: starterId },
    });

    return { success: true };
  }

  /**
   * Calculate starter health score based on feeding consistency
   *
   * Health Score (1-5) based on:
   * - Feeding consistency (40%): Regular feeding intervals
   * - Rise performance (30%): Average rise height
   * - Feeding streak (20%): Consecutive on-time feedings
   * - Recent activity (10%): Last feeding timestamp
   */
  async calculateHealthScore(starterId: string): Promise<number> {
    const starter = await prisma.starter.findUnique({
      where: { id: starterId },
      include: {
        feedings: {
          orderBy: { fedAt: 'desc' },
          take: 20, // Analyze last 20 feedings
        },
      },
    });

    if (!starter || starter.feedings.length === 0) {
      return 3; // Default score for new starters
    }

    const feedings = starter.feedings;

    // 1. Feeding Consistency Score (40%)
    let consistencyScore = 1;
    if (feedings.length >= 2) {
      const intervals = [];
      for (let i = 0; i < feedings.length - 1; i++) {
        const hoursDiff = (feedings[i].fedAt.getTime() - feedings[i + 1].fedAt.getTime()) / (1000 * 60 * 60);
        intervals.push(hoursDiff);
      }

      const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;

      if (avgInterval >= 12 && avgInterval <= 24) {
        consistencyScore = 5;
      } else if (avgInterval > 24 && avgInterval <= 48) {
        consistencyScore = 4;
      } else if (avgInterval > 48 && avgInterval <= 72) {
        consistencyScore = 3;
      } else if (avgInterval > 72) {
        consistencyScore = 2;
      } else {
        consistencyScore = 2; // Too frequent
      }
    }

    // 2. Rise Performance Score (30%)
    let riseScore = 3; // Default if no rise data
    const feedingsWithRise = feedings.filter(f => f.riseHeight !== null);
    if (feedingsWithRise.length > 0) {
      const avgRise = feedingsWithRise.reduce((sum, f) => sum + (f.riseHeight || 0), 0) / feedingsWithRise.length;

      // Assuming typical starter rise is 50-100% (e.g., from 5cm to 10cm = 100% rise)
      // Adjust based on your needs
      if (avgRise >= 10) {
        riseScore = 5; // Doubles or more
      } else if (avgRise >= 7.5) {
        riseScore = 4; // 75-100%
      } else if (avgRise >= 5) {
        riseScore = 3; // 50-75%
      } else if (avgRise >= 2.5) {
        riseScore = 2; // 25-50%
      } else {
        riseScore = 1; // < 25%
      }
    }

    // 3. Feeding Streak Score (20%)
    let streakScore = 1;
    let streak = 0;

    for (let i = 0; i < feedings.length - 1; i++) {
      const hoursDiff = (feedings[i].fedAt.getTime() - feedings[i + 1].fedAt.getTime()) / (1000 * 60 * 60);

      // Consider "on-time" if within 12-36 hours
      if (hoursDiff >= 12 && hoursDiff <= 36) {
        streak++;
      } else {
        break;
      }
    }

    if (streak >= 7) {
      streakScore = 5;
    } else if (streak >= 5) {
      streakScore = 4;
    } else if (streak >= 3) {
      streakScore = 3;
    } else if (streak >= 1) {
      streakScore = 2;
    } else {
      streakScore = 1;
    }

    // 4. Recent Activity Score (10%)
    let recentScore = 1;
    const lastFeeding = feedings[0];
    const hoursSinceLastFeed = (Date.now() - lastFeeding.fedAt.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastFeed <= 24) {
      recentScore = 5;
    } else if (hoursSinceLastFeed <= 48) {
      recentScore = 3;
    } else {
      recentScore = 1;
    }

    // Calculate weighted average
    const totalScore =
      (consistencyScore * 0.4) +
      (riseScore * 0.3) +
      (streakScore * 0.2) +
      (recentScore * 0.1);

    // Round to nearest integer (1-5)
    return Math.max(1, Math.min(5, Math.round(totalScore)));
  }

  /**
   * Get starter health metrics
   */
  async getStarterHealth(userId: string, starterId: string) {
    const starter = await this.getStarter(userId, starterId);

    // Recalculate health score
    const healthScore = await this.calculateHealthScore(starterId);

    // Calculate feeding statistics
    const feedings = starter.feedings;
    let avgRiseHeight = null;
    let feedingConsistency = 0;
    let currentStreak = 0;

    if (feedings.length > 0) {
      // Average rise height
      const feedingsWithRise = feedings.filter(f => f.riseHeight !== null);
      if (feedingsWithRise.length > 0) {
        avgRiseHeight = feedingsWithRise.reduce((sum, f) => sum + (f.riseHeight || 0), 0) / feedingsWithRise.length;
      }

      // Feeding consistency (on-time percentage)
      if (feedings.length >= 2) {
        let onTimeCount = 0;
        for (let i = 0; i < feedings.length - 1; i++) {
          const hoursDiff = (feedings[i].fedAt.getTime() - feedings[i + 1].fedAt.getTime()) / (1000 * 60 * 60);
          if (hoursDiff >= 12 && hoursDiff <= 36) {
            onTimeCount++;
          }
        }
        feedingConsistency = (onTimeCount / (feedings.length - 1)) * 100;
      }

      // Current streak
      for (let i = 0; i < feedings.length - 1; i++) {
        const hoursDiff = (feedings[i].fedAt.getTime() - feedings[i + 1].fedAt.getTime()) / (1000 * 60 * 60);
        if (hoursDiff >= 12 && hoursDiff <= 36) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Next feeding time (based on feeding ratio - assume every 24 hours as default)
    let nextFeedingTime = null;
    if (starter.lastFed) {
      nextFeedingTime = new Date(starter.lastFed.getTime() + 24 * 60 * 60 * 1000);
    }

    return {
      healthScore,
      avgRiseHeight: avgRiseHeight ? Math.round(avgRiseHeight * 10) / 10 : null,
      feedingConsistency: Math.round(feedingConsistency),
      currentStreak,
      nextFeedingTime,
      totalFeedings: starter._count.feedings,
    };
  }

  /**
   * Get feeding schedule / next feeding time
   */
  async getNextFeedingTime(userId: string, starterId: string) {
    const starter = await this.getStarter(userId, starterId);

    if (!starter.lastFed) {
      return {
        nextFeedingTime: null,
        hoursUntilFeeding: null,
        isOverdue: false,
      };
    }

    // Calculate next feeding (24 hours from last feeding by default)
    const nextFeedingTime = new Date(starter.lastFed.getTime() + 24 * 60 * 60 * 1000);
    const hoursUntilFeeding = (nextFeedingTime.getTime() - Date.now()) / (1000 * 60 * 60);
    const isOverdue = hoursUntilFeeding < 0;

    return {
      nextFeedingTime,
      hoursUntilFeeding: Math.round(hoursUntilFeeding * 10) / 10,
      isOverdue,
    };
  }
}

// Export singleton instance
export const starterService = new StarterService();
