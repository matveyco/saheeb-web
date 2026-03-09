'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Header, Footer } from '@/components/layout';
import { Container, Badge, Button } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

const EARLY_ACCESS_LIMIT = 1000;

function useWaitlistCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/waitlist/count')
      .then((res) => res.json())
      .then((data: { count: number }) => setCount(data.count))
      .catch(() => {});
  }, []);

  return count;
}

export default function SaheebDrivePage() {
  const t = useTranslations('saheebDrive');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const count = useWaitlistCount();
  const heroRef = useRef<HTMLDivElement>(null);
  const [showStickyCta, setShowStickyCta] = useState(false);

  // Show sticky CTA after scrolling past hero
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyCta(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const howItWorksSteps = t.raw('howItWorks.steps') as Array<{
    number: string;
    title: string;
    description: string;
  }>;
  const faqItems = t.raw('faq.items') as Array<{ question: string; answer: string }>;

  const progressPercent = count !== null ? Math.min((count / EARLY_ACCESS_LIMIT) * 100, 100) : 0;

  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-24">
        {/* ==================== HERO ==================== */}
        <section ref={heroRef} className="py-12 lg:py-24 bg-[#09090B] relative overflow-hidden">
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <Image
              src="/images/saheeb-drive-hero-bg.png"
              alt=""
              fill
              className="object-cover object-center opacity-40"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#09090B]/40 via-[#09090B]/20 to-[#09090B]" />
          </div>

          <Container className="relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`text-center lg:text-start ${isArabic ? 'lg:order-2' : ''}`}
              >
                <Badge variant="accent" className="mb-6">
                  {t('hero.badge')}
                </Badge>

                <h1 className="text-5xl lg:text-7xl font-bold text-[#EDEDEF] mb-2">
                  {t('hero.title')}
                </h1>
                <p className="text-5xl lg:text-7xl font-bold text-[#C9A87C] mb-8">
                  {t('hero.titleHighlight')}
                </p>

                <Link href="/projects/saheeb-drive/waitlist">
                  <Button variant="primary" size="lg" className="mb-4">
                    {t('hero.cta')}
                  </Button>
                </Link>

                {/* Social proof counter */}
                {count !== null && count > 0 && (
                  <p className="text-[#8F8F96] text-sm mb-6 flex items-center justify-center lg:justify-start gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#C9A87C]">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    {t('hero.socialProof', { count })}
                  </p>
                )}

                {/* App Store Badges */}
                <div className="flex items-center justify-center lg:justify-start gap-4 opacity-60">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#111113] border border-[#222225]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#8F8F96]">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    <span className="text-[#8F8F96] text-sm">{t('hero.appStore')}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#111113] border border-[#222225]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#8F8F96]">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                    </svg>
                    <span className="text-[#8F8F96] text-sm">{t('hero.playStore')}</span>
                  </div>
                </div>
              </motion.div>

              {/* Phone Mockup */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className={isArabic ? 'lg:order-1' : ''}
              >
                <div className="relative mx-auto max-w-[320px]">
                  <div className="relative bg-[#19191B] rounded-[1.5rem] p-[6px] shadow-2xl border border-[#333338]">
                    <div className="relative aspect-[9/19] rounded-[1.25rem] overflow-hidden bg-[#111113]">
                      <Image
                        src="/images/saheeb-drive-app-chat.png"
                        alt="Saheeb Drive App - Chat Interface"
                        fill
                        className="object-contain"
                        sizes="320px"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* ==================== PAIN POINTS ==================== */}
        <section className="py-12 lg:py-20 bg-[#09090B] border-t border-[#1A1A1D]">
          <Container>
            <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
              {[
                {
                  key: 'scrolling' as const,
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#C9A87C]">
                      <rect x="5" y="2" width="14" height="20" rx="2" />
                      <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2" strokeLinecap="round" />
                      <path d="M9 8l3-2 3 2M9 12l3 2 3-2" />
                    </svg>
                  ),
                },
                {
                  key: 'trust' as const,
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#C9A87C]">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
                    </svg>
                  ),
                },
                {
                  key: 'weekends' as const,
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#C9A87C]">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                },
              ].map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-[#111113] rounded-2xl border border-[#222225] p-6 lg:p-8 text-center"
                >
                  <div className="flex justify-center mb-4">{item.icon}</div>
                  <p className="text-[#EDEDEF] font-semibold leading-relaxed">
                    {t(`painPoints.${item.key}`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* ==================== HOW IT WORKS ==================== */}
        <section className="py-12 lg:py-28 bg-[#09090B] border-t border-[#1A1A1D]">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-[#EDEDEF] mb-4">
                {t('howItWorks.title')}
              </h2>
              <p className="text-lg text-[#8F8F96] max-w-2xl mx-auto">
                {t('howItWorks.subtitle')}
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={isArabic ? 'lg:order-2' : ''}
              >
                <div className="relative mx-auto max-w-[280px]">
                  <div className="relative bg-[#19191B] rounded-[1.25rem] p-[5px] shadow-xl border border-[#333338]">
                    <div className="relative aspect-[9/19] rounded-[1rem] overflow-hidden bg-[#111113]">
                      <Image
                        src="/images/saheeb-drive-app-details.png"
                        alt="Saheeb Drive App - Car Details"
                        fill
                        className="object-contain"
                        sizes="280px"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className={`space-y-8 ${isArabic ? 'lg:order-1' : ''}`}>
                {howItWorksSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="shrink-0 w-12 h-12 rounded-full bg-[#C9A87C] flex items-center justify-center text-lg font-bold text-[#09090B]">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#EDEDEF] mb-2">{step.title}</h3>
                      <p className="text-[#8F8F96] leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="pt-4"
                >
                  <Link href="/projects/saheeb-drive/waitlist">
                    <Button variant="primary" size="lg">
                      {t('howItWorks.cta')}
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </Container>
        </section>

        {/* ==================== EARLY ACCESS PERKS ==================== */}
        <section className="py-12 lg:py-20 bg-[#09090B] border-t border-[#1A1A1D]">
          <Container size="md">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-[#EDEDEF] mb-6">
                {t('earlyAccess.title')}
              </h2>

              {/* Progress bar */}
              {count !== null && (
                <div className="max-w-md mx-auto mb-8">
                  <div className="h-2 bg-[#222225] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${progressPercent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-[#C9A87C] rounded-full"
                    />
                  </div>
                  <p className="text-[#5C5C63] text-sm mt-2">
                    {t('earlyAccess.spotsLabel', { count })}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Perks grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                {
                  titleKey: 'perk1Title' as const,
                  descKey: 'perk1Desc' as const,
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z" />
                    </svg>
                  ),
                },
                {
                  titleKey: 'perk2Title' as const,
                  descKey: 'perk2Desc' as const,
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  ),
                },
                {
                  titleKey: 'perk3Title' as const,
                  descKey: 'perk3Desc' as const,
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  ),
                },
              ].map((perk, index) => (
                <motion.div
                  key={perk.titleKey}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-[#111113] rounded-2xl border border-[#222225] p-6 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#C9A87C]/10 flex items-center justify-center text-[#C9A87C]">
                    {perk.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#EDEDEF] mb-2">
                    {t(`earlyAccess.${perk.titleKey}`)}
                  </h3>
                  <p className="text-[#8F8F96] text-sm leading-relaxed">
                    {t(`earlyAccess.${perk.descKey}`)}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <Link href="/projects/saheeb-drive/waitlist">
                <Button variant="primary" size="lg">
                  {t('earlyAccess.cta')}
                </Button>
              </Link>
            </motion.div>
          </Container>
        </section>

        {/* ==================== FAQ ==================== */}
        <section className="py-12 lg:py-24 bg-[#09090B] border-t border-[#1A1A1D]">
          <Container size="md">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center mb-10"
            >
              <h3 className="text-2xl lg:text-3xl font-bold text-[#EDEDEF]">{t('faq.title')}</h3>
            </motion.div>

            <div className="space-y-3 mb-12">
              {faqItems.map((item, index) => (
                <motion.details
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group bg-[#111113] rounded-xl border border-[#222225] overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-5 hover:bg-[#19191B] transition-colors">
                    <span className="font-medium text-[#EDEDEF]">{item.question}</span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[#C9A87C] group-open:rotate-180 transition-transform shrink-0 ms-4"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-5 text-[#8F8F96] leading-relaxed">
                    {item.answer}
                  </div>
                </motion.details>
              ))}
            </div>

            {/* Footer info */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center pt-8 border-t border-[#1A1A1D]"
            >
              <p className="text-[#C9A87C] font-semibold mb-4">{t('footer.launching')}</p>
              <Link
                href="/privacy"
                className="text-[#5C5C63] hover:text-[#8F8F96] text-sm transition-colors"
              >
                {t('footer.privacy')}
              </Link>
            </motion.div>
          </Container>
        </section>
      </main>

      {/* ==================== STICKY MOBILE CTA ==================== */}
      <div
        className={`fixed bottom-0 inset-x-0 z-40 lg:hidden transition-transform duration-300 ${
          showStickyCta ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-[#09090B] border-t border-[#222225] shadow-[0_-4px_12px_rgba(0,0,0,0.3)] px-4 py-3">
          <Link href="/projects/saheeb-drive/waitlist" className="block">
            <Button variant="primary" size="md" className="w-full">
              {t('stickyCta')}
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
