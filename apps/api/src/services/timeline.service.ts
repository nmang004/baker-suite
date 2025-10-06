import { PrismaClient, TimelineStatus } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';
import { weatherService, WeatherData } from './weather.service';

const prisma = new PrismaClient();

export interface TimelineStep {
  id: string;
  name: string;
  description: string;
  startTime: Date;
  duration: number; // minutes
  temperature?: number; // Optional temp requirement
  completed: boolean;
  isProofingStep?: boolean; // Whether this step is affected by weather
}

export interface CreateTimelineInput {
  recipeId: string;
  targetTime: Date;
  location: string;
}

export interface UpdateTimelineStatusInput {
  status: TimelineStatus;
  stepId?: string; // ID of step to mark as completed
}

/**
 * Default baking steps template
 * These are typical steps for sourdough bread
 * Duration is base time in minutes (will be adjusted by weather)
 */
const DEFAULT_BAKING_STEPS = [
  {
    name: 'Autolyse',
    description: 'Mix flour and water, let rest to develop gluten',
    baseDuration: 30,
    isProofing: false,
  },
  {
    name: 'Mix Dough',
    description: 'Add salt and starter, mix until combined',
    baseDuration: 30,
    isProofing: false,
  },
  {
    name: 'Bulk Fermentation',
    description:
      'Let dough rise, perform stretch and folds every 30-45 minutes',
    baseDuration: 270, // 4.5 hours
    isProofing: true, // Affected by temperature
  },
  {
    name: 'Pre-shape',
    description: 'Gently shape dough into a round, let rest 20-30 minutes',
    baseDuration: 30,
    isProofing: false,
  },
  {
    name: 'Final Shape',
    description: 'Shape dough into final form and place in banneton',
    baseDuration: 15,
    isProofing: false,
  },
  {
    name: 'Final Proof',
    description: 'Let shaped dough proof until ready (poke test)',
    baseDuration: 90, // 1.5 hours
    isProofing: true, // Affected by temperature
  },
  {
    name: 'Bake',
    description: 'Score and bake at high temperature',
    baseDuration: 45,
    isProofing: false,
  },
];

export class TimelineService {
  /**
   * Round time to nearest 5 minutes for cleaner display
   */
  private roundToNearestFive(date: Date): Date {
    const rounded = new Date(date);
    const minutes = rounded.getMinutes();
    const remainder = minutes % 5;

    if (remainder < 3) {
      rounded.setMinutes(minutes - remainder);
    } else {
      rounded.setMinutes(minutes + (5 - remainder));
    }

    rounded.setSeconds(0);
    rounded.setMilliseconds(0);

    return rounded;
  }

  /**
   * Calculate timeline steps working backwards from target time
   */
  private calculateSteps(
    targetTime: Date,
    weatherData: WeatherData
  ): TimelineStep[] {
    const steps: TimelineStep[] = [];
    const proofingAdjustment =
      weatherService.calculateProofingAdjustment(weatherData.temperature);

    // Use default steps (can be enhanced to parse from recipe instructions)
    const stepTemplates = DEFAULT_BAKING_STEPS;

    // Work backwards from target time
    let currentTime = new Date(targetTime);

    for (let i = stepTemplates.length - 1; i >= 0; i--) {
      const template = stepTemplates[i];

      // Calculate adjusted duration
      let duration = template.baseDuration;
      if (template.isProofing) {
        duration = Math.round(duration * proofingAdjustment.proofingMultiplier);
      }

      // Calculate start time (subtract duration from current time)
      const startTime = new Date(currentTime.getTime() - duration * 60 * 1000);

      steps.unshift({
        id: `step-${i}`,
        name: template.name,
        description: template.description,
        startTime: this.roundToNearestFive(startTime),
        duration,
        temperature: template.isProofing
          ? weatherData.temperature
          : undefined,
        completed: false,
        isProofingStep: template.isProofing,
      });

      // Move current time back for next step
      currentTime = startTime;
    }

    return steps;
  }

