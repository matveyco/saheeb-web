import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  const title = isArabic ? 'تواصل معنا' : 'Contact Us';
  const description = isArabic
    ? 'تواصل مع فريق صاحب لمناقشة مشروعك القادم. نحن هنا لمساعدتك في تحقيق أهدافك الرقمية.'
    : "Get in touch with Saheeb to discuss your next project. We're here to help you achieve your digital goals.";

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        en: '/en/contact',
        ar: '/ar/contact',
      },
    },
    openGraph: {
      title: isArabic ? 'تواصل معنا | صاحب' : 'Contact Us | Saheeb',
      description,
      url: `https://saheeb.com/${locale}/contact`,
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
      title: isArabic ? 'تواصل معنا | صاحب' : 'Contact Us | Saheeb',
      description,
      images: ['/og-image.svg'],
    },
  };
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
