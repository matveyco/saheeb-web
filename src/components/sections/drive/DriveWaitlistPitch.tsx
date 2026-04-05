'use client';

import { useDriveIntent } from '@/components/sections/drive/useDriveIntent';
import type { DriveIntentContent } from '@/components/sections/drive/types';
import type { DriveIntent } from '@/lib/drive-search-params';

interface DriveWaitlistPitchProps {
  eyebrow: string;
  title: string;
  buyerContent: DriveIntentContent;
  sellerContent: DriveIntentContent;
  initialIntent?: DriveIntent;
}

export function DriveWaitlistPitch({
  eyebrow,
  title,
  buyerContent,
  sellerContent,
  initialIntent = 'buyer',
}: DriveWaitlistPitchProps) {
  const { intent } = useDriveIntent(initialIntent);
  const content = intent === 'seller' ? sellerContent : buyerContent;

  return (
    <div className="rounded-[2rem] border border-[#1F1F23] bg-[#0D0D10] p-6 sm:p-8">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#C9A87C]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold text-[#EDEDEF] lg:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-[#8F8F96]">{content.waitlistSectionSubtitle}</p>

      <div className="mt-6 space-y-3">
        {content.waitlistBenefits.map((benefit) => (
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

      <p className="mt-5 text-sm text-[#5C5C63]">{content.waitlistFootnote}</p>
    </div>
  );
}
