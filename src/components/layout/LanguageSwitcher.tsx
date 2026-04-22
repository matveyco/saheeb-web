'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { recordFunnelEvent } from '@/lib/funnel';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    const search =
      typeof window !== 'undefined' ? window.location.search : '';
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const nextPath = `${pathname}${search}${hash}`;

    if (pathname.startsWith('/projects/saheeb-drive')) {
      recordFunnelEvent({
        eventName: 'language_switch',
        siteLocale: locale,
        project: 'saheeb_drive',
        destinationPath: nextPath,
        payload: {
          from_locale: locale,
          to_locale: newLocale,
          project: 'saheeb_drive',
        },
      });
    }
    document.cookie = `preferred-locale=${newLocale}; path=/; max-age=31536000`;
    router.replace(nextPath, { locale: newLocale });
  };

  return (
    <button
      onClick={switchLocale}
      className="px-4 py-2 text-sm font-medium text-[#8F859C] hover:text-[#FFFFFF] hover:bg-[#1D1A22] rounded-xl transition-colors duration-200 border border-[#2A2633] hover:border-[#333338]"
      aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      {locale === 'ar' ? 'English' : 'العربية'}
    </button>
  );
}
