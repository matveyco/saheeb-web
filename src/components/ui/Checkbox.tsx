'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  variant?: 'light' | 'dark';
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, variant = 'light', ...props }, ref) => {
    const inputId = id || props.name;
    const isDark = variant === 'dark';

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={cn(
              'h-4 w-4 rounded transition-colors duration-200 cursor-pointer',
              isDark
                ? [
                    'border-white/20 bg-white/5',
                    'text-[#D4AF37] focus:ring-[#D4AF37]/50 focus:ring-offset-0',
                    error ? 'border-red-400' : '',
                  ]
                : [
                    'h-5 w-5 border-2',
                    'text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    error ? 'border-red-500' : 'border-neutral-300',
                ],
              'disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
        </div>
        <div className="flex-1">
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                'text-sm cursor-pointer leading-relaxed',
                isDark ? 'text-white/50' : 'text-neutral-700'
              )}
            >
              {label}
            </label>
          )}
          {error && (
            <p
              id={`${inputId}-error`}
              className={cn('mt-1 text-sm', isDark ? 'text-red-400' : 'text-red-600')}
              role="alert"
            >
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
