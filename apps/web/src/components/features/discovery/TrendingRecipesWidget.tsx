'use client';

import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { RecipeCard } from './RecipeCard';
import { useTrendingRecipes } from '@/lib/hooks/useDiscovery';
import { TrendingUp } from 'lucide-react';

export function TrendingRecipesWidget() {
  const router = useRouter();
  const { data: recipes, isLoading } = useTrendingRecipes(3);

  const handleViewRecipe = (recipeId: string) => {
    router.push(`/recipes/${recipeId}`);
  };

  const handleStartTimeline = (recipeId: string) => {
    router.push(`/timelines/new?recipeId=${recipeId}`);
  };

  const handleSaveRecipe = (recipeId: string) => {
    // TODO: Implement save functionality
    console.log('Save recipe:', recipeId);
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/50 py-12 text-center">
        <TrendingUp className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">
          No trending recipes available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onView={handleViewRecipe}
          onStartTimeline={handleStartTimeline}
          onSave={handleSaveRecipe}
        />
      ))}
    </div>
  );
}
