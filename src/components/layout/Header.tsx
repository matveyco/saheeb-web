'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/ui';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';
import { TrackedLink } from '@/components/analytics/TrackedLink';
import { Button } from '@/components/ui';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const tNavigation = useTranslations('navigation');
  const pathname = usePathname();
  const isDrive = pathname?.includes('/projects/saheeb-drive') ?? false;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 start-0 end-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-[#0A0A0D]/95 backdrop-blur-md border-b border-[#2A2633]'
          : 'bg-transparent'
      )}
    >
      <Container>
        <div className="flex items-center justify-between h-18 lg:h-22">
          <Logo variant={isDrive ? 'drive' : 'saheeb'} />

          <div className="hidden lg:flex items-center gap-3">
            <Navigation />
            <Button asChild size="sm">
              <TrackedLink
                href="/projects/saheeb-drive?focus=waitlist#join-now"
                ctaLocation="header_join_waitlist"
                destinationPath="/projects/saheeb-drive?focus=waitlist#join-now"
                project="saheeb_drive"
              >
                {tNavigation('joinWaitlist')}
              </TrackedLink>
            </Button>
            <div className="w-px h-5 bg-[#2A2633] mx-2" aria-hidden="true" />
            <LanguageSwitcher />
          </div>

          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
