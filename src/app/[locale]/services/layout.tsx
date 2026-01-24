import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  const title = isArabic ? 'خدماتنا' : 'Our Services';
  const description = isArabic
    ? 'نبني منتجات، نضيف الذكاء الاصطناعي، نقود النمو، ونوطّن للسوق العربي. حلول تقنية شاملة للشركات في عمان والمنطقة.'
    : 'We build products, add AI intelligence, drive growth, and localize for Arabic markets. Comprehensive technology solutions for businesses in Oman and the region.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/services`,
      languages: {
        en: '/en/services',
        ar: '/ar/services',
      },
    },
    openGraph: {
      title: isArabic ? 'خدماتنا | صاحب' : 'Our Services | Saheeb',
      description,
      url: `https://saheeb.com/${locale}/services`,
      type: 'website',
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
      title: isArabic ? 'خدماتنا | صاحب' : 'Our Services | Saheeb',
      description,
      images: ['/og-image.svg'],
    },
  };
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
