import { createHash } from 'crypto';
import { SITE_CONFIG } from '@/lib/constants';
import { getServerEnv } from '@/lib/env';

interface WaitlistLeadEventInput {
  eventId: string;
  eventTime?: number;
  locale: string;
  name: string;
  email: string | null;
  phone: string | null;
  userType: 'buyer' | 'seller';
  landingPath: string | null;
  pageVariant: string | null;
  intentSource: string | null;
  countryCode: string | null;
  clientIp: string | null;
  userAgent: string | null;
}

function normalizeHashValue(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim().toLowerCase();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizePhoneValue(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const digits = value.replace(/\D/g, '');
  return digits.length > 0 ? digits : null;
}

function sha256(value: string | null) {
  if (!value) {
    return undefined;
  }

  return createHash('sha256').update(value).digest('hex');
}

function getEventSourceUrl(locale: string, landingPath: string | null) {
  if (!landingPath) {
    return `${SITE_CONFIG.url}/${locale}/projects/saheeb-drive`;
  }

  if (landingPath.startsWith('http://') || landingPath.startsWith('https://')) {
    return landingPath;
  }

  if (landingPath.startsWith('/')) {
    return `${SITE_CONFIG.url}/${locale}${landingPath === '/' ? '' : landingPath}`;
  }

  return `${SITE_CONFIG.url}/${locale}/projects/saheeb-drive`;
}

export async function sendMetaWaitlistLeadEvent({
  eventId,
  eventTime = Math.floor(Date.now() / 1000),
  locale,
  name,
  email,
  phone,
  userType,
  landingPath,
  pageVariant,
  intentSource,
  countryCode,
  clientIp,
  userAgent,
}: WaitlistLeadEventInput) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  const { META_CAPI_ACCESS_TOKEN, META_CAPI_TEST_EVENT_CODE } = getServerEnv();

  if (!pixelId || !META_CAPI_ACCESS_TOKEN) {
    return false;
  }

  const payload = {
    data: [
      {
        event_name: 'Lead',
        event_time: eventTime,
        event_id: eventId,
        action_source: 'website',
        event_source_url: getEventSourceUrl(locale, landingPath),
        user_data: {
          em: sha256(normalizeHashValue(email)),
          ph: sha256(normalizePhoneValue(phone)),
          fn: sha256(normalizeHashValue(name)),
          client_ip_address: clientIp ?? undefined,
          client_user_agent: userAgent ?? undefined,
          country: sha256(normalizeHashValue(countryCode)),
        },
        custom_data: {
          content_category: 'saheeb_drive',
          content_name: 'Saheeb Drive Waitlist',
          page_variant: pageVariant ?? 'organic_main',
          intent_source: intentSource ?? undefined,
          user_type: userType,
        },
      },
    ],
    test_event_code: META_CAPI_TEST_EVENT_CODE || undefined,
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v22.0/${pixelId}/events?access_token=${encodeURIComponent(
        META_CAPI_ACCESS_TOKEN
      )}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      console.error('Meta CAPI error:', await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('Meta CAPI request failed:', error);
    return false;
  }
}
