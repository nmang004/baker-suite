'use client';

import { Sparkles, Info, Lightbulb, ChefHat, TrendingUp } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecipeInsights } from '@/lib/hooks/useFlavor';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FlavorInsightsProps {
  recipeId: string;
  onExploreRecipes?: (ingredient: string) => void;
}

export function FlavorInsights({
  recipeId,
  onExploreRecipes,
}: FlavorInsightsProps) {
  const { data: insights, isLoading, error } = useRecipeInsights(recipeId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Failed to load flavor insights. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!insights) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Info className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">
            No flavor insights available for this recipe yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { analysis, flavorProfiles, enhancements } = insights;

  // Helper to get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 0.5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-orange-100 text-orange-800 border-orange-200';
  };

  // Helper to get strength badge variant
  const getStrengthBadge = (strength: number) => {
    if (strength >= 0.7) return { text: 'Dominant', variant: 'default' as const };
    if (strength >= 0.4) return { text: 'Moderate', variant: 'secondary' as const };
    return { text: 'Subtle', variant: 'outline' as const };
  };

  return (
    <div className="space-y-6">
      {/* Flavor Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sunset-orange" />
            Flavor Profile
          </CardTitle>
          <CardDescription>
            Understanding the flavor composition of this recipe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Flavor Types */}
          {flavorProfiles.profiles.length > 0 && (
            <div>
              <h4 className="mb-3 font-semibold text-sm">Flavor Characteristics</h4>
              <div className="flex flex-wrap gap-2">
                {flavorProfiles.profiles.map((profile) => {
                  const strengthInfo = getStrengthBadge(profile.strength);
                  return (
                    <Badge key={profile.type} variant={strengthInfo.variant}>
                      {profile.type}{' '}
                      <span className="ml-1 text-xs opacity-70">
                        ({strengthInfo.text})
                      </span>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Category */}
          <div>
            <h4 className="mb-2 font-semibold text-sm">Category</h4>
            <Badge variant="outline" className="capitalize">
              {flavorProfiles.category}
            </Badge>
          </div>

          {/* Dominant Compounds */}
          {analysis.flavorProfile.dominant.length > 0 && (
            <div>
              <h4 className="mb-2 font-semibold text-sm">Key Flavor Notes</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.flavorProfile.dominant.map((ingredient) => (
                  <Badge
                    key={ingredient}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => onExploreRecipes?.(ingredient)}
                  >
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Supporting Flavors */}
          {analysis.flavorProfile.supporting.length > 0 && (
            <div>
              <h4 className="mb-2 font-semibold text-sm">Supporting Flavors</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.flavorProfile.supporting.map((ingredient) => (
                  <Badge
                    key={ingredient}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => onExploreRecipes?.(ingredient)}
                  >
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Complexity Score */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Flavor Complexity</p>
                <p className="text-xs text-muted-foreground">
                  Based on ingredient interactions
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-sunset-orange">
                  {Math.round(analysis.complexity * 100)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {analysis.complexity >= 0.7
                    ? 'Complex'
                    : analysis.complexity >= 0.4
                    ? 'Moderate'
                    : 'Simple'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ingredient Insights */}
      {analysis.pairings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-sunset-orange" />
              Why These Ingredients Work Together
            </CardTitle>
            <CardDescription>
              Scientifically-backed ingredient pairings in this recipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.pairings.map((pairing, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow"
                >
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium">
                        {pairing.ingredient1}{' '}
                        <span className="text-muted-foreground">+</span>{' '}
                        {pairing.ingredient2}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {pairing.compounds.slice(0, 3).map((compound) => (
                          <Badge
                            key={compound}
                            variant="outline"
                            className="text-xs"
                          >
                            {compound}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={getConfidenceColor(pairing.confidence)}
                      >
                        {Math.round(pairing.confidence * 100)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhancement Suggestions */}
      {enhancements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-sunset-orange" />
              Suggested Enhancements
            </CardTitle>
            <CardDescription>
              Ingredients that could complement this recipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Group by type */}
              {(['flavor', 'texture', 'visual'] as const).map((type) => {
                const items = enhancements.filter((e) => e.type === type);
                if (items.length === 0) return null;

                return (
                  <div key={type}>
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold capitalize">
                      {type === 'flavor' && <ChefHat className="h-4 w-4" />}
                      {type === 'texture' && <TrendingUp className="h-4 w-4" />}
                      {type === 'visual' && <Sparkles className="h-4 w-4" />}
                      {type} Enhancements
                    </h4>
                    <div className="space-y-2">
                      {items.map((suggestion, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border bg-card p-3"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-medium">
                                {suggestion.ingredient}
                              </p>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {suggestion.reason}
                              </p>
                            </div>
                            <Badge
                              className={getConfidenceColor(
                                suggestion.confidence
                              )}
                            >
                              {Math.round(suggestion.confidence * 100)}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Suggestions */}
      {analysis.suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-sunset-orange" />
              Complementary Ingredients
            </CardTitle>
            <CardDescription>
              Other ingredients that pair well with this recipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {analysis.suggestions.map((suggestion, idx) => (
                <div key={idx} className="rounded-lg border bg-card p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="font-medium">{suggestion.ingredient}</p>
                    <Badge className={getConfidenceColor(suggestion.confidence)}>
                      {Math.round(suggestion.confidence * 100)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {suggestion.reason}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
