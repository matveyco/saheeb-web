export const SITE_CONFIG = {
  name: 'Saheeb',
  nameAr: 'صاحب',
  legalEntityName: 'SAHEEB TECH VENTURES LLC',
  crNumber: '1642589',
  legalType: {
    en: 'Limited Liability Company (LLC)',
    ar: 'شركة ذات مسؤولية محدودة',
  },
  registration: {
    establishmentDate: '2026-02-01',
    registrationDate: '2026-02-04',
    expiryDate: '2031-02-01',
    status: {
      en: 'Active',
      ar: 'نشط',
    },
  },
  domain: 'saheeb.com',
  url: 'https://saheeb.com',
  email: 'contact@saheeb.com',
  // phone: '+968 9000 0000', // Placeholder - uncomment when available
  // whatsapp: 'https://wa.me/96890000000', // Placeholder - uncomment when available
  address: {
    registered: {
      en: 'Special Economic Zone at Duqm, Al Wusta Governorate, Oman',
      ar: 'المنطقة الاقتصادية الخاصة بالدقم، محافظة الوسطى، سلطنة عمان',
    },
    operational: {
      en: 'Muscat, Oman',
      ar: 'مسقط، عمان',
    },
  },
  // social: {
  //   linkedin: 'https://linkedin.com/company/saheeb',
  //   twitter: 'https://twitter.com/saheeb',
  // },
} as const;

export const SERVICES = [
  {
    id: 'build',
    icon: 'Rocket',
  },
  {
    id: 'ai',
    icon: 'Brain',
  },
  {
    id: 'grow',
    icon: 'TrendingUp',
  },
  {
    id: 'localize',
    icon: 'Globe',
  },
] as const;

export const VISION_2040_PILLARS = [
  {
    id: 'creative-individuals',
    icon: 'Users',
    color: 'blue',
  },
  {
    id: 'competitive-economy',
    icon: 'BarChart',
    color: 'green',
  },
  {
    id: 'responsible-agencies',
    icon: 'Shield',
    color: 'gold',
  },
  {
    id: 'sustainable-environment',
    icon: 'Leaf',
    color: 'emerald',
  },
] as const;

export const OMAN_CITIES = [
  { en: 'Muscat', ar: 'مسقط' },
  { en: 'Salalah', ar: 'صلالة' },
  { en: 'Sohar', ar: 'صحار' },
  { en: 'Nizwa', ar: 'نزوى' },
  { en: 'Sur', ar: 'صور' },
  { en: 'Ibri', ar: 'عبري' },
  { en: 'Barka', ar: 'بركاء' },
  { en: 'Rustaq', ar: 'الرستاق' },
  { en: 'Other', ar: 'أخرى' },
] as const;
