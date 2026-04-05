'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Navigation } from './Navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { TrackedLink } from '@/components/analytics/TrackedLink';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('common');
  const tNavigation = useTranslations('navigation');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-3 -me-3 text-[#8F8F96] hover:text-[#EDEDEF] hover:bg-[#19191B] rounded-xl transition-colors duration-200"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? t('close') : 'Menu'}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {isOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      <div
        className={cn(
          'fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <div
        id="mobile-menu"
        className={cn(
          'fixed top-0 end-0 h-full w-[300px] bg-[#09090B] border-s border-[#1A1A1D] z-50 lg:hidden transform transition-transform duration-300 ease-out',
          isOpen
            ? 'translate-x-0 rtl:-translate-x-0'
            : 'translate-x-full rtl:-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-[#1A1A1D]">
            <span className="font-semibold text-[#EDEDEF]">{isArabic ? 'القائمة' : 'Menu'}</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-3 -me-3 text-[#8F8F96] hover:text-[#EDEDEF] hover:bg-[#19191B] rounded-xl transition-colors duration-200"
              aria-label={t('close')}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <Navigation vertical onItemClick={() => setIsOpen(false)} />
            <div className="mt-5 border-t border-[#1A1A1D] pt-5">
              <Button asChild className="w-full">
                <TrackedLink
                  href="/projects/saheeb-drive?focus=waitlist#drive-waitlist"
                  ctaLocation="mobile_menu_join_waitlist"
                  destinationPath="/projects/saheeb-drive?focus=waitlist#drive-waitlist"
                  project="saheeb_drive"
                  onClick={() => setIsOpen(false)}
                >
                  {tNavigation('joinWaitlist')}
                </TrackedLink>
              </Button>
            </div>
          </div>

          <div className="p-5 border-t border-[#1A1A1D]">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </>
  );
}
