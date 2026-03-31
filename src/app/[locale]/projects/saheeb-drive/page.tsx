import { Suspense } from 'react';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Header, Footer } from '@/components/layout';
import { WaitlistForm } from '@/components/forms';
import { Container, Badge } from '@/components/ui';
import { DriveIntentButton } from '@/components/sections/drive/DriveIntentButton';
import { DriveStickyWaitlistBar } from '@/components/sections/drive/DriveStickyWaitlistBar';

interface SaheebDrivePageProps {
  params: Promise<{ locale: string }>;
}

export default async function SaheebDrivePage({
  params,
}: SaheebDrivePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'saheebDrive' });
  const heroProofItems = t.raw('hero.proofItems') as string[];
  const trustCards = t.raw('trust.cards') as Array<{
    title: string;
    description: string;
  }>;
  const waitlistBenefits = t.raw('waitlist.benefits') as string[];
  const howItWorksSteps = t.raw('howItWorks.steps') as Array<{
    number: string;
    title: string;
    description: string;
  }>;
  const faqItems = t.raw('faq.items') as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <>
      <Header />
      <main className="bg-[#09090B] pt-20 lg:pt-24">
        <section
          id="drive-hero"
          className="relative overflow-hidden border-b border-[#1A1A1D] bg-[#09090B] py-12 lg:py-24"
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
            <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
              <div className="max-w-3xl">
                <Badge variant="accent" className="mb-5">
                  {t('hero.badge')}
                </Badge>
                <h1 className="text-5xl font-bold leading-[0.95] tracking-tight text-[#EDEDEF] sm:text-6xl lg:text-7xl">
                  {t('hero.title')}
                </h1>
                <p className="mt-2 text-5xl font-bold leading-[0.95] tracking-tight text-[#C9A87C] sm:text-6xl lg:text-7xl">
                  {t('hero.titleHighlight')}
                </p>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#D0D0D5] lg:text-xl">
                  {t('hero.subtitle')}
                </p>
                <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-[#8F8F96]">
                  {t('hero.supportLine')}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {heroProofItems.map((item) => (
                    <div
                      key={item}
                      className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2E] bg-[#111113]/80 px-4 py-2 text-sm text-[#EDEDEF]"
                    >
                      <span className="h-2 w-2 rounded-full bg-[#C9A87C]" />
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:max-w-xl">
                  <DriveIntentButton
                    intent="buyer"
                    ctaLocation="saheeb_drive_hero_buy"
                    size="lg"
                    className="w-full"
                  >
                    {t('hero.buyCta')}
                  </DriveIntentButton>
                  <DriveIntentButton
                    intent="seller"
                    ctaLocation="saheeb_drive_hero_sell"
                    variant="secondary"
                    size="lg"
                    className="w-full"
                  >
                    {t('hero.sellCta')}
                  </DriveIntentButton>
                </div>
              </div>

              <div className="mx-auto w-full max-w-[340px]">
                <div className="rounded-[2rem] border border-[#2A2A2E] bg-[#111113]/85 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur">
                  <div className="mb-4 rounded-2xl border border-[#222225] bg-[#09090B] px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8F8F96]">
                      {t('hero.visualEyebrow')}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#EDEDEF]">
                      {t('hero.visualBody')}
                    </p>
                  </div>
                  <div className="relative aspect-[9/19] overflow-hidden rounded-[1.5rem] border border-[#222225] bg-[#09090B]">
                    <Image
                      src="/images/saheeb-drive-app-chat.jpg"
                      alt="Saheeb Drive app preview"
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 70vw, 340px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-b border-[#1A1A1D] bg-[#09090B] py-12 lg:py-16">
          <Container>
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-[#EDEDEF] lg:text-4xl">
                {t('trust.title')}
              </h2>
              <p className="mt-4 text-lg text-[#8F8F96]">
                {t('trust.subtitle')}
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {trustCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-[1.75rem] border border-[#222225] bg-[#111113] p-6"
                >
                  <h3 className="text-xl font-semibold text-[#EDEDEF]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#8F8F96]">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-b border-[#1A1A1D] bg-[#09090B] py-12 lg:py-18">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
              <div className="rounded-[2rem] border border-[#1F1F23] bg-[#0D0D10] p-6 sm:p-8">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#C9A87C]">
                  {t('waitlist.sectionEyebrow')}
                </p>
                <h2 className="mt-3 text-3xl font-bold text-[#EDEDEF] lg:text-4xl">
                  {t('waitlist.sectionTitle')}
                </h2>
                <p className="mt-4 text-[#8F8F96]">
                  {t('waitlist.sectionSubtitle')}
                </p>

                <div className="mt-6 space-y-3">
                  {waitlistBenefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="flex items-start gap-3 rounded-2xl border border-[#19191B] bg-[#111113] px-4 py-3"
                    >
                      <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A87C]/15 text-[#C9A87C]">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <span className="text-sm leading-relaxed text-[#D0D0D5]">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-5 text-sm text-[#5C5C63]">
                  {t('waitlist.footnote')}
                </p>
              </div>

              <Suspense
                fallback={
                  <div className="rounded-[2rem] border border-[#222225] bg-[#111113] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
                    <div className="h-6 w-32 rounded-full bg-[#1A1A1D]" />
                    <div className="mt-6 space-y-4">
                      <div className="h-12 rounded-xl bg-[#1A1A1D]" />
                      <div className="h-12 rounded-xl bg-[#1A1A1D]" />
                      <div className="h-12 rounded-xl bg-[#1A1A1D]" />
                      <div className="h-12 rounded-xl bg-[#1A1A1D]" />
                    </div>
                  </div>
                }
              >
                <WaitlistForm />
              </Suspense>
            </div>
          </Container>
        </section>

        <section className="border-b border-[#1A1A1D] bg-[#09090B] py-12 lg:py-20">
          <Container>
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-[#EDEDEF] lg:text-4xl">
                {t('howItWorks.title')}
              </h2>
              <p className="mt-4 text-lg text-[#8F8F96]">
                {t('howItWorks.subtitle')}
              </p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {howItWorksSteps.map((step) => (
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

        <section className="bg-[#09090B] py-12 lg:py-20">
          <Container size="md">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#EDEDEF] lg:text-4xl">
                {t('faq.title')}
              </h2>
              <p className="mt-4 text-lg text-[#8F8F96]">
                {t('faq.subtitle')}
              </p>
            </div>

            <div className="mt-8 space-y-3">
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className="group overflow-hidden rounded-2xl border border-[#222225] bg-[#111113]"
                >
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 text-start text-[#EDEDEF] transition-colors hover:bg-[#16161A]">
                    <span className="font-medium">{item.question}</span>
                    <span className="shrink-0 text-[#C9A87C] transition-transform group-open:rotate-180">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm leading-relaxed text-[#8F8F96]">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </Container>
        </section>
      </main>

      <DriveStickyWaitlistBar />
      <Footer />
    </>
  );
}
