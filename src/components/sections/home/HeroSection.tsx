'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Container, Button } from '@/components/ui';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function HeroSection() {
  const t = useTranslations('home.hero');

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0A0E1A]">
      {/* Muscat background image */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/images/Muscat-BG-1.png"
          alt=""
          fill
          className="object-cover object-bottom opacity-50"
          priority
        />
        {/* Dark gradient overlay - fade from top, reveal city at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E1A] via-[#0A0E1A]/85 to-[#0A0E1A]/40" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      {/* Floating gold orb - hidden on mobile for performance */}
      <motion.div
        className="hidden md:block absolute top-1/4 end-[10%] w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        aria-hidden="true"
      />

      {/* Floating blue orb - hidden on mobile for performance */}
      <motion.div
        className="hidden md:block absolute bottom-1/4 start-[5%] w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          y: [0, 40, 0],
          x: [0, -30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        aria-hidden="true"
      />

      {/* Secondary gold accent - hidden on mobile for performance */}
      <motion.div
        className="hidden md:block absolute top-[60%] end-[30%] w-[200px] h-[200px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5,
        }}
        aria-hidden="true"
      />

      <Container className="relative z-10 pt-20 lg:pt-28">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main heading - dramatic typography */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.2] mb-8 tracking-tight"
          >
            <span className="block">{t('titleLine1') || 'Building the'}</span>
            <span className="block bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37] bg-clip-text text-transparent">
              {t('titleHighlight') || 'Digital Economy'}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl lg:text-2xl text-white/60 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/services">
              <Button size="lg" variant="gold">
                {t('cta')}
              </Button>
            </Link>
            <Link href="/projects/saheeb-drive">
              <Button size="lg" variant="glass">
                {t('ctaSecondary')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </Container>

      {/* Scroll indicator - positioned at absolute bottom of section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-6 start-1/2 -translate-x-1/2 z-10 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white/30"
            aria-hidden="true"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
