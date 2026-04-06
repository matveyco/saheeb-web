'use client';

import { DriveIntentButton } from '@/components/sections/drive/DriveIntentButton';
import { useDriveIntent } from '@/components/sections/drive/useDriveIntent';
import { dispatchDriveIntentEvent } from '@/components/sections/drive/events';
import type { DriveIntent } from '@/lib/drive-search-params';
import type { PageVariant } from '@/lib/page-variant';
import { cn } from '@/lib/utils';

interface DriveHeroPrimaryCtaProps {
  initialIntent?: DriveIntent;
  pageVariant: PageVariant;
  primaryCta: string;
  intentLabel: string;
  buyLabel: string;
  sellLabel: string;
}

export function DriveHeroPrimaryCta({
  initialIntent = 'buyer',
  pageVariant,
  primaryCta,
  intentLabel,
  buyLabel,
  sellLabel,
}: DriveHeroPrimaryCtaProps) {
  const { intent, setIntent } = useDriveIntent(initialIntent);

  const handleIntentChange = (nextIntent: DriveIntent) => {
    setIntent(nextIntent);
    dispatchDriveIntentEvent({
      intent: nextIntent,
      source: 'hero_intent_toggle',
    });
  };

  return (
    <div className="mt-6 rounded-[1.75rem] border border-[#222225] bg-[#111113]/90 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur sm:mt-8 sm:max-w-xl">
      <div className="flex items-center justify-between gap-3 px-1 pb-3">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8F8F96]">
          {intentLabel}
        </p>
        <span className="text-xs font-medium text-[#C9A87C]">
          {intent === 'seller' ? sellLabel : buyLabel}
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[#1A1A1D] bg-[#09090B] p-1">
          <button
            type="button"
            data-testid="drive-hero-intent-buyer"
            onClick={() => handleIntentChange('buyer')}
            aria-pressed={intent === 'buyer'}
            className={cn(
              'rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
              intent === 'buyer'
                ? 'bg-[#C9A87C] text-[#09090B]'
                : 'text-[#8F8F96] hover:text-[#EDEDEF]'
            )}
          >
            {buyLabel}
          </button>
          <button
            type="button"
            data-testid="drive-hero-intent-seller"
            onClick={() => handleIntentChange('seller')}
            aria-pressed={intent === 'seller'}
            className={cn(
              'rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
              intent === 'seller'
                ? 'bg-[#C9A87C] text-[#09090B]'
                : 'text-[#8F8F96] hover:text-[#EDEDEF]'
            )}
          >
            {sellLabel}
          </button>
        </div>

        <DriveIntentButton
          intent={intent}
          ctaLocation={`saheeb_drive_${pageVariant}_hero_primary`}
          pageVariant={pageVariant}
          size="lg"
          className="w-full"
          data-testid="drive-hero-primary-cta"
        >
          {primaryCta}
        </DriveIntentButton>
      </div>
    </div>
  );
}
