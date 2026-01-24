import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  as?: 'div' | 'section' | 'article' | 'main';
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', as: Tag = 'div', children, ...props }, ref) => {
    const sizes = {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-7xl',
      xl: 'max-w-[1400px]',
      full: 'max-w-full',
    };

    return (
      <Tag
        ref={ref}
        className={cn(
          'w-full mx-auto px-4 sm:px-6 lg:px-8',
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Container.displayName = 'Container';

export { Container };
