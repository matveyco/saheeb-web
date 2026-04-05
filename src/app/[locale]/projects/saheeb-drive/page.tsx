import { setRequestLocale } from 'next-intl/server';
import { Header, Footer } from '@/components/layout';
import { DriveLandingContent } from '@/components/sections/drive/DriveLandingContent';
import { getDriveLandingCopy } from '@/lib/drive-landing-copy';
import { resolveDriveSearchState } from '@/lib/drive-search-params';

interface SaheebDrivePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SaheebDrivePage({
  params,
  searchParams,
}: SaheebDrivePageProps) {
  const { locale } = await params;
  const driveSearchState = resolveDriveSearchState(await searchParams);
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
