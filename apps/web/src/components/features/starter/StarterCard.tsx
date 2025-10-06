'use client';

import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { type Starter, getFeedingStatus, getStarterAge, FLOUR_TYPES } from '@/lib/api/starters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StarterCardProps {
  starter: Starter;
  onFeedNow?: (starterId: string) => void;
  onArchive?: (starterId: string) => void;
}

export function StarterCard({ starter, onFeedNow, onArchive }: StarterCardProps) {
  const feedingStatus = getFeedingStatus(starter.lastFed);
  const age = getStarterAge(starter.createdDate);
  const flourTypeLabel = FLOUR_TYPES.find((ft) => ft.value === starter.flourType)?.label || starter.flourType;

  // Health score color mapping
  const healthColors = {
    1: 'bg-red-500',
    2: 'bg-orange-500',
    3: 'bg-yellow-500',
    4: 'bg-lime-500',
    5: 'bg-green-500',
  };

  const healthColor = starter.health ? healthColors[starter.health as keyof typeof healthColors] : 'bg-gray-500';

  // Feeding status colors
  const statusColors = {
    healthy: 'bg-green-100 text-green-800 border-green-300',
    soon: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    overdue: 'bg-red-100 text-red-800 border-red-300',
    unknown: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  const statusColor = statusColors[feedingStatus.status];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/starters/${starter.id}`}>
              <CardTitle className="text-xl hover:underline cursor-pointer">
                {starter.name}
              </CardTitle>
            </Link>
            <CardDescription>
              <Badge variant="outline" className="mt-1">
                {flourTypeLabel}
              </Badge>
              <span className="ml-2 text-sm text-muted-foreground">{age}</span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            {feedingStatus.status === 'overdue' && (
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Health Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Health</span>
              <span className="font-medium">{starter.health ? `${starter.health}/5` : 'N/A'}</span>
            </div>
            <Progress value={starter.health ? (starter.health / 5) * 100 : 0} className={`h-2 ${healthColor}`} />
          </div>

          {/* Feeding Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last Fed</span>
              <Badge variant="outline" className={statusColor}>
                {feedingStatus.label}
              </Badge>
            </div>
            {starter.lastFed && (
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(starter.lastFed), { addSuffix: true })}
              </p>
            )}
          </div>

          {/* Feeding Ratio */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Ratio</span>
            <span className="font-mono">{starter.feedingRatio}</span>
          </div>

          {/* Feedings Count */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Feedings</span>
            <span className="font-medium">{starter._count?.feedings || 0}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          onClick={() => onFeedNow?.(starter.id)}
          className="flex-1"
          variant={feedingStatus.status === 'overdue' ? 'primary' : 'outline'}
        >
          Feed Now
        </Button>
        <Link href={`/starters/${starter.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
