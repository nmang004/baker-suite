'use client';

import { Star, TrendingUp, Flame, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBakeStats } from '@/lib/hooks/useBakes';

export function BakeStats() {
  const { data: stats, isLoading, error } = useBakeStats();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Loading statistics...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-red-500">Failed to load statistics</p>
        </CardContent>
      </Card>
    );
  }

  if (stats.totalBakes === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Baking Statistics</CardTitle>
          <CardDescription>Track your progress and improvements</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            No bakes logged yet. Start baking and tracking your progress!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bakes */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Bakes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <p className="text-3xl font-bold">{stats.totalBakes}</p>
            </div>
          </CardContent>
        </Card>

        {/* Average Rating */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <p className="text-3xl font-bold">
                {stats.averageRating ? stats.averageRating.toFixed(1) : 'N/A'}
              </p>
              {stats.averageRating && (
                <span className="text-sm text-gray-500">/ 5</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Baking Streak */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Baking Streak</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <p className="text-3xl font-bold">{stats.bakingStreak}</p>
              <span className="text-sm text-gray-500">
                day{stats.bakingStreak !== 1 ? 's' : ''}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Most Baked Recipe */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Favorite Recipe</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.mostBakedRecipe ? (
              <div>
                <p className="font-medium truncate">{stats.mostBakedRecipe.name}</p>
                <p className="text-sm text-gray-500">
                  {stats.mostBakedRecipe.count} bake{stats.mostBakedRecipe.count !== 1 ? 's' : ''}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">N/A</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Most Common Issues */}
      {stats.mostCommonIssues && stats.mostCommonIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Most Common Issues</CardTitle>
            <CardDescription>
              Areas to focus on for improvement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.mostCommonIssues.map(({ issue, count }) => (
                <Badge key={issue} variant="outline">
                  {issue.replace(/-/g, ' ')} ({count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rating Trend */}
      {stats.ratingTrend && stats.ratingTrend.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <CardTitle>Rating Trend</CardTitle>
            </div>
            <CardDescription>Your last 10 rated bakes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.ratingTrend.map((entry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{entry.recipeName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= entry.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
