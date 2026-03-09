'use client';

import { useTranslations } from 'next-intl';
import { useAnalyticsConsent } from '@/components/analytics/AnalyticsProvider';

export function CookieSettingsButton() {
  const t = useTranslations('footer');
  const { isAvailable, openSettings } = useAnalyticsConsent();

  if (!isAvailable) {
    return null;
  }

  return (
    <li>
      <button
        type="button"
        onClick={openSettings}
        className="text-sm text-[#5C5C63] transition-colors duration-200 hover:text-[#EDEDEF]"
      >
        {t('cookieSettings')}
      </button>
    </li>
  );
}
