import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

interface LogoProps {
  className?: string;
  variant?: 'saheeb' | 'drive';
}

/**
 * Logo — steering-wheel mark + brand wordmark.
 * variant="saheeb" (default): sparkle mark + "Saheeb" — parent brand.
 * variant="drive": steering-wheel mark + "SaheebDrive" — Drive product.
 */
export function Logo({ className, variant = 'saheeb' }: LogoProps) {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const isDrive = variant === 'drive';

  return (
    <Link
      href="/"
      className={`flex items-center gap-2 font-semibold text-xl text-[#FFFFFF] hover:text-[#316BE9] transition-colors duration-200 ${className ?? ''}`}
      aria-label={isDrive ? 'Saheeb Drive' : 'Saheeb'}
    >
      {isDrive ? (
        <svg
          width="28"
          height="28"
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
          className="shrink-0"
        >
          <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth="4.5" strokeDasharray="22 9" strokeDashoffset="11" />
          <circle cx="32" cy="32" r="4" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="4.5" strokeLinecap="round">
            <line x1="32" y1="32" x2="32" y2="14" />
            <line x1="32" y1="32" x2="32" y2="50" />
            <line x1="32" y1="32" x2="14" y2="32" />
            <line x1="32" y1="32" x2="50" y2="32" />
          </g>
        </svg>
      ) : (
        <div className="w-9 h-9 bg-[#316BE9] rounded-xl flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2l2.2 6.8H21l-5.4 4 2.1 6.8L12 15.6l-5.7 4 2.1-6.8L3 8.8h6.8L12 2z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      )}
      <span className={isDrive ? 'tracking-tight' : ''}>
        {isDrive
          ? isArabic
            ? <>صاحب<span className="font-normal">درايف</span></>
            : <>Saheeb<span className="font-normal">Drive</span></>
          : isArabic
            ? 'صاحب'
            : 'Saheeb'}
      </span>
    </Link>
  );
}
