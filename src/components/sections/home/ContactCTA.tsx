'use client';

import { useTranslations, useLocale } from 'next-intl';
import { TrackedLink } from '@/components/analytics/TrackedLink';
import { Link } from '@/i18n/navigation';
import { Container, Button } from '@/components/ui';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function ContactCTA() {
  const t = useTranslations('home.cta');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <section className="py-24 lg:py-32 bg-[#09090B] relative overflow-hidden">
      {/* Sultan Qaboos Mosque background */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/images/Contact-CTA.png"
          alt=""
          fill
          className="object-cover object-center opacity-40"
          sizes="100vw"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090B]/70 via-[#09090B]/40 to-[#09090B]/70" />
      </div>

      <Container size="md" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#EDEDEF] mb-6 leading-tight"
          >
            {t('title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-xl text-[#8F8F96] max-w-xl mx-auto mb-10"
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <TrackedLink
              href="/contact"
              ctaLocation="home_contact_primary"
              destinationPath="/contact"
            >
              <Button size="lg" variant="primary">
                {t('button')}
              </Button>
            </TrackedLink>
            <Link href="/services">
              <Button size="lg" variant="secondary">
                {t('button') === 'Get in Touch' ? 'View Services' : '\u0639\u0631\u0636 \u0627\u0644\u062E\u062F\u0645\u0627\u062A'}
              </Button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-16 pt-10 border-t border-[#1A1A1D]"
          >
            <div className="flex flex-wrap items-center justify-center gap-8 text-[#5C5C63]">
              <div className="flex items-center gap-2">
                <span className="text-lg">{'\uD83C\uDDF4\uD83C\uDDF2'}</span>
                <span className="text-sm">{isArabic ? '\u0634\u0631\u0643\u0629 \u0639\u0645\u0627\u0646\u064A\u0629 100%' : '100% Omani Registered'}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span className="text-sm">{isArabic ? '\u0634\u0631\u0627\u0643\u0627\u062A \u0634\u0641\u0627\u0641\u0629' : 'Transparent Partnerships'}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                <span className="text-sm">{isArabic ? '\u0645\u062A\u0648\u0627\u0641\u0642\u0648\u0646 \u0645\u0639 \u0631\u0624\u064A\u0629 2040' : 'Vision 2040 Aligned'}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
