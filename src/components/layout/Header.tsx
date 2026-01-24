'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/components/ui';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/lib/utils';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

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
          ? 'bg-[#0A0E1A]/90 backdrop-blur-xl border-b border-white/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
          : 'bg-transparent'
      )}
    >
      <Container>
        <div className="flex items-center justify-between h-18 lg:h-22">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3">
            <Navigation />
            <div className="w-px h-5 bg-white/10 mx-2" aria-hidden="true" />
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
