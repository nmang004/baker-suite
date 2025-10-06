'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { getFeedingStatus, getStarterAge, FLOUR_TYPES } from '@/lib/api/starters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useStarter, useStarterHealth, useStarterStatistics, useDeleteStarter } from '@/lib/hooks/useStarters';
import { FeedingLogger } from './FeedingLogger';
import { FeedingHistory } from './FeedingHistory';
import { toast } from 'sonner';

interface StarterDetailProps {
  starterId: string;
}

export function StarterDetail({ starterId }: StarterDetailProps) {
  const router = useRouter();
  const [showFeedingLogger, setShowFeedingLogger] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: starter, isLoading } = useStarter(starterId);
  const { data: health } = useStarterHealth(starterId);
  const { data: statistics } = useStarterStatistics(starterId);
  const deleteMutation = useDeleteStarter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!starter) {
    return <div>Starter not found</div>;
  }

  const feedingStatus = getFeedingStatus(starter.lastFed);
  const age = getStarterAge(starter.createdDate);
  const flourTypeLabel = FLOUR_TYPES.find((ft) => ft.value === starter.flourType)?.label || starter.flourType;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(starterId);
      toast.success('Starter deleted successfully');
      router.push('/starters');
    } catch (error) {
      toast.error('Failed to delete starter');
      console.error('Delete starter error:', error);
    }
  };

  // Health score color mapping
  const healthColors = {
    1: 'bg-red-500',
    2: 'bg-orange-500',
    3: 'bg-yellow-500',
    4: 'bg-lime-500',
    5: 'bg-green-500',
  };

  const healthColor = starter.health ? healthColors[starter.health as keyof typeof healthColors] : 'bg-gray-500';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{starter.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{flourTypeLabel}</Badge>
            <span className="text-sm text-muted-foreground">{age}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowFeedingLogger(!showFeedingLogger)}>
            {showFeedingLogger ? 'Hide' : 'Feed Now'}
          </Button>
          <Button variant="outline" onClick={() => router.push(`/starters/${starterId}/edit`)}>
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      {/* Feeding Logger */}
      {showFeedingLogger && (
        <FeedingLogger
          starter={starter}
          lastFeeding={starter.feedings?.[0]}
          onSuccess={() => setShowFeedingLogger(false)}
          onCancel={() => setShowFeedingLogger(false)}
        />
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Health Score */}
        <Card>
          <CardHeader>
            <CardTitle>Health Score</CardTitle>
            <CardDescription>Based on feeding consistency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">
                {health?.healthScore || starter.health || 'N/A'}/5
              </div>
              <Progress
                value={health?.healthScore ? (health.healthScore / 5) * 100 : (starter.health ? (starter.health / 5) * 100 : 0)}
                className={`h-2 ${healthColor}`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Feeding Status */}
        <Card>
          <CardHeader>
            <CardTitle>Feeding Status</CardTitle>
            <CardDescription>Last feeding time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className={
                feedingStatus.status === 'healthy' ? 'bg-green-500' :
                feedingStatus.status === 'soon' ? 'bg-yellow-500' :
                feedingStatus.status === 'overdue' ? 'bg-red-500' : 'bg-gray-500'
              }>
                {feedingStatus.label}
              </Badge>
              {starter.lastFed && (
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(starter.lastFed), { addSuffix: true })}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Feeding Streak */}
        <Card>
          <CardHeader>
            <CardTitle>Current Streak</CardTitle>
            <CardDescription>Consecutive on-time feedings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {health?.currentStreak || 0}
            </div>
            <p className="text-sm text-muted-foreground mt-2">feedings</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Feeding History</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Starter Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Feeding Ratio</span>
                <span className="font-mono">{starter.feedingRatio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Feedings</span>
                <span>{starter._count?.feedings || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{age}</span>
              </div>
              {starter.notes && (
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{starter.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <FeedingHistory starterId={starterId} />
        </TabsContent>

        <TabsContent value="statistics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Feeding Statistics</CardTitle>
              <CardDescription>Performance metrics over time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Average Rise Height</p>
                  <p className="text-2xl font-bold">
                    {statistics?.avgRiseHeight ? `${statistics.avgRiseHeight} cm` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Feeding Consistency</p>
                  <p className="text-2xl font-bold">
                    {statistics?.feedingConsistency ? `${statistics.feedingConsistency}%` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Feeding Interval</p>
                  <p className="text-2xl font-bold">
                    {statistics?.avgFeedingInterval ? `${statistics.avgFeedingInterval}h` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Max Rise Height</p>
                  <p className="text-2xl font-bold">
                    {statistics?.maxRiseHeight ? `${statistics.maxRiseHeight} cm` : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Starter?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete "{starter.name}" and all its feeding history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
