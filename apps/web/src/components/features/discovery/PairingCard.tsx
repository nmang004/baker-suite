'use client';

import { Star, ChevronDown, ChevronUp, Sparkles, Globe, UtensilsCrossed, Candy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { FlavorPairing } from '@/lib/api/flavor';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface PairingCardProps {
  pairing: FlavorPairing;
  onExploreRecipes?: (ingredient1: string, ingredient2: string) => void;
  onBuildWith?: (ingredient1: string, ingredient2: string) => void;
  className?: string;
}

export function PairingCard({
  pairing,
  onExploreRecipes,
  onBuildWith,
  className,
}: PairingCardProps) {
  const [showCompounds, setShowCompounds] = useState(false);

  // Get confidence color and label
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.5) return 'text-yellow-600 bg-yellow-50';
    return 'text-orange-600 bg-orange-50';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'Strong';
    if (confidence >= 0.5) return 'Good';
    return 'Experimental';
  };

  // Render star rating
  const renderStars = (confidence: number) => {
    const stars = Math.round(confidence * 5);
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-4 w-4',
              i < stars ? 'fill-current text-yellow-500' : 'text-gray-300'
            )}
          />
        ))}
      </div>
    );
  };

  // Category icon
  const CategoryIcon = pairing.category === 'sweet' ? Candy : UtensilsCrossed;

  return (
    <Card className={cn('overflow-hidden transition-shadow hover:shadow-md', className)}>
      <CardContent className="p-6">
        {/* Ingredients Display */}
        <div className="mb-4 flex items-center justify-between gap-4">
          {/* Ingredient 1 */}
          <div className="flex-1 text-center">
            <div className="mb-2 flex h-16 w-full items-center justify-center rounded-lg bg-gradient-to-br from-sunset-orange/10 to-warm-brown/10">
              <span className="text-2xl font-semibold capitalize text-warm-brown">
                {pairing.ingredient1}
              </span>
            </div>
          </div>

          {/* Pairing Icon */}
          <div className="flex flex-col items-center gap-1">
            <Sparkles className="h-6 w-6 text-sunset-orange" />
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>

          {/* Ingredient 2 */}
          <div className="flex-1 text-center">
            <div className="mb-2 flex h-16 w-full items-center justify-center rounded-lg bg-gradient-to-br from-sunset-orange/10 to-warm-brown/10">
              <span className="text-2xl font-semibold capitalize text-warm-brown">
                {pairing.ingredient2}
              </span>
            </div>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Confidence:</span>
            {renderStars(pairing.confidence)}
          </div>
          <Badge className={getConfidenceColor(pairing.confidence)}>
            {getConfidenceLabel(pairing.confidence)} ({Math.round(pairing.confidence * 100)}%)
          </Badge>
        </div>

        {/* Category and Cuisines */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {/* Category Badge */}
          <Badge variant="outline" className="gap-1">
            <CategoryIcon className="h-3 w-3" />
            <span className="capitalize">{pairing.category}</span>
          </Badge>

          {/* Cuisine Badges */}
          {pairing.cuisine.length > 0 && (
            <>
              <Globe className="h-4 w-4 text-muted-foreground" />
              {pairing.cuisine.map((cuisine) => (
                <Badge key={cuisine} variant="secondary">
                  {cuisine}
                </Badge>
              ))}
            </>
          )}
        </div>

        {/* Shared Compounds */}
        {pairing.compounds.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowCompounds(!showCompounds)}
              className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm transition-colors hover:bg-gray-100"
            >
              <span className="font-medium">
                Shared Flavor Compounds ({pairing.compounds.length})
              </span>
              {showCompounds ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {showCompounds && (
              <div className="mt-2 flex flex-wrap gap-2 px-3">
                {pairing.compounds.map((compound) => (
                  <Badge key={compound} variant="outline" className="text-xs">
                    {compound}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={() =>
              onExploreRecipes?.(pairing.ingredient1, pairing.ingredient2)
            }
          >
            Explore Recipes
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() =>
              onBuildWith?.(pairing.ingredient1, pairing.ingredient2)
            }
          >
            Build with This
          </Button>
        </div>

        {/* Educational Note */}
        {pairing.confidence >= 0.8 && (
          <p className="mt-3 text-xs text-muted-foreground">
            This is a well-established pairing backed by shared flavor compounds.
          </p>
        )}
        {pairing.confidence >= 0.5 && pairing.confidence < 0.8 && (
          <p className="mt-3 text-xs text-muted-foreground">
            These ingredients complement each other well in many recipes.
          </p>
        )}
        {pairing.confidence < 0.5 && (
          <p className="mt-3 text-xs text-muted-foreground">
            An experimental pairing worth exploring for creative recipes!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
