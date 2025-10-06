'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Target,
  TrendingUp,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IngredientSearch } from '@/components/features/discovery/IngredientSearch';
import { RecommendationFeed } from '@/components/features/discovery/RecommendationFeed';
import { WhatToMakeNext } from '@/components/features/discovery/WhatToMakeNext';
import { RecipeCard } from '@/components/features/discovery/RecipeCard';
import { useTrendingRecipes } from '@/lib/hooks/useDiscovery';

export default function DiscoverPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('search');

  const { data: trendingRecipes, isLoading: isTrendingLoading } = useTrendingRecipes(6);

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
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold">
          <Sparkles className="h-8 w-8 text-sunset-orange" />
          Discover Recipes
        </h1>
        <p className="text-muted-foreground">
          Find your next bake through ingredient search, personalized recommendations,
          and trending recipes.
        </p>
      </div>

      {/* What to Bake Next - Prominent Feature */}
      <div className="mb-8">
        <WhatToMakeNext
          onStartBaking={handleStartTimeline}
          onSaveForLater={handleSaveRecipe}
        />
      </div>

      {/* Main Discovery Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="search" className="gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">For You</span>
          </TabsTrigger>
          <TabsTrigger value="trending" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Trending</span>
          </TabsTrigger>
          <TabsTrigger value="pairings" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Pairings</span>
          </TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-4">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Search by Ingredients</h2>
            <IngredientSearch
              onViewRecipe={handleViewRecipe}
              onStartTimeline={handleStartTimeline}
              onSaveRecipe={handleSaveRecipe}
            />
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <div>
            <h2 className="mb-2 text-2xl font-semibold">Personalized Recommendations</h2>
            <p className="mb-6 text-muted-foreground">
              Recipes tailored to your preferences and baking history
            </p>
            <RecommendationFeed
              onViewRecipe={handleViewRecipe}
              onStartTimeline={handleStartTimeline}
              onSaveRecipe={handleSaveRecipe}
            />
          </div>
        </TabsContent>

        {/* Trending Tab */}
        <TabsContent value="trending" className="space-y-4">
          <div>
            <h2 className="mb-2 text-2xl font-semibold">Trending This Week</h2>
            <p className="mb-6 text-muted-foreground">
              Popular recipes being baked by the community
            </p>

            {isTrendingLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-96 animate-pulse rounded-lg bg-gray-200" />
                ))}
              </div>
            ) : !trendingRecipes || trendingRecipes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <TrendingUp className="mb-4 h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No trending recipes available yet.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {trendingRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onView={handleViewRecipe}
                    onStartTimeline={handleStartTimeline}
                    onSave={handleSaveRecipe}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Pairings Tab */}
        <TabsContent value="pairings" className="space-y-4">
          <div>
            <h2 className="mb-2 text-2xl font-semibold">Flavor Pairings</h2>
            <p className="mb-6 text-muted-foreground">
              Explore scientifically-backed ingredient combinations
            </p>

            <div className="rounded-lg border bg-muted/50 p-8 text-center">
              <Lightbulb className="mx-auto mb-4 h-12 w-12 text-sunset-orange" />
              <h3 className="mb-2 text-lg font-semibold">
                Explore Flavor Pairings
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Visit our dedicated pairing explorer for an in-depth look at
                flavor combinations.
              </p>
              <button
                onClick={() => router.push('/discover/pairings')}
                className="rounded-lg bg-sunset-orange px-6 py-2 font-medium text-white transition-colors hover:bg-sunset-orange/90"
              >
                Go to Pairing Explorer
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
