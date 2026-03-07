import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <Link
      href="/"
      className={`flex items-center gap-3 font-bold text-xl text-[#EDEDEF] hover:text-[#C9A87C] transition-colors duration-200 ${className}`}
    >
      <div className="w-9 h-9 bg-[#C9A87C] rounded-xl flex items-center justify-center">
        <svg
          width="20"
          height="20"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Gauge outer arc */}
          <path
            d="M10 23 A9 9 0 1 1 22 11"
            stroke="#09090B"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          {/* Needle */}
          <line
            x1="16"
            y1="17"
            x2="22"
            y2="11"
            stroke="#09090B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Pivot dot */}
          <circle cx="16" cy="17" r="2.5" fill="#09090B" />
          {/* Inner lower arc */}
          <path
            d="M12 23 A5 5 0 0 1 20 23"
            stroke="#09090B"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span>{isArabic ? 'صاحب' : 'Saheeb'}</span>
    </Link>
  );
}
