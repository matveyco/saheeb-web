import { getTranslations } from 'next-intl/server';
import type { DriveIntentContent } from '@/components/sections/drive/types';

interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
}

export async function getDriveLandingCopy(locale: string) {
  const t = await getTranslations({ locale, namespace: 'saheebDrive' });

  return {
    hero: {
      badge: t('hero.badge'),
      title: t('hero.title'),
      titleHighlight: t('hero.titleHighlight'),
      subtitle: t('hero.subtitle'),
      supportLine: t('hero.supportLine'),
      primaryCta: t('hero.primaryCta'),
      intentLabel: t('hero.intentLabel'),
      buyCta: t('hero.buyCta'),
      sellCta: t('hero.sellCta'),
      proofItems: t.raw('hero.proofItems') as string[],
      visualEyebrow: t('hero.visualEyebrow'),
      visualBody: t('hero.visualBody'),
    },
    trustTitle: t('trust.title'),
    waitlist: {
      sectionEyebrow: t('waitlist.sectionEyebrow'),
      sectionTitle: t('waitlist.sectionTitle'),
    },
    howItWorks: {
      title: t('howItWorks.title'),
      subtitle: t('howItWorks.subtitle'),
      steps: t.raw('howItWorks.steps') as HowItWorksStep[],
    },
    faqTitle: t('faq.title'),
    buyerContent: t.raw('intentContent.buyer') as DriveIntentContent,
    sellerContent: t.raw('intentContent.seller') as DriveIntentContent,
  };
}
