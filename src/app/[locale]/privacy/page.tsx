import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Header, Footer } from '@/components/layout';
import { Container } from '@/components/ui';

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });

  return {
    title: t('title'),
    description: t('metaDescription'),
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: {
        en: '/en/privacy',
        ar: '/ar/privacy',
      },
    },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('privacy');

  const sections = [
    'intro',
    'dataController',
    'dataCollection',
    'legalBasis',
    'dataUse',
    'dataSharing',
    'internationalTransfers',
    'dataRetention',
    'yourRights',
    'cookies',
    'childrenPrivacy',
    'security',
    'changes',
    'contact',
  ];

  const lastUpdated = new Date('2026-03-23').toLocaleDateString(
    locale === 'ar' ? 'ar-OM' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-24">
        {/* Hero Section */}
        <section className="py-16 lg:py-20 bg-[#211C28] relative overflow-hidden">
          {/* Decorative glow */}
          <div
            className="hidden md:block absolute top-1/2 -translate-y-1/2 end-[10%] w-[300px] h-[300px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
            aria-hidden="true"
          />
          <Container size="md" className="relative z-10">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              {t('title')}
            </h1>
            <p className="text-[#8F859C]">
              {t('lastUpdated')}: {lastUpdated}
            </p>
            <p className="text-[#8F859C] mt-4 text-lg max-w-2xl">
              {t('subtitle')}
            </p>
          </Container>
        </section>

        {/* Content */}
        <section className="py-12 lg:py-16 bg-[#151317]">
          <Container size="md">
            <div className="space-y-12">
              {sections.map((section, index) => (
                <div
                  key={section}
                  className="pb-10 border-b border-[#2A2633] last:border-b-0"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#316BE9]/10 flex items-center justify-center text-[#316BE9] text-sm font-semibold">
                      {index + 1}
                    </span>
                    <h2 className="text-2xl font-bold text-white">
                      {t(`sections.${section}.title`)}
                    </h2>
                  </div>
                  <div className="ps-12">
                    <div className="text-[#8F859C] leading-relaxed whitespace-pre-line">
                      {t(`sections.${section}.content`)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Company Info Footer */}
            <div className="mt-16 pt-8 border-t border-[#2A2633]">
              <div className="bg-[#1D1A22] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#316BE9] mb-4">
                  {t('companyInfo.title')}
                </h3>
                <div className="text-[#8F859C] space-y-2">
                  <p>
                    <strong className="text-white">{t('companyInfo.name')}</strong>
                  </p>
                  <p>{t('companyInfo.address')}</p>
                  <p>
                    {t('companyInfo.emailLabel')}:{' '}
                    <a
                      href="mailto:privacy@saheeb.com"
                      className="text-[#316BE9] hover:text-[#316BE9] transition-colors"
                    >
                      privacy@saheeb.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
