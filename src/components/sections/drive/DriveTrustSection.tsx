'use client';

import { Container } from '@/components/ui';
import { useDriveIntent } from '@/components/sections/drive/useDriveIntent';
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
    <section className="border-b border-[#1A1A1D] bg-[#09090B] py-12 lg:py-16">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-[#EDEDEF] lg:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg text-[#8F8F96]">{content.trustSubtitle}</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {content.trustCards.map((card) => (
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
  );
}
