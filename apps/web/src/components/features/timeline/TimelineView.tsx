'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock,
  CheckCircle,
  Circle,
  Thermometer,
  Play,
  Pause,
  ArrowLeft,
  Timer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  useTimeline,
  useUpdateTimelineStatus,
} from '@/lib/hooks/useTimelines';
import { useToast } from '@/lib/hooks/use-toast';
import { TimelineStatus, type TimelineStep } from '@/lib/api/timelines';
import { formatDistanceToNow, differenceInMinutes } from 'date-fns';
import { requestNotificationPermission } from '@/lib/utils/notifications';

interface TimelineViewProps {
  timelineId: string;
}

export function TimelineView({ timelineId }: TimelineViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: timeline, isLoading } = useTimeline(timelineId);
  const updateStatusMutation = useUpdateTimelineStatus();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Check and show notifications for upcoming steps
  useEffect(() => {
    if (!timeline || timeline.status !== TimelineStatus.ACTIVE) return;

    const checkUpcomingSteps = () => {
      const steps = timeline.steps as TimelineStep[];
      const now = new Date();

      steps.forEach((step) => {
        if (step.completed) return;

        const stepStart = new Date(step.startTime);
        const minutesUntil = differenceInMinutes(stepStart, now);

        // Notify 5 minutes before step starts
        if (minutesUntil === 5) {
          showNotification(
            'Upcoming Step',
            `${step.name} starts in 5 minutes!`
          );
        }

        // Notify when step starts
        if (minutesUntil === 0) {
          showNotification('Time to Start!', `Begin: ${step.name}`);
        }
      });
    };

    const interval = setInterval(checkUpcomingSteps, 60000); // Check every minute
    checkUpcomingSteps(); // Check immediately

    return () => clearInterval(interval);
  }, [timeline]);

  const showNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
      });
    }
  };

  const handleStepComplete = async (stepId: string) => {
    if (!timeline) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: timeline.id,
        input: {
          status: timeline.status,
          stepId,
        },
      });
    } catch (error) {
      toast({
        title: 'Failed to update',
        description: 'Could not mark step as complete',
        variant: 'error',
      });
    }
  };

  const handlePause = async () => {
    if (!timeline) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: timeline.id,
        input: { status: TimelineStatus.PAUSED },
      });
      toast({
        title: 'Timeline paused',
        description: 'You can resume it later',
      });
    } catch (error) {
      toast({
        title: 'Failed to pause',
        description: 'Could not pause timeline',
        variant: 'error',
      });
    }
  };

  const handleResume = async () => {
    if (!timeline) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: timeline.id,
        input: { status: TimelineStatus.ACTIVE },
      });
      toast({
        title: 'Timeline resumed',
        description: 'Timeline is now active',
      });
    } catch (error) {
      toast({
        title: 'Failed to resume',
        description: 'Could not resume timeline',
        variant: 'error',
      });
    }
  };

  const handleComplete = async () => {
    if (!timeline) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: timeline.id,
        input: { status: TimelineStatus.COMPLETED },
      });
      toast({
        title: 'Timeline completed! 🎉',
        description: 'Great bake! Let\'s log it.',
      });
      // Redirect to bake logger with timeline data
      router.push(`/bakes/new?timelineId=${timeline.id}&recipeId=${timeline.recipeId}`);
    } catch (error) {
      toast({
        title: 'Failed to complete',
        description: 'Could not complete timeline',
        variant: 'error',
      });
    }
  };

  const getStepStatus = (step: TimelineStep): 'completed' | 'active' | 'upcoming' => {
    if (step.completed) return 'completed';

    const stepStart = new Date(step.startTime);
    const stepEnd = new Date(stepStart.getTime() + step.duration * 60 * 1000);

    if (currentTime >= stepStart && currentTime <= stepEnd) {
      return 'active';
    }

    return 'upcoming';
  };

  const getTimeRemaining = (step: TimelineStep): string => {
    const stepStart = new Date(step.startTime);
    const stepEnd = new Date(stepStart.getTime() + step.duration * 60 * 1000);

    if (currentTime < stepStart) {
      return `Starts ${formatDistanceToNow(stepStart, { addSuffix: true })}`;
    }

    if (currentTime >= stepStart && currentTime <= stepEnd) {
      return `Ends ${formatDistanceToNow(stepEnd, { addSuffix: true })}`;
    }

    return 'Completed';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-8 bg-warm-gray-200 rounded mb-4"></div>
            <div className="h-24 bg-warm-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!timeline) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p>Timeline not found</p>
        </CardContent>
      </Card>
    );
  }

  const steps = timeline.steps as TimelineStep[];
  const currentStep = timeline.currentStep || steps.find(s => getStepStatus(s) === 'active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/timelines')}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Timelines
          </Button>
          <h1 className="font-serif text-4xl font-bold text-chocolate-brown mb-2">
            {timeline.recipe?.name || 'Bake Timeline'}
          </h1>
          <p className="text-lg text-warm-gray-600">
            Target: {new Date(timeline.targetTime).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          {timeline.status === TimelineStatus.ACTIVE && (
            <>
              <Button variant="outline" onClick={handlePause}>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button onClick={handleComplete}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete
              </Button>
            </>
          )}
          {timeline.status === TimelineStatus.PAUSED && (
            <Button onClick={handleResume}>
              <Play className="h-4 w-4 mr-2" />
              Resume
            </Button>
          )}
        </div>
      </div>

      {/* Weather Info */}
      {timeline.weather && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-warm-gray-600">Temperature</p>
                  <p className="font-semibold">
                    {timeline.weather.temperature}°C
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-sm text-warm-gray-600">Humidity</p>
                  <p className="font-semibold">{timeline.weather.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-sm text-warm-gray-600">Location</p>
                  <p className="font-semibold">{timeline.weather.location}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Step Highlight */}
      {currentStep && timeline.status === TimelineStatus.ACTIVE && (
        <Card className="bg-orange-50 border-orange-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500 text-white">
                    Current Step
                  </Badge>
                  {currentStep.isProofingStep && currentStep.temperature && (
                    <Badge variant="outline">
                      <Thermometer className="h-3 w-3 mr-1" />
                      {currentStep.temperature}°C
                    </Badge>
                  )}
                </div>
                <h3 className="font-serif text-2xl font-bold text-chocolate-brown mb-2">
                  {currentStep.name}
                </h3>
                <p className="text-warm-gray-700 mb-3">
                  {currentStep.description}
                </p>
                <p className="text-sm text-warm-gray-600 flex items-center gap-1">
                  <Timer className="h-4 w-4" />
                  {currentStep.duration} minutes • {getTimeRemaining(currentStep)}
                </p>
              </div>
              {!currentStep.completed && (
                <Button
                  onClick={() => handleStepComplete(currentStep.id)}
                  size="sm"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const status = getStepStatus(step);
          const isActive = status === 'active';
          const isCompleted = status === 'completed';

          return (
            <Card
              key={step.id}
              className={`${
                isActive
                  ? 'border-orange-300 bg-orange-50'
                  : isCompleted
                  ? 'border-green-300 bg-green-50'
                  : 'border-warm-gray-200'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Step Number & Status Icon */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-orange-500 text-white'
                          : 'bg-warm-gray-200 text-warm-gray-600'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : isActive ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-0.5 h-12 bg-warm-gray-300 mt-2"></div>
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-chocolate-brown">
                        {step.name}
                      </h4>
                      {step.isProofingStep && (
                        <Badge variant="outline" className="text-xs">
                          Weather-adjusted
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-warm-gray-600 mb-2">
                      {step.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-warm-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(step.startTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Timer className="h-3 w-3" />
                        {step.duration} min
                      </span>
                      {step.temperature && (
                        <span className="flex items-center gap-1">
                          <Thermometer className="h-3 w-3" />
                          {step.temperature}°C
                        </span>
                      )}
                    </div>
                    {status !== 'completed' && (
                      <p className="text-xs text-warm-gray-500 mt-1">
                        {getTimeRemaining(step)}
                      </p>
                    )}
                  </div>

                  {/* Complete Button */}
                  {!step.completed && status !== 'upcoming' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStepComplete(step.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-warm-gray-600">Overall Progress</span>
            <span className="text-sm font-semibold">
              {steps.filter((s) => s.completed).length} / {steps.length} steps
            </span>
          </div>
          <div className="w-full bg-warm-gray-200 rounded-full h-3">
            <div
              className="bg-orange-500 h-3 rounded-full transition-all"
              style={{
                width: `${
                  (steps.filter((s) => s.completed).length / steps.length) * 100
                }%`,
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
