import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: 'light' | 'dark';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, type = 'text', variant = 'light', ...props }, ref) => {
    const inputId = id || props.name;
    const isDark = variant === 'dark';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium mb-1.5',
              isDark ? 'text-white/70' : 'text-neutral-700'
            )}
          >
            {label}
            {props.required && (
              <span className="text-red-500 ms-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            'w-full px-4 transition-colors duration-200',
            'focus:outline-none',
            isDark
              ? [
                  'py-3 rounded-xl',
                  'bg-white/5 border border-white/10',
                  'text-white placeholder:text-white/40',
                  'focus:border-[#D4AF37]/50',
                  error ? 'border-red-400' : 'hover:border-white/20',
                ]
              : [
                  'py-2.5 rounded-lg border',
                  'text-neutral-900 placeholder:text-neutral-400',
                  'focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                  error
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-neutral-300 hover:border-neutral-400',
                  'disabled:bg-neutral-100 disabled:cursor-not-allowed',
                ],
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className={cn('mt-1.5 text-sm', isDark ? 'text-red-400' : 'text-red-600')}
            role="alert"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className={cn('mt-1.5 text-sm', isDark ? 'text-white/50' : 'text-neutral-500')}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
