'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Header, Footer } from '@/components/layout';
import { Container, Button } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';

type WaitlistUserType = 'buyer' | 'seller';

interface WaitlistFormData {
  name: string;
  email: string;
  phone: string;
  userType: WaitlistUserType;
  city: string;
  consent: boolean;
}

const DEFAULT_CITY = 'muscat';

export default function WaitlistClientPage() {
  const t = useTranslations('saheebDrive');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const [formData, setFormData] = useState<WaitlistFormData>({
    name: '',
    email: '',
    phone: '',
    userType: 'buyer',
    city: DEFAULT_CITY,
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.consent) {
      setSubmitError(t('waitlist.consentRequired'));
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          locale,
          consentTimestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setSubmitError(payload?.error ?? t('waitlist.error.message'));
        return;
      }

      setIsSuccess(true);
    } catch {
      setSubmitError(t('waitlist.error.message'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-24 bg-[#0A0E1A] min-h-screen">
        <section className="py-10 lg:py-16">
          <Container size="sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl mx-auto"
            >
              <Link
                href="/projects/saheeb-drive"
                className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm mb-6"
              >
                <span aria-hidden="true">←</span>
                {isArabic ? 'العودة إلى صاحب درايف' : 'Back to Saheeb Drive'}
              </Link>

              {isSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-emerald-400"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {t('waitlist.success.title')}
                  </h1>
                  <p className="text-white/60 mb-8">
                    {t('waitlist.success.message')}
                  </p>
                  <Link href="/projects/saheeb-drive">
                    <Button variant="gold" size="lg">
                      {isArabic ? 'استكشف صاحب درايف' : 'Explore Saheeb Drive'}
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 text-center">
                    {t('waitlist.title')}
                  </h1>
                  <p className="text-white/60 mb-8 text-center">
                    {t('waitlist.subtitle')}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder={t('waitlist.namePlaceholder')}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                    />

                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder={t('waitlist.phonePlaceholder')}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                      dir="ltr"
                    />

                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder={`${t('waitlist.emailPlaceholder')} (${isArabic ? 'اختياري' : 'Optional'})`}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                      dir="ltr"
                    />

                    <div className="flex items-center justify-center gap-4">
                      <span className="text-white/60">{t('waitlist.buyOrSell')}</span>
                      <div className="flex rounded-xl overflow-hidden border border-white/10">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, userType: 'buyer' })
                          }
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
                          onClick={() =>
                            setFormData({ ...formData, userType: 'seller' })
                          }
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

                    <div className="pt-2">
                      <label className="flex items-start gap-3 cursor-pointer text-start">
                        <input
                          type="checkbox"
                          checked={formData.consent}
                          onChange={(e) =>
                            setFormData({ ...formData, consent: e.target.checked })
                          }
                          className="mt-0.5 w-5 h-5 rounded border-white/20 bg-white/5 text-[#D4AF37] focus:ring-[#D4AF37]/50 focus:ring-offset-0"
                        />
                        <span className="text-sm text-white/50">
                          {t('waitlist.consent')}
                        </span>
                      </label>
                    </div>

                    {submitError && (
                      <p className="text-red-400 text-sm text-start">
                        {submitError}
                      </p>
                    )}

                    <p className="text-xs text-white/40 text-center">
                      <Link
                        href="/privacy"
                        className="text-[#D4AF37] hover:text-[#F4D03F] transition-colors"
                      >
                        {t('footer.privacy')}
                      </Link>
                    </p>

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
      </main>
      <Footer />
    </>
  );
}
