'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateBake } from '@/lib/hooks/useBakes';
import { useRecipes } from '@/lib/hooks/useRecipes';
import { ISSUE_TAGS, ALL_ISSUE_TAGS } from '@/lib/api/bakes';
import { useToast } from '@/lib/hooks/use-toast';

interface BakeLoggerProps {
  defaultRecipeId?: string;
  defaultWeather?: any;
  onSuccess?: () => void;
}

export function BakeLogger({ defaultRecipeId, defaultWeather, onSuccess }: BakeLoggerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const createBake = useCreateBake();
  const { data: recipes, isLoading: recipesLoading } = useRecipes({ limit: 100 });

  // Form state
  const [recipeId, setRecipeId] = useState(defaultRecipeId || '');
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [weather, setWeather] = useState(defaultWeather || null);

  // Check for timeline query params
  useEffect(() => {
    const timelineId = searchParams?.get('timelineId');
    const recipeIdParam = searchParams?.get('recipeId');

    if (recipeIdParam && !defaultRecipeId) {
      setRecipeId(recipeIdParam);
    }

    // TODO: Fetch timeline data if timelineId is present
    // and populate weather data
  }, [searchParams, defaultRecipeId]);

  const handleAddPhoto = () => {
    if (currentPhotoUrl.trim() && photoUrls.length < 10) {
      try {
        new URL(currentPhotoUrl); // Validate URL
        setPhotoUrls([...photoUrls, currentPhotoUrl.trim()]);
        setCurrentPhotoUrl('');
      } catch {
        toast({
          title: 'Invalid URL',
          description: 'Please enter a valid photo URL',
          variant: 'error',
        });
      }
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotoUrls(photoUrls.filter((_, i) => i !== index));
  };

  const toggleIssue = (issue: string) => {
    if (selectedIssues.includes(issue)) {
      setSelectedIssues(selectedIssues.filter((i) => i !== issue));
    } else {
      setSelectedIssues([...selectedIssues, issue]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipeId) {
      toast({
        title: 'Recipe Required',
        description: 'Please select a recipe',
        variant: 'error',
      });
      return;
    }

    try {
      await createBake.mutateAsync({
        recipeId,
        rating,
        notes: notes.trim() || undefined,
        photos: photoUrls,
        issues: selectedIssues,
        weather,
      });

      toast({
        title: 'Bake Logged!',
        description: 'Your bake has been successfully recorded',
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/bakes');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to log bake',
        variant: 'error',
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Log a Bake</CardTitle>
        <CardDescription>
          Record details about your completed bake to track your progress
          {searchParams?.get('timelineId') && (
            <span className="block mt-1 text-primary">
              Logging bake from timeline
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipe Selection */}
          <div className="space-y-2">
            <Label htmlFor="recipe">Recipe *</Label>
            <Select value={recipeId} onValueChange={setRecipeId}>
              <SelectTrigger id="recipe">
                <SelectValue placeholder="Select a recipe" />
              </SelectTrigger>
              <SelectContent>
                {recipesLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading recipes...
                  </SelectItem>
                ) : recipes && recipes.length > 0 ? (
                  recipes.map((recipe: any) => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      {recipe.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No recipes found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(rating === star ? undefined : star)}
                  className="transition-colors"
                >
                  <Star
                    className={`w-8 h-8 ${
                      rating && star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you learn? What would you change?"
              maxLength={2000}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-sm text-gray-500">
              {notes.length}/2000 characters
            </p>
          </div>

          {/* Photos */}
          <div className="space-y-2">
            <Label htmlFor="photo-url">Photos (URLs)</Label>
            <div className="flex gap-2">
              <Input
                id="photo-url"
                type="url"
                value={currentPhotoUrl}
                onChange={(e) => setCurrentPhotoUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPhoto();
                  }
                }}
              />
              <Button type="button" onClick={handleAddPhoto} variant="outline">
                Add
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              TODO: Cloudflare R2 integration coming soon. For now, use image URLs.
            </p>
            {photoUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {photoUrls.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded"
                  >
                    <span className="text-sm truncate max-w-[200px]">{url}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Issue Tags */}
          <div className="space-y-2">
            <Label>Issues & Observations</Label>
            <div className="space-y-3">
              {Object.entries(ISSUE_TAGS).map(([category, tags]) => (
                <div key={category}>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {category.replace(/_/g, ' ')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedIssues.includes(tag) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleIssue(tag)}
                      >
                        {tag.replace(/-/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Display (if from timeline) */}
          {weather && (
            <div className="space-y-2">
              <Label>Weather Conditions</Label>
              <div className="p-3 bg-gray-50 rounded-md text-sm">
                {weather.temperature && <p>Temperature: {weather.temperature}°C</p>}
                {weather.humidity && <p>Humidity: {weather.humidity}%</p>}
                {weather.location && <p>Location: {weather.location}</p>}
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-2">
            <Button type="submit" disabled={createBake.isPending}>
              {createBake.isPending ? 'Logging...' : 'Log Bake'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
