'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    document.cookie = `preferred-locale=${newLocale}; path=/; max-age=31536000`;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <button
      onClick={switchLocale}
      className="px-4 py-2 text-sm font-medium text-[#8F8F96] hover:text-[#EDEDEF] hover:bg-[#19191B] rounded-xl transition-colors duration-200 border border-[#222225] hover:border-[#333338]"
      aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      {locale === 'ar' ? 'English' : 'العربية'}
    </button>
  );
}
