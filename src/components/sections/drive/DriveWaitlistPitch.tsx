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
    <div className="rounded-[2rem] border border-[#2A2633] bg-[#0D0D10]/72 p-6 sm:p-7">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#316BE9] sm:text-sm">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#FFFFFF] lg:text-3xl">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-[#9B9BA3] sm:text-base">
        {content.waitlistSectionSubtitle}
      </p>

      <div className="mt-6 rounded-[1.5rem] border border-[#2A2633] bg-[#151317]/78 px-4 sm:px-5">
        {content.waitlistBenefits.map((benefit, index) => (
          <div
            key={benefit}
            className={`flex items-start gap-3 py-4 ${
              index > 0 ? 'border-t border-[#1B1B20]' : ''
            }`}
          >
            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#316BE9]/15 text-[#316BE9]">
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
            <span className="text-sm leading-relaxed text-[#D0D0D5] sm:text-[15px]">
              {benefit}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-5 text-sm leading-relaxed text-[#6F6F77]">
        {content.waitlistFootnote}
      </p>
    </div>
  );
}
