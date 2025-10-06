'use client';

import { useState, useEffect } from 'react';
import { Plus, Save, RotateCcw, BarChart3 } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IngredientRow } from './IngredientRow';
import { useToast } from '@/lib/hooks/use-toast';
import { useCreateRecipe, useRecipe } from '@/lib/hooks/useRecipes';
import {
  type Ingredient,
  createEmptyIngredient,
  calculateAllPercentages,
  scaleRecipe,
  calculateTotalWeight,
  calculateHydration,
  calculateHydrationBreakdown,
  validateRecipe,
  getFlourWeight,
  generateIngredientId,
  type ScaleBy,
  type HydrationBreakdown,
} from '@/lib/utils/ratioCalculator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function RatioCalculator() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn } = useAuth();
  const createRecipeMutation = useCreateRecipe();

  // Get recipe ID from URL params
  const loadRecipeId = searchParams.get('load');
  const { data: loadedRecipe } = useRecipe(loadRecipeId || '');

  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { ...createEmptyIngredient(), name: 'Flour', weight: 500, percentage: 100 },
  ]);

  const [scaleBy, setScaleBy] = useState<ScaleBy>('flour');
  const [targetValue, setTargetValue] = useState<number>(500);
  const [targetUnit, setTargetUnit] = useState<'g' | 'oz' | 'lb'>('g');
  const [scaledIngredients, setScaledIngredients] = useState<Ingredient[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Load recipe from URL parameter
  useEffect(() => {
    if (loadedRecipe) {
      // Convert API ingredients to calculator format
      const convertedIngredients: Ingredient[] = loadedRecipe.ingredients.map(
        (ing) => ({
          id: generateIngredientId(),
          name: ing.name,
          weight: ing.quantity,
          unit: ing.unit as 'g' | 'oz' | 'lb',
          percentage: ing.percentage || 0,
        })
      );

      setRecipeName(loadedRecipe.name);
      setIngredients(convertedIngredients);

      toast({
        title: 'Recipe loaded',
        description: `${loadedRecipe.name} has been loaded into the calculator`,
        variant: 'success',
      });

      // Clear the URL parameter
      router.replace('/calculator');
    }
  }, [loadedRecipe, router, toast]);

  // Auto-calculate percentages when ingredients change
  useEffect(() => {
    const updated = calculateAllPercentages(ingredients);
    setIngredients(updated);
  }, [ingredients.length]); // Only run when ingredients are added/removed

  const handleAddIngredient = () => {
    setIngredients([...ingredients, createEmptyIngredient()]);
  };

  const handleUpdateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string | number
  ) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };

    // Recalculate percentages
    const withPercentages = calculateAllPercentages(updated);
    setIngredients(withPercentages);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length === 1) {
      toast({
        title: 'Cannot remove',
        description: 'Recipe must have at least one ingredient',
        variant: 'error',
      });
      return;
    }
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleCalculate = () => {
    const validation = validateRecipe(ingredients);

    if (!validation.isValid) {
      toast({
        title: 'Validation Error',
        description: validation.errors[0],
        variant: 'error',
      });
      return;
    }

    try {
      const scaled = scaleRecipe(
        ingredients,
        scaleBy,
        targetValue,
        scaleBy === 'yield' ? targetUnit : undefined
      );
      setScaledIngredients(scaled);
      setShowResults(true);

      toast({
        title: 'Recipe Scaled!',
        description: `Scaled successfully by ${scaleBy}`,
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Calculation Error',
        description: 'Failed to scale recipe',
        variant: 'error',
      });
    }
  };

  const handleReset = () => {
    setIngredients([
      { ...createEmptyIngredient(), name: 'Flour', weight: 500, percentage: 100 },
    ]);
    setRecipeName('');
    setScaledIngredients([]);
    setShowResults(false);
    setTargetValue(500);
  };

  const handleSave = async () => {
    // Check if user is signed in
    if (!isSignedIn) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save recipes',
        variant: 'error',
      });
      router.push('/sign-in');
      return;
    }

    // Validate recipe name
    if (!recipeName.trim()) {
      toast({
        title: 'Recipe name required',
        description: 'Please enter a name for your recipe',
        variant: 'error',
      });
      return;
    }

    // Validate recipe
    const validation = validateRecipe(ingredients);
    if (!validation.isValid) {
      toast({
        title: 'Invalid recipe',
        description: validation.errors[0],
        variant: 'error',
      });
      return;
    }

    try {
      // Convert calculator ingredients to API format
      const apiIngredients = ingredients.map((ing) => ({
        name: ing.name,
        quantity: ing.weight,
        unit: ing.unit,
        percentage: ing.percentage,
      }));

      // Calculate baker's ratios
      const flourWeight = getFlourWeight(ingredients);
      const ratios: Record<string, number> = { flour: 100 };

      ingredients.forEach((ing) => {
        const name = ing.name.toLowerCase();
        if (name.includes('water')) {
          ratios.water = ing.percentage;
        } else if (name.includes('salt')) {
          ratios.salt = ing.percentage;
        } else if (name.includes('yeast') && !name.includes('starter')) {
          ratios.yeast = ing.percentage;
        } else if (name.includes('starter') || name.includes('levain')) {
          ratios.starter = ing.percentage;
        }
      });

      // Ensure minimum required ratios
      if (!ratios.water) ratios.water = 0;
      if (!ratios.salt) ratios.salt = 0;

      // Create recipe
      await createRecipeMutation.mutateAsync({
        name: recipeName,
        description: `Hydration: ${calculateHydration(ingredients).toFixed(1)}%`,
        ingredients: apiIngredients,
        instructions: ['Mix ingredients', 'Follow your preferred method'],
        tags: [],
        ratios: ratios as any,
      });

      toast({
        title: 'Recipe saved!',
        description: `${recipeName} has been saved successfully`,
        variant: 'success',
      });

      // Optionally redirect to recipes page
      // router.push('/recipes');
    } catch (error) {
      console.error('Save recipe error:', error);
      toast({
        title: 'Save failed',
        description: error instanceof Error ? error.message : 'Failed to save recipe',
        variant: 'error',
      });
    }
  };

  const totalWeight = calculateTotalWeight(ingredients);
  const hydration = calculateHydration(ingredients);
  const hydrationBreakdown = calculateHydrationBreakdown(ingredients);

  return (
    <div className="space-y-8">
      {/* Recipe Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="recipe-name">Recipe Name</Label>
          <Input
            id="recipe-name"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            placeholder="My Sourdough Boule"
            className="max-w-md"
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          {totalWeight > 0 && (
            <Badge variant="secondary">
              Total: {totalWeight.toFixed(0)}g
            </Badge>
          )}
          {hydration > 0 && (
            <div className="group relative">
              <Badge variant="secondary" className="cursor-help">
                Hydration: {hydration.toFixed(1)}%
              </Badge>
              {/* Tooltip with breakdown */}
              {hydrationBreakdown.contributors.length > 0 && (
                <div className="hidden group-hover:block absolute z-10 mt-2 p-3 bg-white border-2 border-warm-gray-200 rounded-lg shadow-lg min-w-[250px]">
                  <p className="text-xs font-semibold text-chocolate-brown mb-2">
                    Hydration Breakdown:
                  </p>
                  <div className="space-y-1">
                    {hydrationBreakdown.contributors.map((contributor, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-warm-gray-700">
                          {contributor.ingredient}
                          <span className="text-warm-gray-500 ml-1">
                            ({contributor.hydrationFactor}% liquid)
                          </span>
                        </span>
                        <span className="font-mono text-sunset-orange">
                          +{contributor.contribution.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-warm-gray-200 flex justify-between text-xs font-semibold">
                    <span>Total Hydration:</span>
                    <span className="text-sunset-orange">
                      {hydrationBreakdown.totalHydration.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Ingredients Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ingredients</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddIngredient}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Ingredient
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-warm-gray-300">
                  <th className="text-left py-3 pr-4 font-semibold text-chocolate-brown">
                    Ingredient
                  </th>
                  <th className="text-left py-3 pr-4 font-semibold text-chocolate-brown">
                    Weight
                  </th>
                  <th className="text-left py-3 pr-4 font-semibold text-chocolate-brown">
                    Unit
                  </th>
                  <th className="text-left py-3 pr-4 font-semibold text-chocolate-brown">
                    Percentage
                  </th>
                  <th className="text-left py-3 font-semibold text-chocolate-brown">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ingredient, index) => (
                  <IngredientRow
                    key={ingredient.id}
                    ingredient={ingredient}
                    onUpdate={(field, value) =>
                      handleUpdateIngredient(index, field, value)
                    }
                    onRemove={() => handleRemoveIngredient(index)}
                    isFlour={ingredient.name.toLowerCase().includes('flour')}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Scaling Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Scale Recipe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Scale By */}
            <div className="space-y-2">
              <Label htmlFor="scale-by">Scale By</Label>
              <Select
                value={scaleBy}
                onValueChange={(value: ScaleBy) => setScaleBy(value)}
              >
                <SelectTrigger id="scale-by">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flour">Flour Weight</SelectItem>
                  <SelectItem value="yield">Final Yield</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Target Value */}
            <div className="space-y-2">
              <Label htmlFor="target-value">
                {scaleBy === 'percentage' ? 'Percentage' : 'Target Amount'}
              </Label>
              <Input
                id="target-value"
                type="number"
                value={targetValue || ''}
                onChange={(e) => setTargetValue(parseFloat(e.target.value) || 0)}
                placeholder={scaleBy === 'percentage' ? '150' : '1000'}
                min="0"
                step="0.1"
                unit={scaleBy === 'percentage' ? '%' : undefined}
              />
            </div>

            {/* Unit (only for yield) */}
            {scaleBy === 'yield' && (
              <div className="space-y-2">
                <Label htmlFor="target-unit">Unit</Label>
                <Select
                  value={targetUnit}
                  onValueChange={(value: 'g' | 'oz' | 'lb') =>
                    setTargetUnit(value)
                  }
                >
                  <SelectTrigger id="target-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">Grams (g)</SelectItem>
                    <SelectItem value="oz">Ounces (oz)</SelectItem>
                    <SelectItem value="lb">Pounds (lb)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={handleCalculate}>Calculate</Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="secondary" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Recipe
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {showResults && scaledIngredients.length > 0 && (
        <Card className="border-sunset-orange border-2">
          <CardHeader>
            <CardTitle className="text-sunset-orange flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Scaled Recipe Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-sunset-orange">
                      <th className="text-left py-3 pr-4 font-semibold text-chocolate-brown">
                        Ingredient
                      </th>
                      <th className="text-right py-3 pr-4 font-semibold text-chocolate-brown">
                        Weight
                      </th>
                      <th className="text-right py-3 font-semibold text-chocolate-brown">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {scaledIngredients.map((ing) => (
                      <tr key={ing.id} className="border-b border-warm-gray-200">
                        <td className="py-3 pr-4">{ing.name}</td>
                        <td className="py-3 pr-4 text-right font-mono">
                          {ing.weight.toFixed(1)} {ing.unit}
                        </td>
                        <td className="py-3 text-right font-mono text-warm-gray-600">
                          {ing.percentage.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-sunset-orange font-semibold">
                      <td className="py-3 pr-4">Total</td>
                      <td className="py-3 pr-4 text-right font-mono">
                        {calculateTotalWeight(scaledIngredients).toFixed(1)}g
                      </td>
                      <td className="py-3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {calculateHydration(scaledIngredients) > 0 && (
                <div className="p-4 bg-sunset-orange/10 rounded-md space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-chocolate-brown">
                      Total Hydration:{' '}
                      <span className="text-sunset-orange font-mono text-lg">
                        {calculateHydration(scaledIngredients).toFixed(1)}%
                      </span>
                    </p>
                  </div>

                  {/* Hydration breakdown */}
                  {(() => {
                    const breakdown = calculateHydrationBreakdown(scaledIngredients);
                    return breakdown.contributors.length > 0 ? (
                      <div className="pt-2 border-t border-sunset-orange/20">
                        <p className="text-xs font-semibold text-chocolate-brown mb-2">
                          Breakdown by ingredient:
                        </p>
                        <div className="space-y-1">
                          {breakdown.contributors.map((contributor, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <span className="text-warm-gray-700">
                                {contributor.ingredient}
                                <span className="text-warm-gray-500 ml-1">
                                  ({contributor.hydrationFactor}% liquid content)
                                </span>
                              </span>
                              <span className="font-mono text-sunset-orange font-semibold">
                                +{contributor.contribution.toFixed(1)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
