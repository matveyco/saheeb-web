'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Input, Button } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import { readAttributionSnapshot } from '@/lib/attribution';
import {
  createAnalyticsEventId,
  ensureAnalyticsIdentity,
} from '@/lib/analytics-identity';
import { recordFunnelEvent } from '@/lib/funnel';
import { getPageVariant, type PageVariant } from '@/lib/page-variant';
import { trackEvent } from '@/lib/analytics';
import {
  dispatchDriveIntentEvent,
  DRIVE_INTENT_EVENT,
  DRIVE_WAITLIST_EVENT,
  type DriveWaitlistEventDetail,
} from '@/components/sections/drive/events';
import type { DriveIntent } from '@/lib/drive-search-params';
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
  pageVariant?: PageVariant;
  initialIntent?: DriveIntent;
  hasPresetIntent?: boolean;
  shouldFocusWaitlist?: boolean;
}

const FORM_NAME = 'saheeb_drive_waitlist';
const PHONE_REGEX = /^\+?[0-9\s\-()]{8,20}$/;

function getResolvedPageVariant(pageVariant?: PageVariant) {
  if (pageVariant) {
    return pageVariant;
  }

  if (typeof window === 'undefined') {
    return 'organic_main';
  }

  return getPageVariant(window.location.pathname) ?? 'organic_main';
}

