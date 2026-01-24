import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'glass' | 'ghost' | 'white';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'gold',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E1A] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

    const variants = {
      gold: [
        'bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37]',
        'text-[#0A0E1A]',
        'shadow-[0_4px_20px_rgba(212,175,55,0.4)]',
        'hover:shadow-[0_8px_30px_rgba(212,175,55,0.6)]',
        'hover:-translate-y-0.5',
        'active:translate-y-0',
      ].join(' '),
      glass: [
        'bg-white/5',
        'backdrop-blur-md',
        'border border-[#D4AF37]/30',
        'text-[#D4AF37]',
        'hover:bg-[#D4AF37]/10',
        'hover:border-[#D4AF37]',
        'hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]',
      ].join(' '),
      ghost: [
        'text-white/70',
        'hover:text-white',
        'hover:bg-white/5',
      ].join(' '),
      white: [
        'bg-white',
        'text-[#0A0E1A]',
        'shadow-[0_4px_20px_rgba(255,255,255,0.2)]',
        'hover:shadow-[0_8px_30px_rgba(255,255,255,0.3)]',
        'hover:-translate-y-0.5',
      ].join(' '),
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm gap-2',
      md: 'px-6 py-3 text-base gap-2',
      lg: 'px-8 py-4 text-lg gap-3',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
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
