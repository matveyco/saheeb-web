'use client';

import { useTranslations } from 'next-intl';
import { useWaitlistCount } from '@/components/sections/drive/useWaitlistCount';
import { dispatchDriveWaitlistEvent } from '@/components/sections/drive/events';

/**
 * Total founder spots available. The counter shows how many are left.
 * When real count approaches this, bump it up or introduce a new tier.
 */
const FOUNDER_SPOTS_CAP = 1000;

/**
 * Visual floor: never show fewer than this many "taken" spots so the
 * counter always feels urgent, even with few real signups.
 */
const VISUAL_FLOOR = 930;

interface DriveWaitlistCounterProps {
  variant?: 'hero' | 'form' | 'sticky';
  className?: string;
}

export function DriveWaitlistCounter({
  variant = 'hero',
  className,
}: DriveWaitlistCounterProps) {
  const t = useTranslations('saheebDrive.scarcity');
  const count = useWaitlistCount();

  // Render nothing until count loads — suppressHydrationWarning prevents
  // React error #418 when SSR output (null) differs from client (content)
  if (count === null) {
    return <div className={className} suppressHydrationWarning />;
  }

  const taken = Math.max(count, VISUAL_FLOOR);
  const remaining = Math.max(FOUNDER_SPOTS_CAP - taken, 0);
  const percent = Math.min((taken / FOUNDER_SPOTS_CAP) * 100, 100);

  if (variant === 'sticky') {
    return (
      <span className={className}>
        {t('stickyBadge', { remaining: String(remaining) })}
      </span>
    );
  }

  const label =
    variant === 'hero'
      ? t('heroBadge', { remaining: String(remaining), cap: String(FOUNDER_SPOTS_CAP) })
      : t('formBadge', { remaining: String(remaining), cap: String(FOUNDER_SPOTS_CAP) });

  const inner = (
    <div className="inline-flex flex-col gap-1.5 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-2.5">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
        </span>
        <span className="text-xs font-semibold text-amber-300 sm:text-sm">
          {label}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-amber-950/50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-1000"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );

  // Hero variant: make counter tappable to capture dead clicks.
  // Clarity showed 10% of users tap decorative elements expecting action.
  if (variant === 'hero') {
    return (
      <button
        type="button"
        className={className}
        data-testid="drive-waitlist-counter"
        onClick={() => dispatchDriveWaitlistEvent({ source: 'hero_counter' })}
        aria-label={label}
      >
        {inner}
      </button>
    );
  }

  return (
    <div className={className} data-testid="drive-waitlist-counter">
      {inner}
    </div>
  );
}
