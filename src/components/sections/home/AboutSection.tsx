'use client';

import { useTranslations } from 'next-intl';
import { Container, Card } from '@/components/ui';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function AboutSection() {
  const t = useTranslations('home.about');

  const values = [
    {
      key: 'globalTalent',
      icon: (
        <svg
          width="28"
          height="28"
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
      ),
    },
    {
      key: 'localImpact',
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      key: 'knowledgeTransfer',
      icon: (
        <svg
          width="28"
          height="28"
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
      ),
    },
  ];

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
      id="about"
    >
      {/* Omani geometric pattern - subtle centered background */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/images/About-section.png"
          alt=""
          fill
          className="object-cover object-center opacity-[0.15]"
          sizes="100vw"
        />
        {/* Radial gradient to fade edges */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 0%, #09090B 80%)'
          }}
        />
      </div>

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111113] border border-[#222225] text-[#8F8F96] text-sm font-medium mb-6">
            {t('subtitle')}
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#EDEDEF] mb-6">
            {t('title')}
          </h2>
          <p className="text-lg text-[#8F8F96] leading-relaxed mb-4">
            {t('description')}
          </p>
          <p className="text-lg text-[#8F8F96] leading-relaxed">{t('mission')}</p>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {values.map((value) => (
            <motion.div key={value.key} variants={itemVariants}>
              <Card
                variant="outline"
                padding="lg"
                className="text-center h-full group bg-[#111113] border-[#222225] hover:border-[#333338] transition-colors duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#19191B] text-[#C9A87C] rounded-2xl mb-6 border border-[#222225]">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-[#EDEDEF] mb-3">
                  {t(`values.${value.key}.title`)}
                </h3>
                <p className="text-[#8F8F96] leading-relaxed">
                  {t(`values.${value.key}.description`)}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
