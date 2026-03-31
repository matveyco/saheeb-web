import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Header, Footer } from '@/components/layout';
import { Container, Button } from '@/components/ui';

export default function NotFoundPage() {
  const t = useTranslations('errors.notFound');

  return (
    <>
      <Header />
      <main className="pt-20 lg:pt-24 min-h-[80vh] flex items-center bg-[#09090B]">
        <Container size="sm" className="relative z-10">
          <div className="text-center py-20">
            <h1 className="text-8xl lg:text-9xl font-black text-[#C9A87C] mb-6">
              404
            </h1>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#EDEDEF] mb-4">
              {t('title')}
            </h2>
            <p className="text-lg text-[#8F8F96] mb-10 max-w-md mx-auto">
              {t('description')}
            </p>
            <Button asChild variant="primary" size="lg">
              <Link href="/">
                {t('cta')}
              </Link>
            </Button>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
