import { setRequestLocale } from 'next-intl/server';
import { Header, Footer } from '@/components/layout';
import {
  HeroSection,
  AboutSection,
  ServicesGrid,
  Vision2040Section,
  SaheebDriveCard,
  ContactCTA,
} from '@/components/sections/home';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <SaheebDriveCard />
        <AboutSection />
        <ServicesGrid />
        <Vision2040Section />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
