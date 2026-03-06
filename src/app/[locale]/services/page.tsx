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
  build: '/images/service-build.png',
  ai: '/images/service-ai.png',
  grow: '/images/service-grow.png',
  localize: '/images/service-localize.png',
};

const serviceColors: Record<string, { accent: string; glow: string }> = {
  build: { accent: '#D4AF37', glow: 'rgba(212, 175, 55, 0.3)' },
  ai: { accent: '#A855F7', glow: 'rgba(168, 85, 247, 0.3)' },
  grow: { accent: '#10B981', glow: 'rgba(16, 185, 129, 0.3)' },
  localize: { accent: '#3B82F6', glow: 'rgba(59, 130, 246, 0.3)' },
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
        <section className="py-20 lg:py-28 bg-[#0A0E1A] relative overflow-hidden">
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <Image
              src="/images/services-hero.png"
              alt=""
              fill
              className="object-cover object-center opacity-30"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E1A]/70 via-[#0A0E1A]/50 to-[#0A0E1A]" />
          </div>

          {/* Decorative glow */}
          <div
            className="absolute top-0 start-1/4 w-[600px] h-[600px] rounded-full z-[1]"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
            aria-hidden="true"
          />

          <Container className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                {t('title')}
              </h1>
              <p className="text-2xl lg:text-3xl text-[#D4AF37] font-semibold">
                {t('subtitle')}
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Services List */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-[#0F1629] to-[#0A0E1A]">
          <Container>
            <div className="space-y-16 lg:space-y-24">
              {SERVICES.map((service, index) => {
                const key = serviceKeys[service.id];
                const isEven = index % 2 === 0;
                const colors = serviceColors[key];
                const imageUrl = serviceImages[key];

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
                  >
                    {/* Content */}
                    <div className={!isEven ? 'lg:order-2' : ''}>
                      {/* Tagline */}
                      <p
                        className="text-sm font-semibold uppercase tracking-wider mb-3"
                        style={{ color: colors.accent }}
                      >
                        {t(`list.${key}.tagline`)}
                      </p>

                      <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                        {t(`list.${key}.title`)}
                      </h2>

                      <p className="text-lg text-white/70 mb-8 leading-relaxed">
                        {t(`list.${key}.description`)}
                      </p>

                      {/* Key Points */}
                      <ul className="space-y-3 mb-8">
                        {(t.raw(`list.${key}.points`) as string[]).map(
                          (point: string, i: number) => (
                            <li
                              key={i}
                              className="flex items-center gap-3 text-white/80"
                            >
                              <svg
                                className="w-5 h-5 shrink-0"
                                style={{ color: colors.accent }}
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
                        <Button variant="gold">{tCommon('contactUs')}</Button>
                      </Link>
                    </div>

                    {/* Visual - Image */}
                    <div className={`${!isEven ? 'lg:order-1' : ''}`}>
                      <div
                        className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10"
                        style={{
                          boxShadow: `0 0 60px ${colors.glow}`,
                        }}
                      >
                        <Image
                          src={imageUrl}
                          alt={t(`list.${key}.title`)}
                          fill
                          className="object-cover opacity-85"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        {/* Gradient overlay */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(135deg, ${colors.accent}15 0%, transparent 60%)`,
                          }}
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
        <section className="py-24 lg:py-32 bg-[#0A0E1A] relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 80% 50% at 50% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 60%)`,
            }}
            aria-hidden="true"
          />

          <Container size="md" className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                {isArabic ? 'مستعد للبدء؟' : 'Ready to Get Started?'}
              </h2>
              <p className="text-xl text-white/60 max-w-xl mx-auto mb-10">
                {isArabic
                  ? 'تواصل معنا لمناقشة مشروعك واحتياجاتك.'
                  : "Let's discuss your project and requirements."}
              </p>
              <p className="text-sm text-white/40 max-w-2xl mx-auto mb-8">
                {t('licenseDisclaimer')}
              </p>
              <Link href="/contact">
                <Button size="lg" variant="gold">
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
