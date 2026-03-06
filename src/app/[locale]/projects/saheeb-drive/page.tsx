'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Header, Footer } from '@/components/layout';
import { Container, Badge, Button } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

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

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    userType: 'buyer',
    city: 'muscat',
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [consentError, setConsentError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      setConsentError(true);
      return;
    }
    setConsentError(false);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          userType: formData.userType,
          city: formData.city,
          consent: formData.consent,
          locale,
          consentTimestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
      }
    } catch {
      // Handle error silently
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-24">
        {/* Hero Section - App Focus */}
        <section className="py-16 lg:py-24 bg-[#0A0E1A] relative overflow-hidden">
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
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E1A]/60 via-[#0A0E1A]/40 to-[#0A0E1A]" />
          </div>

          {/* Decorative glow */}
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(212, 175, 55, 0.12) 0%, transparent 60%)',
            }}
            aria-hidden="true"
          />

          <Container className="relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`text-center lg:text-start ${isArabic ? 'lg:order-2' : ''}`}
              >
                <Badge variant="glow" className="mb-6">
                  {t('hero.badge')}
                </Badge>

                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-2">
                  {t('hero.title')}
                </h1>
                <p className="text-5xl lg:text-7xl font-bold text-[#D4AF37] mb-8">
                  {t('hero.titleHighlight')}
                </p>

                <Button variant="gold" size="lg" onClick={scrollToWaitlist} className="mb-6">
                  {t('hero.cta')}
                </Button>

                {/* App Store Badges */}
                <div className="flex items-center justify-center lg:justify-start gap-4 opacity-60">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white/60">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    <span className="text-white/60 text-sm">{t('hero.appStore')}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white/60">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                    </svg>
                    <span className="text-white/60 text-sm">{t('hero.playStore')}</span>
                  </div>
                </div>
              </motion.div>

              {/* Phone Mockup */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={isArabic ? 'lg:order-1' : ''}
              >
                <div className="relative mx-auto max-w-[320px]">
                  {/* Phone frame glow */}
                  <div
                    className="absolute inset-0 rounded-[3rem]"
                    style={{
                      background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)',
                      filter: 'blur(40px)',
                      transform: 'scale(1.2)',
                    }}
                  />

                  {/* Phone frame - minimal to match image's square corners */}
                  <div className="relative bg-gradient-to-b from-gray-700 to-gray-900 rounded-[1.5rem] p-[6px] shadow-2xl border border-white/20">
                    <div className="relative aspect-[9/19] rounded-[1.25rem] overflow-hidden bg-[#0F1629]">
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
        <section className="py-20 lg:py-28 bg-gradient-to-b from-[#0F1629] to-[#0A0E1A]">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
                {t('howItWorks.title')}
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                {t('howItWorks.subtitle')}
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Phone mockup on one side */}
              <motion.div
                initial={{ opacity: 0, x: isArabic ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={isArabic ? 'lg:order-2' : ''}
              >
                <div className="relative mx-auto max-w-[280px]">
                  <div
                    className="absolute inset-0 rounded-[3rem]"
                    style={{
                      background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
                      filter: 'blur(30px)',
                      transform: 'scale(1.1)',
                    }}
                  />
                  <div className="relative bg-gradient-to-b from-gray-700 to-gray-900 rounded-[1.25rem] p-[5px] shadow-xl border border-white/20">
                    <div className="relative aspect-[9/19] rounded-[1rem] overflow-hidden bg-[#0F1629]">
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
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="flex gap-4"
                  >
                    <div className="shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-lg font-bold text-[#0A0E1A] shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-white/60 leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="pt-4"
                >
                  <Button variant="gold" size="lg" onClick={scrollToWaitlist}>
                    {t('howItWorks.cta')}
                  </Button>
                </motion.div>
              </div>
            </div>
          </Container>
        </section>

        {/* Waitlist - Form with email + consent */}
        <section className="py-20 lg:py-28 bg-[#0A0E1A]" id="waitlist">
          <Container size="sm">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              {isSuccess ? (
                <div className="py-12">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">{t('waitlist.success.title')}</h2>
                  <p className="text-white/60">{t('waitlist.success.message')}</p>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    {t('waitlist.title')}
                  </h2>
                  <p className="text-white/60 mb-10">{t('waitlist.subtitle')}</p>

                  <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                    {/* Name */}
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t('waitlist.namePlaceholder')}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                    />

                    {/* Email */}
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t('waitlist.emailPlaceholder')}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                      dir="ltr"
                    />

                    {/* Phone */}
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={t('waitlist.phonePlaceholder')}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                      dir="ltr"
                    />

                    {/* Buy or Sell Toggle */}
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-white/60">{t('waitlist.buyOrSell')}</span>
                      <div className="flex rounded-xl overflow-hidden border border-white/10">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, userType: 'buyer' })}
                          className={`px-5 py-2 text-sm font-medium transition-colors ${
                            formData.userType === 'buyer'
                              ? 'bg-[#D4AF37] text-[#0A0E1A]'
                              : 'bg-white/5 text-white/60 hover:text-white'
                          }`}
                        >
                          {t('waitlist.buy')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, userType: 'seller' })}
                          className={`px-5 py-2 text-sm font-medium transition-colors ${
                            formData.userType === 'seller'
                              ? 'bg-[#D4AF37] text-[#0A0E1A]'
                              : 'bg-white/5 text-white/60 hover:text-white'
                          }`}
                        >
                          {t('waitlist.sell')}
                        </button>
                      </div>
                    </div>

                    {/* Consent Checkbox */}
                    <div className="pt-2">
                      <label className="flex items-start gap-3 cursor-pointer text-start">
                        <input
                          type="checkbox"
                          checked={formData.consent}
                          onChange={(e) => {
                            setFormData({ ...formData, consent: e.target.checked });
                            if (e.target.checked) setConsentError(false);
                          }}
                          className="mt-0.5 w-5 h-5 rounded border-white/20 bg-white/5 text-[#D4AF37] focus:ring-[#D4AF37]/50 focus:ring-offset-0"
                        />
                        <span className="text-sm text-white/50">
                          {t('waitlist.consent')}
                        </span>
                      </label>
                      {consentError && (
                        <p className="text-red-400 text-sm mt-2 text-start ps-7">
                          {t('waitlist.consentRequired')}
                        </p>
                      )}
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      variant="gold"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? t('waitlist.submitting') : t('waitlist.submit')}
                    </Button>
                  </form>
                </>
              )}
            </motion.div>
          </Container>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-[#0F1629] to-[#0A0E1A]">
          <Container size="md">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <h3 className="text-2xl lg:text-3xl font-bold text-white">{t('faq.title')}</h3>
            </motion.div>

            <div className="space-y-3 mb-12">
              {faqItems.map((item, index) => (
                <motion.details
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group bg-white/[0.03] rounded-xl border border-white/[0.08] overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/[0.02] transition-colors">
                    <span className="font-medium text-white">{item.question}</span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[#D4AF37] group-open:rotate-180 transition-transform shrink-0 ms-4"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-5 text-white/60 leading-relaxed">
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
              transition={{ duration: 0.5 }}
              className="text-center pt-8 border-t border-white/[0.06]"
            >
              <p className="text-[#D4AF37] font-semibold mb-4">{t('footer.launching')}</p>
              <Link
                href="/privacy"
                className="text-white/40 hover:text-white/60 text-sm transition-colors"
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
