'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Trash2, Calculator, Wheat, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRecipes, useDeleteRecipe } from '@/lib/hooks/useRecipes';
import { useToast } from '@/lib/hooks/use-toast';

export default function RecipesPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const { data: recipes, isLoading } = useRecipes({ search });
  const deleteRecipeMutation = useDeleteRecipe();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteRecipeMutation.mutateAsync(id);
      toast({
        title: 'Recipe deleted',
        description: `${name} has been deleted`,
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Failed to delete recipe',
        variant: 'error',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-4xl font-bold text-chocolate-brown mb-2 flex items-center gap-2">
            <BookOpen className="h-9 w-9" />
            My Recipes
          </h1>
          <p className="text-lg text-warm-gray-600">
            Your saved baking recipes and formulas
          </p>
        </div>
        <Link href="/calculator">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Recipe
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-warm-gray-400" />
          <Input
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Recipes Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-warm-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-warm-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : recipes && recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Link href={`/recipes/${recipe.id}`}>
                  <div className="flex items-start justify-between mb-3 cursor-pointer">
                    <h3 className="font-serif text-xl font-bold text-chocolate-brown hover:text-sunset-orange transition-colors">
                      {recipe.name}
                    </h3>
                  </div>

                  {recipe.description && (
                    <p className="text-sm text-warm-gray-600 mb-3">
                      {recipe.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {recipe.ratios.water && (
                      <Badge variant="secondary">
                        {recipe.ratios.water}% hydration
                      </Badge>
                    )}
                    {recipe.ratios.salt && (
                      <Badge variant="outline">{recipe.ratios.salt}% salt</Badge>
                    )}
                    {recipe.ingredients.length > 0 && (
                      <Badge variant="outline">
                        {recipe.ingredients.length} ingredients
                      </Badge>
                    )}
                  </div>
                </Link>

                <div className="flex gap-2">
                  <Link
                    href={`/calculator?load=${recipe.id}`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full" size="sm">
                      <Calculator className="h-4 w-4 mr-2" />
                      Load in Calculator
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(recipe.id, recipe.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-xs text-warm-gray-400 mt-3">
                  {new Date(recipe.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mb-4 flex justify-center">
              <Wheat className="h-16 w-16 text-warm-gray-400" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-chocolate-brown mb-2">
              No recipes yet
            </h3>
            <p className="text-warm-gray-600 mb-6">
              Start by creating your first recipe in the calculator
            </p>
            <Link href="/calculator">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Recipe
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
