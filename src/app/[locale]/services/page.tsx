'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Header, Footer } from '@/components/layout';
import { Container, Button } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import { SERVICES } from '@/lib/constants';
import { motion } from 'framer-motion';
import Image from 'next/image';

const serviceKeys: Record<string, string> = {
  'build': 'build',
  'ai': 'ai',
  'grow': 'grow',
  'localize': 'localize',
};

const serviceImages: Record<string, string> = {
  build: '/images/service-build.jpg',
  ai: '/images/service-ai.jpg',
  grow: '/images/service-grow.jpg',
  localize: '/images/service-localize.jpg',
};

export default function ServicesPage() {
  const t = useTranslations('services');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-24">
        {/* Hero Section */}
        <section className="py-20 lg:py-28 bg-[#09090B] relative overflow-hidden">
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <Image
              src="/images/services-hero.jpg"
              alt=""
              fill
              className="object-cover object-center opacity-50"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#09090B]/50 via-[#09090B]/30 to-[#09090B]" />
          </div>

          <Container className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-[#EDEDEF] mb-6">
                {t('title')}
              </h1>
              <p className="text-2xl lg:text-3xl text-[#C9A87C] font-semibold">
                {t('subtitle')}
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Services List */}
        <section className="py-16 lg:py-24 bg-[#09090B]">
          <Container>
            <div className="space-y-16 lg:space-y-24">
              {SERVICES.map((service, index) => {
                const key = serviceKeys[service.id];
                const isEven = index % 2 === 0;
                const imageUrl = serviceImages[key];

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
                  >
                    {/* Content */}
                    <div className={!isEven ? 'lg:order-2' : ''}>
                      {/* Tagline */}
                      <p className="text-sm font-semibold uppercase tracking-wider mb-3 text-[#C9A87C]">
                        {t(`list.${key}.tagline`)}
                      </p>

                      <h2 className="text-3xl lg:text-4xl font-bold text-[#EDEDEF] mb-4">
                        {t(`list.${key}.title`)}
                      </h2>

                      <p className="text-lg text-[#8F8F96] mb-8 leading-relaxed">
                        {t(`list.${key}.description`)}
                      </p>

                      {/* Key Points */}
                      <ul className="space-y-3 mb-8">
                        {(t.raw(`list.${key}.points`) as string[]).map(
                          (point: string, i: number) => (
                            <li
                              key={i}
                              className="flex items-center gap-3 text-[#EDEDEF]/80"
                            >
                              <svg
                                className="w-5 h-5 shrink-0 text-[#C9A87C]"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              {point}
                            </li>
                          )
                        )}
                      </ul>

                      <Link href="/contact">
                        <Button variant="primary">{tCommon('contactUs')}</Button>
                      </Link>
                    </div>

                    {/* Visual - Image */}
                    <div className={`${!isEven ? 'lg:order-1' : ''}`}>
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#222225]">
                        <Image
                          src={imageUrl}
                          alt={t(`list.${key}.title`)}
                          fill
                          className="object-cover opacity-85"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-24 lg:py-32 bg-[#09090B] border-t border-[#1A1A1D]">
          <Container size="md" className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-[#EDEDEF] mb-6">
                {isArabic ? 'مستعد للبدء؟' : 'Ready to Get Started?'}
              </h2>
              <p className="text-xl text-[#8F8F96] max-w-xl mx-auto mb-10">
                {isArabic
                  ? 'تواصل معنا لمناقشة مشروعك واحتياجاتك.'
                  : "Let's discuss your project and requirements."}
              </p>
              <p className="text-sm text-[#5C5C63] max-w-2xl mx-auto mb-8">
                {t('licenseDisclaimer')}
              </p>
              <Link href="/contact">
                <Button size="lg" variant="primary">
                  {tCommon('contactUs')}
                </Button>
              </Link>
            </motion.div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
