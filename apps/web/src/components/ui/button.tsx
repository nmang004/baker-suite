import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-base font-semibold transition-all duration-fast focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sunset-orange/50 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-sunset-orange text-white hover:bg-sunset-orange-600 shadow-sm hover:shadow-md hover:-translate-y-0.5',
        secondary:
          'bg-warm-cream text-chocolate-brown border border-warm-gray-300 hover:bg-warm-gray-100 shadow-sm',
        outline:
          'border-2 border-sunset-orange bg-transparent text-sunset-orange hover:bg-sunset-orange hover:text-white',
        ghost:
          'hover:bg-warm-gray-100 hover:text-chocolate-brown',
        destructive:
          'bg-error text-white hover:bg-error-dark shadow-sm',
      },
      size: {
        sm: 'h-9 px-4 py-2 text-sm',
        md: 'h-11 px-6 py-3',
        lg: 'h-12 px-8 py-3 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, children, disabled, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Loading...
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
