'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { type Starter, type CreateStarterInput, FLOUR_TYPES, isValidFeedingRatio } from '@/lib/api/starters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateStarter, useUpdateStarter } from '@/lib/hooks/useStarters';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Validation schema
const starterFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  flourType: z.enum(['white', 'whole-wheat', 'rye', 'spelt', 'mixed', 'other']),
  createdDate: z.string().optional(),
  feedingRatio: z.string().refine((val) => isValidFeedingRatio(val), {
    message: 'Feeding ratio must be in format "X:Y:Z" (e.g., "1:1:1")',
  }),
  notes: z.string().max(1000, 'Notes are too long').optional(),
});

type StarterFormData = z.infer<typeof starterFormSchema>;

interface StarterFormProps {
  starter?: Starter;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function StarterForm({ starter, onSuccess, onCancel }: StarterFormProps) {
  const router = useRouter();
  const createMutation = useCreateStarter();
  const updateMutation = useUpdateStarter();
  const isEditMode = !!starter;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<StarterFormData>({
    resolver: zodResolver(starterFormSchema),
    defaultValues: {
      name: starter?.name || '',
      flourType: starter?.flourType || 'white',
      createdDate: starter?.createdDate
        ? new Date(starter.createdDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      feedingRatio: starter?.feedingRatio || '1:1:1',
      notes: starter?.notes || '',
    },
  });

  const flourType = watch('flourType');

  const onSubmit = async (data: StarterFormData) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: starter.id,
          input: {
            name: data.name,
            feedingRatio: data.feedingRatio,
            notes: data.notes,
          },
        });
        toast.success('Starter updated successfully');
      } else {
        const result = await createMutation.mutateAsync({
          name: data.name,
          flourType: data.flourType,
          createdDate: data.createdDate ? new Date(data.createdDate) : new Date(),
          feedingRatio: data.feedingRatio,
          notes: data.notes,
        });
        toast.success('Starter created successfully');
        if (result?.id) {
          router.push(`/starters/${result.id}`);
        }
      }
      onSuccess?.();
    } catch (error) {
      toast.error(isEditMode ? 'Failed to update starter' : 'Failed to create starter');
      console.error('Form submission error:', error);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Starter' : 'Create New Starter'}</CardTitle>
          <CardDescription>
            {isEditMode
              ? 'Update your starter information'
              : 'Add a new sourdough starter to track'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="My Sourdough Starter"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Flour Type */}
          <div className="space-y-2">
            <Label htmlFor="flourType">Flour Type *</Label>
            <Select
              value={flourType}
              onValueChange={(value) => setValue('flourType', value as any)}
              disabled={isEditMode} // Can't change flour type after creation
            >
              <SelectTrigger>
                <SelectValue placeholder="Select flour type" />
              </SelectTrigger>
              <SelectContent>
                {FLOUR_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.flourType && (
              <p className="text-sm text-red-500">{errors.flourType.message}</p>
            )}
          </div>

          {/* Created Date */}
          {!isEditMode && (
            <div className="space-y-2">
              <Label htmlFor="createdDate">Created Date</Label>
              <Input
                id="createdDate"
                type="date"
                {...register('createdDate')}
                max={new Date().toISOString().split('T')[0]}
              />
              <p className="text-sm text-muted-foreground">
                When did you create this starter?
              </p>
            </div>
          )}

          {/* Feeding Ratio */}
          <div className="space-y-2">
            <Label htmlFor="feedingRatio">Feeding Ratio *</Label>
            <Input
              id="feedingRatio"
              placeholder="1:1:1"
              {...register('feedingRatio')}
              className={errors.feedingRatio ? 'border-red-500' : 'font-mono'}
            />
            {errors.feedingRatio && (
              <p className="text-sm text-red-500">{errors.feedingRatio.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Format: starter:flour:water (e.g., "1:1:1" means equal parts)
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Special characteristics, origin, or any notes..."
              {...register('notes')}
              rows={4}
              className={errors.notes ? 'border-red-500' : ''}
            />
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? 'Saving...'
              : isEditMode
              ? 'Update Starter'
              : 'Create Starter'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
