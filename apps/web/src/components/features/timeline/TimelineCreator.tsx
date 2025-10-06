'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRecipes } from '@/lib/hooks/useRecipes';
import { useCreateTimeline, useWeather } from '@/lib/hooks/useTimelines';
import { useToast } from '@/lib/hooks/use-toast';
import { Loader2, AlertCircle, MapPin, Thermometer } from 'lucide-react';
import { formatDistanceToNow, addHours } from 'date-fns';

export function TimelineCreator() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: recipes, isLoading: loadingRecipes } = useRecipes();
  const createTimelineMutation = useCreateTimeline();

  const [recipeId, setRecipeId] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [targetTime, setTargetTime] = useState('');
  const [location, setLocation] = useState('');
  const [weatherEnabled, setWeatherEnabled] = useState(false);

  // Get weather when location is entered
  const { data: weatherData, isLoading: loadingWeather } = useWeather(
    location,
    weatherEnabled && location.length > 2
  );

  // Set default target time to 12 hours from now
  useEffect(() => {
    const defaultTarget = addHours(new Date(), 12);
    const date = defaultTarget.toISOString().split('T')[0];
    const time = defaultTarget.toTimeString().slice(0, 5);
    setTargetDate(date);
    setTargetTime(time);
  }, []);

  const handleLocationChange = (value: string) => {
    setLocation(value);
    setWeatherEnabled(value.length > 2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipeId || !targetDate || !targetTime || !location) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields',
        variant: 'error',
      });
      return;
    }

    // Combine date and time into ISO string
    const targetDateTime = new Date(`${targetDate}T${targetTime}`);

    if (targetDateTime <= new Date()) {
      toast({
        title: 'Invalid time',
        description: 'Target time must be in the future',
        variant: 'error',
      });
      return;
    }

    try {
      const timeline = await createTimelineMutation.mutateAsync({
        recipeId,
        targetTime: targetDateTime.toISOString(),
        location,
      });

      toast({
        title: 'Timeline created!',
        description: 'Your bake timeline is ready',
      });

      router.push(`/timelines/${timeline?.id}`);
    } catch (error) {
      toast({
        title: 'Failed to create timeline',
        description:
          error instanceof Error ? error.message : 'Please try again',
        variant: 'error',
      });
    }
  };

  // Calculate first step start time (approximate)
  const getEstimatedStart = () => {
    if (!targetDate || !targetTime) return null;
    const target = new Date(`${targetDate}T${targetTime}`);
    // Approximate: subtract 8 hours for typical sourdough
    const start = new Date(target.getTime() - 8 * 60 * 60 * 1000);
    return start;
  };

  const estimatedStart = getEstimatedStart();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-serif text-2xl">
          Create Bake Timeline
        </CardTitle>
        <p className="text-sm text-warm-gray-600">
          Schedule your bake with weather-aware adjustments
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipe Selection */}
          <div className="space-y-2">
            <Label htmlFor="recipe">Recipe</Label>
            <Select value={recipeId} onValueChange={setRecipeId}>
              <SelectTrigger id="recipe">
                <SelectValue placeholder="Select a recipe" />
              </SelectTrigger>
              <SelectContent>
                {loadingRecipes ? (
                  <div className="p-2 text-center text-sm text-warm-gray-500">
                    Loading recipes...
                  </div>
                ) : recipes && recipes.length > 0 ? (
                  recipes.map((recipe) => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      {recipe.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-center text-sm text-warm-gray-500">
                    No recipes found
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Target Finish Time */}
          <div className="space-y-2">
            <Label>When do you want the bread ready?</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="flex-1">
                <Input
                  type="time"
                  value={targetTime}
                  onChange={(e) => setTargetTime(e.target.value)}
                  required
                />
              </div>
            </div>
            {estimatedStart && (
              <p className="text-xs text-warm-gray-500">
                You'll need to start{' '}
                {formatDistanceToNow(estimatedStart, { addSuffix: true })}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">
              <MapPin className="h-4 w-4 inline mr-1" />
              Location
            </Label>
            <Input
              id="location"
              placeholder="City name or coordinates (lat,lon)"
              value={location}
              onChange={(e) => handleLocationChange(e.target.value)}
              required
            />
            <p className="text-xs text-warm-gray-500">
              Used to get weather conditions for timing adjustments
            </p>
          </div>

          {/* Weather Preview */}
          {loadingWeather && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Fetching weather data...</span>
              </CardContent>
            </Card>
          )}

          {weatherData && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Weather Conditions
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-warm-gray-600">Temperature</p>
                    <p className="font-medium">
                      {weatherData.temperature}°C
                    </p>
                  </div>
                  <div>
                    <p className="text-warm-gray-600">Humidity</p>
                    <p className="font-medium">{weatherData.humidity}%</p>
                  </div>
                </div>

                {weatherData.adjustments && (
                  <div className="mt-3 p-3 bg-white rounded-md">
                    <p className="text-xs font-semibold mb-1">
                      Proofing Adjustment:
                    </p>
                    <p className="text-xs text-warm-gray-700">
                      {weatherData.adjustments.proofing.recommendation}
                    </p>
                    {weatherData.adjustments.hydration.adjustment !== 0 && (
                      <>
                        <p className="text-xs font-semibold mt-2 mb-1">
                          Hydration Tip:
                        </p>
                        <p className="text-xs text-warm-gray-700">
                          {weatherData.adjustments.hydration.recommendation}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Warning if no weather data */}
          {location.length > 2 && !loadingWeather && !weatherData && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">
                    Weather data unavailable
                  </p>
                  <p className="text-yellow-700">
                    Using default temperature (21°C) for calculations
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTimelineMutation.isPending || !recipeId}
              className="flex-1"
            >
              {createTimelineMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Timeline'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
