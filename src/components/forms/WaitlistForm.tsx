'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Input, Button } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import { useAnalyticsConsent } from '@/components/analytics/AnalyticsProvider';
import { readAttributionSnapshot } from '@/lib/attribution';
import { recordFunnelEvent } from '@/lib/funnel';
import { trackEvent } from '@/lib/analytics';
import {
  DRIVE_WAITLIST_EVENT,
  type DriveWaitlistEventDetail,
} from '@/components/sections/drive/events';
import { cn } from '@/lib/utils';

type WaitlistUserType = 'buyer' | 'seller';

interface WaitlistFormData {
  name: string;
  email: string;
  phone: string;
  userType: WaitlistUserType;
  consent: boolean;
}

interface WaitlistFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  consent?: string;
}

interface WaitlistFormProps {
  sectionId?: string;
  className?: string;
}

const FORM_NAME = 'saheeb_drive_waitlist';
const PHONE_REGEX = /^\+?[0-9\s\-()]{8,20}$/;

function getIntentFromSearchParams(searchParams: URLSearchParams | null) {
  return searchParams?.get('intent') === 'seller' ? 'seller' : 'buyer';
}

export function WaitlistForm({
  sectionId = 'drive-waitlist',
  className,
}: WaitlistFormProps) {
  const t = useTranslations('saheebDrive.waitlist');
  const tValidation = useTranslations('validation');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const searchParams = useSearchParams();
  const { isBannerOpen } = useAnalyticsConsent();

  const [formData, setFormData] = useState<WaitlistFormData>({
    name: '',
    email: '',
    phone: '',
    userType: getIntentFromSearchParams(searchParams),
    consent: false,
  });
  const [errors, setErrors] = useState<WaitlistFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const hasTrackedFormStart = useRef(false);
  const hasTrackedWaitlistView = useRef(false);

  const openWaitlist = (intent?: WaitlistUserType) => {
    if (intent) {
      setFormData((current) => ({ ...current, userType: intent }));
    }

    sectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    window.setTimeout(() => {
      nameInputRef.current?.focus();
    }, 150);
  };

  useEffect(() => {
    const intent = getIntentFromSearchParams(searchParams);
    setFormData((current) => ({ ...current, userType: intent }));
  }, [searchParams]);

  useEffect(() => {
    const focus = searchParams?.get('focus');
    if (focus !== 'waitlist') {
      return;
    }

    openWaitlist(getIntentFromSearchParams(searchParams));
  }, [searchParams]);

  useEffect(() => {
    const handleOpenWaitlist = (event: Event) => {
      const customEvent = event as CustomEvent<DriveWaitlistEventDetail>;
      openWaitlist(customEvent.detail?.intent);
    };

    window.addEventListener(
      DRIVE_WAITLIST_EVENT,
      handleOpenWaitlist as EventListener
    );

    return () => {
      window.removeEventListener(
        DRIVE_WAITLIST_EVENT,
        handleOpenWaitlist as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasTrackedWaitlistView.current) {
          return;
        }

        hasTrackedWaitlistView.current = true;
        recordFunnelEvent({
          eventName: 'waitlist_view',
          siteLocale: locale,
          userType: formData.userType,
          formName: FORM_NAME,
          payload: {
            form_name: FORM_NAME,
            project: 'saheeb_drive',
            page_group: 'saheeb_drive',
            site_locale: locale,
          },
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [formData.userType, locale]);

  const trackFormStart = () => {
    if (hasTrackedFormStart.current) {
      return;
    }

    hasTrackedFormStart.current = true;
    recordFunnelEvent({
      eventName: 'form_start',
      siteLocale: locale,
      userType: formData.userType,
      formName: FORM_NAME,
      analyticsEventName: 'form_start',
      analyticsParams: {
        form_name: FORM_NAME,
        page_group: 'saheeb_drive',
        project: 'saheeb_drive',
        site_locale: locale,
      },
      payload: {
        form_name: FORM_NAME,
        project: 'saheeb_drive',
        site_locale: locale,
      },
    });
  };

  const validateForm = () => {
    const nextErrors: WaitlistFormErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = tValidation('required');
    }

    if (!formData.email.trim()) {
      nextErrors.email = tValidation('required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = tValidation('email');
    }

    if (formData.phone.trim() && !PHONE_REGEX.test(formData.phone)) {
      nextErrors.phone = tValidation('phone');
    }

    if (!formData.consent) {
      nextErrors.consent = tValidation('consent');
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      recordFunnelEvent({
        eventName: 'validation_error',
        siteLocale: locale,
        userType: formData.userType,
        formName: FORM_NAME,
        errorStage: 'client',
        payload: {
          error_count: Object.keys(nextErrors).length,
          error_fields: Object.keys(nextErrors).join(','),
          form_name: FORM_NAME,
        },
      });
    }

    return Object.keys(nextErrors).length === 0;
  };

  const handleCopyLink = async () => {
    if (typeof window === 'undefined' || !navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href.split('?')[0]);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 2500);
    } catch {}
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const attribution = readAttributionSnapshot();

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          locale,
          utmSource: attribution?.utmSource ?? '',
          utmMedium: attribution?.utmMedium ?? '',
          utmCampaign: attribution?.utmCampaign ?? '',
          utmContent: attribution?.utmContent ?? '',
          referrer: attribution?.referrer ?? '',
          landingPath: attribution?.landingPath ?? window.location.pathname,
          consentTimestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;

        recordFunnelEvent({
          eventName: 'validation_error',
          siteLocale: locale,
          userType: formData.userType,
          formName: FORM_NAME,
          errorStage:
            response.status === 400 || response.status === 429
              ? 'response'
              : 'network',
          payload: {
            form_name: FORM_NAME,
            response_status: response.status,
          },
        });

        setSubmitError(payload?.error ?? t('error.message'));
        return;
      }

      trackEvent('waitlist_submit_success', {
        form_name: FORM_NAME,
        page_group: 'saheeb_drive',
        project: 'saheeb_drive',
        site_locale: locale,
        user_type: formData.userType,
      });

      setIsSuccess(true);
    } catch {
      recordFunnelEvent({
        eventName: 'validation_error',
        siteLocale: locale,
        userType: formData.userType,
        formName: FORM_NAME,
        errorStage: 'network',
        payload: {
          form_name: FORM_NAME,
        },
      });
      setSubmitError(t('error.message'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareUrl =
    typeof window !== 'undefined'
      ? window.location.href.split('?')[0]
      : `https://saheeb.com/${locale}/projects/saheeb-drive`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `${t('success.shareText')} ${shareUrl}`
  )}`;

  return (
    <div
      id={sectionId}
      ref={sectionRef}
      className={cn(
        'scroll-mt-24 lg:scroll-mt-32',
        isBannerOpen ? 'pb-32 sm:pb-36' : '',
        className
      )}
    >
      {isSuccess ? (
        <div className="rounded-[2rem] border border-emerald-500/20 bg-[#111113] p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-[#EDEDEF]">
            {t('success.title')}
          </h3>
          <p className="mt-3 text-[#8F8F96]">{t('success.message')}</p>
          <p className="mt-2 text-sm text-[#C9A87C]">
            {t('success.launchNote')}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#C9A87C] px-5 py-3 text-sm font-semibold text-[#09090B] transition-colors hover:bg-[#D4B78E]"
            >
              {t('success.shareWhatsapp')}
            </a>
            <Button type="button" variant="secondary" onClick={handleCopyLink}>
              {isCopied ? t('success.copied') : t('success.copyLink')}
            </Button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          onFocusCapture={trackFormStart}
          className="space-y-5"
        >
          <div className="rounded-[2rem] border border-[#222225] bg-[#111113] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#C9A87C]">
                {t('eyebrow')}
              </p>
              <h3 className="mt-3 text-2xl font-bold text-[#EDEDEF]">
                {t('title')}
              </h3>
              <p className="mt-3 text-[#8F8F96]">{t('subtitle')}</p>
            </div>

            <div className="mb-6 rounded-2xl border border-[#222225] bg-[#09090B] p-2">
              <p className="px-3 pb-2 text-sm text-[#8F8F96]">
                {t('buyOrSell')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((current) => ({
                      ...current,
                      userType: 'buyer',
                    }))
                  }
                  className={cn(
                    'rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
                    formData.userType === 'buyer'
                      ? 'bg-[#C9A87C] text-[#09090B]'
                      : 'bg-[#111113] text-[#8F8F96] hover:text-[#EDEDEF]'
                  )}
                >
                  {t('buy')}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((current) => ({
                      ...current,
                      userType: 'seller',
                    }))
                  }
                  className={cn(
                    'rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
                    formData.userType === 'seller'
                      ? 'bg-[#C9A87C] text-[#09090B]'
                      : 'bg-[#111113] text-[#8F8F96] hover:text-[#EDEDEF]'
                  )}
                >
                  {t('sell')}
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              <Input
                ref={nameInputRef}
                name="name"
                placeholder={t('namePlaceholder')}
                value={formData.name}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                error={errors.name}
                required
                autoComplete="name"
              />

              <Input
                name="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                value={formData.email}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                error={errors.email}
                required
                autoComplete="email"
                dir="ltr"
              />

              <Input
                name="phone"
                type="tel"
                placeholder={`${t('phonePlaceholder')} (${isArabic ? 'اختياري' : 'Optional'})`}
                value={formData.phone}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                error={errors.phone}
                autoComplete="tel"
                dir="ltr"
              />
            </div>

            <div className="mt-5">
              <label className="flex cursor-pointer items-start gap-3 text-start">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      consent: event.target.checked,
                    }))
                  }
                  className="mt-0.5 h-5 w-5 rounded border-[#222225] bg-[#19191B] text-[#C9A87C] focus:ring-[#C9A87C]/50 focus:ring-offset-0"
                />
                <span className="text-sm leading-relaxed text-[#5C5C63]">
                  {isArabic ? (
                    <>
                      {t('consentPrefix')}{' '}
                      <Link
                        href="/privacy"
                        className="text-[#C9A87C] transition-colors hover:text-[#EDEDEF]"
                      >
                        {t('privacy')}
                      </Link>
                    </>
                  ) : (
                    <>
                      {t('consentPrefix')}{' '}
                      <Link
                        href="/privacy"
                        className="text-[#C9A87C] transition-colors hover:text-[#EDEDEF]"
                      >
                        {t('privacy')}
                      </Link>
                    </>
                  )}
                </span>
              </label>

              {errors.consent ? (
                <p className="mt-2 ps-7 text-sm text-red-400">
                  {errors.consent}
                </p>
              ) : null}
            </div>

            {submitError ? (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                {submitError}
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-[#5C5C63]">
                {t('privacyNote')}
              </p>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? t('submitting') : t('submit')}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
