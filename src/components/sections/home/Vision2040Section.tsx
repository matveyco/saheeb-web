'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui';
import { motion } from 'framer-motion';
import Image from 'next/image';

const pillarIcons: Record<string, React.ReactNode> = {
  peopleSociety: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  economyDevelopment: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  ),
  governance: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  ),
  environment: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  ),
};

export function Vision2040Section() {
  const t = useTranslations('home.vision2040');

  const pillars = [
    'peopleSociety',
    'economyDevelopment',
    'governance',
    'environment',
  ] as const;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0, 0, 0.58, 1] as const },
    },
  };

  return (
    <section
      className="py-24 lg:py-32 bg-[#09090B] relative overflow-hidden"
      id="vision-2040"
    >
      {/* Futuristic Muscat skyline background */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/images/vision-2040.jpg"
          alt=""
          fill
          className="object-cover object-center opacity-40"
          sizes="100vw"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090B] via-[#09090B]/60 to-[#09090B]" />
      </div>

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#111113] border border-[#222225] text-[#C9A87C] text-sm font-semibold mb-6">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            Oman Vision 2040
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#EDEDEF] mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-[#8F8F96] max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {pillars.map((pillar) => (
            <motion.div key={pillar} variants={itemVariants}>
              <div
                className="
                  relative p-8 rounded-2xl
                  bg-[#111113]
                  border border-[#222225]
                  hover:border-[#333338]
                  transition-colors duration-300
                  group
                "
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-[#19191B] border border-[#222225] text-[#C9A87C]">
                  {pillarIcons[pillar]}
                </div>
                <h3 className="text-xl font-bold text-[#EDEDEF] mb-3">
                  {t(`pillars.${pillar}.title`)}
                </h3>
                <p className="text-[#8F8F96] leading-relaxed">
                  {t(`pillars.${pillar}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
