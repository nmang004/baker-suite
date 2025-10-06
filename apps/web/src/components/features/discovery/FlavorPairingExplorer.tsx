'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, Plus, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PairingCard } from './PairingCard';
import {
  useFlavorPairings,
  useSearchPairings,
  useAllIngredients,
  useAllCuisines,
} from '@/lib/hooks/useFlavor';
import { cn } from '@/lib/utils';

interface FlavorPairingExplorerProps {
  onExploreRecipes?: (ingredient1: string, ingredient2: string) => void;
  onBuildRecipe?: (ingredient1: string, ingredient2: string) => void;
  onCuisineChange?: (cuisine: string) => void;
  externalCuisine?: string;
  className?: string;
}

export function FlavorPairingExplorer({
  onExploreRecipes,
  onBuildRecipe,
  onCuisineChange,
  externalCuisine,
  className,
}: FlavorPairingExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'sweet' | 'savory' | 'all'>('all');
  const [selectedCuisine, setSelectedCuisine] = useState(externalCuisine || 'all');
  const [showFilters, setShowFilters] = useState(false);

  // Update internal state when external cuisine changes
  useEffect(() => {
    if (externalCuisine) {
      setSelectedCuisine(externalCuisine);
      setShowFilters(true); // Show filters when externally set
    }
  }, [externalCuisine]);

  const { data: allIngredients } = useAllIngredients();
  const { data: allCuisines } = useAllCuisines();

  // Popular/common ingredients for quick access
  const popularIngredients = [
    'chocolate',
    'vanilla',
    'cinnamon',
    'lemon',
    'orange',
    'almond',
    'honey',
    'cardamom',
    'butter',
    'coffee',
    'caramel',
    'strawberry',
  ];

  // Default cuisines if API doesn't provide them
  const cuisineOptions = allCuisines || [
    'french',
    'italian',
    'american',
    'british',
    'middle eastern',
    'asian',
    'nordic',
    'mediterranean',
  ];

  // Use search pairings when filters are active
  const useSearch = (selectedCategory !== 'all') || (selectedCuisine !== 'all');

  const { data: ingredientPairings, isLoading: isLoadingIngredient } = useFlavorPairings(
    selectedIngredient,
    20
  );

  const { data: searchPairings, isLoading: isLoadingSearch } = useSearchPairings({
    ingredient: selectedIngredient || undefined,
    category: selectedCategory !== 'all' ? (selectedCategory as 'sweet' | 'savory') : undefined,
    cuisine: selectedCuisine !== 'all' ? selectedCuisine : undefined,
    limit: 20,
  });

  // Load featured pairings when nothing is selected
  const { data: featuredPairings, isLoading: isLoadingFeatured } = useSearchPairings({
    minConfidence: 0.85,
    limit: 12,
  });

  const showFeatured = !selectedIngredient && selectedCategory === 'all' && selectedCuisine === 'all';
  const pairings = showFeatured ? featuredPairings : (useSearch ? searchPairings : ingredientPairings);
  const isLoading = showFeatured ? isLoadingFeatured : (useSearch ? isLoadingSearch : isLoadingIngredient);

  // Filter suggestions based on search term
  const filteredSuggestions = allIngredients?.filter((ing) =>
    ing.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);

  const handleSelectIngredient = (ingredient: string) => {
    setSelectedIngredient(ingredient);
    setSearchTerm('');
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedCuisine('all');
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search Section */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for an ingredient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />

          {/* Autocomplete Suggestions */}
          {searchTerm && filteredSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
              {filteredSuggestions.map((ing) => (
                <button
                  key={ing}
                  onClick={() => handleSelectIngredient(ing)}
                  className="w-full px-4 py-2 text-left text-sm capitalize transition-colors hover:bg-accent"
                >
                  {ing}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filters Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>

          {selectedIngredient && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Exploring:</span>
              <div className="flex items-center gap-1 rounded-md bg-sunset-orange/10 px-3 py-1">
                <span className="font-medium capitalize">{selectedIngredient}</span>
                <button
                  onClick={() => setSelectedIngredient('')}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="flex flex-wrap gap-4 rounded-lg border p-4">
            <div className="flex-1 min-w-[200px]">
              <label className="mb-2 block text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="sweet">Sweet</SelectItem>
                  <SelectItem value="savory">Savory</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="mb-2 block text-sm font-medium">Cuisine</label>
              <Select
                value={selectedCuisine}
                onValueChange={(value) => {
                  setSelectedCuisine(value);
                  onCuisineChange?.(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All cuisines" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All cuisines</SelectItem>
                  {cuisineOptions.map((cuisine) => (
                    <SelectItem key={cuisine} value={cuisine} className="capitalize">
                      {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(selectedCategory !== 'all' || selectedCuisine !== 'all') && (
              <div className="flex items-end">
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Section */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-64 w-full" />
            </div>
          ))}
        </div>
      ) : showFeatured ? (
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Search className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Explore Flavor Pairings</h3>
            <p className="mb-6 max-w-md text-muted-foreground">
              Search for an ingredient or try one of these popular ingredients to discover
              scientifically-backed flavor pairings.
            </p>

            {/* Popular Ingredients */}
            <div className="w-full max-w-2xl">
              <h4 className="mb-3 text-sm font-semibold text-muted-foreground">
                Popular Ingredients
              </h4>
              <div className="flex flex-wrap justify-center gap-2">
                {popularIngredients.map((ingredient) => (
                  <Button
                    key={ingredient}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectIngredient(ingredient)}
                    className="capitalize"
                  >
                    {ingredient}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Show featured pairings */}
          {pairings && pairings.length > 0 && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Featured Pairings</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Classic high-confidence combinations to inspire your baking
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pairings.map((pairing) => (
                  <PairingCard
                    key={pairing.id}
                    pairing={pairing}
                    onExploreRecipes={onExploreRecipes}
                    onBuildWith={onBuildRecipe}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : !pairings || pairings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="mb-4 text-lg text-muted-foreground">
            No pairings found. Try a different ingredient or filter!
          </p>
        </div>
      ) : (
        <>
          {/* Pairings Grid */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {pairings.length} Pairing{pairings.length !== 1 ? 's' : ''} Found
              </h3>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pairings.map((pairing) => (
                <PairingCard
                  key={pairing.id}
                  pairing={pairing}
                  onExploreRecipes={onExploreRecipes}
                  onBuildWith={onBuildRecipe}
                />
              ))}
            </div>
          </div>

          {/* Educational Section */}
          <div className="rounded-lg border bg-muted/50 p-6">
            <h4 className="mb-2 font-semibold">About Flavor Pairings</h4>
            <p className="text-sm text-muted-foreground">
              These pairings are based on shared flavor compounds and culinary traditions.
              <strong> Strong pairings (80%+)</strong> are well-established combinations,
              while <strong>experimental pairings (below 50%)</strong> offer creative
              opportunities for innovation in your baking!
            </p>
          </div>
        </>
      )}
    </div>
  );
}
