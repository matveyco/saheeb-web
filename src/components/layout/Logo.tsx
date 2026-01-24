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
      className={`flex items-center gap-3 font-bold text-xl text-white hover:text-[#D4AF37] transition-colors duration-200 ${className}`}
    >
      <div className="w-9 h-9 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-xl flex items-center justify-center shadow-[0_4px_15px_rgba(212,175,55,0.3)]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M8 16C8 11.5817 11.5817 8 16 8C20.4183 8 24 11.5817 24 16"
            stroke="#0A0E1A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="16" cy="20" r="4" fill="#0A0E1A" />
        </svg>
      </div>
      <span>{isArabic ? 'صاحب' : 'Saheeb'}</span>
    </Link>
  );
}
