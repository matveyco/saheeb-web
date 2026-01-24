import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'glass' | 'glow' | 'outline' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'gold', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center font-semibold rounded-full transition-all duration-300';

    const variants = {
      gold: [
        'bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37]',
        'text-[#0A0E1A]',
        'shadow-[0_2px_10px_rgba(212,175,55,0.3)]',
      ].join(' '),
      glass: [
        'bg-white/[0.05]',
        'backdrop-blur-md',
        'text-white/90',
        'border border-white/10',
      ].join(' '),
      glow: [
        'bg-[#D4AF37]/10',
        'text-[#D4AF37]',
        'border border-[#D4AF37]/30',
        'shadow-[0_0_15px_rgba(212,175,55,0.2)]',
      ].join(' '),
      outline: [
        'bg-transparent',
        'text-[#D4AF37]',
        'border border-[#D4AF37]/50',
      ].join(' '),
      success: [
        'bg-emerald-500/10',
        'text-emerald-400',
        'border border-emerald-500/30',
      ].join(' '),
    };

    const sizes = {
      sm: 'px-2.5 py-0.5 text-xs',
      md: 'px-3.5 py-1 text-sm',
      lg: 'px-4 py-1.5 text-base',
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
