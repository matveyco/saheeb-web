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
import { DriveWaitlistCounter } from '@/components/sections/drive/DriveWaitlistCounter';
import type { DriveIntent } from '@/lib/drive-search-params';
import { cn } from '@/lib/utils';

type WaitlistUserType = 'buyer' | 'seller';

interface WaitlistFormData {
  name: string;
  email: string;
  phone: string;
  userType: WaitlistUserType;
}

interface WaitlistFormErrors {
  name?: string;
  email?: string;
  phone?: string;
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
  });
  const [intentSource, setIntentSource] = useState<string>(
    hasPresetIntent ? 'query_param' : 'direct_view'
  );
  const [errors, setErrors] = useState<WaitlistFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [position, setPosition] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const hasTrackedFormStart = useRef(false);
  const hasTrackedWaitlistView = useRef(false);

  const resolvedPageVariant = getResolvedPageVariant(pageVariant);
  const trustPills = (t.raw('trustPills') as string[]) ?? [];

  const resolveFieldError = useCallback(
    (
      field: keyof Pick<WaitlistFormData, 'name' | 'email' | 'phone'>,
      value: string
    ) => {
      const trimmedValue = value.trim();

      switch (field) {
        case 'name':
          return trimmedValue ? undefined : tValidation('required');
        case 'email':
          if (!trimmedValue) {
            return undefined;
          }

          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)
            ? undefined
            : tValidation('email');
        case 'phone':
          if (!trimmedValue) {
            return undefined;
          }

          return PHONE_REGEX.test(trimmedValue)
            ? undefined
            : tValidation('phone');
        default:
          return undefined;
      }
    },
    [tValidation]
  );

  const updateField = (field: keyof WaitlistFormData, value: string | boolean) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      const errorField = field as keyof WaitlistFormErrors;
      if (!current[errorField]) {
        return current;
      }

      return {
        ...current,
        [errorField]:
          typeof value === 'string' &&
          (errorField === 'name' || errorField === 'email' || errorField === 'phone')
            ? resolveFieldError(errorField, value)
            : undefined,
      };
    });
  };

  const scrollWaitlistIntoView = useCallback(() => {
    const target = cardRef.current ?? sectionRef.current;
    if (!target || typeof window === 'undefined') {
      return;
    }

    const offset = window.innerWidth < 640 ? 64 : 120;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

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

    const alignWaitlistViewport = () => {
      scrollWaitlistIntoView();
    };

    scrollWaitlistIntoView();
    alignWaitlistViewport();

    [120, 240, 360, 480, 640].forEach((delay) => {
      window.setTimeout(alignWaitlistViewport, delay);
    });
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
    nextErrors.name = resolveFieldError('name', formData.name);
    nextErrors.email = resolveFieldError('email', formData.email);
    nextErrors.phone = resolveFieldError('phone', formData.phone);

    // Require at least one of email or phone
    if (!formData.email.trim() && !formData.phone.trim()) {
      nextErrors.email = tValidation('emailOrPhone');
    }

    setErrors(nextErrors);

    const errorFields = Object.entries(nextErrors)
      .filter(([, value]) => Boolean(value))
      .map(([field]) => field);

    if (errorFields.length > 0) {
      recordFunnelEvent({
        eventName: 'validation_error',
        siteLocale: locale,
        userType: formData.userType,
        formName: FORM_NAME,
        errorStage: 'client',
        pageVariant: resolvedPageVariant,
        intentSource,
        payload: {
          error_count: errorFields.length,
          error_fields: errorFields.join(','),
          form_name: FORM_NAME,
          page_variant: resolvedPageVariant,
        },
      });
    }

    return errorFields.length === 0;
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
          consent: true,
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
            position?: number;
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

      if (typeof payload?.position === 'number') {
        setPosition(payload.position);
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

  return (
    <div
      ref={sectionRef}
      id={sectionId}
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
            {position
              ? t('success.title', { position: String(position) })
              : t('success.titleFallback')}
          </h3>
          <p className="mt-3 text-[#8F8F96]">{t('success.message')}</p>
          <p className="mt-2 text-sm text-[#C9A87C]">
            {t('success.launchNote')}
          </p>

          <div className="mt-6">
            <Button type="button" variant="secondary" onClick={handleCopyLink}>
              {isCopied ? t('success.copied') : t('success.copyLink')}
            </Button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          onFocusCapture={trackFormStart}
          noValidate
          className="space-y-4"
        >
          <div
            ref={cardRef}
            id="join-now"
            className="scroll-mt-24 rounded-[2rem] border border-[#2B2B31] bg-[#111113] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-8 lg:scroll-mt-32"
            data-testid="drive-waitlist-card"
          >
            <div className="space-y-2">
              <DriveWaitlistCounter variant="form" className="mb-1" />
              <h3
                data-testid="drive-waitlist-title"
                className="text-[1.85rem] font-bold tracking-tight text-[#EDEDEF] sm:text-[2.15rem]"
              >
                {t('title')}
              </h3>
              <p className="max-w-xl text-sm leading-relaxed text-[#9B9BA3] sm:text-base">
                {t('subtitle')}
              </p>
              <div data-testid="drive-waitlist-social-proof" className="flex flex-wrap gap-1.5">
                {trustPills.map((pill) => (
                  <div
                    key={pill}
                    className="inline-flex items-center gap-2 rounded-full border border-[#3A3226] bg-[#17120C] px-3.5 py-2 text-xs font-semibold text-[#F1DFC2] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:text-sm"
                  >
                    <span className="h-2 w-2 rounded-full bg-[#C9A87C]" />
                    {pill}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="inline-grid w-full grid-cols-2 rounded-2xl border border-[#222225] bg-[#0D0D10] p-1 sm:w-auto">
                <button
                  type="button"
                  data-testid="drive-form-intent-buyer"
                  aria-pressed={formData.userType === 'buyer'}
                  onClick={() => handleIntentSelection('buyer', 'form_toggle')}
                  className={cn(
                    'rounded-[0.9rem] px-4 py-3 text-sm font-semibold transition-colors',
                    formData.userType === 'buyer'
                      ? 'bg-[#C9A87C] text-[#09090B]'
                      : 'text-[#8F8F96] hover:text-[#EDEDEF]'
                  )}
                >
                  {t('buy')}
                </button>
                <button
                  type="button"
                  data-testid="drive-form-intent-seller"
                  aria-pressed={formData.userType === 'seller'}
                  onClick={() => handleIntentSelection('seller', 'form_toggle')}
                  className={cn(
                    'rounded-[0.9rem] px-4 py-3 text-sm font-semibold transition-colors',
                    formData.userType === 'seller'
                      ? 'bg-[#C9A87C] text-[#09090B]'
                      : 'text-[#8F8F96] hover:text-[#EDEDEF]'
                  )}
                >
                  {t('sell')}
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <Input
                data-testid="drive-waitlist-name"
                name="name"
                label={t('nameLabel')}
                placeholder={t('namePlaceholder')}
                value={formData.name}
                onChange={(event) => updateField('name', event.target.value)}
                onBlur={(event) =>
                  setErrors((current) => ({
                    ...current,
                    name: resolveFieldError('name', event.target.value),
                  }))
                }
                error={errors.name}
                required
                autoComplete="name"
                className="border-[#3A3A3F] focus:border-[#C9A87C] focus:ring-[#C9A87C]/25"
              />

              <Input
                data-testid="drive-waitlist-email"
                name="email"
                type="email"
                label={t('emailLabel')}
                placeholder={t('emailPlaceholder')}
                value={formData.email}
                onChange={(event) => updateField('email', event.target.value)}
                onBlur={(event) =>
                  setErrors((current) => ({
                    ...current,
                    email: resolveFieldError('email', event.target.value),
                  }))
                }
                error={errors.email}
                required
                autoComplete="email"
                dir="ltr"
                className="border-[#3A3A3F] focus:border-[#C9A87C] focus:ring-[#C9A87C]/25"
              />

              <Input
                data-testid="drive-waitlist-phone"
                name="phone"
                type="tel"
                label={t('phoneLabel')}
                placeholder={t('phonePlaceholder')}
                value={formData.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                onBlur={(event) =>
                  setErrors((current) => ({
                    ...current,
                    phone: resolveFieldError('phone', event.target.value),
                  }))
                }
                error={errors.phone}
                hint={t('phoneHint')}
                autoComplete="tel"
                dir="ltr"
                className="border-[#3A3A3F] focus:border-[#C9A87C] focus:ring-[#C9A87C]/25"
              />
            </div>

            {submitError ? (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                {submitError}
              </div>
            ) : null}

            <div className="mt-6">
              <p className="mb-3 text-sm font-medium leading-relaxed text-[#E3C08B]">
                {t('reassurance')}
              </p>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                data-testid="drive-waitlist-submit"
                className="w-full text-base sm:text-lg"
              >
                {isSubmitting ? t('submitting') : t('submit')}
              </Button>
              <p
                data-testid="drive-waitlist-passive-privacy"
                className="mt-4 text-center text-sm leading-relaxed text-[#7E7E85]"
              >
                {t('privacyLinePrefix')}{' '}
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
                {t('privacyLineSuffix')}
              </p>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
