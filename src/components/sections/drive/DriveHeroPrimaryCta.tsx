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
    <div className="mt-6 sm:mt-8 sm:max-w-xl">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-[#8F859C]">
        {intentLabel}
      </p>

      <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[#2A2633] bg-[#0F1013]/90 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.24)] backdrop-blur">
          <button
            type="button"
            data-testid="drive-hero-intent-buyer"
            onClick={() => handleIntentChange('buyer')}
            aria-pressed={intent === 'buyer'}
            className={cn(
              'rounded-xl px-4 py-3 text-sm font-semibold transition-colors sm:min-w-[112px]',
              intent === 'buyer'
                ? 'bg-[#316BE9] text-[#0A0A0D]'
                : 'text-[#8F859C] hover:text-[#FFFFFF]'
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
              'rounded-xl px-4 py-3 text-sm font-semibold transition-colors sm:min-w-[112px]',
              intent === 'seller'
                ? 'bg-[#316BE9] text-[#0A0A0D]'
                : 'text-[#8F859C] hover:text-[#FFFFFF]'
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
          className="w-full text-base sm:text-lg"
          data-testid="drive-hero-primary-cta"
        >
          {primaryCta}
        </DriveIntentButton>
      </div>
    </div>
  );
}
