'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Header, Footer } from '@/components/layout';
import { Container, Badge, Button } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ProjectsPage() {
  const t = useTranslations('projects');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-24">
        {/* Hero Section - Saheeb Drive Focus */}
        <section className="py-24 lg:py-32 bg-[#0A0E1A] relative overflow-hidden">
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <Image
              src="/images/saheeb-project-hero.png"
              alt=""
              fill
              className="object-cover object-center opacity-25"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E1A]/60 via-[#0A0E1A]/40 to-[#0A0E1A]" />
          </div>

          {/* Decorative elements - hidden on mobile for performance */}
          <motion.div
            className="hidden md:block absolute top-[20%] end-[10%] w-[400px] h-[400px] rounded-full z-[1]"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
              filter: 'blur(60px)',
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

          <Container className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Badge variant="glow" className="mb-6">
                {t('saheebDrive.status')}
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                {t('title')}
              </h1>
              <p className="text-xl lg:text-2xl text-[#D4AF37] font-semibold mb-8">
                {t('subtitle')}
              </p>
              <Link href="/projects/saheeb-drive">
                <Button variant="gold" size="lg">
                  {t('saheebDrive.cta')}
                </Button>
              </Link>
            </motion.div>
          </Container>
        </section>

        {/* Saheeb Drive Showcase */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-[#0F1629] to-[#0A0E1A]">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: isArabic ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  {/* Car icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-xl flex items-center justify-center shadow-[0_4px_20px_rgba(212,175,55,0.3)]">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0A0E1A"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
                      <circle cx="6.5" cy="16.5" r="2.5" />
                      <circle cx="16.5" cy="16.5" r="2.5" />
                    </svg>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white">
                    {t('saheebDrive.title')}
                  </h2>
                </div>

                <p className="text-xl lg:text-2xl text-[#D4AF37] font-semibold mb-4">
                  {t('saheebDrive.heroTagline')}
                </p>

                <p className="text-lg text-white/70 mb-8 leading-relaxed">
                  {t('saheebDrive.heroDescription')}
                </p>

                <Link href="/projects/saheeb-drive">
                  <Button variant="gold" size="lg">
                    {t('saheebDrive.cta')}
                  </Button>
                </Link>
              </motion.div>

              {/* Visual */}
              <motion.div
                initial={{ opacity: 0, x: isArabic ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10"
                  style={{
                    boxShadow: '0 0 60px rgba(212, 175, 55, 0.2)',
                  }}
                >
                  <Image
                    src="/images/saheeb-drive-hero.png"
                    alt={t('saheebDrive.title')}
                    fill
                    className="object-cover opacity-90"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A]/60 to-transparent" />
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* More Coming Soon */}
        <section className="py-20 lg:py-28 bg-[#0F1629]">
          <Container size="md">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-white/40"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white/60 mb-3">
                {t('moreComing.title')}
              </h3>
              <p className="text-white/40 max-w-md mx-auto">
                {t('moreComing.description')}
              </p>
            </motion.div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-24 lg:py-32 bg-[#0A0E1A] relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 60% 40% at 50% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 60%)`,
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
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                {isArabic ? 'هل لديك فكرة مشروع؟' : 'Have a Project Idea?'}
              </h2>
              <p className="text-xl text-white/60 max-w-xl mx-auto mb-10">
                {isArabic
                  ? 'نحب سماع أفكارك. تواصل معنا لمناقشة كيف يمكننا مساعدتك.'
                  : "We'd love to hear your ideas. Get in touch to discuss how we can help."}
              </p>
              <Link href="/contact">
                <Button size="lg" variant="gold">
                  {tCommon('contactUs')}
                </Button>
              </Link>
            </motion.div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
