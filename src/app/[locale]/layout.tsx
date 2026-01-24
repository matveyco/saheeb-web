import type { Metadata } from 'next';
import { Inter, IBM_Plex_Sans_Arabic } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-arabic',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  const title = isArabic
    ? 'صاحب | حلول تقنية مبنية على الذكاء الاصطناعي'
    : 'Saheeb | AI-Native Technology Solutions';

  const description = isArabic
    ? 'شركة تقنية عمانية تبني منتجات وخدمات للشركات تعتمد على الذكاء الاصطناعي بما يتوافق مع رؤية عمان 2040'
    : "Oman-based technology company building AI-native products and B2B services aligned with Oman Vision 2040";

  return {
    title: {
      default: title,
      template: isArabic ? '%s | صاحب' : '%s | Saheeb',
    },
    description,
    keywords: isArabic
      ? [
          'صاحب',
          'تقنية',
          'ذكاء اصطناعي',
          'عمان',
          'رؤية 2040',
          'تطوير برمجيات',
          'صاحب درايف',
        ]
      : [
          'Saheeb',
          'technology',
          'AI',
          'Oman',
          'Vision 2040',
          'software development',
          'Saheeb Drive',
        ],
    authors: [{ name: 'Saheeb' }],
    creator: 'Saheeb',
    metadataBase: new URL('https://saheeb.com'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        ar: '/ar',
        'x-default': '/ar',
      },
    },
    openGraph: {
      type: 'website',
      locale: isArabic ? 'ar_OM' : 'en_US',
      alternateLocale: isArabic ? 'en_US' : 'ar_OM',
      siteName: isArabic ? 'صاحب' : 'Saheeb',
      title,
      description,
      url: 'https://saheeb.com',
      images: [
        {
          url: '/og-image.svg',
          width: 1200,
          height: 630,
          alt: isArabic ? 'صاحب' : 'Saheeb',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.svg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as 'ar' | 'en')) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();
  const isArabic = locale === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';

  // JSON-LD Structured Data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Saheeb',
    alternateName: 'صاحب',
    url: 'https://saheeb.com',
    logo: 'https://saheeb.com/og-image.svg',
    description: isArabic
      ? 'شركة تقنية عمانية تبني منتجات وخدمات للشركات تعتمد على الذكاء الاصطناعي'
      : 'Oman-based technology company building AI-native products and B2B services',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Muscat',
      addressCountry: 'OM',
    },
    sameAs: [
      'https://linkedin.com/company/saheeb',
      'https://twitter.com/saheeb',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@saheeb.com',
      contactType: 'customer service',
      availableLanguage: ['English', 'Arabic'],
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: isArabic ? 'صاحب' : 'Saheeb',
    url: 'https://saheeb.com',
    inLanguage: [locale, locale === 'ar' ? 'en' : 'ar'],
  };

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${inter.variable} ${ibmPlexArabic.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body
        className={`${isArabic ? 'font-arabic' : 'font-sans'} antialiased bg-neutral-50 text-neutral-900`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
