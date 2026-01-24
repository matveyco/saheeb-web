import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui';
import { SITE_CONFIG } from '@/lib/constants';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('navigation');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: '/', label: tNav('home') },
    { href: '/services', label: tNav('services') },
    { href: '/projects', label: tNav('projects') },
    { href: '/contact', label: tNav('contact') },
  ];

  const legalLinks = [
    { href: '/privacy', label: tNav('privacy') },
    { href: '/terms', label: tNav('terms') },
  ];

  return (
    <footer className="bg-[#050810] text-white/70 relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute top-0 start-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(212, 175, 55, 0.03) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-xl flex items-center justify-center shadow-[0_4px_15px_rgba(212,175,55,0.3)]">
                  <svg
                    width="24"
                    height="24"
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
                <span className="font-bold text-xl text-white">
                  {isArabic ? 'صاحب' : 'Saheeb'}
                </span>
              </div>
              <p className="text-sm text-white/50 mb-6 leading-relaxed">{t('tagline')}</p>
              <p className="flex items-center gap-2 text-sm text-white/40">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {isArabic ? SITE_CONFIG.address.ar : SITE_CONFIG.address.en}
              </p>
            </div>

            {/* Navigation Column */}
            <div>
              <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">{t('navigation')}</h3>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-[#D4AF37] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">{t('legal')}</h3>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-[#D4AF37] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect Column */}
            <div>
              <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">{t('connect')}</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="text-sm text-white/50 hover:text-[#D4AF37] transition-colors duration-200"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/[0.05]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-white/50">
              © {currentYear} {isArabic ? 'صاحب' : 'Saheeb'}. {t('rights')}.
            </p>
            <p className="flex items-center gap-2 text-white/60">
              <span className="text-lg">🇴🇲</span>
              {t('madeIn')}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
