'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { TrackedLink } from '@/components/analytics/TrackedLink';

interface NavItem {
  href: string;
  labelKey: string;
}

const navItems: NavItem[] = [
  { href: '/', labelKey: 'home' },
  { href: '/services', labelKey: 'services' },
  { href: '/projects', labelKey: 'projects' },
  { href: '/contact', labelKey: 'contact' },
];

interface NavigationProps {
  className?: string;
  vertical?: boolean;
  onItemClick?: () => void;
}

export function Navigation({
  className,
  vertical = false,
  onItemClick,
}: NavigationProps) {
  const t = useTranslations('navigation');
  const pathname = usePathname();
  const isDrivePage = pathname.startsWith('/projects/saheeb-drive');

  return (
    <nav
      className={cn(
        vertical
          ? 'flex flex-col space-y-1'
          : 'flex items-center gap-1',
        className
      )}
    >
      {navItems.map((item) => {
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);

        const className = cn(
          'px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200',
          vertical ? 'w-full' : '',
          isActive
            ? 'text-[#FFFFFF] bg-[#1D1A22]'
            : 'text-[#8F859C] hover:text-[#FFFFFF] hover:bg-[#1D1A22]'
        );

        if (isDrivePage) {
          return (
            <TrackedLink
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              eventName="nav_exit"
              ctaLocation={`site_nav_${item.labelKey}`}
              destinationPath={item.href}
              project="saheeb_drive"
              className={className}
              aria-current={isActive ? 'page' : undefined}
            >
              {t(item.labelKey)}
            </TrackedLink>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={className}
            aria-current={isActive ? 'page' : undefined}
          >
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
