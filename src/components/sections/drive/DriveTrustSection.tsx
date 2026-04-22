'use client';

import { Container } from '@/components/ui';
import { useDriveIntent } from '@/components/sections/drive/useDriveIntent';
import { dispatchDriveWaitlistEvent } from '@/components/sections/drive/events';
import type { DriveIntentContent } from '@/components/sections/drive/types';
import type { DriveIntent } from '@/lib/drive-search-params';

interface DriveTrustSectionProps {
  title: string;
  buyerContent: DriveIntentContent;
  sellerContent: DriveIntentContent;
  initialIntent?: DriveIntent;
}

export function DriveTrustSection({
  title,
  buyerContent,
  sellerContent,
  initialIntent = 'buyer',
}: DriveTrustSectionProps) {
  const { intent } = useDriveIntent(initialIntent);
  const content = intent === 'seller' ? sellerContent : buyerContent;

  return (
    <section className="border-b border-[#2A2633] bg-[#211C28] py-12 lg:py-16">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-[#FFFFFF] lg:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg text-[#8F859C]">{content.trustSubtitle}</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {content.trustCards.map((card) => (
            <button
              key={card.title}
              type="button"
              onClick={() =>
                dispatchDriveWaitlistEvent({ intent, source: 'trust_card' })
              }
              className="group rounded-[1.75rem] border border-[#2A2633] bg-[#151317] p-6 text-start transition-colors hover:border-[#316BE9]/40 hover:bg-[#141418]"
              aria-label={card.title}
            >
              <h3 className="text-xl font-semibold text-[#FFFFFF] transition-colors group-hover:text-[#316BE9]">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#8F859C]">
                {card.description}
              </p>
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
