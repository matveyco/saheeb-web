'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Navigation } from './Navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { cn } from '@/lib/utils';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('common');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  // Close menu on escape key
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
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-3 -me-3 text-white/70 hover:text-[#D4AF37] hover:bg-white/5 rounded-xl transition-all duration-200"
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

      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        id="mobile-menu"
        className={cn(
          'fixed top-0 end-0 h-full w-[300px] bg-[#0A0E1A] border-s border-white/[0.05] z-50 lg:hidden transform transition-transform duration-300 ease-out shadow-[0_0_60px_rgba(0,0,0,0.5)]',
          isOpen
            ? 'translate-x-0 rtl:-translate-x-0'
            : 'translate-x-full rtl:-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/[0.05]">
            <span className="font-semibold text-white">{isArabic ? 'القائمة' : 'Menu'}</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-3 -me-3 text-white/70 hover:text-[#D4AF37] hover:bg-white/5 rounded-xl transition-all duration-200"
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

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-5">
            <Navigation vertical onItemClick={() => setIsOpen(false)} />
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-white/[0.05]">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </>
  );
}
