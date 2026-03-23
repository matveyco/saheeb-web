'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Header, Footer } from '@/components/layout';
import { Container } from '@/components/ui';
import { ContactForm } from '@/components/forms/ContactForm';
import { SITE_CONFIG } from '@/lib/constants';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ContactPage() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <>
      <Header />
      <main className="pt-16 md:pt-20 lg:pt-24">
        {/* Contact Section - Hero + Form combined */}
        <section className="py-20 lg:py-28 bg-[#09090B] relative overflow-hidden">
          {/* Layer 1: Background image at opacity-20 */}
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <Image
              src="/images/contact-hero-bg.jpg"
              alt=""
              fill
              className="object-cover object-center opacity-40"
              sizes="100vw"
              priority
            />
          </div>

          {/* Layer 2: Gradient overlay */}
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background:
                'linear-gradient(to bottom, rgba(9,9,11,0.4), rgba(9,9,11,0.2), rgba(9,9,11,0.9))',
            }}
            aria-hidden="true"
          />

          <Container size="sm" className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#EDEDEF] mb-3">
                {t('title')}
              </h1>
              <p className="text-lg text-[#8F8F96] mb-10">{t('subtitle')}</p>

              <div className="max-w-md mx-auto">
                <ContactForm />
              </div>
            </motion.div>
          </Container>
        </section>

        {/* Contact Info Section - Simple inline */}
        <section className="py-16 bg-[#09090B] border-t border-[#1A1A1D]">
          <Container size="sm">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-center"
            >
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 text-sm">
                {/* Email */}
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-[#C9A87C] hover:text-[#EDEDEF] transition-colors"
                >
                  {t('info.email.value')}
                </a>

                <span className="hidden md:block text-[#333338]">|</span>

                {/* Operational location */}
                <span className="flex items-center gap-2 text-[#8F8F96]">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {isArabic
                    ? SITE_CONFIG.address.operational.ar
                    : SITE_CONFIG.address.operational.en}
                </span>
              </div>

              <p className="text-sm text-[#5C5C63] mt-4">
                {isArabic
                  ? `المقر القانوني: ${SITE_CONFIG.address.registered.ar}`
                  : `Registered HQ: ${SITE_CONFIG.address.registered.en}`}
              </p>

              <p className="text-sm text-[#5C5C63] mt-2">
                {isArabic
                  ? 'الأحد - الخميس: 9:00 صباحاً - 6:00 مساءً'
                  : 'Sun - Thu: 9 AM - 6 PM (Oman)'}
              </p>
            </motion.div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
