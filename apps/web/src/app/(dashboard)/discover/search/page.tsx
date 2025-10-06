'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IngredientSearch } from '@/components/features/discovery/IngredientSearch';

export default function IngredientSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial ingredients from URL if provided
  const initialIngredients = searchParams.get('ingredients')?.split(',') || [];

  const handleViewRecipe = (recipeId: string) => {
    router.push(`/recipes/${recipeId}`);
  };

  const handleStartTimeline = (recipeId: string) => {
    router.push(`/timelines/new?recipeId=${recipeId}`);
  };

  const handleSaveRecipe = (recipeId: string) => {
    // TODO: Implement save/bookmark functionality
    console.log('Save recipe:', recipeId);
  };

  return (
    <div className="container mx-auto max-w-7xl py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Discover
      </Button>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold">
          <SearchIcon className="h-8 w-8 text-sunset-orange" />
          Search by Ingredients
        </h1>
        <p className="text-muted-foreground">
          Find recipes based on ingredients you have or want to use.
        </p>
      </div>

      {/* Tips Section */}
      <div className="mb-8 rounded-lg border bg-muted/50 p-6">
        <h3 className="mb-3 font-semibold">Search Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-sunset-orange">•</span>
            <span>
              Add multiple ingredients to find recipes that use them together
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-sunset-orange">•</span>
            <span>
              Use the "Exclude" option for ingredients you want to avoid (allergies, preferences)
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-sunset-orange">•</span>
            <span>
              Recipes are ranked by match score - higher scores mean more of your ingredients are used
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-sunset-orange">•</span>
            <span>
              Use advanced filters to narrow down by difficulty level
            </span>
          </li>
        </ul>
      </div>

      {/* Ingredient Search Component */}
      <IngredientSearch
        onViewRecipe={handleViewRecipe}
        onStartTimeline={handleStartTimeline}
        onSaveRecipe={handleSaveRecipe}
      />
    </div>
  );
}
