'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calculator, Edit, Trash2, Clock, ChefHat, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecipe, useDeleteRecipe } from '@/lib/hooks/useRecipes';
import { useToast } from '@/lib/hooks/use-toast';
import { FlavorInsights } from '@/components/features/discovery/FlavorInsights';

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const recipeId = params?.id as string;

  const { data: recipe, isLoading } = useRecipe(recipeId);
  const deleteRecipeMutation = useDeleteRecipe();

  const handleDelete = async () => {
    if (!recipe) return;

    if (
      !confirm(
        `Are you sure you want to delete "${recipe.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteRecipeMutation.mutateAsync(recipeId);
      toast({
        title: 'Recipe deleted',
        description: `${recipe.name} has been deleted`,
        variant: 'success',
      });
      router.push('/recipes');
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Failed to delete recipe',
        variant: 'error',
      });
    }
  };

  const handleLoadInCalculator = () => {
    router.push(`/calculator?load=${recipeId}`);
  };

  const handleExploreIngredient = (ingredient: string) => {
    router.push(`/discover/search?ingredients=${ingredient}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Recipe not found</p>
        <Button
          variant="outline"
          onClick={() => router.push('/recipes')}
          className="mt-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Recipes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push('/recipes')}
        className="mb-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Recipes
      </Button>

      {/* Recipe Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <h1 className="mb-2 flex items-center gap-2 font-serif text-4xl font-bold text-chocolate-brown">
            <ChefHat className="h-9 w-9" />
            {recipe.name}
          </h1>
          {recipe.description && (
            <p className="text-lg text-warm-gray-600">{recipe.description}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleLoadInCalculator}>
            <Calculator className="mr-2 h-4 w-4" />
            Load in Calculator
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteRecipeMutation.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Recipe Details Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
            <CardDescription>
              {recipe.ingredients.length} ingredient
              {recipe.ingredients.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recipe.ingredients.map((ingredient, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border bg-card p-3"
                >
                  <div className="flex-1">
                    <p className="font-medium">{ingredient.name}</p>
                    {ingredient.percentage !== undefined && (
                      <p className="text-sm text-muted-foreground">
                        {ingredient.percentage}% of flour weight
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {ingredient.quantity} {ingredient.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Baker's Ratios */}
        <Card>
          <CardHeader>
            <CardTitle>Baker&apos;s Percentages</CardTitle>
            <CardDescription>
              Recipe ratios (flour = 100%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(recipe.ratios)
                .filter(([_, value]) => value !== undefined)
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg border bg-card p-3"
                  >
                    <p className="font-medium capitalize">{key}</p>
                    <p className="text-xl font-bold text-sunset-orange">
                      {value}%
                    </p>
                  </div>
                ))}
            </div>

            {/* Quick Ratio Info */}
            {recipe.ratios.water && (
              <div className="mt-4 rounded-lg bg-muted/50 p-4">
                <p className="text-sm font-medium">Hydration Level</p>
                <p className="text-xs text-muted-foreground">
                  {recipe.ratios.water >= 75
                    ? 'High hydration - wet, sticky dough'
                    : recipe.ratios.water >= 65
                    ? 'Medium hydration - standard bread dough'
                    : 'Low hydration - firm, easy to handle'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      {recipe.instructions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Instructions
            </CardTitle>
            <CardDescription>
              {recipe.instructions.length} step
              {recipe.instructions.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, idx) => (
                <li key={idx} className="flex gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sunset-orange text-sm font-bold text-white">
                    {idx + 1}
                  </div>
                  <p className="flex-1 pt-1 text-warm-gray-700">
                    {instruction}
                  </p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Flavor Insights Section */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl font-semibold text-chocolate-brown">
          <Sparkles className="h-6 w-6" />
          Flavor Insights
        </h2>
        <FlavorInsights
          recipeId={recipeId}
          onExploreRecipes={handleExploreIngredient}
        />
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap gap-4 text-sm text-warm-gray-500">
        <p>Created: {new Date(recipe.createdAt).toLocaleDateString()}</p>
        {recipe.updatedAt !== recipe.createdAt && (
          <p>Updated: {new Date(recipe.updatedAt).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
}
