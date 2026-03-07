import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Header, Footer } from '@/components/layout';
import { Container } from '@/components/ui';

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'terms' });

  return {
    title: t('title'),
    description: t('metaDescription'),
    alternates: {
      canonical: `/${locale}/terms`,
      languages: {
        en: '/en/terms',
        ar: '/ar/terms',
      },
    },
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('terms');

  const sections = [
    'acceptance',
    'companyInfo',
    'servicesDescription',
    'userAccounts',
    'acceptableUse',
    'intellectualProperty',
    'thirdPartyContent',
    'disclaimerWarranties',
    'limitationLiability',
    'indemnification',
    'governingLaw',
    'disputeResolution',
    'forceMajeure',
    'severability',
    'changes',
    'contact',
  ];

  const lastUpdated = new Date('2026-03-06').toLocaleDateString(
    locale === 'ar' ? 'ar-OM' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-24">
        {/* Hero Section */}
        <section className="py-16 lg:py-20 bg-[#09090B] relative overflow-hidden">
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
            <p className="text-[#8F8F96]">
              {t('lastUpdated')}: {lastUpdated}
            </p>
            <p className="text-[#8F8F96] mt-4 text-lg max-w-2xl">
              {t('subtitle')}
            </p>
          </Container>
        </section>

        {/* Important Notice */}
        <section className="py-6 bg-[#C9A87C]/10 border-y border-[#C9A87C]/20">
          <Container size="md">
            <p className="text-[#C9A87C] font-medium text-center">
              {t('importantNotice')}
            </p>
          </Container>
        </section>

        {/* Content */}
        <section className="py-12 lg:py-16 bg-[#111113]">
          <Container size="md">
            <div className="space-y-12">
              {sections.map((section, index) => (
                <div
                  key={section}
                  className="pb-10 border-b border-[#222225] last:border-b-0"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#C9A87C]/10 flex items-center justify-center text-[#C9A87C] text-sm font-semibold">
                      {index + 1}
                    </span>
                    <h2 className="text-2xl font-bold text-white">
                      {t(`sections.${section}.title`)}
                    </h2>
                  </div>
                  <div className="ps-12">
                    <div className="text-[#8F8F96] leading-relaxed whitespace-pre-line">
                      {t(`sections.${section}.content`)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Saheeb Drive Terms */}
            <div className="mt-16 pt-8 border-t border-[#222225]">
              <h2 className="text-3xl font-bold text-[#C9A87C] mb-8">
                {t('saheebDrive.title')}
              </h2>
              <p className="text-[#8F8F96] mb-8">{t('saheebDrive.intro')}</p>

              {[
                'platformDescription',
                'userResponsibilities',
                'platformRole',
                'feesPayments',
                'listingStandards',
                'verificationServices',
                'disclaimers',
              ].map((driveSection, index) => (
                <div key={driveSection} className="mb-10">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#C9A87C]/20 flex items-center justify-center text-[#C9A87C] text-sm font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      {t(`saheebDrive.sections.${driveSection}.title`)}
                    </h3>
                  </div>
                  <div className="ps-12">
                    <div className="text-[#8F8F96] leading-relaxed whitespace-pre-line">
                      {t(`saheebDrive.sections.${driveSection}.content`)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* B2B Disclaimer */}
            <div className="mt-16 pt-8 border-t border-[#222225]">
              <div className="bg-[#19191B] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#C9A87C] mb-4">
                  {t('b2bDisclaimer.title')}
                </h3>
                <div className="text-[#8F8F96] leading-relaxed whitespace-pre-line">
                  {t('b2bDisclaimer.content')}
                </div>
              </div>
            </div>

            {/* Company Info Footer */}
            <div className="mt-16 pt-8 border-t border-[#222225]">
              <div className="bg-[#19191B] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#C9A87C] mb-4">
                  {t('legalContact.title')}
                </h3>
                <div className="text-[#8F8F96] space-y-2">
                  <p>
                    <strong className="text-white">{t('legalContact.name')}</strong>
                  </p>
                  <p>{t('legalContact.address')}</p>
                  <p>
                    {t('legalContact.emailLabel')}:{' '}
                    <a
                      href="mailto:legal@saheeb.com"
                      className="text-[#C9A87C] hover:text-[#C9A87C] transition-colors"
                    >
                      legal@saheeb.com
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
