import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import WaitlistClientPage from './waitlist-client';

interface WaitlistPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: WaitlistPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'saheebDrive.waitlist' });

  const title = isArabic ? 'قائمة انتظار صاحب درايف' : 'Saheeb Drive Waitlist';
  const description = t('subtitle');
  const path = `/${locale}/projects/saheeb-drive/waitlist`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: '/en/projects/saheeb-drive/waitlist',
        ar: '/ar/projects/saheeb-drive/waitlist',
      },
    },
    openGraph: {
      title: isArabic
        ? 'قائمة انتظار صاحب درايف | صاحب'
        : 'Saheeb Drive Waitlist | Saheeb',
      description,
      url: `https://saheeb.com${path}`,
      type: 'website',
      images: [
        {
          url: '/og-image.svg',
          width: 1200,
          height: 630,
          alt: isArabic ? 'قائمة انتظار صاحب درايف' : 'Saheeb Drive Waitlist',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isArabic
        ? 'قائمة انتظار صاحب درايف | صاحب'
        : 'Saheeb Drive Waitlist | Saheeb',
      description,
      images: ['/og-image.svg'],
    },
  };
}

export default function WaitlistPage() {
  return <WaitlistClientPage />;
}
