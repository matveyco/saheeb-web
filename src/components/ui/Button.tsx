import {
  ButtonHTMLAttributes,
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
} from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      asChild = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-colors duration-200 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A87C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B] disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: [
        'bg-[#C9A87C] text-[#09090B]',
        'shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]',
        'hover:bg-[#D4B78E] hover:shadow-[0_2px_8px_rgba(201,168,124,0.25)]',
        'active:bg-[#BF9D71] active:shadow-none active:translate-y-[0.5px]',
      ].join(' '),
      secondary: [
        'bg-transparent',
        'border border-[#333338] text-[#EDEDEF]',
        'hover:bg-[#19191B] hover:border-[#444]',
        'active:bg-[#111113] active:border-[#333338]',
      ].join(' '),
      ghost: [
        'text-[#8F8F96]',
        'hover:text-[#EDEDEF] hover:bg-[#19191B]',
      ].join(' '),
    };

    const sizes = {
      sm: 'px-4 py-2.5 text-sm gap-2 min-h-[40px]',
      md: 'px-6 py-3 text-base gap-2 min-h-[44px]',
      lg: 'px-8 py-4 text-lg gap-3 min-h-[52px]',
    };

    const sharedClassName = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    );

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{ className?: string }>;

      return cloneElement(child, {
        ...props,
        className: cn(
          sharedClassName,
          child.props.className
        ),
      });
    }

    return (
      <button
        ref={ref}
        className={sharedClassName}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
