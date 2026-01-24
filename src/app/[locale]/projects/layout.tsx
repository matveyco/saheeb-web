import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  const title = isArabic ? 'مشاريعنا' : 'Our Projects';
  const description = isArabic
    ? 'اكتشف صاحب درايف، سوق السيارات بالذكاء الاصطناعي المبني لعمان. منتجنا الرئيسي يعيد تشكيل صناعة بأكملها.'
    : 'Discover Saheeb Drive, the AI-native car marketplace built for Oman. Our flagship product is reshaping an entire industry.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/projects`,
      languages: {
        en: '/en/projects',
        ar: '/ar/projects',
      },
    },
    openGraph: {
      title: isArabic ? 'مشاريعنا | صاحب' : 'Our Projects | Saheeb',
      description,
      url: `https://saheeb.com/${locale}/projects`,
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
      title: isArabic ? 'مشاريعنا | صاحب' : 'Our Projects | Saheeb',
      description,
      images: ['/og-image.svg'],
    },
  };
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
