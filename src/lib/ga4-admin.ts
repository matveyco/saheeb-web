import { createSign } from 'crypto';
import { getServerEnv } from '@/lib/env';

interface Ga4SubmitRow {
  date: string;
  submitSuccesses: number;
}

export interface Ga4SubmitReport {
  configured: boolean;
  propertyId: string | null;
  error: string | null;
  rows: Ga4SubmitRow[];
}

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function parsePrivateKey(value: string) {
  return value.replace(/\\n/g, '\n');
}

async function fetchGoogleAccessToken() {
  const {
    GA4_SERVICE_ACCOUNT_CLIENT_EMAIL,
    GA4_SERVICE_ACCOUNT_PRIVATE_KEY,
  } = getServerEnv();
  if (!GA4_SERVICE_ACCOUNT_CLIENT_EMAIL || !GA4_SERVICE_ACCOUNT_PRIVATE_KEY) {
    return null;
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(
    JSON.stringify({
      alg: 'RS256',
      typ: 'JWT',
    })
  );
  const payload = base64UrlEncode(
    JSON.stringify({
      iss: GA4_SERVICE_ACCOUNT_CLIENT_EMAIL,
      sub: GA4_SERVICE_ACCOUNT_CLIENT_EMAIL,
      aud: 'https://oauth2.googleapis.com/token',
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      iat: issuedAt,
      exp: issuedAt + 3600,
    })
  );
  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${payload}`);
  signer.end();
  const signature = signer.sign(parsePrivateKey(GA4_SERVICE_ACCOUNT_PRIVATE_KEY));
  const assertion = `${header}.${payload}.${base64UrlEncode(signature)}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`GA4 OAuth failed with ${response.status}`);
  }

  const payloadJson = (await response.json()) as { access_token?: string };
  if (!payloadJson.access_token) {
    throw new Error('GA4 OAuth response did not include access_token');
  }

  return payloadJson.access_token;
}

function formatGaDate(rawDate: string) {
  if (!/^\d{8}$/.test(rawDate)) {
    return rawDate;
  }

  return `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
}

export async function getGa4WaitlistSubmitReport(
  days: number
): Promise<Ga4SubmitReport> {
  const { GA4_PROPERTY_ID } = getServerEnv();

  if (!GA4_PROPERTY_ID) {
    return {
      configured: false,
      propertyId: null,
      error: null,
      rows: [],
    };
  }

  try {
    const accessToken = await fetchGoogleAccessToken();
    if (!accessToken) {
      return {
        configured: false,
        propertyId: GA4_PROPERTY_ID,
        error: null,
        rows: [],
      };
    }

    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [
            {
              startDate: `${days}daysAgo`,
              endDate: 'today',
            },
          ],
          dimensions: [{ name: 'date' }],
          metrics: [{ name: 'eventCount' }],
          dimensionFilter: {
            filter: {
              fieldName: 'eventName',
              stringFilter: {
                matchType: 'EXACT',
                value: 'waitlist_submit_success',
              },
            },
          },
          orderBys: [
            {
              dimension: {
                dimensionName: 'date',
              },
            },
          ],
        }),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`GA4 Data API failed with ${response.status}`);
    }

    const payload = (await response.json()) as {
      rows?: Array<{
        dimensionValues?: Array<{ value?: string }>;
        metricValues?: Array<{ value?: string }>;
      }>;
    };

    return {
      configured: true,
      propertyId: GA4_PROPERTY_ID,
      error: null,
      rows:
        payload.rows?.map((row) => ({
          date: formatGaDate(row.dimensionValues?.[0]?.value ?? ''),
          submitSuccesses: Number(row.metricValues?.[0]?.value ?? 0),
        })) ?? [],
    };
  } catch (error) {
    return {
      configured: true,
      propertyId: GA4_PROPERTY_ID,
      error: error instanceof Error ? error.message : 'Unknown GA4 error',
      rows: [],
    };
  }
}
