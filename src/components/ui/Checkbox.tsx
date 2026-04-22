'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={cn(
              'h-4 w-4 rounded transition-colors duration-200 cursor-pointer',
              'border-[#2A2633] bg-[#0F1013]',
              'text-[#316BE9] focus:ring-[#316BE9]/50 focus:ring-offset-0',
              error ? 'border-red-400' : '',
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
              className="text-sm cursor-pointer leading-relaxed text-[#5C5C63]"
            >
              {label}
            </label>
          )}
          {error && (
            <p
              id={`${inputId}-error`}
              className="mt-1 text-sm text-red-400"
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
