'use client';

import { Clock, Star, ChefHat, Heart, Play, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { RecipeWithScore } from '@/lib/api/discovery';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: RecipeWithScore;
  onView?: (recipeId: string) => void;
  onStartTimeline?: (recipeId: string) => void;
  onSave?: (recipeId: string) => void;
  showMatchScore?: boolean;
  className?: string;
}

export function RecipeCard({
  recipe,
  onView,
  onStartTimeline,
  onSave,
  showMatchScore = false,
  className,
}: RecipeCardProps) {
  const getDifficultyColor = (tags: string[]) => {
    if (tags.includes('beginner')) return 'bg-green-100 text-green-800';
    if (tags.includes('intermediate')) return 'bg-yellow-100 text-yellow-800';
    if (tags.includes('advanced')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getDifficultyLabel = (tags: string[]) => {
    if (tags.includes('beginner')) return 'Beginner';
    if (tags.includes('intermediate')) return 'Intermediate';
    if (tags.includes('advanced')) return 'Advanced';
    return 'Unknown';
  };

  const ingredientCount = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.length
    : 0;

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all hover:shadow-lg',
        className
      )}
    >
      {/* Match Score Badge (for search results) */}
      {showMatchScore && recipe.matchScore !== undefined && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
            {Math.round(recipe.matchScore * 100)}% match
          </Badge>
        </div>
      )}

      {/* Image Placeholder */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-sunset-orange/20 to-warm-brown/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <ChefHat className="h-16 w-16 text-warm-brown/40" />
        </div>

        {/* Quick Actions on Hover */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onView?.(recipe.id)}
          >
            <Eye className="mr-1 h-4 w-4" />
            View
          </Button>
          <Button
            size="sm"
            onClick={() => onStartTimeline?.(recipe.id)}
          >
            <Play className="mr-1 h-4 w-4" />
            Start
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Recipe Name */}
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold">
          {recipe.name}
        </h3>

        {/* Description */}
        {recipe.description && (
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {recipe.description}
          </p>
        )}

        {/* Match Reason (for recommendations) */}
        {recipe.reason && (
          <p className="mb-3 text-xs italic text-sunset-orange">
            {recipe.reason}
          </p>
        )}

        {/* Meta Info */}
        <div className="mb-3 flex items-center gap-3 text-sm text-muted-foreground">
          {/* Time Estimate - placeholder since not in schema */}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>~4h</span>
          </div>

          {/* Ingredient Count */}
          <div className="flex items-center gap-1">
            <ChefHat className="h-4 w-4" />
            <span>{ingredientCount} ingredients</span>
          </div>

          {/* Score (if available) */}
          {recipe.score !== undefined && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-current text-yellow-500" />
              <span>{Math.round(recipe.score)}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {/* Difficulty Badge */}
          <Badge className={getDifficultyColor(recipe.tags)}>
            {getDifficultyLabel(recipe.tags)}
          </Badge>

          {/* Other Tags (max 2) */}
          {recipe.tags
            .filter(
              (tag) =>
                !['beginner', 'intermediate', 'advanced'].includes(tag)
            )
            .slice(0, 2)
            .map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}

          {/* More tags indicator */}
          {recipe.tags.filter(
            (tag) =>
              !['beginner', 'intermediate', 'advanced'].includes(tag)
          ).length > 2 && (
            <Badge variant="outline">
              +
              {recipe.tags.filter(
                (tag) =>
                  !['beginner', 'intermediate', 'advanced'].includes(tag)
              ).length - 2}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center gap-2 border-t p-3">
        {/* Action Buttons */}
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onView?.(recipe.id)}
        >
          <Eye className="mr-1 h-4 w-4" />
          View
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={() => onStartTimeline?.(recipe.id)}
        >
          <Play className="mr-1 h-4 w-4" />
          Start
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSave?.(recipe.id)}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
