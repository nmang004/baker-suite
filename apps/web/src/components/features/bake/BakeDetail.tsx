'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, Calendar, Trash2, Edit, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBake, useDeleteBake } from '@/lib/hooks/useBakes';
import { getIssueCategory } from '@/lib/api/bakes';
import { useToast } from '@/lib/hooks/use-toast';

interface BakeDetailProps {
  bakeId: string;
}

export function BakeDetail({ bakeId }: BakeDetailProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: bake, isLoading, error } = useBake(bakeId);
  const deleteBake = useDeleteBake();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteBake.mutateAsync(bakeId);
      toast({
        title: 'Bake Deleted',
        description: 'Your bake has been successfully deleted',
      });
      router.push('/bakes');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete bake',
        variant: 'error',
      });
    }
  };

  const handleBakeAgain = () => {
    if (bake?.recipe?.id) {
      // TODO: Create new timeline with this recipe
      router.push(`/timelines/new?recipeId=${bake.recipe.id}`);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Loading bake details...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !bake) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <p className="text-center text-red-500">Failed to load bake details</p>
        </CardContent>
      </Card>
    );
  }

  const formattedDate = new Date(bake.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">
                {bake.recipe?.name || 'Unknown Recipe'}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/bakes/${bakeId}/edit`)}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rating */}
          {bake.rating && (
            <div className="space-y-2">
              <h3 className="font-medium">Rating</h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 ${
                      star <= bake.rating!
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recipe Link */}
          {bake.recipe && (
            <div className="space-y-2">
              <h3 className="font-medium">Recipe</h3>
              <Link
                href={`/recipes/${bake.recipe.id}`}
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                {bake.recipe.name}
                <ExternalLink className="w-4 h-4" />
              </Link>
              {bake.recipe.description && (
                <p className="text-sm text-gray-600">{bake.recipe.description}</p>
              )}
            </div>
          )}

          {/* Photos */}
          {bake.photos && bake.photos.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {bake.photos.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`Bake photo ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-image.png';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {bake.notes && (
            <div className="space-y-2">
              <h3 className="font-medium">Notes</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{bake.notes}</p>
            </div>
          )}

          {/* Issues */}
          {bake.issues && bake.issues.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Issues & Observations</h3>
              <div className="flex flex-wrap gap-2">
                {bake.issues.map((issue) => {
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
                    >
                      {issue.replace(/-/g, ' ')}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Weather */}
          {bake.weather && (
            <div className="space-y-2">
              <h3 className="font-medium">Weather Conditions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                {bake.weather.temperature !== undefined && (
                  <div>
                    <p className="text-sm text-gray-600">Temperature</p>
                    <p className="font-medium">{bake.weather.temperature}°C</p>
                  </div>
                )}
                {bake.weather.humidity !== undefined && (
                  <div>
                    <p className="text-sm text-gray-600">Humidity</p>
                    <p className="font-medium">{bake.weather.humidity}%</p>
                  </div>
                )}
                {bake.weather.pressure !== undefined && (
                  <div>
                    <p className="text-sm text-gray-600">Pressure</p>
                    <p className="font-medium">{bake.weather.pressure} hPa</p>
                  </div>
                )}
                {bake.weather.location && (
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{bake.weather.location}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleBakeAgain}>
              Bake Again
            </Button>
            <Button variant="outline" onClick={() => router.push('/bakes')}>
              Back to Bakes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Delete Bake?</CardTitle>
              <CardDescription>
                This action cannot be undone. This will permanently delete your bake log.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteBake.isPending}
              >
                {deleteBake.isPending ? 'Deleting...' : 'Delete'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
