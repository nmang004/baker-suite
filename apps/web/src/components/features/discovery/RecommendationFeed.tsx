'use client';

import { useState } from 'react';
import { Loader2, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RecipeCard } from './RecipeCard';
import { useRecommendations } from '@/lib/hooks/useDiscovery';
import { cn } from '@/lib/utils';

interface RecommendationFeedProps {
  onViewRecipe?: (recipeId: string) => void;
  onStartTimeline?: (recipeId: string) => void;
  onSaveRecipe?: (recipeId: string) => void;
  className?: string;
}

export function RecommendationFeed({
  onViewRecipe,
  onStartTimeline,
  onSaveRecipe,
  className,
}: RecommendationFeedProps) {
  const [recommendationType, setRecommendationType] = useState<
    'personalized' | 'similar' | 'new' | 'seasonal'
  >('personalized');
  const [excludeBaked, setExcludeBaked] = useState(true);
  const [dismissedRecipes, setDismissedRecipes] = useState<Set<string>>(new Set());

  const { data: recommendations, isLoading, refetch } = useRecommendations({
    type: recommendationType,
    excludeBaked,
    limit: 20,
  });

  const handleDismiss = (recipeId: string) => {
    setDismissedRecipes((prev) => new Set([...prev, recipeId]));
  };

  const filteredRecommendations = recommendations?.filter(
    (recipe) => !dismissedRecipes.has(recipe.id)
  );

  const handleTypeChange = (value: string) => {
    setRecommendationType(value as any);
    setDismissedRecipes(new Set()); // Reset dismissed on filter change
  };

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {/* Filter Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Recipe Cards Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={recommendationType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personalized">For You</SelectItem>
              <SelectItem value="similar">Similar to Favorites</SelectItem>
              <SelectItem value="new">Something New</SelectItem>
              <SelectItem value="seasonal">Seasonal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setExcludeBaked(!excludeBaked)}
        >
          {excludeBaked ? 'Show All' : 'Hide Baked'}
        </Button>
      </div>

      {/* Recommendations Grid */}
      {!filteredRecommendations || filteredRecommendations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="mb-4 text-lg text-muted-foreground">
            No recommendations found. Try a different filter!
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Refresh Recommendations
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecommendations.map((recipe) => (
              <div key={recipe.id} className="relative">
                {/* Dismiss Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-white/90 shadow-sm hover:bg-white"
                  onClick={() => handleDismiss(recipe.id)}
                >
                  <X className="h-4 w-4" />
                </Button>

                <RecipeCard
                  recipe={recipe}
                  onView={onViewRecipe}
                  onStartTimeline={onStartTimeline}
                  onSave={onSaveRecipe}
                />
              </div>
            ))}
          </div>

          {/* Load More */}
          {filteredRecommendations.length >= 20 && (
            <div className="flex justify-center pt-6">
              <Button variant="outline" onClick={() => refetch()}>
                <Loader2 className="mr-2 h-4 w-4" />
                Load More
              </Button>
            </div>
          )}
        </>
      )}

      {/* Info Message */}
      {dismissedRecipes.size > 0 && (
        <div className="rounded-lg bg-muted p-4 text-center text-sm text-muted-foreground">
          {dismissedRecipes.size} recipe{dismissedRecipes.size > 1 ? 's' : ''} hidden.
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissedRecipes(new Set())}
            className="ml-2"
          >
            Show all again
          </Button>
        </div>
      )}
    </div>
  );
}
