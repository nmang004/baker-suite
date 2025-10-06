'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlavorPairingExplorer } from '@/components/features/discovery/FlavorPairingExplorer';

export default function FlavorPairingsPage() {
  const router = useRouter();
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');

  const handleExploreRecipes = (ingredient1: string, ingredient2: string) => {
    // Navigate to search page with both ingredients
    router.push(`/discover/search?ingredients=${ingredient1},${ingredient2}`);
  };

  const handleBuildRecipe = (ingredient1: string, ingredient2: string) => {
    // TODO: Navigate to recipe builder with pre-filled ingredients
    console.log('Build recipe with:', ingredient1, ingredient2);
  };

  const handleCuisineClick = (cuisine: string) => {
    setSelectedCuisine(cuisine.toLowerCase());
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
          <Sparkles className="h-8 w-8 text-sunset-orange" />
          Flavor Pairing Explorer
        </h1>
        <p className="text-muted-foreground">
          Discover scientifically-backed ingredient combinations based on shared flavor compounds.
        </p>
      </div>

      {/* Educational Section */}
      <div className="mb-8 rounded-lg border bg-blue-50 p-6">
        <div className="flex gap-4">
          <Info className="h-6 w-6 flex-shrink-0 text-blue-600" />
          <div>
            <h3 className="mb-2 font-semibold text-blue-900">
              How Flavor Pairing Works
            </h3>
            <p className="mb-3 text-sm text-blue-800">
              Flavor pairings are based on the principle that foods sharing similar flavor compounds
              tend to taste good together. Our database includes compounds like <strong>vanillin</strong>,
              <strong> limonene</strong>, <strong>pyrazines</strong>, and more.
            </p>
            <div className="grid gap-2 text-sm sm:grid-cols-3">
              <div>
                <span className="font-semibold text-green-700">Strong (80%+):</span>
                <span className="text-blue-800"> Well-established pairings</span>
              </div>
              <div>
                <span className="font-semibold text-yellow-700">Good (50-80%):</span>
                <span className="text-blue-800"> Complementary flavors</span>
              </div>
              <div>
                <span className="font-semibold text-orange-700">Experimental (&lt;50%):</span>
                <span className="text-blue-800"> Creative combinations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flavor Pairing Explorer */}
      <FlavorPairingExplorer
        onExploreRecipes={handleExploreRecipes}
        onBuildRecipe={handleBuildRecipe}
        externalCuisine={selectedCuisine}
        onCuisineChange={setSelectedCuisine}
      />

      {/* Additional Info */}
      <div className="mt-8 rounded-lg border p-6">
        <h3 className="mb-3 font-semibold">Popular Cuisines in Our Database</h3>
        <p className="mb-3 text-sm text-muted-foreground">
          Click a cuisine to explore pairings from that culinary tradition
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCuisine('all')}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              selectedCuisine === 'all'
                ? 'bg-sunset-orange text-white'
                : 'bg-muted hover:bg-muted-foreground/20'
            }`}
          >
            All Cuisines
          </button>
          {[
            'French',
            'Italian',
            'American',
            'Middle Eastern',
            'Asian',
            'Nordic',
            'Mediterranean',
            'British',
          ].map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => handleCuisineClick(cuisine)}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                selectedCuisine === cuisine.toLowerCase()
                  ? 'bg-sunset-orange text-white'
                  : 'bg-muted hover:bg-muted-foreground/20'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
