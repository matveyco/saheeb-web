'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui';
import { motion } from 'framer-motion';
import Image from 'next/image';

const pillarGradients = {
  peopleSociety: 'from-blue-500/20 to-blue-600/5',
  economyDevelopment: 'from-[#D4AF37]/20 to-[#D4AF37]/5',
  governance: 'from-emerald-500/20 to-emerald-600/5',
  environment: 'from-cyan-500/20 to-cyan-600/5',
};

const pillarBorders = {
  peopleSociety: 'border-blue-500/30 hover:border-blue-400/50',
  economyDevelopment: 'border-[#D4AF37]/30 hover:border-[#D4AF37]/50',
  governance: 'border-emerald-500/30 hover:border-emerald-400/50',
  environment: 'border-cyan-500/30 hover:border-cyan-400/50',
};

const pillarIconColors = {
  peopleSociety: 'text-blue-400',
  economyDevelopment: 'text-[#D4AF37]',
  governance: 'text-emerald-400',
  environment: 'text-cyan-400',
};

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
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0, 0, 0.58, 1] as const },
    },
  };

  return (
    <section
      className="py-24 lg:py-32 bg-[#0A0E1A] relative overflow-hidden"
      id="vision-2040"
    >
      {/* Futuristic Muscat skyline background */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/images/vision-2040.png"
          alt=""
          fill
          className="object-cover object-center opacity-30"
          sizes="100vw"
        />
        {/* Gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E1A] via-[#0A0E1A]/70 to-[#0A0E1A]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E1A]/50 via-transparent to-[#0A0E1A]/50" />
      </div>

      {/* Background glow */}
      <div
        className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full z-[1]"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 text-[#D4AF37] text-sm font-semibold mb-6">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            Oman Vision 2040
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
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
                className={`
                  relative p-8 rounded-2xl
                  bg-gradient-to-br ${pillarGradients[pillar]}
                  backdrop-blur-xl
                  border ${pillarBorders[pillar]}
                  transition-all duration-500
                  hover:-translate-y-1
                  hover:shadow-[0_0_40px_rgba(0,0,0,0.3)]
                  group
                `}
              >
                <div
                  className={`
                    inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6
                    bg-white/[0.05] backdrop-blur-sm
                    ${pillarIconColors[pillar]}
                    group-hover:scale-110 transition-transform duration-300
                  `}
                >
                  {pillarIcons[pillar]}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {t(`pillars.${pillar}.title`)}
                </h3>
                <p className="text-white/60 leading-relaxed">
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
