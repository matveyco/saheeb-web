'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Container, Button } from '@/components/ui';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function ContactCTA() {
  const t = useTranslations('home.cta');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <section className="py-24 lg:py-32 bg-[#0A0E1A] relative overflow-hidden">
      {/* Sultan Qaboos Mosque background */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/images/Contact-CTA.png"
          alt=""
          fill
          className="object-cover object-center opacity-25"
          sizes="100vw"
        />
        {/* Gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E1A]/80 via-[#0A0E1A]/60 to-[#0A0E1A]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E1A]/40 via-transparent to-[#0A0E1A]/40" />
      </div>

      {/* Dramatic gradient background */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 50%, rgba(212, 175, 55, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 30% 70%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 50% 30% at 70% 30%, rgba(212, 175, 55, 0.06) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Animated gold orb - main */}
      <motion.div
        className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full z-[2]"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        aria-hidden="true"
      />

      {/* Floating orb - left */}
      <motion.div
        className="absolute top-[20%] start-[10%] w-[300px] h-[300px] rounded-full z-[2]"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{
          y: [0, -40, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        aria-hidden="true"
      />

      {/* Floating orb - right */}
      <motion.div
        className="absolute bottom-[20%] end-[10%] w-[250px] h-[250px] rounded-full z-[2]"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          y: [0, 30, 0],
          x: [0, -25, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
        aria-hidden="true"
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-15 z-[3]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
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
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight"
          >
            {t('title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-white/60 max-w-xl mx-auto mb-10"
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/contact">
              <Button size="lg" variant="gold">
                {t('button')}
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="glass">
                {t('button') === 'Get in Touch' ? 'View Services' : 'عرض الخدمات'}
              </Button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 pt-10 border-t border-white/10"
          >
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/50">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇴🇲</span>
                <span className="text-sm">{isArabic ? 'شركة عمانية 100%' : '100% Omani Registered'}</span>
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
                <span className="text-sm">{isArabic ? 'شراكات شفافة' : 'Transparent Partnerships'}</span>
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
                <span className="text-sm">{isArabic ? 'متوافقون مع رؤية 2040' : 'Vision 2040 Aligned'}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
