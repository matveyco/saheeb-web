import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, IBM_Plex_Sans_Arabic } from 'next/font/google';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';
import { routing } from '@/i18n/routing';
import '../globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

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
          url: '/images/og-image.png',
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
      images: ['/images/og-image.png'],
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
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  const shouldRenderGa =
    process.env.NODE_ENV === 'production' && Boolean(gaMeasurementId);

  // JSON-LD Structured Data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Saheeb',
    alternateName: 'صاحب',
    url: 'https://saheeb.com',
    logo: 'https://saheeb.com/images/og-image.png',
    description: isArabic
      ? 'شركة تقنية عمانية تبني منتجات وخدمات للشركات تعتمد على الذكاء الاصطناعي'
      : 'Oman-based technology company building AI-native products and B2B services',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Muscat',
      addressCountry: 'OM',
    },
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
      className={`${plusJakarta.variable} ${inter.variable} ${ibmPlexArabic.variable}`}
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
        {shouldRenderGa && gaMeasurementId ? (
          <>
            <Script
              id="ga4-src"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script
              id="ga4-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  window.gtag = window.gtag || function(){dataLayer.push(arguments);};
                  if (!window.__saheebAnalyticsInitialized) {
                    window.gtag('consent', 'default', { analytics_storage: 'denied' });
                    window.gtag('js', new Date());
                    window.gtag('config', '${gaMeasurementId}', {
                      send_page_view: false,
                      anonymize_ip: true,
                      allow_google_signals: false,
                      allow_ad_personalization_signals: false
                    });
                    window.__saheebAnalyticsInitialized = true;
                  }
                `,
              }}
            />
          </>
        ) : null}
      </head>
      <body
        className={`${isArabic ? 'font-arabic' : 'font-sans'} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
