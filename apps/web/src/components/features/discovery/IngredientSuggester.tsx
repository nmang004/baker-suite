'use client';

import { Plus, X, Sparkles, Palette, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSuggestIngredients } from '@/lib/hooks/useFlavor';
import { cn } from '@/lib/utils';

interface IngredientSuggesterProps {
  recipeId: string;
  currentIngredients?: string[];
  onAddIngredient?: (ingredient: string) => void;
  className?: string;
}

export function IngredientSuggester({
  recipeId,
  currentIngredients = [],
  onAddIngredient,
  className,
}: IngredientSuggesterProps) {
  const { data: suggestions, isLoading } = useSuggestIngredients(recipeId, 8);

  const getTypeIcon = (type: 'flavor' | 'texture' | 'visual') => {
    switch (type) {
      case 'flavor':
        return Sparkles;
      case 'texture':
        return Palette;
      case 'visual':
        return Eye;
      default:
        return Plus;
    }
  };

  const getTypeColor = (type: 'flavor' | 'texture' | 'visual') => {
    switch (type) {
      case 'flavor':
        return 'text-sunset-orange bg-sunset-orange/10';
      case 'texture':
        return 'text-purple-600 bg-purple-100';
      case 'visual':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'border-green-500';
    if (confidence >= 0.5) return 'border-yellow-500';
    return 'border-orange-500';
  };

  if (isLoading) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Enhancement Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Enhancement Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No suggestions available for this recipe.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group suggestions by type
  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    const type = suggestion.type || 'flavor';
    if (!acc[type]) acc[type] = [];
    acc[type].push(suggestion);
    return acc;
  }, {} as Record<string, typeof suggestions>);

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-sunset-orange" />
          Enhancement Suggestions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ingredients that would pair well with your recipe
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Ingredients */}
        {currentIngredients.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              Current Ingredients:
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentIngredients.map((ing, i) => (
                <Badge key={i} variant="outline">
                  {ing}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions by Type */}
        {Object.entries(groupedSuggestions).map(([type, items]) => {
          const TypeIcon = getTypeIcon(type as any);

          return (
            <div key={type}>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-medium capitalize">
                <TypeIcon className="h-4 w-4" />
                {type} Enhancements
              </h4>

              <div className="space-y-2">
                {items.map((suggestion, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex items-start justify-between gap-4 rounded-lg border-l-4 bg-muted/50 p-3',
                      getConfidenceColor(suggestion.confidence)
                    )}
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">
                          {suggestion.ingredient}
                        </span>
                        <Badge
                          variant="secondary"
                          className={cn('text-xs', getTypeColor(suggestion.type))}
                        >
                          {Math.round(suggestion.confidence * 100)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.reason}
                      </p>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => onAddIngredient?.(suggestion.ingredient)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Info */}
        <div className="rounded-lg bg-sunset-orange/10 p-3 text-sm text-muted-foreground">
          Suggestions are based on flavor compound analysis and culinary traditions.
          Confidence scores indicate how well these ingredients typically pair.
        </div>
      </CardContent>
    </Card>
  );
}
