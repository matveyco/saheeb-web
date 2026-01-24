'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Input, Select, Checkbox, Button } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import { OMAN_CITIES } from '@/lib/constants';

interface FormData {
  name: string;
  phone: string;
  email: string;
  userType: string;
  city: string;
  consent: boolean;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  userType?: string;
  city?: string;
  consent?: string;
}

export function WaitlistForm() {
  const t = useTranslations('saheebDrive.waitlist.form');
  const tValidation = useTranslations('validation');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    userType: '',
    city: '',
    consent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const cityOptions = OMAN_CITIES.map((city) => ({
    value: city.en.toLowerCase(),
    label: isArabic ? city.ar : city.en,
  }));

  const userTypeOptions = [
    { value: 'buyer', label: t('userTypes.buyer') },
    { value: 'seller', label: t('userTypes.seller') },
    { value: 'dealer', label: t('userTypes.dealer') },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = tValidation('required');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = tValidation('required');
    } else if (!/^\+?[\d\s-]{8,}$/.test(formData.phone)) {
      newErrors.phone = tValidation('phone');
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = tValidation('email');
    }

    if (!formData.userType) {
      newErrors.userType = tValidation('required');
    }

    if (!formData.city) {
      newErrors.city = tValidation('required');
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
      const response = await fetch('/api/waitlist', {
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
          phone: '',
          email: '',
          userType: '',
          city: '',
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
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-600"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-neutral-900 mb-2">
          {t('success.title')}
        </h3>
        <p className="text-neutral-600">{t('success.message')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {t('error.message')}
        </div>
      )}

      <Input
        name="name"
        label={t('name')}
        placeholder={t('namePlaceholder')}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        required
      />

      <Input
        name="phone"
        type="tel"
        label={t('phone')}
        placeholder={t('phonePlaceholder')}
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        error={errors.phone}
        required
      />

      <Input
        name="email"
        type="email"
        label={`${t('email')} (${isArabic ? 'اختياري' : 'Optional'})`}
        placeholder={t('emailPlaceholder')}
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
      />

      <Select
        name="userType"
        label={t('userType')}
        placeholder={isArabic ? 'اختر...' : 'Select...'}
        options={userTypeOptions}
        value={formData.userType}
        onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
        error={errors.userType}
        required
      />

      <Select
        name="city"
        label={t('city')}
        placeholder={t('cityPlaceholder')}
        options={cityOptions}
        value={formData.city}
        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        error={errors.city}
        required
      />

      <Checkbox
        name="consent"
        label={t('consent')}
        checked={formData.consent}
        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
        error={errors.consent}
      />

      <p className="text-xs text-neutral-500">
        <Link href="/privacy" className="text-primary-600 hover:underline">
          {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
        </Link>
      </p>

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        {isSubmitting ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
