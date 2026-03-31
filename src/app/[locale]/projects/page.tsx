'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Header, Footer } from '@/components/layout';
import { Container, Badge, Button } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { TrackedLink } from '@/components/analytics/TrackedLink';

export default function ProjectsPage() {
  const t = useTranslations('projects');
  const tNavigation = useTranslations('navigation');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-24">
        {/* Hero Section - Saheeb Drive Focus */}
        <section className="py-24 lg:py-32 bg-[#09090B] relative overflow-hidden">
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <Image
              src="/images/saheeb-project-hero.jpg"
              alt=""
              fill
              className="object-cover object-center opacity-45"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#09090B]/40 via-[#09090B]/20 to-[#09090B]" />
          </div>

          <Container className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Badge variant="accent" className="mb-6">
                {t('saheebDrive.status')}
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-[#EDEDEF] mb-4">
                {t('title')}
              </h1>
              <p className="text-xl lg:text-2xl text-[#C9A87C] font-semibold mb-8">
                {t('subtitle')}
              </p>
              <Button asChild variant="primary" size="lg">
                <TrackedLink
                  href="/projects/saheeb-drive?focus=waitlist"
                  ctaLocation="projects_hero_join_waitlist"
                  destinationPath="/projects/saheeb-drive?focus=waitlist"
                  project="saheeb_drive"
                >
                  {tNavigation('joinWaitlist')}
                </TrackedLink>
              </Button>
            </motion.div>
          </Container>
        </section>

        {/* Saheeb Drive Showcase */}
        <section className="py-20 lg:py-28 bg-[#09090B] border-t border-[#1A1A1D]">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  {/* Car icon */}
                  <div className="w-12 h-12 bg-[#C9A87C] rounded-xl flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#09090B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
                      <circle cx="6.5" cy="16.5" r="2.5" />
                      <circle cx="16.5" cy="16.5" r="2.5" />
                    </svg>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-[#EDEDEF]">
                    {t('saheebDrive.title')}
                  </h2>
                </div>

                <p className="text-xl lg:text-2xl text-[#C9A87C] font-semibold mb-4">
                  {t('saheebDrive.heroTagline')}
                </p>

                <p className="text-lg text-[#8F8F96] mb-8 leading-relaxed">
                  {t('saheebDrive.heroDescription')}
                </p>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button asChild variant="primary" size="lg">
                    <TrackedLink
                      href="/projects/saheeb-drive?focus=waitlist"
                      ctaLocation="projects_showcase_join_waitlist"
                      destinationPath="/projects/saheeb-drive?focus=waitlist"
                      project="saheeb_drive"
                    >
                      {tNavigation('joinWaitlist')}
                    </TrackedLink>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/projects/saheeb-drive">
                      {t('saheebDrive.cta')}
                    </Link>
                  </Button>
                </div>
              </motion.div>

              {/* Visual */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#222225]">
                  <Image
                    src="/images/saheeb-drive-hero.jpg"
                    alt={t('saheebDrive.title')}
                    fill
                    className="object-cover opacity-90"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/60 to-transparent" />
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* More Coming Soon */}
        <section className="py-20 lg:py-28 bg-[#111113]">
          <Container size="md">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#19191B] border border-[#222225] flex items-center justify-center">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-[#5C5C63]"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#8F8F96] mb-3">
                {t('moreComing.title')}
              </h3>
              <p className="text-[#5C5C63] max-w-md mx-auto">
                {t('moreComing.description')}
              </p>
            </motion.div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-24 lg:py-32 bg-[#09090B] border-t border-[#1A1A1D]">
          <Container size="md" className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-[#EDEDEF] mb-6">
                {isArabic
                  ? 'انضم لقائمة انتظار صاحب درايف'
                  : 'Join the Saheeb Drive Waitlist'}
              </h2>
              <p className="text-xl text-[#8F8F96] max-w-xl mx-auto mb-10">
                {isArabic
                  ? 'منتجنا الأولوي الآن. سجّل مبكراً إذا كنت تنوي الشراء أو البيع في مسقط.'
                  : 'Saheeb Drive is our priority launch right now. Join early if you plan to buy or sell in Muscat.'}
              </p>
              <Button asChild size="lg" variant="primary">
                <TrackedLink
                  href="/projects/saheeb-drive?focus=waitlist"
                  ctaLocation="projects_footer_join_waitlist"
                  destinationPath="/projects/saheeb-drive?focus=waitlist"
                  project="saheeb_drive"
                >
                  {tNavigation('joinWaitlist')}
                </TrackedLink>
              </Button>
            </motion.div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
