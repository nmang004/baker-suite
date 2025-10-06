'use client';

import { useState, useEffect } from 'react';
import { Search, X, Plus, Filter, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RecipeCard } from './RecipeCard';
import { useSearchRecipes } from '@/lib/hooks/useDiscovery';
import { useAllIngredients } from '@/lib/hooks/useFlavor';
import { cn } from '@/lib/utils';

interface IngredientSearchProps {
  onViewRecipe?: (recipeId: string) => void;
  onStartTimeline?: (recipeId: string) => void;
  onSaveRecipe?: (recipeId: string) => void;
  className?: string;
}

export function IngredientSearch({
  onViewRecipe,
  onStartTimeline,
  onSaveRecipe,
  className,
}: IngredientSearchProps) {
  const [searchInput, setSearchInput] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: allIngredients } = useAllIngredients();

  // Build search params
  const searchParams = {
    ingredients: selectedIngredients.join(','),
    excludeIngredients: excludedIngredients.length > 0 ? excludedIngredients.join(',') : undefined,
    limit: 20,
  };

  const { data: recipes, isLoading, refetch } = useSearchRecipes(searchParams);

  // Filter ingredient suggestions
  const filteredSuggestions = allIngredients?.filter(
    (ing) =>
      ing.toLowerCase().includes(searchInput.toLowerCase()) &&
      !selectedIngredients.includes(ing) &&
      !excludedIngredients.includes(ing)
  ).slice(0, 10);

  const handleAddIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
    setSearchInput('');
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter((i) => i !== ingredient));
  };

  const handleAddExcluded = (ingredient: string) => {
    if (!excludedIngredients.includes(ingredient)) {
      setExcludedIngredients([...excludedIngredients, ingredient]);
    }
    setSearchInput('');
  };

  const handleRemoveExcluded = (ingredient: string) => {
    setExcludedIngredients(excludedIngredients.filter((i) => i !== ingredient));
  };

  const handleClearAll = () => {
    setSelectedIngredients([]);
    setExcludedIngredients([]);
    setDifficulty('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      handleAddIngredient(searchInput.trim());
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search Input Section */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Type an ingredient and press Enter..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />

          {/* Autocomplete Suggestions */}
          {searchInput && filteredSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
              {filteredSuggestions.map((ing) => (
                <div key={ing} className="flex items-center justify-between border-b px-4 py-2 last:border-0">
                  <button
                    onClick={() => handleAddIngredient(ing)}
                    className="flex-1 text-left text-sm capitalize transition-colors hover:text-sunset-orange"
                  >
                    {ing}
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddExcluded(ing)}
                    className="ml-2 h-auto py-1 text-xs"
                  >
                    Exclude
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Ingredients */}
        {selectedIngredients.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Must Include:
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map((ing) => (
                <Badge
                  key={ing}
                  variant="default"
                  className="gap-1 bg-sunset-orange hover:bg-sunset-orange/90"
                >
                  <span className="capitalize">{ing}</span>
                  <button
                    onClick={() => handleRemoveIngredient(ing)}
                    className="ml-1 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Excluded Ingredients */}
        {excludedIngredients.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Exclude:
            </label>
            <div className="flex flex-wrap gap-2">
              {excludedIngredients.map((ing) => (
                <Badge
                  key={ing}
                  variant="outline"
                  className="gap-1 border-red-200 text-red-600"
                >
                  <span className="capitalize">{ing}</span>
                  <button
                    onClick={() => handleRemoveExcluded(ing)}
                    className="ml-1 hover:text-red-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Filters Toggle and Clear */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>

          {(selectedIngredients.length > 0 || excludedIngredients.length > 0 || difficulty) && (
            <Button variant="ghost" size="sm" onClick={handleClearAll}>
              Clear All
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="rounded-lg border p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Difficulty</label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : selectedIngredients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="mb-4 h-16 w-16 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">Search Recipes by Ingredients</h3>
          <p className="mb-4 max-w-md text-muted-foreground">
            Start by adding ingredients you want to use. We'll find recipes that match!
          </p>
        </div>
      ) : !recipes || recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="mb-4 text-lg text-muted-foreground">
            No recipes found with these ingredients. Try different combinations!
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {recipes.length} Recipe{recipes.length !== 1 ? 's' : ''} Found
            </h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onView={onViewRecipe}
                onStartTimeline={onStartTimeline}
                onSave={onSaveRecipe}
                showMatchScore
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
