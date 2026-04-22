import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, type = 'text', ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium mb-1.5 text-[#8F859C]"
          >
            {label}
            {props.required && (
              <span className="text-red-400 ms-0.5" aria-hidden="true">
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
            'w-full px-4 py-3.5 rounded-xl transition-colors duration-200 min-h-[44px]',
            'bg-[#0F1013] border border-[#3A3A3F]',
            'text-[#FFFFFF] placeholder:text-[#5C5C63]',
            'focus:outline-none focus:border-[#316BE9] focus:ring-1 focus:ring-[#316BE9]/25',
            error ? 'border-red-400' : 'hover:border-[#4A4A50]',
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
            className="mt-1.5 text-sm text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-[#5C5C63]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
