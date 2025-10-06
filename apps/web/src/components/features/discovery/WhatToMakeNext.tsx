'use client';

import { Shuffle, Heart, Play, Clock, ChefHat, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useWhatToMakeNext } from '@/lib/hooks/useDiscovery';
import { cn } from '@/lib/utils';

interface WhatToMakeNextProps {
  onStartBaking?: (recipeId: string) => void;
  onSaveForLater?: (recipeId: string) => void;
  onRefresh?: () => void;
  className?: string;
}

export function WhatToMakeNext({
  onStartBaking,
  onSaveForLater,
  onRefresh,
  className,
}: WhatToMakeNextProps) {
  const { data: suggestion, isLoading, refetch } = useWhatToMakeNext();

  const handleRefresh = () => {
    refetch();
    onRefresh?.();
  };

  if (isLoading) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sunset-orange" />
            What to Bake Next
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="mb-4 h-64 w-full" />
          <Skeleton className="mb-2 h-6 w-3/4" />
          <Skeleton className="mb-4 h-4 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!suggestion) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sunset-orange" />
            What to Bake Next
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ChefHat className="mb-4 h-16 w-16 text-muted-foreground" />
            <p className="mb-4 text-muted-foreground">
              No suggestions available yet. Start logging some bakes to get personalized recommendations!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const ingredientCount = Array.isArray(suggestion.ingredients)
    ? suggestion.ingredients.length
    : 0;

  return (
    <Card className={cn('overflow-hidden border-2 border-sunset-orange/20', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sunset-orange" />
            We think you'll love this!
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <Shuffle className="mr-1 h-4 w-4" />
            Shuffle
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Recipe Image Placeholder */}
        <div className="relative mb-4 h-64 w-full overflow-hidden rounded-lg bg-gradient-to-br from-sunset-orange/20 to-warm-brown/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <ChefHat className="h-24 w-24 text-warm-brown/40" />
          </div>
        </div>

        {/* Recipe Name */}
        <h3 className="mb-2 text-2xl font-bold">{suggestion.name}</h3>

        {/* Description */}
        {suggestion.description && (
          <p className="mb-4 text-muted-foreground">{suggestion.description}</p>
        )}

        {/* Reasoning */}
        {suggestion.reason && (
          <div className="mb-4 rounded-lg bg-sunset-orange/10 p-3">
            <p className="text-sm font-medium text-sunset-orange">
              {suggestion.reason}
            </p>
          </div>
        )}

        {/* Meta Info */}
        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>~4 hours</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="h-4 w-4" />
            <span>{ingredientCount} ingredients</span>
          </div>
        </div>

        {/* Tags */}
        {suggestion.tags && suggestion.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {suggestion.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
            {suggestion.tags.length > 4 && (
              <Badge variant="outline">+{suggestion.tags.length - 4} more</Badge>
            )}
          </div>
        )}

        {/* Ingredients Preview */}
        {Array.isArray(suggestion.ingredients) && suggestion.ingredients.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-2 text-sm font-medium">Ingredients:</h4>
            <div className="flex flex-wrap gap-2">
              {suggestion.ingredients.slice(0, 6).map((ing: any, i: number) => {
                const name = typeof ing === 'string' ? ing : ing.name || 'Unknown';
                return (
                  <span key={i} className="text-sm text-muted-foreground">
                    {name}
                    {i < Math.min(5, suggestion.ingredients.length - 1) ? ',' : ''}
                  </span>
                );
              })}
              {suggestion.ingredients.length > 6 && (
                <span className="text-sm text-muted-foreground">
                  +{suggestion.ingredients.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            className="flex-1"
            size="lg"
            onClick={() => onStartBaking?.(suggestion.id)}
          >
            <Play className="mr-2 h-5 w-5" />
            Start Baking
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => onSaveForLater?.(suggestion.id)}
          >
            <Heart className="mr-2 h-5 w-5" />
            Save for Later
          </Button>
        </div>

        {/* Secondary Action */}
        <div className="mt-3 text-center">
          <Button variant="ghost" onClick={handleRefresh}>
            Show me another suggestion
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
