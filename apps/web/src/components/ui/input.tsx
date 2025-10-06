import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  unit?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, error, helperText, leftIcon, rightIcon, unit, ...props },
    ref
  ) => {
    return (
      <div className="w-full">
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray-500">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex h-11 w-full rounded-sm border border-warm-gray-200 bg-white px-4 py-3 text-base text-chocolate-brown placeholder:text-warm-gray-400 focus:outline-none focus:ring-4 focus:ring-sunset-orange/50 focus:border-sunset-orange disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-fast',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              unit && 'pr-12',
              error &&
                'border-error focus:ring-error/50 focus:border-error',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray-500">
              {rightIcon}
            </div>
          )}
          {unit && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-warm-gray-500">
              {unit}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-error">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-warm-gray-600">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
