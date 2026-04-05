export interface DriveTrustCard {
  title: string;
  description: string;
}

export interface DriveFaqItem {
  question: string;
  answer: string;
}

export interface DriveIntentContent {
  trustSubtitle: string;
  trustCards: DriveTrustCard[];
  waitlistSectionSubtitle: string;
  waitlistBenefits: string[];
  waitlistFootnote: string;
  faqSubtitle: string;
  faqItems: DriveFaqItem[];
}
