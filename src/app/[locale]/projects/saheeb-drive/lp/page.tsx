import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { DriveLandingContent } from '@/components/sections/drive/DriveLandingContent';
import { Container } from '@/components/ui';
import { getDriveLandingCopy } from '@/lib/drive-landing-copy';
import { resolveDriveSearchState } from '@/lib/drive-search-params';

interface SaheebDrivePaidLandingPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: SaheebDrivePaidLandingPageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    alternates: {
      canonical: `/${locale}/projects/saheeb-drive`,
    },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default async function SaheebDrivePaidLandingPage({
  params,
  searchParams,
}: SaheebDrivePaidLandingPageProps) {
  const { locale } = await params;
  const driveSearchState = resolveDriveSearchState(await searchParams);
  setRequestLocale(locale);
  const tNavigation = await getTranslations({ locale, namespace: 'navigation' });
  const tProject = await getTranslations({
    locale,
    namespace: 'projects.saheebDrive',
  });
  const copy = await getDriveLandingCopy(locale);

  return (
    <>
      <header
        data-testid="drive-paid-header"
        className="fixed inset-x-0 top-0 z-50 border-b border-[#1A1A1D] bg-[#09090B]/95 backdrop-blur-md"
      >
        <Container>
          <div className="flex min-h-[72px] items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A87C] text-lg font-bold text-[#09090B]">
                S
              </div>
              <div>
                <p className="text-sm font-semibold text-[#EDEDEF]">
                  {tProject('title')}
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-[#8F8F96]">
                  {copy.waitlist.sectionEyebrow}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </header>

      <DriveLandingContent
        pageVariant="paid_lp"
        {...driveSearchState}
        {...copy}
      />

      <footer className="border-t border-[#1A1A1D] bg-[#09090B] py-6 text-[#8F8F96]">
        <Container>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Link
              href="/privacy"
              className="text-[#5C5C63] transition-colors hover:text-[#EDEDEF]"
            >
              {tNavigation('privacy')}
            </Link>
            <Link
              href="/terms"
              className="text-[#5C5C63] transition-colors hover:text-[#EDEDEF]"
            >
              {tNavigation('terms')}
            </Link>
          </div>
        </Container>
      </footer>
    </>
  );
}
