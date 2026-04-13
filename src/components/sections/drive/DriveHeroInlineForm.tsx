'use client';

import { useCallback, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Input, Button } from '@/components/ui';
import { readAttributionSnapshot } from '@/lib/attribution';
import {
  createAnalyticsEventId,
  ensureAnalyticsIdentity,
} from '@/lib/analytics-identity';
import { recordFunnelEvent } from '@/lib/funnel';
import { getPageVariant, type PageVariant } from '@/lib/page-variant';
import { trackEvent } from '@/lib/analytics';
import type { DriveIntent } from '@/lib/drive-search-params';
import { useDriveIntent } from '@/components/sections/drive/useDriveIntent';

const FORM_NAME = 'saheeb_drive_waitlist';

interface DriveHeroInlineFormProps {
  pageVariant: PageVariant;
  initialIntent?: DriveIntent;
}

export function DriveHeroInlineForm({
  pageVariant,
  initialIntent = 'buyer',
}: DriveHeroInlineFormProps) {
  const t = useTranslations('saheebDrive.heroForm');
  const tValidation = useTranslations('validation');
  const locale = useLocale();
  const { intent } = useDriveIntent(initialIntent);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [position, setPosition] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const hasTrackedFormStart = useRef(false);

  const resolvedPageVariant = pageVariant ?? getPageVariant(typeof window !== 'undefined' ? window.location.pathname : '') ?? 'organic_main';

  const trackFormStart = useCallback(() => {
    if (hasTrackedFormStart.current) return;
    hasTrackedFormStart.current = true;
    recordFunnelEvent({
      eventName: 'form_start',
      siteLocale: locale,
      userType: intent,
      formName: FORM_NAME,
      pageVariant: resolvedPageVariant,
      intentSource: 'hero_inline_form',
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
        form_location: 'hero_inline',
        page_variant: resolvedPageVariant,
        project: 'saheeb_drive',
        site_locale: locale,
      },
    });
  }, [locale, intent, resolvedPageVariant]);

  const validate = () => {
    const next: { name?: string; email?: string } = {};
    if (!name.trim()) next.name = tValidation('required');
    if (!email.trim()) {
      next.email = tValidation('required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = tValidation('email');
    }
    setErrors(next);
    return !next.name && !next.email;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const attribution = readAttributionSnapshot();
    const identity = ensureAnalyticsIdentity();
    const eventId = createAnalyticsEventId('waitlist');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: '',
          userType: intent,
          consent: true,
          locale,
          anonymousId: identity.anonymousId ?? '',
          sessionId: identity.sessionId ?? '',
          pageVariant: resolvedPageVariant,
          eventId,
          intentSource: 'hero_inline_form',
          utmSource: attribution?.utmSource ?? '',
          utmMedium: attribution?.utmMedium ?? '',
          utmCampaign: attribution?.utmCampaign ?? '',
          utmContent: attribution?.utmContent ?? '',
          referrer: attribution?.referrer ?? '',
          landingPath: attribution?.landingPath ?? (typeof window !== 'undefined' ? window.location.pathname : ''),
          consentTimestamp: new Date().toISOString(),
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        duplicate?: boolean;
        eventId?: string;
        position?: number;
      } | null;

      if (!response.ok) {
        setSubmitError(payload?.error ?? t('error'));
        return;
      }

      const resolvedEventId = payload?.eventId ?? eventId;
      trackEvent(payload?.duplicate ? 'waitlist_submit_duplicate' : 'waitlist_submit_success', {
        event_id: resolvedEventId,
        form_name: FORM_NAME,
        page_group: 'saheeb_drive',
        page_variant: resolvedPageVariant,
        project: 'saheeb_drive',
        site_locale: locale,
        user_type: intent,
        intent_source: 'hero_inline_form',
      });

      if (typeof payload?.position === 'number') {
        setPosition(payload.position);
      }
      setIsSuccess(true);
    } catch {
      setSubmitError(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <p className="text-sm font-semibold text-emerald-400">
          {position
            ? t('successTitle', { position: String(position) })
            : t('successFallback')}
        </p>
        <p className="mt-1 text-xs text-[#8F8F96]">{t('successBody')}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocusCapture={trackFormStart}
      noValidate
      className="mt-6 rounded-2xl border border-[#2B2B31] bg-[#111113]/90 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.24)] backdrop-blur"
    >
      <p className="mb-3 text-sm font-semibold text-[#EDEDEF]">
        {t('title')}
      </p>
      <div className="grid gap-2.5 sm:grid-cols-[1fr_1fr_auto] sm:items-start">
        <Input
          name="hero-name"
          placeholder={t('namePlaceholder')}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name && e.target.value.trim()) {
              setErrors((prev) => ({ ...prev, name: undefined }));
            }
          }}
          error={errors.name}
          required
          autoComplete="name"
          className="border-[#3A3A3F] focus:border-[#C9A87C] focus:ring-[#C9A87C]/25"
        />
        <Input
          name="hero-email"
          type="email"
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email && e.target.value.trim()) {
              setErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
          error={errors.email}
          required
          autoComplete="email"
          dir="ltr"
          className="border-[#3A3A3F] focus:border-[#C9A87C] focus:ring-[#C9A87C]/25"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isSubmitting}
          className="w-full sm:w-auto sm:whitespace-nowrap"
        >
          {isSubmitting ? t('submitting') : t('submit')}
        </Button>
      </div>

      {submitError && (
        <p className="mt-2 text-xs text-red-400">{submitError}</p>
      )}

      <p className="mt-2.5 text-xs text-[#7E7E85]">{t('privacy')}</p>
    </form>
  );
}
