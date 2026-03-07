'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Header, Footer } from '@/components/layout';
import { Container, Badge, Button } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function SaheebDrivePage() {
  const t = useTranslations('saheebDrive');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  // Get arrays from translations
  const howItWorksSteps = t.raw('howItWorks.steps') as Array<{
    number: string;
    title: string;
    description: string;
  }>;
  const faqItems = t.raw('faq.items') as Array<{ question: string; answer: string }>;

  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-24">
        {/* Hero Section - App Focus */}
        <section className="py-12 lg:py-24 bg-[#09090B] relative overflow-hidden">
          {/* Background Image - faded */}
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <Image
              src="/images/saheeb-drive-hero-bg.png"
              alt=""
              fill
              className="object-cover object-center opacity-20"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#09090B]/60 via-[#09090B]/40 to-[#09090B]" />
          </div>

          <Container className="relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`text-center lg:text-start ${isArabic ? 'lg:order-2' : ''}`}
              >
                <Badge variant="accent" className="mb-6">
                  {t('hero.badge')}
                </Badge>

                <h1 className="text-5xl lg:text-7xl font-bold text-[#EDEDEF] mb-2">
                  {t('hero.title')}
                </h1>
                <p className="text-5xl lg:text-7xl font-bold text-[#C9A87C] mb-8">
                  {t('hero.titleHighlight')}
                </p>

                <Link href="/projects/saheeb-drive/waitlist">
                  <Button variant="primary" size="lg" className="mb-6">
                    {t('hero.cta')}
                  </Button>
                </Link>

                {/* App Store Badges */}
                <div className="flex items-center justify-center lg:justify-start gap-4 opacity-60">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#111113] border border-[#222225]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#8F8F96]">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    <span className="text-[#8F8F96] text-sm">{t('hero.appStore')}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#111113] border border-[#222225]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#8F8F96]">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                    </svg>
                    <span className="text-[#8F8F96] text-sm">{t('hero.playStore')}</span>
                  </div>
                </div>
              </motion.div>

              {/* Phone Mockup */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className={isArabic ? 'lg:order-1' : ''}
              >
                <div className="relative mx-auto max-w-[320px]">
                  {/* Phone frame */}
                  <div className="relative bg-[#19191B] rounded-[1.5rem] p-[6px] shadow-2xl border border-[#333338]">
                    <div className="relative aspect-[9/19] rounded-[1.25rem] overflow-hidden bg-[#111113]">
                      <Image
                        src="/images/saheeb-drive-app-chat.png"
                        alt="Saheeb Drive App - Chat Interface"
                        fill
                        className="object-contain"
                        sizes="320px"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* How It Works - Merged meaningful section */}
        <section className="py-12 lg:py-28 bg-[#09090B] border-t border-[#1A1A1D]">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-[#EDEDEF] mb-4">
                {t('howItWorks.title')}
              </h2>
              <p className="text-lg text-[#8F8F96] max-w-2xl mx-auto">
                {t('howItWorks.subtitle')}
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Phone mockup on one side */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={isArabic ? 'lg:order-2' : ''}
              >
                <div className="relative mx-auto max-w-[280px]">
                  <div className="relative bg-[#19191B] rounded-[1.25rem] p-[5px] shadow-xl border border-[#333338]">
                    <div className="relative aspect-[9/19] rounded-[1rem] overflow-hidden bg-[#111113]">
                      <Image
                        src="/images/saheeb-drive-app-details.png"
                        alt="Saheeb Drive App - Car Details"
                        fill
                        className="object-contain"
                        sizes="280px"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Steps on the other side */}
              <div className={`space-y-8 ${isArabic ? 'lg:order-1' : ''}`}>
                {howItWorksSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="shrink-0 w-12 h-12 rounded-full bg-[#C9A87C] flex items-center justify-center text-lg font-bold text-[#09090B]">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#EDEDEF] mb-2">{step.title}</h3>
                      <p className="text-[#8F8F96] leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="pt-4"
                >
                  <Link href="/projects/saheeb-drive/waitlist">
                    <Button variant="primary" size="lg">
                      {t('howItWorks.cta')}
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </Container>
        </section>
        <section className="py-10 lg:py-14 bg-[#09090B] border-t border-[#1A1A1D]">
          <Container size="sm">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-[#EDEDEF] mb-3">
                {t('waitlist.title')}
              </h2>
              <p className="text-[#8F8F96] mb-6">
                {t('waitlist.subtitle')}
              </p>
              <Link href="/projects/saheeb-drive/waitlist">
                <Button variant="primary" size="lg">
                  {t('waitlist.submit')}
                </Button>
              </Link>
            </motion.div>
          </Container>
        </section>

        {/* FAQ Section */}
        <section className="py-12 lg:py-24 bg-[#09090B] border-t border-[#1A1A1D]">
          <Container size="md">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center mb-10"
            >
              <h3 className="text-2xl lg:text-3xl font-bold text-[#EDEDEF]">{t('faq.title')}</h3>
            </motion.div>

            <div className="space-y-3 mb-12">
              {faqItems.map((item, index) => (
                <motion.details
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group bg-[#111113] rounded-xl border border-[#222225] overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-[#19191B] transition-colors">
                    <span className="font-medium text-[#EDEDEF]">{item.question}</span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[#C9A87C] group-open:rotate-180 transition-transform shrink-0 ms-4"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-5 text-[#8F8F96] leading-relaxed">
                    {item.answer}
                  </div>
                </motion.details>
              ))}
            </div>

            {/* Footer info */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center pt-8 border-t border-[#1A1A1D]"
            >
              <p className="text-[#C9A87C] font-semibold mb-4">{t('footer.launching')}</p>
              <Link
                href="/privacy"
                className="text-[#5C5C63] hover:text-[#8F8F96] text-sm transition-colors"
              >
                {t('footer.privacy')}
              </Link>
            </motion.div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
