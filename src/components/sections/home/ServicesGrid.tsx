'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Container, Card, Button } from '@/components/ui';
import { SERVICES } from '@/lib/constants';
import { motion } from 'framer-motion';

const icons: Record<string, React.ReactNode> = {
  Rocket: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  Smartphone: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  ),
  Brain: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </svg>
  ),
  Search: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  TrendingUp: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
  Globe: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  ),
};

const serviceKeys: Record<string, string> = {
  'build': 'build',
  'ai': 'ai',
  'grow': 'grow',
  'localize': 'localize',
};

// Service-specific accent colors for visual variety
const serviceAccents: Record<string, { gradient: string; glow: string; border: string }> = {
  'build': {
    gradient: 'from-[#D4AF37]/20 to-[#D4AF37]/5',
    glow: 'group-hover:shadow-[0_0_30px_rgba(212,175,55,0.25)]',
    border: 'group-hover:border-[#D4AF37]/50',
  },
  'ai': {
    gradient: 'from-purple-500/20 to-purple-500/5',
    glow: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]',
    border: 'group-hover:border-purple-500/50',
  },
  'grow': {
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    glow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]',
    border: 'group-hover:border-emerald-500/50',
  },
  'localize': {
    gradient: 'from-blue-500/20 to-blue-500/5',
    glow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]',
    border: 'group-hover:border-blue-500/50',
  },
};

export function ServicesGrid() {
  const t = useTranslations('home.services');
  const tServices = useTranslations('services.list');
  const tCommon = useTranslations('common');

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0, 0, 0.58, 1] as const },
    },
  };

  return (
    <section className="py-24 lg:py-32 bg-[#0A0E1A] relative overflow-hidden" id="services">
      {/* Background decoration - hidden on mobile for performance */}
      <div
        className="hidden md:block absolute bottom-0 end-0 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

      {/* Floating blue orb - hidden on mobile for performance */}
      <motion.div
        className="hidden md:block absolute top-[15%] start-[5%] w-[350px] h-[350px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        aria-hidden="true"
      />

      {/* Floating purple orb - hidden on mobile for performance */}
      <motion.div
        className="hidden md:block absolute top-[50%] end-[8%] w-[280px] h-[280px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{
          y: [0, -25, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        aria-hidden="true"
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
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
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          {SERVICES.map((service) => {
            const key = serviceKeys[service.id];
            const accent = serviceAccents[service.id] || serviceAccents['product-mvp'];
            return (
              <motion.div key={service.id} variants={itemVariants}>
                <Card
                  variant="glass"
                  padding="lg"
                  className={`group h-full ${accent.border} ${accent.glow} transition-all duration-500`}
                >
                  <motion.div
                    className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${accent.gradient} text-[#D4AF37] rounded-xl mb-5 border border-white/10 group-hover:scale-110 transition-all duration-500`}
                    whileHover={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.6 }}
                  >
                    {icons[service.icon]}
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors duration-300">
                    {tServices(`${key}.title`)}
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    {tServices(`${key}.shortDescription`)}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/services">
            <Button variant="glass" size="lg">
              {tCommon('viewAll')}
            </Button>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
