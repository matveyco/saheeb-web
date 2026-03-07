import type { Metadata } from 'next';

// FAQ data for structured data
const faqDataEn = [
  {
    question: 'When and where does it launch?',
    answer:
      "We're starting in Muscat, Q3 2026. Waitlist members get early access before the public launch. We'll expand to other cities based on demand.",
  },
  {
    question: 'Can I sell my car through Saheeb Drive?',
    answer:
      "Yes! Sellers get AI-powered pricing (so you know exactly what your car is worth), professional photos, and access to verified buyers. No more haggling with lowballers.",
  },
  {
    question: 'How do you verify cars and sellers?',
    answer:
      'We check against ROP records, insurance history, and our own fraud detection system. Suspicious listings get flagged before you ever see them. Only verified sellers make it to the platform.',
  },
  {
    question: 'What does it cost to use?',
    answer:
      'Browsing and searching is free. We charge a small service fee only when a deal is completed successfully. Sellers pay a listing fee. Full pricing will be announced at launch.',
  },
  {
    question: 'Is my data safe?',
    answer:
      'All your data stays in Oman, processed according to Omani privacy regulations. We never sell your information. You can delete your account and data anytime.',
  },
];

const faqDataAr = [
  {
    question: 'متى وأين الإطلاق؟',
    answer:
      'نبدأ في مسقط، الربع الثالث 2026. أعضاء قائمة الانتظار يحصلون على وصول مبكر قبل الإطلاق العام. سنتوسع لمدن أخرى حسب الطلب.',
  },
  {
    question: 'أقدر أبيع سيارتي من خلال صاحب درايف؟',
    answer:
      'إيه! البائعين يحصلون على تسعير بالذكاء الاصطناعي (تعرف بالضبط كم تسوى سيارتك)، صور احترافية، ووصول لمشترين موثقين. خلاص من المساومات مع اللي يعرضون أسعار واطية.',
  },
  {
    question: 'كيف تتحققون من السيارات والبائعين؟',
    answer:
      'نفحص مع سجلات شرطة عمان، تاريخ التأمين، ونظام كشف الاحتيال الخاص فينا. الإعلانات المشبوهة تنحذف قبل ما تشوفها. بس البائعين الموثقين يوصلون للمنصة.',
  },
  {
    question: 'كم يكلف الاستخدام؟',
    answer:
      'التصفح والبحث مجاني. ناخذ رسوم خدمة صغيرة بس لما تتم الصفقة بنجاح. البائعين يدفعون رسوم إعلان. الأسعار الكاملة نعلنها عند الإطلاق.',
  },
  {
    question: 'بياناتي آمنة؟',
    answer:
      'كل بياناتك تبقى في عمان، تُعالج حسب قوانين الخصوصية العمانية. ما نبيع معلوماتك أبداً. تقدر تحذف حسابك وبياناتك في أي وقت.',
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  const title = isArabic ? 'صاحب درايف' : 'Saheeb Drive';
  const description = isArabic
    ? 'سيارتك القادمة على بُعد محادثة واحدة. سوق السيارات بالذكاء الاصطناعي المبني لعمان. قل لنا ما تريد بالعربي أو الإنجليزي، ونتولى الباقي.'
    : 'Your next car is one chat away. The AI-native car marketplace built for Oman. Tell us what you want in Arabic or English, and we handle everything.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/projects/saheeb-drive`,
      languages: {
        en: '/en/projects/saheeb-drive',
        ar: '/ar/projects/saheeb-drive',
      },
    },
    openGraph: {
      title: isArabic ? 'صاحب درايف | صاحب' : 'Saheeb Drive | Saheeb',
      description,
      url: `https://saheeb.com/${locale}/projects/saheeb-drive`,
      type: 'website',
      images: [
        {
          url: '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: isArabic ? 'صاحب درايف' : 'Saheeb Drive',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isArabic ? 'صاحب درايف | صاحب' : 'Saheeb Drive | Saheeb',
      description,
      images: ['/images/og-image.png'],
    },
  };
}

export default async function SaheebDriveLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  const faqData = isArabic ? faqDataAr : faqDataEn;

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  // Product Schema for Saheeb Drive
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Saheeb Drive',
    alternateName: 'صاحب درايف',
    description: isArabic
      ? 'سوق السيارات بالذكاء الاصطناعي المبني لعمان'
      : 'AI-native car marketplace built for Oman',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'iOS, Android, Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'OMR',
      availability: 'https://schema.org/PreOrder',
    },
    author: {
      '@type': 'Organization',
      name: 'Saheeb',
      url: 'https://saheeb.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      {children}
    </>
  );
}
