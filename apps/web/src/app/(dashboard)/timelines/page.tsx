'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Clock, Play, Pause, CheckCircle, XCircle, Timer, Thermometer, Droplet, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  useTimelines,
  useUpdateTimelineStatus,
  useDeleteTimeline,
} from '@/lib/hooks/useTimelines';
import { useToast } from '@/lib/hooks/use-toast';
import { TimelineStatus } from '@/lib/api/timelines';
import { formatDistanceToNow } from 'date-fns';

export default function TimelinesPage() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<TimelineStatus | undefined>(
    TimelineStatus.ACTIVE
  );
  const { data: timelines, isLoading } = useTimelines({ status: statusFilter });
  const updateStatusMutation = useUpdateTimelineStatus();
  const deleteTimelineMutation = useDeleteTimeline();

  const handlePause = async (id: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id,
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

  const handleResume = async (id: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id,
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

  const handleComplete = async (id: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id,
        input: { status: TimelineStatus.COMPLETED },
      });
      toast({
        title: 'Timeline completed',
        description: 'Great bake! 🎉',
      });
    } catch (error) {
      toast({
        title: 'Failed to complete',
        description: 'Could not complete timeline',
        variant: 'error',
      });
    }
  };

  const handleDelete = async (id: string, recipeName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the timeline for "${recipeName}"?`
      )
    ) {
      return;
    }

    try {
      await deleteTimelineMutation.mutateAsync(id);
      toast({
        title: 'Timeline deleted',
        description: 'Timeline has been removed',
      });
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Failed to delete timeline',
        variant: 'error',
      });
    }
  };

  const getStatusBadge = (status: TimelineStatus) => {
    switch (status) {
      case TimelineStatus.ACTIVE:
        return (
          <Badge className="bg-orange-500 text-white">
            <Clock className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case TimelineStatus.PAUSED:
        return (
          <Badge variant="secondary">
            <Pause className="h-3 w-3 mr-1" />
            Paused
          </Badge>
        );
      case TimelineStatus.COMPLETED:
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case TimelineStatus.CANCELLED:
        return (
          <Badge variant="error">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-4xl font-bold text-chocolate-brown mb-2 flex items-center gap-2">
            <Timer className="h-9 w-9" />
            Bake Timelines
          </h1>
          <p className="text-lg text-warm-gray-600">
            Weather-aware baking schedules
          </p>
        </div>
        <Link href="/timelines/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Timeline
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={statusFilter === TimelineStatus.ACTIVE ? 'primary' : 'outline'}
          onClick={() => setStatusFilter(TimelineStatus.ACTIVE)}
        >
          Active
        </Button>
        <Button
          variant={statusFilter === TimelineStatus.PAUSED ? 'primary' : 'outline'}
          onClick={() => setStatusFilter(TimelineStatus.PAUSED)}
        >
          Paused
        </Button>
        <Button
          variant={
            statusFilter === TimelineStatus.COMPLETED ? 'primary' : 'outline'
          }
          onClick={() => setStatusFilter(TimelineStatus.COMPLETED)}
        >
          Completed
        </Button>
        <Button
          variant={statusFilter === undefined ? 'primary' : 'outline'}
          onClick={() => setStatusFilter(undefined)}
        >
          All
        </Button>
      </div>

      {/* Timelines List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-warm-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-warm-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : timelines && timelines.length > 0 ? (
        <div className="space-y-4">
          {timelines.map((timeline) => (
            <Link key={timeline.id} href={`/timelines/${timeline.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-serif text-xl font-bold text-chocolate-brown">
                          {timeline.recipe?.name || 'Untitled Recipe'}
                        </h3>
                        {getStatusBadge(timeline.status)}
                      </div>
                      <p className="text-sm text-warm-gray-600">
                        Target: {new Date(timeline.targetTime).toLocaleString()}
                      </p>
                      {timeline.weather && (
                        <p className="text-sm text-warm-gray-500 mt-1 flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Thermometer className="h-3 w-3" />
                            {timeline.weather.temperature}°C
                          </span>
                          <span className="flex items-center gap-1">
                            <Droplet className="h-3 w-3" />
                            {timeline.weather.humidity}%
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {timeline.weather.location}
                          </span>
                        </p>
                      )}
                    </div>
                    <div
                      className="flex gap-2"
                      onClick={(e) => e.preventDefault()}
                    >
                      {timeline.status === TimelineStatus.ACTIVE && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePause(timeline.id)}
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleComplete(timeline.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {timeline.status === TimelineStatus.PAUSED && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResume(timeline.id)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      {timeline.status !== TimelineStatus.ACTIVE && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDelete(
                              timeline.id,
                              timeline.recipe?.name || 'this recipe'
                            )
                          }
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Progress indicator */}
                  {timeline.steps && timeline.steps.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-warm-gray-500 mb-2">
                        <span>
                          {timeline.steps.filter((s) => s.completed).length} of{' '}
                          {timeline.steps.length} steps completed
                        </span>
                        <span>
                          Started{' '}
                          {formatDistanceToNow(
                            new Date(timeline.steps[0].startTime),
                            { addSuffix: true }
                          )}
                        </span>
                      </div>
                      <div className="w-full bg-warm-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${
                              (timeline.steps.filter((s) => s.completed).length /
                                timeline.steps.length) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mb-4 flex justify-center">
              <Timer className="h-16 w-16 text-warm-gray-400" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-chocolate-brown mb-2">
              No timelines yet
            </h3>
            <p className="text-warm-gray-600 mb-6">
              Create a timeline to schedule your next bake with weather-aware
              adjustments
            </p>
            <Link href="/timelines/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Timeline
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
