'use client';

import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Ingredient } from '@/lib/utils/ratioCalculator';

interface IngredientRowProps {
  ingredient: Ingredient;
  onUpdate: (field: keyof Ingredient, value: string | number) => void;
  onRemove: () => void;
  isFlour?: boolean;
}

export function IngredientRow({
  ingredient,
  onUpdate,
  onRemove,
  isFlour = false,
}: IngredientRowProps) {
  return (
    <tr className="border-b border-warm-gray-200 hover:bg-warm-gray-50 transition-colors">
      {/* Ingredient Name */}
      <td className="py-3 pr-4">
        <Input
          value={ingredient.name}
          onChange={(e) => onUpdate('name', e.target.value)}
          placeholder={isFlour ? 'Flour (required)' : 'Ingredient name'}
          className={isFlour ? 'font-semibold' : ''}
        />
      </td>

      {/* Weight */}
      <td className="py-3 pr-4">
        <Input
          type="number"
          value={ingredient.weight || ''}
          onChange={(e) => onUpdate('weight', parseFloat(e.target.value) || 0)}
          placeholder="500"
          min="0"
          step="0.1"
        />
      </td>

      {/* Unit */}
      <td className="py-3 pr-4">
        <Select
          value={ingredient.unit}
          onValueChange={(value) => onUpdate('unit', value)}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="g">g</SelectItem>
            <SelectItem value="oz">oz</SelectItem>
            <SelectItem value="lb">lb</SelectItem>
          </SelectContent>
        </Select>
      </td>

      {/* Percentage (read-only) */}
      <td className="py-3 pr-4">
        <div className="flex items-center h-11 px-4 rounded-sm bg-warm-gray-100 border border-warm-gray-200">
          <span className="font-mono font-semibold text-chocolate-brown">
            {ingredient.percentage.toFixed(1)}%
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-warm-gray-500 hover:text-error hover:bg-error-light"
          aria-label="Remove ingredient"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}