  /**
   * Create a new timeline
   */
  async createTimeline(userId: string, data: CreateTimelineInput) {
    // Verify recipe exists and belongs to user
    const recipe = await prisma.recipe.findFirst({
      where: { id: data.recipeId, userId },
    });

    if (!recipe) {
      throw new AppError(404, 'Recipe not found');
    }

    // Validate target time is in the future
    if (new Date(data.targetTime) <= new Date()) {
      throw new AppError(400, 'Target time must be in the future');
    }

    // Get weather data
    const weatherData = await weatherService.getWeather(data.location);

    // Log weather
    await weatherService.logWeather(userId, weatherData);

    // Calculate timeline steps
    const steps = this.calculateSteps(
      new Date(data.targetTime),
      weatherData
    );

    // Validate timeline is reasonable (not more than 48 hours)
    const firstStep = steps[0];
    const totalDuration =
      (new Date(data.targetTime).getTime() - firstStep.startTime.getTime()) /
      (1000 * 60 * 60);

    if (totalDuration > 48) {
      throw new AppError(
        400,
        'Timeline exceeds 48 hours. Please adjust target time or recipe.'
      );
    }

    // Create timeline
    const timeline = await prisma.timeline.create({
      data: {
        userId,
        recipeId: data.recipeId,
        targetTime: new Date(data.targetTime),
        steps: steps as any,
        status: TimelineStatus.ACTIVE,
        weather: {
          temperature: weatherData.temperature,
          humidity: weatherData.humidity,
          location: weatherData.location,
          timestamp: weatherData.timestamp,
        } as any,
      },
      include: {
        recipe: {
          select: {
            id: true,
            name: true,
            description: true,
            tags: true,
          },
        },
      },
    });

    return timeline;
  }

  /**
   * List user's timelines
   */
  async listTimelines(
    userId: string,
    options: {
      status?: TimelineStatus;
      page?: number;
      limit?: number;
    } = {}
  ) {
    const { status, page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const [timelines, total] = await Promise.all([
      prisma.timeline.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          recipe: {
            select: {
              id: true,
              name: true,
              description: true,
              tags: true,
            },
          },
        },
      }),
      prisma.timeline.count({ where }),
    ]);

    return {
      data: timelines,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single timeline
   */
  async getTimeline(userId: string, timelineId: string) {
    const timeline = await prisma.timeline.findFirst({
      where: { id: timelineId, userId },
      include: {
        recipe: {
          select: {
            id: true,
            name: true,
            description: true,
            tags: true,
            ingredients: true,
            instructions: true,
          },
        },
      },
    });

    if (!timeline) {
      throw new AppError(404, 'Timeline not found');
    }

    return timeline;
  }

  /**
   * Update timeline status (pause, resume, complete, cancel)
   */
  async updateTimelineStatus(
    userId: string,
    timelineId: string,
    data: UpdateTimelineStatusInput
  ) {
    // Get existing timeline
    const timeline = await this.getTimeline(userId, timelineId);

    // Prepare update data
    const updateData: any = {
      status: data.status,
    };

    // If completing, set completion time
    if (data.status === TimelineStatus.COMPLETED) {
      updateData.completedAt = new Date();
    }

    // If marking a step as completed, update the steps array
    if (data.stepId) {
      const steps = Array.isArray(timeline.steps) ? timeline.steps : [];
      const updatedSteps = steps.map((step: any) =>
        step.id === data.stepId ? { ...step, completed: true } : step
      );
      updateData.steps = updatedSteps;
    }

    // Update timeline
    const updatedTimeline = await prisma.timeline.update({
      where: { id: timelineId },
      data: updateData,
      include: {
        recipe: {
          select: {
            id: true,
            name: true,
            description: true,
            tags: true,
          },
        },
      },
    });

    return updatedTimeline;
  }

  /**
   * Delete a timeline
   */
  async deleteTimeline(userId: string, timelineId: string) {
    // Verify timeline exists and belongs to user
    await this.getTimeline(userId, timelineId);

    await prisma.timeline.delete({
      where: { id: timelineId },
    });

    return { success: true };
  }

  /**
   * Get current active step for a timeline
   */
  getCurrentStep(timeline: any): TimelineStep | null {
    const steps = Array.isArray(timeline.steps) ? timeline.steps : [];
    const now = new Date();

    // Find the step that should be active right now
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepEndTime = new Date(
        new Date(step.startTime).getTime() + step.duration * 60 * 1000
      );

      if (now >= new Date(step.startTime) && now <= stepEndTime) {
        return step;
      }
    }

    return null;
  }

  /**
   * Get next upcoming step
   */
  getNextStep(timeline: any): TimelineStep | null {
    const steps = Array.isArray(timeline.steps) ? timeline.steps : [];
    const now = new Date();

    for (const step of steps) {
      if (new Date(step.startTime) > now && !step.completed) {
        return step;
      }
    }

    return null;
  }
}

// Export singleton instance
export const timelineService = new TimelineService();
