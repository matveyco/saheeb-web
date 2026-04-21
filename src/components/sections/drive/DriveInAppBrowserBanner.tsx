'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const STORAGE_KEY = 'saheeb_iab_banner_dismissed';

function isInAppBrowser(ua: string): boolean {
  if (!ua) return false;
  // Facebook in-app browser: FBAN/FBAV are primary markers; FB_IAB is fallback
  if (/FBAN|FBAV|FB_IAB/.test(ua)) return true;
  // Instagram in-app browser
  if (/Instagram/.test(ua)) return true;
  // LinkedIn, Twitter, TikTok in-app (future-proof)
  if (/LinkedInApp|Twitter|TikTok/.test(ua)) return true;
  return false;
}

export function DriveInAppBrowserBanner() {
  const t = useTranslations('saheebDrive.inAppBanner');
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.localStorage?.getItem(STORAGE_KEY) === '1') return;
    if (!isInAppBrowser(navigator.userAgent)) return;
    setShow(true);
  }, []);

  if (!show) return null;

  const dismiss = () => {
    setShow(false);
    try {
      window.localStorage?.setItem(STORAGE_KEY, '1');
    } catch {}
  };

  return (
    <div
      data-testid="drive-iab-banner"
      role="status"
      className="fixed inset-x-0 top-0 z-[60] flex items-center gap-3 border-b border-amber-500/20 bg-[#1a1408]/95 px-4 py-2.5 text-sm text-amber-200 backdrop-blur"
    >
      <span className="flex-1 leading-snug">{t('message')}</span>
      <button
        type="button"
        onClick={dismiss}
        aria-label={t('dismiss')}
        className="shrink-0 rounded-full p-1.5 text-amber-300 hover:bg-amber-500/10 hover:text-amber-100"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
