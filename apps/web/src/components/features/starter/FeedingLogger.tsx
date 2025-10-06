'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatDistanceToNow } from 'date-fns';
import { type Starter, type StarterFeeding, isValidFeedingRatio } from '@/lib/api/starters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLogFeeding } from '@/lib/hooks/useStarters';
import { toast } from 'sonner';

// Validation schema
const feedingFormSchema = z.object({
  ratio: z.string().refine((val) => isValidFeedingRatio(val), {
    message: 'Feeding ratio must be in format "X:Y:Z" (e.g., "1:1:1")',
  }),
  observations: z.string().max(500, 'Observations are too long').optional(),
  riseHeight: z.coerce.number().positive('Rise height must be positive').optional(),
  fedAt: z.string().optional(),
});

type FeedingFormData = z.infer<typeof feedingFormSchema>;

interface FeedingLoggerProps {
  starter: Starter;
  lastFeeding?: StarterFeeding;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function FeedingLogger({ starter, lastFeeding, onSuccess, onCancel }: FeedingLoggerProps) {
  const logFeedingMutation = useLogFeeding();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FeedingFormData>({
    resolver: zodResolver(feedingFormSchema),
    defaultValues: {
      ratio: starter.feedingRatio || '1:1:1',
      observations: '',
      riseHeight: undefined,
      fedAt: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:MM format
    },
  });

  const onSubmit = async (data: FeedingFormData) => {
    try {
      await logFeedingMutation.mutateAsync({
        starterId: starter.id,
        input: {
          ratio: data.ratio,
          observations: data.observations,
          riseHeight: data.riseHeight,
          fedAt: data.fedAt ? new Date(data.fedAt) : new Date(),
        },
      });
      toast.success('Feeding logged successfully');
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to log feeding');
      console.error('Feeding log error:', error);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Log Feeding</CardTitle>
          <CardDescription>
            Record a feeding for {starter.name}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Show last feeding for reference */}
          {lastFeeding && (
            <div className="p-3 bg-muted rounded-lg text-sm space-y-1">
              <p className="font-medium">Last Feeding:</p>
              <div className="text-muted-foreground">
                <p>
                  {formatDistanceToNow(new Date(lastFeeding.fedAt), { addSuffix: true })}
                </p>
                <p>Ratio: <span className="font-mono">{lastFeeding.ratio}</span></p>
                {lastFeeding.riseHeight && (
                  <p>Rise: {lastFeeding.riseHeight} cm</p>
                )}
              </div>
            </div>
          )}

          {/* Feeding Time */}
          <div className="space-y-2">
            <Label htmlFor="fedAt">Feeding Time</Label>
            <Input
              id="fedAt"
              type="datetime-local"
              {...register('fedAt')}
              max={new Date().toISOString().slice(0, 16)}
            />
            <p className="text-sm text-muted-foreground">
              Leave as current time or adjust if feeding was earlier
            </p>
          </div>

          {/* Feeding Ratio */}
          <div className="space-y-2">
            <Label htmlFor="ratio">Feeding Ratio *</Label>
            <Input
              id="ratio"
              placeholder="1:1:1"
              {...register('ratio')}
              className={errors.ratio ? 'border-red-500' : 'font-mono'}
            />
            {errors.ratio && (
              <p className="text-sm text-red-500">{errors.ratio.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Format: starter:flour:water (default is your starter's ratio)
            </p>
          </div>

          {/* Rise Height */}
          <div className="space-y-2">
            <Label htmlFor="riseHeight">Rise Height (cm)</Label>
            <Input
              id="riseHeight"
              type="number"
              step="0.1"
              placeholder="e.g., 5.5"
              {...register('riseHeight')}
              className={errors.riseHeight ? 'border-red-500' : ''}
            />
            {errors.riseHeight && (
              <p className="text-sm text-red-500">{errors.riseHeight.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Optional: How much did the starter rise?
            </p>
          </div>

          {/* Observations */}
          <div className="space-y-2">
            <Label htmlFor="observations">Observations</Label>
            <Textarea
              id="observations"
              placeholder="How does it smell? Appearance? Activity level?"
              {...register('observations')}
              rows={3}
              className={errors.observations ? 'border-red-500' : ''}
            />
            {errors.observations && (
              <p className="text-sm text-red-500">{errors.observations.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Optional: Notes about the starter's condition
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button
            type="submit"
            disabled={logFeedingMutation.isPending}
          >
            {logFeedingMutation.isPending ? 'Logging...' : 'Log Feeding'}
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
