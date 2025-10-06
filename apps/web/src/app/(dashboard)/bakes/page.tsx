'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBakes } from '@/lib/hooks/useBakes';
import { useRecipes } from '@/lib/hooks/useRecipes';
import { getIssueCategory } from '@/lib/api/bakes';

export default function BakesPage() {
  const router = useRouter();
  const [recipeFilter, setRecipeFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');

  const { data: recipes } = useRecipes({ limit: 100 });
  const { data: bakes, isLoading } = useBakes({
    recipeId: recipeFilter !== 'all' ? recipeFilter : undefined,
    minRating: ratingFilter !== 'all' ? parseInt(ratingFilter) : undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Bakes</h1>
          <p className="text-gray-600">Track your baking journey and progress</p>
        </div>
        <Button onClick={() => router.push('/bakes/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Log New Bake
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            {/* Recipe Filter */}
            <div className="flex-1 min-w-[200px]">
              <Select value={recipeFilter} onValueChange={setRecipeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by recipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Recipes</SelectItem>
                  {recipes?.map((recipe: any) => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      {recipe.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rating Filter */}
            <div className="flex-1 min-w-[200px]">
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="2">2+ Stars</SelectItem>
                  <SelectItem value="1">1+ Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bakes List */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Loading bakes...</p>
          </CardContent>
        </Card>
      ) : !bakes || bakes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">
              {recipeFilter !== 'all' || ratingFilter !== 'all'
                ? 'No bakes match your filters'
                : 'No bakes logged yet'}
            </p>
            <Button onClick={() => router.push('/bakes/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Log Your First Bake
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bakes.map((bake: any) => (
            <Link key={bake.id} href={`/bakes/${bake.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="space-y-2">
                    {/* Recipe Name */}
                    <CardTitle className="text-lg">
                      {bake.recipe?.name || 'Unknown Recipe'}
                    </CardTitle>

                    {/* Date */}
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(bake.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Photo */}
                  {bake.photos && bake.photos.length > 0 && (
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={bake.photos[0]}
                        alt="Bake"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.png';
                        }}
                      />
                    </div>
                  )}

                  {/* Rating */}
                  {bake.rating && (
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= bake.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Notes Preview */}
                  {bake.notes && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {bake.notes}
                    </p>
                  )}

                  {/* Issues */}
                  {bake.issues && bake.issues.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {bake.issues.slice(0, 3).map((issue: string) => {
                        const category = getIssueCategory(issue);
                        return (
                          <Badge
                            key={issue}
                            variant={
                              category === 'problem'
                                ? 'error'
                                : category === 'success'
                                ? 'success'
                                : 'outline'
                            }
                            className="text-xs"
                          >
                            {issue.replace(/-/g, ' ')}
                          </Badge>
                        );
                      })}
                      {bake.issues.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{bake.issues.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
