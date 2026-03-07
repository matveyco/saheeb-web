import { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, error, hint, options, placeholder, id, ...props },
    ref
  ) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium mb-1.5 text-[#8F8F96]"
          >
            {label}
            {props.required && (
              <span className="text-red-400 ms-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3.5 rounded-xl transition-colors duration-200 min-h-[44px]',
            'bg-[#111113] border border-[#222225]',
            'text-[#EDEDEF]',
            'focus:outline-none focus:border-[#C9A87C]/50 focus:ring-1 focus:ring-[#C9A87C]/20',
            error ? 'border-red-400' : 'hover:border-[#333338]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'appearance-none cursor-pointer',
            // Arrow icon using background
            'bg-no-repeat bg-[right_0.75rem_center] rtl:bg-[left_0.75rem_center]',
            "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%238F8F96%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')]",
            'bg-[length:1.25rem_1.25rem]',
            'pe-10',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

Select.displayName = 'Select';

export { Select };
