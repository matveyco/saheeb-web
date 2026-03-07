'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Check for saved preference cookie
    const cookies = document.cookie.split(';');
    const localeCookie = cookies.find(c => c.trim().startsWith('preferred-locale='));
    const savedLocale = localeCookie?.split('=')[1];

    if (savedLocale && (savedLocale === 'ar' || savedLocale === 'en')) {
      router.replace(`/${savedLocale}`);
      return;
    }

    // Detect from browser language
    const browserLang = navigator.language || '';
    const isArabic = browserLang.startsWith('ar');

    router.replace(isArabic ? '/ar' : '/en');
  }, [router]);

  // Dark background while redirecting
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#09090B',
    }} />
  );
}
