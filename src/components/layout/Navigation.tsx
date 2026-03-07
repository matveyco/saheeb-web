'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

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

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200',
              vertical ? 'w-full' : '',
              isActive
                ? 'text-[#EDEDEF] bg-[#19191B]'
                : 'text-[#8F8F96] hover:text-[#EDEDEF] hover:bg-[#19191B]'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
