'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Container, Button } from '@/components/ui';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function HeroSection() {
  const t = useTranslations('home.hero');

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#09090B]">
      {/* Muscat background image */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/images/Muscat-BG-1.png"
          alt=""
          fill
          className="object-cover object-bottom opacity-60"
          priority
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090B] via-[#09090B]/70 to-[#09090B]/30" />
      </div>

      <Container className="relative z-10 pt-20 lg:pt-28">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-[#EDEDEF] leading-[1.2] mb-8 tracking-tight"
          >
            <span className="block">{t('titleLine1') || 'Building the'}</span>
            <span className="block text-[#C9A87C]">
              {t('titleHighlight') || 'Digital Economy'}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-lg sm:text-xl lg:text-2xl text-[#8F8F96] max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/services">
              <Button size="lg" variant="primary">
                {t('cta')}
              </Button>
            </Link>
            <Link href="/projects/saheeb-drive">
              <Button size="lg" variant="secondary">
                {t('ctaSecondary')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1 }}
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
            className="text-[#5C5C63]"
            aria-hidden="true"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
