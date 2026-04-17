import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { DriveLandingContent } from '@/components/sections/drive/DriveLandingContent';
import { getDriveLandingCopy } from '@/lib/drive-landing-copy';
import { resolveDriveSearchState } from '@/lib/drive-search-params';

interface SaheebDrivePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function readSearchParam(
  value: string | string[] | undefined
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function shouldRedirectPaidTrafficToLp(
  searchParams: Record<string, string | string[] | undefined>
) {
  const utmSource = readSearchParam(searchParams.utm_source)?.toLowerCase();
  const utmMedium = readSearchParam(searchParams.utm_medium)?.toLowerCase();
  const utmCampaign = readSearchParam(searchParams.utm_campaign)?.toLowerCase();

  return Boolean(
    readSearchParam(searchParams.fbclid) ||
      readSearchParam(searchParams.gclid) ||
      readSearchParam(searchParams.gbraid) ||
      readSearchParam(searchParams.wbraid) ||
      readSearchParam(searchParams.ttclid) ||
      utmSource ||
      utmCampaign ||
      utmMedium === 'paid' ||
      utmMedium === 'banner' ||
      utmMedium === 'carousel'
  );
}

function toQueryString(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (entry) {
          params.append(key, entry);
        }
      });
      continue;
    }

    if (value) {
      params.set(key, value);
    }
  }

  return params.toString();
}

export default async function SaheebDrivePage({
  params,
  searchParams,
}: SaheebDrivePageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  // AR: skip redirect — AR organic converts 2.3x better than AR LP
  //   (AR organic 16% engagement vs AR LP 7% engagement)
  // EN: keep redirect, organic/LP gap narrower and LP less noisy
  if (locale !== 'ar' && shouldRedirectPaidTrafficToLp(resolvedSearchParams)) {
    const query = toQueryString(resolvedSearchParams);
    redirect(`/${locale}/projects/saheeb-drive/lp${query ? `?${query}` : ''}`);
  }

  const driveSearchState = resolveDriveSearchState(resolvedSearchParams);
  setRequestLocale(locale);
  const copy = await getDriveLandingCopy(locale);

  return (
    <>
      <Header />
      <DriveLandingContent
        pageVariant="organic_main"
        {...driveSearchState}
        {...copy}
      />
      <Footer />
    </>
  );
}
