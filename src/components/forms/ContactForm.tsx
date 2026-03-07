'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Input, Textarea, Button } from '@/components/ui';
import { Link } from '@/i18n/navigation';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  consent?: string;
}

export function ContactForm() {
  const t = useTranslations('contact.form');
  const tValidation = useTranslations('validation');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    consent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = tValidation('required');
    }

    if (!formData.email.trim()) {
      newErrors.email = tValidation('required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = tValidation('email');
    }

    if (!formData.message.trim()) {
      newErrors.message = tValidation('required');
    } else if (formData.message.length < 10) {
      newErrors.message = tValidation('minLength').replace('{min}', '10');
    }

    if (!formData.consent) {
      newErrors.consent = tValidation('consent');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          locale,
          consentTimestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          consent: false,
        });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-emerald-400"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#EDEDEF] mb-2">
          {t('success.title')}
        </h3>
        <p className="text-[#8F8F96]">{t('success.message')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitStatus === 'error' && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {t('error.message')}
        </div>
      )}

      <Input
        name="name"
        placeholder={t('namePlaceholder')}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        required
      />

      <Input
        name="email"
        type="email"
        placeholder={t('emailPlaceholder')}
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        required
        dir="ltr"
      />

      <Input
        name="phone"
        type="tel"
        placeholder={t('phonePlaceholder')}
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        error={errors.phone}
        dir="ltr"
      />

      <Textarea
        name="message"
        placeholder={t('messagePlaceholder')}
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        error={errors.message}
        required
        rows={4}
      />

      {/* Consent with inline privacy link */}
      <div className="pt-2">
        <label className="flex items-start gap-3 cursor-pointer text-start">
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
            className="mt-0.5 w-5 h-5 rounded border-[#222225] bg-[#111113] text-[#C9A87C] focus:ring-[#C9A87C]/50 focus:ring-offset-0"
          />
          <span className="text-sm text-[#5C5C63]">
            {isArabic ? (
              <>
                أوافق على معالجة بياناتي وفقًا لـ{' '}
                <Link href="/privacy" className="text-[#C9A87C] hover:text-[#EDEDEF] transition-colors">
                  سياسة الخصوصية
                </Link>
              </>
            ) : (
              <>
                I agree to the{' '}
                <Link href="/privacy" className="text-[#C9A87C] hover:text-[#EDEDEF] transition-colors">
                  Privacy Policy
                </Link>
              </>
            )}
          </span>
        </label>
        {errors.consent && (
          <p className="text-red-400 text-sm mt-2 text-start ps-7">{errors.consent}</p>
        )}
      </div>

      <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
        {isSubmitting ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
