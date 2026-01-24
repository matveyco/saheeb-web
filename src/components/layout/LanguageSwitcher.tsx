'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    // Save preference to cookie (accessible by middleware for root redirect)
    document.cookie = `preferred-locale=${newLocale}; path=/; max-age=31536000`; // 1 year
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <button
      onClick={switchLocale}
      className="px-4 py-2 text-sm font-medium text-white/70 hover:text-[#D4AF37] hover:bg-white/5 rounded-xl transition-all duration-200 border border-white/10 hover:border-[#D4AF37]/30"
      aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      {locale === 'ar' ? 'English' : 'العربية'}
    </button>
  );
}
