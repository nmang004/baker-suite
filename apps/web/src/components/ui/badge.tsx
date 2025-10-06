import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-sunset-orange text-white',
        secondary:
          'border-transparent bg-warm-gray-200 text-warm-gray-700',
        success:
          'border-transparent bg-success-light text-success-dark',
        warning:
          'border-transparent bg-warning-light text-warning-dark',
        error:
          'border-transparent bg-error-light text-error-dark',
        info:
          'border-transparent bg-info-light text-info-dark',
        outline: 'text-chocolate-brown',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
