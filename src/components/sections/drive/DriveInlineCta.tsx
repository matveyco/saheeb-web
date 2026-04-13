'use client';

import { DriveIntentButton } from '@/components/sections/drive/DriveIntentButton';
import { useDriveIntent } from '@/components/sections/drive/useDriveIntent';
import type { DriveIntent } from '@/lib/drive-search-params';
import type { PageVariant } from '@/lib/page-variant';

interface DriveInlineCtaProps {
  label: string;
  ctaLocation: string;
  pageVariant: PageVariant;
  initialIntent?: DriveIntent;
}

export function DriveInlineCta({
  label,
  ctaLocation,
  pageVariant,
  initialIntent = 'buyer',
}: DriveInlineCtaProps) {
  const { intent } = useDriveIntent(initialIntent);

  return (
    <div className="flex justify-center py-8 lg:py-10">
      <DriveIntentButton
        intent={intent}
        ctaLocation={ctaLocation}
        pageVariant={pageVariant}
        size="lg"
        className="text-base sm:text-lg"
      >
        {label}
      </DriveIntentButton>
    </div>
  );
}
