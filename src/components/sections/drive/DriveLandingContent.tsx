import Image from 'next/image';
import { WaitlistForm } from '@/components/forms';
import { Container, Badge } from '@/components/ui';
import { DriveHeroPrimaryCta } from '@/components/sections/drive/DriveHeroPrimaryCta';
import { DriveStickyWaitlistBar } from '@/components/sections/drive/DriveStickyWaitlistBar';
import { DriveTrustSection } from '@/components/sections/drive/DriveTrustSection';
import { DriveWaitlistPitch } from '@/components/sections/drive/DriveWaitlistPitch';
import { DriveFaqSection } from '@/components/sections/drive/DriveFaqSection';
import type { DriveIntentContent } from '@/components/sections/drive/types';
import type { DriveIntent } from '@/lib/drive-search-params';
import type { PageVariant } from '@/lib/page-variant';

interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
}

interface DriveLandingContentProps {
  pageVariant: PageVariant;
  initialIntent?: DriveIntent;
  hasPresetIntent?: boolean;
  shouldFocusWaitlist?: boolean;
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    supportLine: string;
    primaryCta: string;
    intentLabel: string;
    buyCta: string;
    sellCta: string;
    proofItems: string[];
    visualEyebrow: string;
    visualBody: string;
  };
  trustTitle: string;
  waitlist: {
    sectionEyebrow: string;
    sectionTitle: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: HowItWorksStep[];
  };
  faqTitle: string;
  buyerContent: DriveIntentContent;
  sellerContent: DriveIntentContent;
}

export function DriveLandingContent({
  pageVariant,
  initialIntent = 'buyer',
  hasPresetIntent = false,
  shouldFocusWaitlist = false,
  hero,
  trustTitle,
  waitlist,
  howItWorks,
  faqTitle,
  buyerContent,
  sellerContent,
}: DriveLandingContentProps) {
  return (
    <>
      <main className="bg-[#09090B] pt-20 lg:pt-24">
        <section
          id="drive-hero"
          className="relative overflow-hidden border-b border-[#1A1A1D] bg-[#09090B] py-6 lg:py-24"
        >
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src="/images/saheeb-drive-hero-bg.jpg"
              alt=""
              fill
              className="object-cover object-center opacity-35"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,168,124,0.2),transparent_30%),linear-gradient(to_bottom,rgba(9,9,11,0.35),rgba(9,9,11,0.82),#09090B)]" />
          </div>

          <Container className="relative z-10">
            <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-14">
              <div className="relative z-20 max-w-3xl">
                <Badge variant="accent" className="mb-4">
                  {hero.badge}
                </Badge>
                <h1 className="text-4xl font-bold leading-[0.95] tracking-tight text-[#EDEDEF] sm:text-6xl lg:text-7xl">
                  {hero.title}
                </h1>
                <p className="mt-1 text-4xl font-bold leading-[0.95] tracking-tight text-[#C9A87C] sm:mt-2 sm:text-6xl lg:text-7xl">
                  {hero.titleHighlight}
                </p>
                <DriveHeroPrimaryCta
                  initialIntent={initialIntent}
                  pageVariant={pageVariant}
                  primaryCta={hero.primaryCta}
                  intentLabel={hero.intentLabel}
                  buyLabel={hero.buyCta}
                  sellLabel={hero.sellCta}
                />

                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#D0D0D5] sm:text-lg lg:mt-6 lg:text-xl">
                  {hero.subtitle}
                </p>

                <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-[#8F8F96] sm:mt-5 sm:text-sm">
                  {hero.supportLine}
                </p>

                <div className="mt-4 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
                  {hero.proofItems.map((item, index) => (
                    <div
                      key={item}
                      className={`items-center gap-2 rounded-full border border-[#2A2A2E] bg-[#111113]/80 px-3 py-2 text-sm text-[#EDEDEF] sm:px-4 ${
                        index > 1 ? 'hidden sm:inline-flex' : 'inline-flex'
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-[#C9A87C]" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-0 hidden w-full max-w-[300px] self-end sm:max-w-[340px] lg:mx-auto lg:mt-0 lg:block lg:pt-4">
                <div className="pointer-events-none rounded-[2rem] border border-[#2A2A2E] bg-[#111113]/85 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur">
                  <div className="mb-4 rounded-2xl border border-[#222225] bg-[#09090B] px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8F8F96]">
                      {hero.visualEyebrow}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#EDEDEF]">
                      {hero.visualBody}
                    </p>
                  </div>
                  <div className="relative aspect-[9/19] overflow-hidden rounded-[1.5rem] border border-[#222225] bg-[#09090B]">
                    <Image
                      src="/images/saheeb-drive-app-chat.jpg"
                      alt="Saheeb Drive app preview"
                      fill
                      className="pointer-events-none object-contain"
                      sizes="(max-width: 1024px) 70vw, 340px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <DriveTrustSection
          title={trustTitle}
          buyerContent={buyerContent}
          sellerContent={sellerContent}
          initialIntent={initialIntent}
        />

        <section className="border-b border-[#1A1A1D] bg-[#09090B] py-12 lg:py-18">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
              <div className="order-2 lg:order-1">
                <DriveWaitlistPitch
                  eyebrow={waitlist.sectionEyebrow}
                  title={waitlist.sectionTitle}
                  buyerContent={buyerContent}
                  sellerContent={sellerContent}
                  initialIntent={initialIntent}
                />
              </div>

              <div className="order-1 lg:order-2">
                <WaitlistForm
                  pageVariant={pageVariant}
                  initialIntent={initialIntent}
                  hasPresetIntent={hasPresetIntent}
                  shouldFocusWaitlist={shouldFocusWaitlist}
                />
              </div>
            </div>
          </Container>
        </section>

        <section className="border-b border-[#1A1A1D] bg-[#09090B] py-12 lg:py-20">
          <Container>
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-[#EDEDEF] lg:text-4xl">
                {howItWorks.title}
              </h2>
              <p className="mt-4 text-lg text-[#8F8F96]">
                {howItWorks.subtitle}
              </p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {howItWorks.steps.map((step) => (
                <article
                  key={step.number}
                  className="rounded-[1.75rem] border border-[#222225] bg-[#111113] p-6"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#C9A87C] text-lg font-bold text-[#09090B]">
                    {step.number}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-[#EDEDEF]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#8F8F96]">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <DriveFaqSection
          title={faqTitle}
          buyerContent={buyerContent}
          sellerContent={sellerContent}
          initialIntent={initialIntent}
        />
      </main>

      <DriveStickyWaitlistBar pageVariant={pageVariant} />
    </>
  );
}