export function WaitlistForm({
  sectionId = 'drive-waitlist',
  className,
  pageVariant,
  initialIntent = 'buyer',
  hasPresetIntent = false,
  shouldFocusWaitlist = false,
}: WaitlistFormProps) {
  const t = useTranslations('saheebDrive.waitlist');
  const tValidation = useTranslations('validation');
  const locale = useLocale();

  const [formData, setFormData] = useState<WaitlistFormData>({
    name: '',
    email: '',
    phone: '',
    userType: initialIntent,
    consent: false,
  });
  const [intentSource, setIntentSource] = useState<string>(
    hasPresetIntent ? 'query_param' : 'direct_view'
  );
  const [errors, setErrors] = useState<WaitlistFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const sectionTitleRef = useRef<HTMLHeadingElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const hasTrackedFormStart = useRef(false);
  const hasTrackedWaitlistView = useRef(false);

  const resolvedPageVariant = getResolvedPageVariant(pageVariant);

  const updateField = (field: keyof WaitlistFormData, value: string | boolean) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      if (!current[field as keyof WaitlistFormErrors]) {
        return current;
      }

      return {
        ...current,
        [field]: undefined,
      };
    });
  };

  const scrollWaitlistIntoView = useCallback(() => {
    const target = sectionTitleRef.current ?? sectionRef.current;
    if (!target || typeof window === 'undefined') {
      return;
    }

    const offset = window.innerWidth < 640 ? 92 : 116;
    const top =
      target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: 'auto',
    });
  }, []);

  const openWaitlist = useCallback((intent?: WaitlistUserType, source?: string) => {
    if (intent) {
      setFormData((current) => ({ ...current, userType: intent }));
      setIntentSource(source ?? 'query_param');
    }

    scrollWaitlistIntoView();

    window.setTimeout(() => {
      nameInputRef.current?.focus({ preventScroll: true });
    }, 220);
  }, [scrollWaitlistIntoView]);

  const handleIntentSelection = (
    nextIntent: WaitlistUserType,
    source = 'form_toggle'
  ) => {
    setFormData((current) => ({ ...current, userType: nextIntent }));
    setIntentSource(source);

    dispatchDriveIntentEvent({
      intent: nextIntent,
      source,
    });
  };

  useEffect(() => {
    if (!shouldFocusWaitlist) {
      return;
    }

    openWaitlist(
      initialIntent,
      hasPresetIntent ? 'query_param' : 'direct_view'
    );
  }, [hasPresetIntent, initialIntent, openWaitlist, shouldFocusWaitlist]);

  useEffect(() => {
    const handleOpenWaitlist = (event: Event) => {
      const customEvent = event as CustomEvent<DriveWaitlistEventDetail>;
      openWaitlist(customEvent.detail?.intent, customEvent.detail?.source);
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
  }, [openWaitlist]);

  useEffect(() => {
    const handleIntentUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<DriveWaitlistEventDetail>;
      const nextIntent = customEvent.detail?.intent;

      if (!nextIntent) {
        return;
      }

      setFormData((current) => ({ ...current, userType: nextIntent }));
      if (customEvent.detail?.source) {
        setIntentSource(customEvent.detail.source);
      }
    };

    window.addEventListener(
      DRIVE_INTENT_EVENT,
      handleIntentUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        DRIVE_INTENT_EVENT,
        handleIntentUpdate as EventListener
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
          pageVariant: resolvedPageVariant,
          intentSource,
          payload: {
            form_name: FORM_NAME,
            page_variant: resolvedPageVariant,
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
  }, [formData.userType, intentSource, locale, resolvedPageVariant]);

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
      pageVariant: resolvedPageVariant,
      intentSource,
      analyticsEventName: 'form_start',
      analyticsParams: {
        form_name: FORM_NAME,
        page_group: 'saheeb_drive',
        page_variant: resolvedPageVariant,
        project: 'saheeb_drive',
        site_locale: locale,
      },
      payload: {
        form_name: FORM_NAME,
        page_variant: resolvedPageVariant,
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
        pageVariant: resolvedPageVariant,
        intentSource,
        payload: {
          error_count: Object.keys(nextErrors).length,
          error_fields: Object.keys(nextErrors).join(','),
          form_name: FORM_NAME,
          page_variant: resolvedPageVariant,
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
      recordFunnelEvent({
        eventName: 'share_click',
        siteLocale: locale,
        userType: formData.userType,
        ctaLocation: 'waitlist_success_copy_link',
        destinationPath: window.location.href.split('?')[0],
        project: 'saheeb_drive',
        pageVariant: resolvedPageVariant,
        intentSource,
        payload: {
          page_variant: resolvedPageVariant,
          share_destination: 'copy_link',
        },
      });
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
    const analyticsIdentity = ensureAnalyticsIdentity();
    const eventId = createAnalyticsEventId('waitlist');

    recordFunnelEvent({
      eventName: 'form_submit_attempt',
      siteLocale: locale,
      userType: formData.userType,
      formName: FORM_NAME,
      pageVariant: resolvedPageVariant,
      eventId,
      intentSource,
      analyticsEventName: 'form_submit_attempt',
      payload: {
        form_name: FORM_NAME,
        page_variant: resolvedPageVariant,
        project: 'saheeb_drive',
      },
    });

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          locale,
          anonymousId: analyticsIdentity.anonymousId ?? '',
          sessionId: analyticsIdentity.sessionId ?? '',
          pageVariant: resolvedPageVariant,
          eventId,
          intentSource,
          utmSource: attribution?.utmSource ?? '',
          utmMedium: attribution?.utmMedium ?? '',
          utmCampaign: attribution?.utmCampaign ?? '',
          utmContent: attribution?.utmContent ?? '',
          referrer: attribution?.referrer ?? '',
          landingPath: attribution?.landingPath ?? window.location.pathname,
          consentTimestamp: new Date().toISOString(),
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            error?: string;
            duplicate?: boolean;
            eventId?: string;
            message?: string;
          }
        | null;

      if (!response.ok) {
        recordFunnelEvent({
          eventName: 'validation_error',
          siteLocale: locale,
          userType: formData.userType,
          formName: FORM_NAME,
          errorStage:
            response.status === 400 || response.status === 429
              ? 'response'
              : 'network',
          pageVariant: resolvedPageVariant,
          intentSource,
          payload: {
            form_name: FORM_NAME,
            page_variant: resolvedPageVariant,
            response_status: response.status,
          },
        });

        setSubmitError(payload?.error ?? t('error.message'));
        return;
      }

      const resolvedEventId = payload?.eventId ?? eventId;

      if (payload?.duplicate) {
        trackEvent('waitlist_submit_duplicate', {
          event_id: resolvedEventId,
          form_name: FORM_NAME,
          page_group: 'saheeb_drive',
          page_variant: resolvedPageVariant,
          project: 'saheeb_drive',
          site_locale: locale,
          user_type: formData.userType,
          intent_source: intentSource,
        });
      } else {
        trackEvent('waitlist_submit_success', {
          event_id: resolvedEventId,
          form_name: FORM_NAME,
          page_group: 'saheeb_drive',
          page_variant: resolvedPageVariant,
          project: 'saheeb_drive',
          site_locale: locale,
          user_type: formData.userType,
          intent_source: intentSource,
        });
      }

      setIsSuccess(true);
    } catch {
      recordFunnelEvent({
        eventName: 'validation_error',
        siteLocale: locale,
        userType: formData.userType,
        formName: FORM_NAME,
        errorStage: 'network',
        pageVariant: resolvedPageVariant,
        intentSource,
        payload: {
          form_name: FORM_NAME,
          page_variant: resolvedPageVariant,
        },
      });
      setSubmitError(t('error.message'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareUrl = `https://saheeb.com/${locale}/projects/saheeb-drive`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `${t('success.shareText')} ${shareUrl}`
  )}`;

  return (
    <div
      ref={sectionRef}
      data-testid="drive-waitlist-section"
      className={cn('scroll-mt-24 lg:scroll-mt-32', className)}
    >
      {isSuccess ? (
        <div className="rounded-[2rem] border border-emerald-500/20 bg-[#111113] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-8">
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
              onClick={() => {
                recordFunnelEvent({
                  eventName: 'share_click',
                  siteLocale: locale,
                  userType: formData.userType,
                  ctaLocation: 'waitlist_success_whatsapp',
                  destinationPath: whatsappShareUrl,
                  project: 'saheeb_drive',
                  pageVariant: resolvedPageVariant,
                  intentSource,
                  payload: {
                    page_variant: resolvedPageVariant,
                    share_destination: 'whatsapp',
                  },
                });
              }}
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
          className="space-y-4"
        >
          <div
            id={sectionId}
            className="scroll-mt-24 rounded-[2rem] border border-[#222225] bg-[#111113] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-8 lg:scroll-mt-32"
            data-testid="drive-waitlist-card"
          >
            <div className="mb-5">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#C9A87C]">
                {t('eyebrow')}
              </p>
              <h3
                ref={sectionTitleRef}
                data-testid="drive-waitlist-title"
                className="mt-3 text-2xl font-bold text-[#EDEDEF]"
              >
                {t('title')}
              </h3>
              <p className="mt-3 text-[#8F8F96]">{t('subtitle')}</p>
            </div>

            <div className="mb-5 rounded-2xl border border-[#222225] bg-[#09090B] p-2">
              <p className="px-3 pb-2 text-sm text-[#8F8F96]">{t('buyOrSell')}</p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  data-testid="drive-form-intent-buyer"
                  onClick={() => handleIntentSelection('buyer')}
                  aria-pressed={formData.userType === 'buyer'}
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
                  data-testid="drive-form-intent-seller"
                  onClick={() => handleIntentSelection('seller')}
                  aria-pressed={formData.userType === 'seller'}
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
                data-testid="drive-waitlist-name"
                name="name"
                label={t('nameLabel')}
                placeholder={t('namePlaceholder')}
                value={formData.name}
                onChange={(event) => updateField('name', event.target.value)}
                error={errors.name}
                required
                autoComplete="name"
              />

              <Input
                data-testid="drive-waitlist-email"
                name="email"
                type="email"
                label={t('emailLabel')}
                placeholder={t('emailPlaceholder')}
                value={formData.email}
                onChange={(event) => updateField('email', event.target.value)}
                error={errors.email}
                required
                autoComplete="email"
                dir="ltr"
              />

              <Input
                data-testid="drive-waitlist-phone"
                name="phone"
                type="tel"
                label={t('phoneLabel')}
                placeholder={t('phonePlaceholder')}
                value={formData.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                error={errors.phone}
                hint={t('phoneHint')}
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
                  onChange={(event) => updateField('consent', event.target.checked)}
                  className="mt-0.5 h-5 w-5 rounded border-[#222225] bg-[#19191B] text-[#C9A87C] focus:ring-[#C9A87C]/50 focus:ring-offset-0"
                />
                <span className="text-sm leading-relaxed text-[#5C5C63]">
                  {t('consentPrefix')}{' '}
                  <Link
                    href="/privacy"
                    onClick={() => {
                      recordFunnelEvent({
                        eventName: 'privacy_click',
                        siteLocale: locale,
                        userType: formData.userType,
                        ctaLocation: 'waitlist_privacy_link',
                        destinationPath: '/privacy',
                        project: 'saheeb_drive',
                        pageVariant: resolvedPageVariant,
                        intentSource,
                      });
                    }}
                    className="text-[#C9A87C] transition-colors hover:text-[#EDEDEF]"
                  >
                    {t('privacy')}
                  </Link>
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

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#D0D0D5]">
                  {t('reassurance')}
                </p>
                <p className="text-xs leading-relaxed text-[#5C5C63]">
                  {t('privacyNote')}
                </p>
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                data-testid="drive-waitlist-submit"
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
