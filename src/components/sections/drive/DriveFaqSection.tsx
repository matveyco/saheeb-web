'use client';

import { Container } from '@/components/ui';
import { useDriveIntent } from '@/components/sections/drive/useDriveIntent';
import type { DriveIntentContent } from '@/components/sections/drive/types';
import type { DriveIntent } from '@/lib/drive-search-params';

interface DriveFaqSectionProps {
  title: string;
  buyerContent: DriveIntentContent;
  sellerContent: DriveIntentContent;
  initialIntent?: DriveIntent;
}

export function DriveFaqSection({
  title,
  buyerContent,
  sellerContent,
  initialIntent = 'buyer',
}: DriveFaqSectionProps) {
  const { intent } = useDriveIntent(initialIntent);
  const content = intent === 'seller' ? sellerContent : buyerContent;

  return (
    <section className="bg-[#211C28] py-12 lg:py-20">
      <Container size="md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#FFFFFF] lg:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg text-[#8F859C]">{content.faqSubtitle}</p>
        </div>

        <div className="mt-8 space-y-3">
          {content.faqItems.map((item) => (
            <details
              key={item.question}
              className="group overflow-hidden rounded-2xl border border-[#2A2633] bg-[#151317]"
            >
              <summary className="flex items-center justify-between gap-4 px-5 py-4 text-start text-[#FFFFFF] transition-colors hover:bg-[#16161A]">
                <span className="font-medium">{item.question}</span>
                <span className="shrink-0 text-[#316BE9] transition-transform group-open:rotate-180">
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
              <div className="px-5 pb-5 text-sm leading-relaxed text-[#8F859C]">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
