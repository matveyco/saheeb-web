import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Header, Footer } from '@/components/layout';
import { Container, Button } from '@/components/ui';

export default function NotFoundPage() {
  const t = useTranslations('errors.notFound');

  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-24 min-h-[80vh] flex items-center bg-[#0A0E1A] relative overflow-hidden">
        {/* Background decorations */}
        <div
          className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          aria-hidden="true"
        />

        <Container size="sm" className="relative z-10">
          <div className="text-center py-20">
            <h1 className="text-8xl lg:text-9xl font-black bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37] bg-clip-text text-transparent mb-6">
              404
            </h1>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              {t('title')}
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-md mx-auto">
              {t('description')}
            </p>
            <Link href="/">
              <Button variant="gold" size="lg">
                {t('cta')}
              </Button>
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
